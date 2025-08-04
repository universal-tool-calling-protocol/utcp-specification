import { PROVIDER_TYPE_ICONS, CATEGORY_ICONS, DEFAULT_PROVIDER_ICON, DEFAULT_CATEGORY_ICON } from '../constants/icons';

/**
 * Gets the appropriate icon for a provider type
 */
export const getProviderTypeIcon = (type: string): string => {
  return PROVIDER_TYPE_ICONS[type.toLowerCase()] || DEFAULT_PROVIDER_ICON;
};

/**
 * Gets the appropriate icon for a category
 */
export const getCategoryIcon = (category: string): string => {
  return CATEGORY_ICONS[category] || DEFAULT_CATEGORY_ICON;
};