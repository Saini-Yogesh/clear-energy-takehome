import { colors } from '../theme/tokens';

/**
 * Formats amount in paise to Indian Locale currency format (₹1,23,456.78)
 */
export const formatCurrency = (paise: number): string => {
  if (typeof paise !== 'number' || isNaN(paise)) return '₹0.00';
  const rupees = paise / 100;
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(rupees);
  } catch (e) {
    // Fallback format if Intl fails
    return `₹${rupees.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  }
};

/**
 * Formats ISO string into Indian readable date time string
 */
export const formatDate = (isoString: string): string => {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return '';
  try {
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } catch (e) {
    return date.toISOString().replace('T', ' ').substring(0, 16);
  }
};

/**
 * Truncates address to a readable format
 */
export const truncateAddress = (address: string, maxLength: number = 60): string => {
  if (!address) return '';
  if (address.length <= maxLength) return address;
  return `${address.substring(0, maxLength)}...`;
};

/**
 * Formats ETA ISO string to time string (e.g. 12:45 PM)
 */
export const formatETA = (etaIsoString: string): string => {
  if (!etaIsoString) return 'N/A';
  const date = new Date(etaIsoString);
  if (isNaN(date.getTime())) return etaIsoString; // fallback if it's already a time string
  try {
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } catch (e) {
    return etaIsoString;
  }
};

/**
 * Returns dynamic colors for order status badge based on theme
 */
export const getStatusColors = (status: string, themeColors: typeof colors.light) => {
  const norm = status.toUpperCase();
  switch (norm) {
    case 'DELIVERED':
    case 'COMPLETED':
      return { bg: themeColors.successBackground, text: themeColors.success };
    case 'PENDING':
    case 'SCHEDULED':
      return { bg: themeColors.infoBackground, text: themeColors.info };
    case 'ASSIGNED':
    case 'IN_TRANSIT':
    case 'ACTIVE':
      return { bg: themeColors.warningBackground, text: themeColors.warning };
    case 'CANCELLED':
    case 'REJECTED':
      return { bg: themeColors.errorBackground, text: themeColors.error };
    default:
      return { bg: themeColors.divider, text: themeColors.textSecondary };
  }
};

/**
 * Returns dynamic colors for order priority badge based on theme
 */
export const getPriorityColors = (priority: string, themeColors: typeof colors.light) => {
  const norm = priority.toUpperCase();
  switch (norm) {
    case 'CRITICAL':
      return { bg: '#FEE2E2', text: '#991B1B' }; // Darker red for critical alert
    case 'HIGH':
      return { bg: themeColors.errorBackground, text: themeColors.error };
    case 'MEDIUM':
      return { bg: themeColors.warningBackground, text: themeColors.warning };
    case 'LOW':
    default:
      return { bg: themeColors.successBackground, text: themeColors.success };
  }
};
