function sanitizeText(value) {
  return String(value || '').replace(/[<>]/g, '').replace(/\s+/g, ' ').trim();
}

function sanitizeEmail(value) {
  return sanitizeText(value).toLowerCase();
}

module.exports = {
  sanitizeText,
  sanitizeEmail,
};
