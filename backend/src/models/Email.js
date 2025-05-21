const mongoose = require('mongoose');

const EmailSchema = new mongoose.Schema({
  to: { type: String, required: true },
  name: { type: String, required: true },
  scheduledAt: { type: Date, required: true },
  subject: { type: String, required: true },
  body: { type: String, required: true },
  status: { type: String, enum: ['pending', 'sent', 'delivered', 'failed', 'time_passed'], default: 'pending' },
  deliveredAt: Date,
  sentAt: {type: Date},
  error: String,
  createdAt: { type: Date, default: Date.now, required: true }
});

module.exports = mongoose.model('Email', EmailSchema);
