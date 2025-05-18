const express = require('express');
const { getFile, saveToFile } = require('../controllers');

const router = express.Router();

router.route('/api/v1').post(saveToFile);
router.route('/api/v1/:id').get(getFile);

module.exports = router;