const router = require('express').Router();

router.route('/').get((_, res) => {
	res.type('text');
	res.status(200).send('Hello from Express');
});

module.exports = router;