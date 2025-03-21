
// Format currency in KES
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format date to readable string
export const formatDate = (date: Date | undefined): string => {
  if (!date) return 'N/A';
  
  return new Intl.DateTimeFormat('en-KE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
};

// Format relative time (e.g., "2 days ago")
export const formatRelativeTime = (date: Date | undefined): string => {
  if (!date) return 'N/A';
  
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  
  // Convert difference to days
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 30) return `${days} days ago`;
  
  const months = Math.floor(days / 30);
  if (months === 1) return '1 month ago';
  if (months < 12) return `${months} months ago`;
  
  const years = Math.floor(months / 12);
  if (years === 1) return '1 year ago';
  return `${years} years ago`;
};

// Format quantity with unit
export const formatQuantity = (quantity: number, unit: string): string => {
  return `${quantity} ${unit}`;
};

// Get status color class based on asset status
export const getStatusColorClass = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'available':
      return 'text-green-600 bg-green-50 border-green-200';
    case 'checked-out':
      return 'text-blue-600 bg-blue-50 border-blue-200';
    case 'maintenance':
      return 'text-amber-600 bg-amber-50 border-amber-200';
    case 'retired':
      return 'text-gray-600 bg-gray-100 border-gray-200';
    default:
      return 'text-gray-600 bg-gray-100 border-gray-200';
  }
};

// Get condition color class
export const getConditionColorClass = (condition: string): string => {
  switch (condition.toLowerCase()) {
    case 'excellent':
      return 'text-green-600';
    case 'good':
      return 'text-blue-600';
    case 'fair':
      return 'text-amber-600';
    case 'poor':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
};

// Get stock level color class
export const getStockLevelClass = (quantity: number, minStockLevel: number): string => {
  if (quantity <= minStockLevel * 0.5) {
    return 'text-red-600';
  } else if (quantity <= minStockLevel) {
    return 'text-amber-600';
  } else if (quantity <= minStockLevel * 1.5) {
    return 'text-blue-600';
  } else {
    return 'text-green-600';
  }
};

// Truncate text with ellipsis
export const truncateText = (text: string, maxLength: number): string => {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

// Generate a random ID (for demo purposes)
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 10);
};

// Format percentage
export const formatPercentage = (value: number, total: number): string => {
  if (total === 0) return '0%';
  return `${Math.round((value / total) * 100)}%`;
};

// Capitalize first letter of each word
export const capitalizeWords = (str: string): string => {
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};
