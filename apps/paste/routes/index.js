const express = require('express');
const saveToFile = require('../controllers/saveFile.js')
const getFile = require('../controllers/getFile.js')

const router = express.Router();

router.route('/api/v1').post(saveToFile);
router.route('/api/v1/:id').get(getFile);

module.exports = router;