const mongoose = require('mongoose');
// const { PORT, MONGO_URI } = require('./config');
const app = require('./app.js');
const startEmailScheduler = require('./jobs/emailScheduler.js');

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      startEmailScheduler();
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
