/**
 * Formats a currency amount into standard USD/Local values.
 */
export const formatCurrency = (amount, currencyCode = 'USD') => {
  if (typeof amount === 'string') {
    if (amount.toLowerCase() === 'free') return 'Free';
    return amount; // return raw if already a string description
  }
  
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      maximumFractionDigits: 0
    }).format(amount);
  } catch (e) {
    return `${currencyCode} ${amount}`;
  }
};

/**
 * Truncates text with trailing ellipses.
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};

/**
 * Formats dates into human readable formats.
 */
export const formatDateRange = (startDateStr, endDateStr) => {
  if (!startDateStr) return '';
  try {
    const sDate = new Date(startDateStr);
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    
    if (!endDateStr) {
      return sDate.toLocaleDateString('en-US', options);
    }
    
    const eDate = new Date(endDateStr);
    return `${sDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${eDate.toLocaleDateString('en-US', options)}`;
  } catch (e) {
    return `${startDateStr} to ${endDateStr}`;
  }
};

/**
 * Formats a single date string into a human-readable format.
 */
export const formatDate = (dateStr, options = { month: 'short', day: 'numeric', year: 'numeric' }) => {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('en-US', options);
  } catch (e) {
    return dateStr;
  }
};

/**
 * Capitalizes the first letter of every word in a string.
 */
export const capitalizeWords = (str = '') =>
  str.replace(/\b\w/g, (char) => char.toUpperCase());
