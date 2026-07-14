/**
 * Utility functions to format numbers, currency, dates, percentages, and order IDs 
 * strictly using ASCII English digits (0-9) to maintain visual-system consistency.
 */

export const formatNumber = (
  value: number,
  options?: Intl.NumberFormatOptions
): string => {
  return new Intl.NumberFormat('en-US', options).format(value);
};

export const formatCurrency = (value: number): string => {
  return `${formatNumber(value)} تومان`;
};

export const formatPercent = (value: number, decimals: number = 0): string => {
  return `${formatNumber(value, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}%`;
};

export const formatDate = (dateString: string | Date): string => {
  if (!dateString) return '';
  const d = typeof dateString === 'string' ? new Date(dateString) : dateString;
  if (isNaN(d.getTime())) {
    // If it's a Persian relative/absolute string, translate any numbers to English
    return normalizeDigits(String(dateString));
  }
  // Standard formatting in Gregorian with English digits
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}/${month}/${day}`;
};

export const formatTime = (timeString: string): string => {
  return normalizeDigits(timeString);
};

export const formatOrderId = (id: string | number): string => {
  return `#${normalizeDigits(String(id))}`;
};

export const normalizeDigits = (value: string): string => {
  if (!value) return '';
  return value
    .replace(/[۰-۹]/g, (digit) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(digit)));
};
