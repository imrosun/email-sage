const Email = require('../models/Email.js');
const validateEmail = require('../utils/validateEmail.js');

function toISODateTime(str) {
  if (!str) return null;
  const [date, time] = str.trim().split(' ');
  if (!date || !time) return null;
  const [h = '00', m = '00', s = '00'] = time.split(':');
  const hh = h.padStart(2, '0');
  const mm = m.padStart(2, '0');
  const ss = s.padStart(2, '0');
  return `${date}T${hh}:${mm}:${ss}Z`;
}


async function scheduleEmails(req, res, next) {
  try {
    const { recipients, subject, body } = req.body;
    const now = new Date();
    if (!Array.isArray(recipients) || !subject || !body) {
      return res.status(400).json({ error: "Missing recipients, subject, or body" });
    }

    let scheduledCount = 0;
    let errors = [];

    for (const [idx, rec] of recipients.entries()) {
      // Validate again for safety
      if (!rec.email || !rec.name || !rec.scheduled_send_time) {
        errors.push({ row: idx + 2, error: "Missing required fields" });
        continue;
      }
      if (!validateEmail(rec.email)) {
        errors.push({ row: idx + 2, error: "Invalid email format" });
        continue;
      }
      const isoString = toISODateTime(rec.scheduled_send_time);
      const scheduledAt = isoString ? new Date(isoString) : new Date('');
      if (isNaN(scheduledAt.getTime())) {
        errors.push({ row: idx + 2, error: "Invalid scheduled_send_time" });
        continue;
      }
      // console.log('scheduledAt:', scheduledAt.toISOString(), 'now:', now.toISOString());
      if (scheduledAt < new Date()) {
        // Time already passed
        await Email.create({
          to: rec.email,
          name: rec.name,
          scheduledAt,
          subject,
          body,
          status: 'time_passed',
          error: 'Scheduled time is in the past'
        });
        errors.push({ row: idx + 2, error: "Scheduled time is in the past" });
        continue;
      }
      await Email.create({
        to: rec.email,
        name: rec.name,
        scheduledAt,
        subject,
        body,
        status: scheduledAt < now ? 'time_passed' : 'pending',
        error: scheduledAt < now ? 'Scheduled time is in the past' : undefined,
        createdAt: new Date()
      });
      scheduledCount++;
    }

    res.json({
      success: true, 
      scheduledCount: scheduledCount || 0,
      errors: errors || []
    });
  } catch (err) {
    next(err);
  }
}

async function getEmails(req, res, next) {
  try {
    const { status } = req.query;
    const query = status && status !== 'all' ? { status } : {};
    // const emails = await Email.find(query).sort({ scheduledAt: 1 }); 
    const emails = await Email.find(query).sort({ createdAt: -1 }); // -1 for descending
    res.json(emails);
  } catch (err) {
    next(err);
  }
}

async function getQuota(req, res, next) {
  try {
    const now = new Date();
    // Get UTC midnight for today
    const todayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    // Count emails sent today
    const sentCount = await Email.countDocuments({
      sentAt: { $gte: todayUTC },
      status: { $in: ['sent', 'delivered'] }
    });
    const quota = 100;
    res.json({ quota, sentCount, left: quota - sentCount });
  } catch (err) {
    res.status(500).json({ error: "Could not fetch quota" });
  }
};

async function retryEmail(req, res, next) {
   try {
    const email = await Email.findById(req.params.id);
    if (!email) return res.status(404).json({ error: "Email not found" });
    if (email.status !== "failed") return res.status(400).json({ error: "Only failed emails can be retried" });

    // Set status back to pending, clear error, and update scheduledAt to now + 30s
    email.status = "pending";
    email.error = undefined;
    email.scheduledAt = new Date(Date.now() + 30 * 1000);
    await email.save();

    res.json({ success: true, message: "Email scheduled to retry in 30 seconds." });
  } catch (err) {
    res.status(500).json({ error: "Error retrying email" });
  }
};

module.exports = { scheduleEmails, getEmails, getQuota, retryEmail };
