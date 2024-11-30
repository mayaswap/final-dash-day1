export const formatDollarAmount = (amount: string | number): string => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (num >= 1e9) {
    return `$${(num / 1e9).toFixed(2)}B`;
  }
  if (num >= 1e6) {
    return `$${(num / 1e6).toFixed(2)}M`;
  }
  if (num >= 1e3) {
    return `$${(num / 1e3).toFixed(2)}K`;
  }
  return `$${num.toFixed(2)}`;
};

export const formatPercentage = (value: number): string => {
  return `${value.toFixed(2)}%`;
};

export const formatPrice = (price: string | number): string => {
  const num = typeof price === 'string' ? parseFloat(price) : price;
  return Math.round(num).toString();
};

export const parseDollarAmount = (value: string): number => {
  const cleanValue = value.replace(/[$,]/g, '');
  const match = cleanValue.match(/^([\d.]+)([KMB])?$/);
  if (!match) return 0;

  const [, number, suffix] = match;
  const baseValue = parseFloat(number);
  
  if (isNaN(baseValue)) return 0;
  
  switch (suffix) {
    case 'K':
      return baseValue * 1e3;
    case 'M':
      return baseValue * 1e6;
    case 'B':
      return baseValue * 1e9;
    default:
      return baseValue;
  }
};

export const formatTokenAmount = (amount: string | number): string => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  // Return 0 for negative numbers
  if (num <= 0) return '0.00';
  
  if (num >= 1e6) {
    return `${(num / 1e6).toFixed(2)}M`;
  }
  if (num >= 1e3) {
    return `${(num / 1e3).toFixed(2)}K`;
  }
  return num.toFixed(2);
};