const DOMAIN = 'localhost:3000';

const PROTOCOL = DOMAIN.startsWith('localhost') ||
	DOMAIN.startsWith('192.168.0.') ||
	DOMAIN.startsWith('127.0.0.1') ? 'http://' :
	'https://';

const BASE_URI = `${PROTOCOL}${DOMAIN}`;
const API_BASE = `${BASE_URI}/apps/sharefile/api/v1`;
const PUBLIC_STORE = `${BASE_URI}/public/tempStore`;

// console.log(`Base URL : ${BASE_URI}`);

const toast = new ZephyrToast({
	position: 'bottom-left',
	duration: 5000
});

// Change the hyperlink to sibling page based on current page
document.getElementById('anotherPageAnchor').href = `${BASE_URI}/apps/paste/`;

// Global array holding all current nameCells in table.
// Will be used to reapply scrolling during window resize.
window.nameCellArray = [];

/**
 * Applies scrolling wrap animation to a table cell if its content overflows
 * @param {HTMLElement} cell The <td> element containing the filename
 */
const applyScrollingWrap = (cell) => {

	const addAnimation = (cellElem) => {
		const text = cellElem.textContent;
		cellElem.textContent = '';

		const inner = document.createElement('div');
		inner.classList.add('scroll-content');
		inner.innerHTML = `<span>${text}</span><span>${text}</span>`;
		cellElem.appendChild(inner);

		const singleWidth = inner.children[0].offsetWidth;
		const speed = 30;                     // px/sec
		const duration = singleWidth / speed; // seconds

		inner.style.setProperty('--single-width', `${singleWidth}px`);
		inner.style.setProperty('--duration', `${duration}s`);

		cellElem.classList.add('scrolling');
	};
	const removeAnimation = (cellElem) => {
		const wrapper = cellElem.querySelector('.scroll-content');
		if (wrapper) {
			cellElem.classList.remove('scrolling');
			const origText = wrapper.children[0]?.textContent;
			wrapper.remove();
			cellElem.textContent = origText;
		}
	};


	let div;
	let spans;
	let spanClientWidth;
	div = spanClientWidth = spans = null;

	if (cell.classList.contains('scrolling')) {
		div = cell.children[0];
		spans = div?.querySelectorAll('span');

		spanClientWidth = spans[0].clientWidth + 20;
	}

	const availableWidth = cell.clientWidth;

	const neededWidth = cell.scrollWidth;

	// console.log(`${cell.innerText} ->\n avail : ${availableWidth}\n needed : ${neededWidth}\n spanNeeded : ${spanClientWidth}`);

	if (spanClientWidth && spanClientWidth < availableWidth) {
		removeAnimation(cell);
	}
	else if (neededWidth > availableWidth && !cell.classList.contains('scrolling')) {
		addAnimation(cell);
	}
};

const applyScrollingWrapToAll = (cells) => {
	cells.forEach(cell => applyScrollingWrap(cell));
};

// const postFile = (files) => {
// 	const form = new FormData();

// 	for (let i = 0; i < files.length; i++) {
// 		form.append('files', files[i]);
// 	}

// 	fetch(API_BASE, {
// 		body: form,
// 		method: 'POST'
// 	})
// 		.then(res => res.json())
// 		.then(data => {
// 			if (data.success) {
// 				toast.success(data.message);
// 				setTimeout(getFiles, 100); // Refresh UI
// 			} else {
// 				console.error(data.statusText || data.message || data);
// 				toast.error(data.statusText || data.message || 'Error posting file');
// 			}
// 		})
// 		.catch(error => {
// 			console.error(error);
// 			toast.error(error.message || error);
// 		});
// };

