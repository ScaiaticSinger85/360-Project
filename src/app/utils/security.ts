export function sanitizePlainText(value: string) {
  return value.replace(/[<>]/g, '').replace(/\s+/g, ' ').trim();
}

export function sanitizeEmail(value: string) {
  return value.trim().toLowerCase();
}
