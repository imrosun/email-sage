const parseCSV = require('../utils/csvParser.js');
const validateEmail = require('../utils/validateEmail.js');

async function uploadCSV(req, res, next) {
  try {
    const filePath = req.file.path;
    const rows = await parseCSV(filePath);

    // Validate each row and send back the parsed data for preview
    const parsed = rows.map((row, idx) => {
      let error = null;
      if (!row.email || !row.name || !row.scheduled_send_time) {
        error = "Missing required fields";
      } else if (!validateEmail(row.email)) {
        error = "Invalid email format";
      } else if (isNaN(Date.parse(row.scheduled_send_time))) {
        error = "Invalid scheduled_send_time";
      }
      return {
        email: row.email,
        name: row.name,
        scheduled_send_time: row.scheduled_send_time,
        error,
        row: idx + 2 // CSV header is row 1
      };
    });

    res.json({ success: true, parsed });
  } catch (err) {
    next(err);
  }
}

module.exports = { uploadCSV };
