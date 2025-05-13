const getAll = (_, res) => {
	res.status(200).send('Hello from Express!');
};

module.exports = getAll;