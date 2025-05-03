const domain = 'https://nodeapp-ctvu.onrender.com';

const apiBase = `${domain}/sharefile/api/v1`;
const publicStore = `${domain}/sharefile/public/storage`;

const toast = new ZephyrToast({
	position: "bottom-left",
	duration: 5000
});

// Global array holding all current nameCells in table.
// Will be used to reapply scrolling durin window resize.
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

	if (spanClientWidth) {
		if (spanClientWidth < availableWidth) {
			removeAnimation(cell);

		}
	}
	else if (neededWidth > availableWidth && !cell.classList.contains('scrolling')) {
		addAnimation(cell);
	}
};

const applyScrollingWrapToAll = (cells) => {
	cells.forEach(cell => applyScrollingWrap(cell));
};

const postFile = (files) => {
	const form = new FormData();

	for (let i = 0; i < files.length; i++) {
		form.append('files', files[i]);
	}

	fetch(apiBase, {
		body: form,
		method: 'POST'
	})
		.then(res => res.json())
		.then(data => {
			if (data.success) {
				toast.success(data.message);
				setTimeout(getFiles, 100); // Refresh UI
			} else {
				console.error(data.statusText || data.message || data);
				toast.error(data.statusText || data.message || 'Error posting file');
			}
		})
		.catch(error => {
			console.error(error);
			toast.error(error.message || error);
		});
};

const getFiles = () => {
	fetch(apiBase)
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

			const nameCell = document.createElement('td');
			nameCell.classList.add('fileName');
			nameCell.textContent = nameCell.title = file.name;

			// Temporary append for measurement and wrap
			row.appendChild(nameCell);
			tableBody.appendChild(row);
			applyScrollingWrap(nameCell);
			tableBody.removeChild(row);

			const createdCell = document.createElement('td');
			createdCell.title = file.created;
			createdCell.innerHTML = formatTime(file.created, false);

			const sizeCell = document.createElement('td');
			sizeCell.textContent = formatByte(file.size);

			const actionCell = document.createElement('td');
			const downloadBtn = document.createElement('button');
			downloadBtn.classList.add('btn-download');
			downloadBtn.title = 'Download';
			downloadBtn.innerHTML = `<i class="fa fa-download"></i>`;
			downloadBtn.setAttribute('onclick', `downloadFile('${file.serverName}')`);
			actionCell.appendChild(downloadBtn);

			window.nameCellArray.push(nameCell);

			row.append(nameCell, createdCell, sizeCell, actionCell);
			tableBody.prepend(row);
		});
	} else {
		const noRow = document.createElement('tr');
		const noCell = document.createElement('td');
		noCell.setAttribute('colspan', '4');
		noCell.classList.add('no-files');
		noCell.textContent = files === null ? 'Internal Server Error' : 'No Files Available.';
		noRow.appendChild(noCell);
		tableBody.appendChild(noRow);
	}
};

const downloadFile = (filename) => {
	// fetch(`${apiBase}/${filename}`)
	// 	.then(res => {
	// 		if (!res.ok) throw new Error(res.statusText);
	// 		return res.blob();
	// 	})
	// 	.then(blob => {
	// 		const url = window.URL.createObjectURL(blob);
	// 		const a = document.createElement('a');
	// 		a.href = url;
	// 		a.download = getFilename(filename);
	// 		a.click();
	// 		a.remove();
	// 		window.URL.revokeObjectURL(url);
	// 	})
	// 	.catch(error => {
	// 		console.error(error.message || error);
	// 		toast.error(error.message || error);
	// 	});

	const a = document.createElement('a');
	a.href = `${publicStore}/${filename}`;
	a.download = getFilename(filename);
	console.log('clicked')
	a.click();
	a.remove();
};

getFiles(); // Initialize list on load
