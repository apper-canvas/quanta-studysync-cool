import { parseISO, isValid, format } from 'date-fns';

/**
 * Safely parse ISO date string with validation
 * Prevents TypeError when undefined/null values are passed to parseISO
 * @param {string} dateString - ISO date string to parse
 * @param {Date} fallback - Fallback date if parsing fails
 * @returns {Date} Parsed date or fallback
 */
export const safeParseISO = (dateString, fallback = new Date()) => {
  // Return fallback immediately if input is falsy
  if (!dateString || typeof dateString !== 'string') {
    return fallback;
  }
  
  try {
    const parsed = parseISO(dateString);
    return isValid(parsed) ? parsed : fallback;
  } catch (error) {
    console.warn('Date parsing failed:', error.message, 'Input:', dateString);
    return fallback;
  }
};

/**
 * Safely format date with validation
 * @param {Date|string} date - Date to format
 * @param {string} formatString - Format pattern
 * @param {string} fallback - Fallback string if formatting fails
 * @returns {string} Formatted date or fallback
 */
export const safeFormatDate = (date, formatString = 'yyyy-MM-dd', fallback = 'Invalid Date') => {
  try {
    const dateObj = typeof date === 'string' ? safeParseISO(date) : date;
    return isValid(dateObj) ? format(dateObj, formatString) : fallback;
  } catch (error) {
    console.warn('Date formatting failed:', error.message, 'Input:', date);
    return fallback;
  }
};