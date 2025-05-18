module.exports = async (req, res) => {
	const fileID = req.params?.file || undefined;

	console.log(fileID);

	res.send(`Request : ${fileID}`);
};
