const express = require('express');
const multer = require('multer');
const { uploadCSV } = require('../controllers/uploadController.js');

const upload = multer({ dest: 'uploads/' });
const router = express.Router();

router.post('/', upload.single('csv'), uploadCSV);

module.exports = router;
