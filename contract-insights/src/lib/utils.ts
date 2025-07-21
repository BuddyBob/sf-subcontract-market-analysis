import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  // Ensure we have a valid number
  const numAmount = Number(amount);
  if (isNaN(numAmount) || !isFinite(numAmount)) {
    return '$0';
  }
  
  if (numAmount >= 1000000) {
    return `$${(numAmount / 1000000).toFixed(1)}M`;
  } else if (numAmount >= 1000) {
    return `$${(numAmount / 1000).toFixed(0)}K`;
  }
  return `$${numAmount.toLocaleString()}`;
}

export function formatPercent(value: number): string {
  const numValue = Number(value);
  if (isNaN(numValue) || !isFinite(numValue)) {
    return '0.0%';
  }
  return `${(numValue * 100).toFixed(1)}%`;
}

export function parseNumericValue(value: string | number): number {
  if (typeof value === 'number') return value;
  
  // Handle engineer estimates with ranges like "14,000,000-15,000,000"
  if (typeof value === 'string' && value.includes('-')) {
    const parts = value.split('-');
    const firstValue = parts[0].replace(/,/g, '');
    return parseFloat(firstValue) || 0;
  }
  
  // Handle regular numeric strings with commas
  if (typeof value === 'string') {
    const cleaned = value.replace(/,/g, '');
    return parseFloat(cleaned) || 0;
  }
  
  return 0;
}

export function getConcentrationColor(level: string): string {
  switch (level) {
    case 'Highly Concentrated':
      return 'bg-danger-500';
    case 'Moderately Concentrated':
      return 'bg-warning-500';
    case 'Unconcentrated':
      return 'bg-primary-500';
    default:
      return 'bg-gray-500';
  }
}

export function getConcentrationColorClass(level: string): string {
  switch (level) {
    case 'Highly Concentrated':
      return 'text-danger-600 bg-danger-50';
    case 'Moderately Concentrated':
      return 'text-warning-600 bg-warning-50';
    case 'Unconcentrated':
      return 'text-primary-600 bg-primary-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
}

export function getLbeEquityColor(share: number): string {
  if (share < 0.25) return 'text-danger-600 bg-danger-50';
  if (share > 0.75) return 'text-primary-600 bg-primary-50';
  return 'text-warning-600 bg-warning-50';
}
