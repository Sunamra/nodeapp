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
			title = line.replace(/[@#]/g, '').trim();
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
	let lineWritten = 0;
	for (let i = lineIndex; i < lines.length; i++) {

		const line = lines[i].replace(/[\r\n]/g, '').trim();

		if (line.startsWith('@#')) {
			continue;
		}

		// Precisely add `line`s to `content` with no leading/trailing whitespace
		if (line) {
			if (lineWritten) {
				content += '\n' + line.trim();
			}
			else {
				content += `${line}`;
			}
			lineWritten++;
		}
	}

	// console.log(`'${content}'`);
	return content;
};

module.exports = (data, filename = null) => {

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