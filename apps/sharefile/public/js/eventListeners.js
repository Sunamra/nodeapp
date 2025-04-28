const uploadBtn = document.getElementById('uploadBtn');

uploadBtn.addEventListener('click', (e) => {
	e.preventDefault();
	document.getElementById('fileInput').click()
});