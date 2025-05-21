const Email = require('../models/Email.js');

async function handleSendGridWebhook(req, res) {
  try {
    const events = req.body;
    console.log("Webhook received events:", JSON.stringify(events, null, 2));
    for (const event of events) {
      if (event.event === 'delivered' && event.email) {
        // Log which email is being updated
        console.log(`Marking ${event.email} as delivered at ${event.timestamp}`);
        await Email.findOneAndUpdate(
          { to: event.email, status: 'sent' },
          { status: 'delivered', deliveredAt: new Date(event.timestamp * 1000) }
        );
      }
    }
    res.status(200).send('OK');
  } catch (err) {
    console.error('SendGrid Webhook error:', err);
    res.status(500).send('Error');
  }
}


module.exports = { handleSendGridWebhook };
