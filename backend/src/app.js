const express = require('express');
const cors = require('cors');
const uploadRoutes = require('./routes/uploadRoutes.js');
const emailRoutes = require('./routes/emailRoutes.js');
const errorHandler = require('./middlewares/errorHandler.js');
const sendgridWebhookRoutes = require('./routes/sendgridWebhook.js');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/upload', uploadRoutes);
app.use('/api/emails', emailRoutes);
app.use('/api/sendgrid/webhook', sendgridWebhookRoutes);

app.use(errorHandler);

module.exports = app;
