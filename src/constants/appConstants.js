/**
 * Application Constants
 * Centralized configuration and constants for the vehicle rental system
 */

export const VEHICLE_TYPES = {
  SEDAN: 'Sedan',
  SUV: 'SUV',
  MINI_BUS: 'Mini Bus',
  MAXI_CAB: 'Maxi Cab',
};

export const VEHICLE_PRICES = {
  [VEHICLE_TYPES.SEDAN]: 2000,
  [VEHICLE_TYPES.SUV]: 3000,
  [VEHICLE_TYPES.MINI_BUS]: 6000,
  [VEHICLE_TYPES.MAXI_CAB]: 4500,
};

export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
};

export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
};

export const PAYMENT_METHODS = {
  UPI: 'upi',
  CARD: 'card',
  CASH: 'cash',
};

export const VALIDATION_RULES = {
  MIN_AGE: 18,
  MAX_AGE: 60,
  MIN_PERSONS: 4,
  PHONE_LENGTH: 10,
  MIN_LICENSE_LENGTH: 15,
  TAX_RATE: 0.1, // 10%
};

export const ROUTES = {
  HOME: '/',
  BOOKING: '/booking',
  VEHICLES: '/vehicles',
  BROWSE_BY_TYPE: '/browse-by-type',
  BUDGET_VEHICLES: '/budget-vehicles',
  POPULAR_VEHICLES: '/popular-vehicles',
  MY_BOOKINGS: '/my-bookings',
  FAVORITES: '/favorites',
  SUMMARY: '/summary',
  PAYMENT: '/payment',
  BOOKING_CONFIRMATION: '/booking-confirmation',
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_VEHICLES: '/admin/vehicles',
  ADMIN_BOOKINGS: '/admin/bookings',
  ADMIN_USERS: '/admin/users',
  PROFILE: '/profile',
};

export const DEMO_CREDENTIALS = {
  ADMIN: {
    USERNAME: 'admin',
    EMAIL: 'admin@greenride.com',
    PASSWORD: 'admin123',
  },
  USER: {
    PASSWORD: 'password123',
  },
};

export const APP_CONFIG = {
  NAME: 'GreenRide',
  TAGLINE: 'Premium rentals',
  SUPPORT_EMAIL: 'support@greenride.com',
  SUPPORT_HOURS: 'Mon–Sun, 9am–9pm',
};
