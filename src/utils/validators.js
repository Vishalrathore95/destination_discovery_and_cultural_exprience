/**
 * Validates email format.
 */
export const validateEmail = (email) => {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(String(email).toLowerCase());
};

/**
 * Validates password strength (min 6 characters).
 */
export const validatePassword = (password) => {
  return password && password.length >= 6;
};

/**
 * Sanitizes search input to prevent injection or malicious inputs.
 */
export const sanitizeInput = (text) => {
  if (typeof text !== 'string') return '';
  return text
    .replace(/[<>]/g, '') // remove HTML tag brackets
    .trim();
};

/**
 * Checks if search input is safe and valid.
 */
export const validateSearchQuery = (query) => {
  const sanitized = sanitizeInput(query);
  if (!sanitized) return 'Search query cannot be empty.';
  if (sanitized.length < 2) return 'Search query must be at least 2 characters.';
  if (sanitized.length > 80) return 'Search query must be under 80 characters.';
  return null;
};
