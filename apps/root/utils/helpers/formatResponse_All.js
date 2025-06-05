module.exports = (extractedData) => {

	let result = '';

	const borderChar = '-';
	const cornerChar = '+';
	const sideChar = '|';
	const endChar = '*';
	const padLen = 8;
	const endBorderLen = 50;
	let i = 0;
	for (const element of extractedData) {
		const filename = element.filename;
		const title = element.title;
		const content = element.content;

		const finalTitle = `(${filename}) ${title}`;
		const borderLen = finalTitle.length + (padLen * 2);

		// Title
		// result += '\n';
		// result += borderChar.repeat(borderLen) + '\n';
		// result += borderChar + ' '.repeat(padLen - 1) + finalTitle + ' '.repeat(padLen - 1) + borderChar + '\n';
		// result += borderChar.repeat(borderLen) + '\n\n';

		// Chatgpt ASCII Diagram Style Title Box
		result += '\n';
		result += cornerChar + borderChar.repeat(borderLen - 2) + cornerChar + '\n';
		result += sideChar + ' '.repeat(padLen - 1) + finalTitle + ' '.repeat(padLen - 1) + sideChar + '\n';
		result += cornerChar + borderChar.repeat(borderLen - 2) + cornerChar + '\n\n';

		// Content
		result += content + '\n\n';

		// Additional newline handling
		i++;
		if (i !== extractedData.length) {
			result += endChar.repeat(endBorderLen) + '\n'.repeat(2);
		}
		else {
			result += endChar.repeat(endBorderLen) + '\n';
		}

	}
	// process.stdout.write(result);

	return result;
};