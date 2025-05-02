// Formats File or Folder Sizes to a Human Readable Format
function formatByte(bytes) {
	if (bytes <= 0) {
		return "0 B"; // Return 0 bytes if size is zero or negative
	}

	const units = ["B", "K", "M", "G", "T", "PB", "EB", "ZB", "YB"];
	const digitGroups = Math.floor(Math.log10(bytes) / Math.log10(1024));

	const unit = units[digitGroups];

	return `${(bytes / Math.pow(1024, digitGroups)).toFixed(unit === 'B' ? 0 : 1)} ${unit}`;
}

function formatTime(epoch, options = { sec: true }) {
	const { sec } = options;

	const date = new Date(epoch);
	const day = String(date.getDate()).padStart(2, '0');
	const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
		"Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
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

/**
 * Extracts original filename from a Unix timestamp added filename
 * @param {String} filename Filename that contains Unix timestamp at start
 * @returns Original filename
 */
const getFilename = (filename) => {
	// First 13 characters are timestamps, and 1 dash
	const timestamp = filename.slice(14);
	return String(timestamp);
}
