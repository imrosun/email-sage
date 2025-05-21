const express = require('express');
const { handleSendGridWebhook } = require('../controllers/sendgridWebhookController.js');
const router = express.Router();

router.post('/', express.json({ type: 'application/json' }), handleSendGridWebhook);

module.exports = router;
