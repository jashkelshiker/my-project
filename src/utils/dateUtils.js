/**
 * Date Utilities
 * Helper functions for date calculations and formatting
 */

/**
 * Calculates the number of days between two dates
 */
export const calculateDays = (startDate, endDate) => {
  if (!startDate || !endDate) return 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays || 1; // Minimum 1 day
};

/**
 * Formats date to YYYY-MM-DD format
 */
export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Formats date to readable format (e.g., "Jan 30, 2026")
 */
export const formatDateReadable = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Gets today's date in YYYY-MM-DD format
 */
export const getTodayDate = () => {
  return formatDate(new Date());
};

/**
 * Gets minimum date for date picker (today)
 */
export const getMinDate = () => {
  return getTodayDate();
};
