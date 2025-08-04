/**
 * Formats property names from snake_case to Title Case
 */
export const formatPropertyName = (key: string): string => {
  return key
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Checks if a string is a URL
 */
export const isUrl = (value: string): boolean => {
  return value.startsWith('http://') || value.startsWith('https://');
};

/**
 * Truncates text to a specified length with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};