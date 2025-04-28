const apiBase = 'https://example.com/api/files';

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

});



function loadFiles() {
	fetch(apiBase)
		.then(response => response.json())
		.then(data => {
			const tableBody = document.getElementById('fileTable').querySelector('tbody');
			tableBody.innerHTML = ''; // Clear old data

			data.forEach(file => {
				const row = document.createElement('tr');

				const nameCell = document.createElement('td');
				nameCell.textContent = file.name;

				const sizeCell = document.createElement('td');
				sizeCell.textContent = (file.size / 1024).toFixed(2);

				const actionCell = document.createElement('td');
				const deleteBtn = document.createElement('button');
				deleteBtn.textContent = 'Delete';
				deleteBtn.onclick = () => deleteFile(file.name, row);
				actionCell.appendChild(deleteBtn);

				row.appendChild(nameCell);
				row.appendChild(sizeCell);
				row.appendChild(actionCell);

				tableBody.appendChild(row);
			});
		});
}

function deleteFile(filename, row) {
	fetch(`${apiBase}/${encodeURIComponent(filename)}`, {
		method: 'DELETE'
	})
		.then(response => {
			if (response.ok) {
				row.remove(); // Remove the row from the table
			} else {
				alert('Failed to delete file.');
			}
		});
}

// loadFiles();