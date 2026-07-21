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

export const formatIRRToToman = (valueIRR: number): string => {
  const toman = Math.floor(valueIRR / 10);
  return `${formatNumber(toman)} تومان`;
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
    .replace(/[0-9]/g, (digit) => String('0123456789'.indexOf(digit)))
    .replace(/[0-9]/g, (digit) => String('0123456789'.indexOf(digit)));
};
