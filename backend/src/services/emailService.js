const sgMail = require('@sendgrid/mail');
const { SENDGRID_API_KEY, FROM_EMAIL } = require('../config');

sgMail.setApiKey(SENDGRID_API_KEY);

async function sendEmail({ to, subject, text }) {
  const msg = {
    to,
    from: FROM_EMAIL,
    subject,
    text,
  };
  return sgMail.send(msg);
}

module.exports = { sendEmail };
