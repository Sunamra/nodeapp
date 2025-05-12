// Drag, drop events
const dropZone = document.getElementById('drop-zone');
const dragText = document.getElementById('dragText');
let dragCounter = 0;

dropZone.addEventListener('dragenter', e => {
	e.preventDefault();
	if (dragCounter === 0) {
		dragText.style.display = 'flex';
	}
	dragCounter++;
});

dropZone.addEventListener('dragleave', e => {
	e.preventDefault();
	dragCounter--;
	if (dragCounter === 0) {
		dragText.style.display = 'none';
	}
});

dropZone.addEventListener('dragover', e => {
	e.preventDefault();
});


dropZone.addEventListener('drop', e => {
	e.preventDefault();
	dragCounter = 0;
	dragText.style.display = 'none';
	e.preventDefault();

	if (!isFolder(e.dataTransfer.items)) {
		postFile(e.dataTransfer.files);
	}
	else {
		toast.warning('Folder not supported. Please select a file');
		console.warn('Folder not supported. Please select a file');
	}
});

const uploadBtn = document.getElementById('btn-upload');
const fileInput = document.getElementById('fileInput');

// Upload button click inputs file(s) and upload
uploadBtn.addEventListener('click', (e) => {
	e.preventDefault();
	// Input field clicks on button click
	fileInput.click();
});

// Upload file(s) when input(s) taken
fileInput.addEventListener('change', () => {
	if (fileInput.files && fileInput.files.length > 0) {
		postFile(fileInput.files);
		fileInput.value = '';

	} else {
		// No file selected (e.g. user canceled)
		console.error('No file selected');
		toast.warning('No file selected');
	}
});

// File name scrolling animation trigger on window resize
window.addEventListener('resize', (e) => {
	e.preventDefault();
	applyScrollingWrapToAll(window.nameCellArray);
});
