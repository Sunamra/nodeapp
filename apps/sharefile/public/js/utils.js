// Formats File or Folder Sizes to a Human Readable Format
function formatByte(bytes) {
	if (bytes <= 0) {
		return '0 B'; // Return 0 bytes if size is zero or negative
	}

	const units = ['B', 'K', 'M', 'G', 'T', 'PB', 'EB', 'ZB', 'YB'];
	const digitGroups = Math.floor(Math.log10(bytes) / Math.log10(1024));

	const unit = units[digitGroups];

	return `${(bytes / Math.pow(1024, digitGroups)).toFixed(unit === 'B' ? 0 : 1)} ${unit}`;
}

/**
 * Formats a given epoch timestamp into a human-readable date-time string.
 *
 * @param {number} epoch - The epoch timestamp in milliseconds.
 * @param {Object} [options={}] - Formatting options.
 * @param {boolean} [options.sec=true] - Whether to include seconds in the output.
 * @returns {string} A formatted date-time string in the form "DD-MMM-YY  HH:mm[:ss]".
 *
 * @example
 * formatTime(1700000000000); 
 * // "14-Nov-23  12:53:20"
 *
 * @example
 * formatTime(1700000000000, { sec: false }); 
 * // "14-Nov-23  12:53"
 */

function formatTime(epoch, options = { sec: true }) {
	const { sec } = options;

	const date = new Date(epoch);
	const day = String(date.getDate()).padStart(2, '0');
	const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
		'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	const month = months[date.getMonth()];
	const year = String(date.getFullYear()).slice(-2);
	const hours = String(date.getHours()).padStart(2, '0');
	const minutes = String(date.getMinutes()).padStart(2, '0');
	const seconds = String(date.getSeconds()).padStart(2, '0');

	// return `${day}-${month}-${year} ${hours}:${minutes}${sec === true ? seconds : ""}`;
	return day + '-' + month + '-' + year + '&nbsp;&nbsp;'
		+ hours + ':' + minutes +
		(sec === true ? ':' + seconds : '');
}

const isFolder = (eventDataTransferItems) => {
	const items = eventDataTransferItems;

	for (let i = 0; i < items.length; i++) {

		const entry = items[i].webkitGetAsEntry?.();
		if (entry && entry.isDirectory) {
			// console.warn("Folder detected:", entry.name);
			return true;
		}
	}
	return false;
};


/**
* Updates the circular progress.
* @param {number} value 0–100
*/
function setUploadProgress(value) {
	const v = Math.max(0, Math.min(100, value));
	const fg = document.getElementById('progress-fg');
	const txt = document.getElementById('progress-text');
	fg.style.strokeDashoffset = 100 - v;
	txt.textContent = v + '%';
}

// Upload progress bar controllers
const progressBar = document.getElementById('progress-bar');

function showProgressBar() {
	progressBar.classList.remove('fade-out');
	progressBar.classList.add('fade-in');
	progressBar.style.visibility = 'visible';
}

function hideProgressBar() {
	progressBar.classList.remove('fade-in');
	progressBar.classList.add('fade-out');
	// Optionally hide the element after the fade-out animation completes
	setTimeout(() => {
		progressBar.style.visibility = 'hidden';
	}, 500); // Duration matches the fade-out animation duration

	setTimeout(() => {
		setUploadProgress(0);
	}, 800);
}

// Right tick controllers
const right_tick = document.getElementById('right-tick');

function showRightTick() {

	right_tick.classList.add('fade-in');
	right_tick.style.visibility = 'visible';

	right_tick.stop();
	setTimeout(() => {
		right_tick.play();
	}, 200);
}

function hideRightTick() {
	setTimeout(() => {
		right_tick.classList.add('fade-out');
	}, 3000);

	setTimeout(() => {
		right_tick.classList.remove('fade-in');
		right_tick.classList.remove('fade-out');
		right_tick.style.visibility = 'hidden';
	}, 4000);
}

const filterFiles = (files) => {

	const stats = window.storageStats;
	let maxSingleFileSize = stats.rule.maxTotalSize - stats.current.totalSize;

	const modifiedFiles = [];
	const rejectedFiles = [];
	let totalModifiedSize = 0;

	for (let i = 0; i < files?.length; i++) {
		const file = files[i];
		if (file.size > maxSingleFileSize) {
			rejectedFiles.push(file);
			continue
		}

		maxSingleFileSize -= file.size;
		totalModifiedSize += file.size;

		if (totalModifiedSize > stats.rule.maxTotalSize) {
			if (modifiedFiles.length > 0) {
				// info() declared first 'cuz new toast comes on top
				toast.info(`Uploading first ${modifiedFiles.length} file${modifiedFiles.length > 1 ? 's' : ''}`, { duration: 0 });
				toast.warning(`Total file size exceeded storage capacity`, { duration: 0 });
			}
			return modifiedFiles;
		}

		modifiedFiles.push(file);
	}

	if (rejectedFiles.length) {
		if (rejectedFiles.length > 1) {
			toast.warning(`${rejectedFiles.length} files not uploaded: exceeds maximum allowed size`, { duration: 0 });
		}
		else {
			toast.warning(`File '${rejectedFiles[0].name}' not uploaded: exceeds maximum allowed size`, { duration: 0 });
		}
	}

	return modifiedFiles;
};
