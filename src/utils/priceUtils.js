/**
 * Price Calculation Utilities
 * Helper functions for price calculations
 */

import { VALIDATION_RULES } from '../constants/appConstants';
import { calculateDays } from './dateUtils';

/**
 * Calculates total price for booking
 */
export const calculateTotalPrice = (pricePerDay, startDate, endDate) => {
  const days = calculateDays(startDate, endDate);
  return pricePerDay * days;
};

/**
 * Calculates tax amount
 */
export const calculateTax = (subtotal) => {
  return Math.round(subtotal * VALIDATION_RULES.TAX_RATE);
};

/**
 * Calculates final total with tax
 */
export const calculateFinalTotal = (subtotal) => {
  const tax = calculateTax(subtotal);
  return subtotal + tax;
};

/**
 * Formats price with currency symbol
 */
export const formatPrice = (price) => {
  return `₹${price.toLocaleString('en-IN')}`;
};

/**
 * Calculates complete booking price breakdown
 */
export const calculateBookingPrice = (pricePerDay, startDate, endDate) => {
  const subtotal = calculateTotalPrice(pricePerDay, startDate, endDate);
  const tax = calculateTax(subtotal);
  const total = calculateFinalTotal(subtotal);
  const days = calculateDays(startDate, endDate);

  return {
    pricePerDay,
    days,
    subtotal,
    tax,
    total,
  };
};
