const cron = require('node-cron');
const Email = require('../models/Email.js');
const { sendEmail } = require('../services/emailService.js');
const { renderTemplate } = require('../services/templateService.js');

function startEmailScheduler() {
  cron.schedule('* * * * *', async () => {
    const now = new Date();
    const emails = await Email.find({
      scheduledAt: { $lte: now },
      status: 'pending'
    });

    for (const email of emails) {
      try {
        // Personalize subject/body
        const subject = renderTemplate(email.subject, { name: email.name });
        const body = renderTemplate(email.body, { name: email.name });

        await sendEmail({
          to: email.to,
          subject,
          text: body
        });
        email.status = 'sent';
        email.sentAt = new Date();
        email.error = undefined;
      } catch (err) {
        email.status = 'failed';
        email.error = err.message;
      }
      await email.save();
    }
  });
}

module.exports = startEmailScheduler;
