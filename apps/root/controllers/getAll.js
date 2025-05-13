const getAll = (req, res) => {
	const i = Number(req.params?.num) || 1;
	res.send(Array(i).fill("Hello ").map((s, i) => s + (i + 1)).join("\n"));
};

module.exports = getAll;