const postFile = (files) => {
	// Filter files based on size / total numbers
	files = filterFiles(files);

	showProgressBar();

	// Build the form
	const form = new FormData();
	for (let i = 0; i < files.length; i++) {
		form.append('file', files[i]);
	}

	// xhr instead of fetch for upload progress
	const xhr = new XMLHttpRequest();
	xhr.open('POST', API_BASE);

	// progress handler
	xhr.upload.onprogress = (e) => {
		if (!e.lengthComputable) return;
		const pct = ((e.loaded / e.total) * 100).toFixed(0);
		// console.log(`Upload Progress: ${pct}%`);
		setUploadProgress(pct);
	};

	// Success / response parsing
	xhr.onload = () => {
		let data;
		try {
			data = JSON.parse(xhr.responseText);
		} catch {
			console.error('Invalid JSON', xhr.responseText);
			toast.error('Unexpected server response');
			return;
		}

		if (data.success) {
			toast.success(data.message);

			// Show and hide upload anmations
			hideProgressBar();
			showRightTick();
			hideRightTick();

		} else {
			console.error(data.statusText || data.message || data);
			toast.error(data.statusText || data.message || 'Error posting file');
		}

		// Hide if error occurs
		hideProgressBar();
	};

	// network / transport errors
	xhr.onerror = () => {
		console.error('Network error');
		toast.error('Network error during upload');
	};

	// fire it off
	xhr.send(form);
};

const getFiles = () => {
	fetch(API_BASE)
		.then(res => res.json())
		.then(data => {
			if (data.success) {
				window.fetchedFiles = data.files;
				listFiles(data.files);
			} else {
				listFiles(null);
				throw new Error(data.message);
			}
		})
		.catch(error => {
			console.error(error.message || error);
			toast.error(error.message || error);
		});
};

/**
 * Renders the list of files in the table
 * @param {Array|null} files Array of file objects or null on error
 */
const listFiles = (files) => {
	const tableBody = document.getElementById('fileTable').querySelector('tbody');
	tableBody.innerHTML = ''; // Clear old data

	if (files && files.length) {
		files.forEach(file => {
			const row = document.createElement('tr');

			// Name
			const nameCell = document.createElement('td');
			nameCell.classList.add('fileName');
			nameCell.textContent = nameCell.title = file.name;

			// Uploaded
			const uploadedCell = document.createElement('td');
			uploadedCell.title = file.created;
			uploadedCell.innerHTML = formatTime(file.created, false);

			// Size
			const sizeCell = document.createElement('td');
			file.size > 1024 ? sizeCell.title = file.size : '';
			sizeCell.textContent = formatByte(file.size);

			// Download
			const actionCell = document.createElement('td');
			const downloadBtn = document.createElement('button');
			downloadBtn.classList.add('btn-download');
			downloadBtn.title = 'Download';
			downloadBtn.innerHTML = '<i class="fa fa-download"></i>';
			downloadBtn.setAttribute('onclick', `downloadFile('${file.serverName}')`);
			actionCell.appendChild(downloadBtn);

			window.nameCellArray.push(nameCell);

			row.append(nameCell, uploadedCell, sizeCell, actionCell);
			tableBody.prepend(row);
		});
	} else {
		const noRow = document.createElement('tr');
		const noCell = document.createElement('td');
		noCell.setAttribute('colspan', '4');
		noCell.classList.add('no-files');
		noCell.textContent = files === null ? 'Internal Server Error' : 'No Files Available';
		noRow.appendChild(noCell);
		tableBody.appendChild(noRow);
	}

	applyScrollingWrapToAll(window.nameCellArray);
};

const downloadFile = (filename) => {

	fetch(`${API_BASE}/${filename}`)
		.then(res => {
			return res.json();
		})
		.then(data => {
			// console.log(data);

			if (data.success) {
				const a = document.createElement('a');
				a.href = `${BASE_URI}/${data.publicStore}/${filename}`;
				a.download = data.filename;
				a.click();
				a.remove();
			}
			else {
				throw new Error(data.message);
			}
		})
		.catch(error => {
			console.log(error);

			console.error(error.message || 5);
			toast.error(error.message || 5);
		});
};

// WebSocket receives message on changes in sharefile/storage/
// It refreshes file list by calling getFiles()
// whenever a change (e.g. Create, Delete) is detected.
const wsProtocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
const ws = new WebSocket(`${wsProtocol}://${window.location.host}`);

ws.onmessage = (message) => {
	getFiles(); // Refresh file list on changes
	// console.log(JSON.parse(message.data));
};

