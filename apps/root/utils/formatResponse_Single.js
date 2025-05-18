module.exports = (separatedData) => {
	let result = '';

	const highlightChar = '=';
	result += '\n';
	result += `${highlightChar.repeat(4)} ${separatedData.title} ${highlightChar.repeat(4)}`;
	result += '\n'.repeat(2);
	result += `${separatedData.content}`;
	result += '\n';

	return result;
};
