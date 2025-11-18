/* eslint-disable no-undef, no-empty */
// Simple API base helper. Returns configured API base from env or window global.
export function getApiBase() {
  try {
    if (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_BASE) {
      return process.env.REACT_APP_API_BASE;
    }
  } catch (e) {}
  if (typeof window !== 'undefined' && window._API_BASE) {
    return window._API_BASE;
  }
  // Fallback to empty string so callers can build relative URLs
  return '';
}

// CommonJS compatibility for require() callers
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { getApiBase };
}
