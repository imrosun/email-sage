const validateEmail = require('../utils/validateEmail.js');

function validateCSVRow(row) {
  if (!row.email || !row.name || !row.scheduled_send_time) return false;
  if (!validateEmail(row.email)) return false;
  if (isNaN(Date.parse(row.scheduled_send_time))) return false;
  return true;
}

module.exports = validateCSVRow;
