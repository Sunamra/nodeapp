
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
	(async () => {
		console.log(await e.dataTransfer.files.item(0).text());		
	})();
	postFile();
});

const uploadBtn = document.getElementById('uploadBtn');

uploadBtn.addEventListener('click', (e) => {
	e.preventDefault();
	document.getElementById('fileInput').click();
});