let lineIndex = 0;

const extractTitle = (lines) => {
	lineIndex = 0;
	let title = '';
	let titleSignPresent = false;

	for (let line of lines) {
		line = line.trim();
		lineIndex++;

		if (!line) {
			continue;
		}

		if (line.startsWith('@#')) {
			titleSignPresent = true;
			title = line.replace(/[@#]/g, '');
		}

		break;
	}

	if (title) {
		return title;
	}
	else {
		titleSignPresent ? '' : lineIndex--;
		return 'NO TITLE';
	}
};

const extractContent = (lines) => {
	let content = '';

	for (let i = lineIndex; i < lines.length; i++) {

		const line = lines[i].replace(/[\r\n]/g, '').trim();

		if (line.startsWith('@#')) {
			continue;
		}

		if (line) {
			content += `${line}`;

			if (i !== lines.length - 1) {
				content += '\n';
			}
		}

	}

	// console.log(`'${content}'`);
	return content;
};

module.exports = (filename, data) => {

	if (!data) {
		throw new Error('No content provided to getTitle()');
	}

	const lines = data.split(/\r?\n/);

	const title = extractTitle(lines);
	const content = extractContent(lines);

	return ({
		filename: filename,
		title: title,
		content: content
	});
};