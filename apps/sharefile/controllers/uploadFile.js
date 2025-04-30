const uploadFile = (req, res) => {
	console.log('File received:', req.file);
	res.send('File uploaded successfully!');
}

module.exports = uploadFile;