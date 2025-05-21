const express = require('express');
const { scheduleEmails, getEmails, getQuota, retryEmail } = require('../controllers/emailController.js');
const router = express.Router();

router.post('/schedule', scheduleEmails);
router.get('/', getEmails);
router.get('/quota', getQuota);
router.post('/retry/:id', retryEmail);

module.exports = router;
