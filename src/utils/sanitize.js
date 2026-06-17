// Minimal client-side sanitizer: escape HTML special characters
export function escapeHtml(input) {
  if (input === null || input === undefined) return input;
  return String(input)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function sanitizeForStorage(input) {
  // For simple strings, escape HTML to reduce XSS risk when re-displayed
  if (typeof input === 'string') return escapeHtml(input);
  return input;
}
