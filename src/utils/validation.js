/**
 * Validation Utilities
 * Reusable validation functions for forms and data
 */

import { VALIDATION_RULES } from '../constants/appConstants';

/**
 * Validates phone number (10 digits)
 */
export const validatePhone = (phone) => {
  const phoneRegex = /^\d{10}$/;
  return phoneRegex.test(phone);
};

/**
 * Validates email format
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates age (between MIN_AGE and MAX_AGE)
 */
export const validateAge = (age) => {
  const ageNum = parseInt(age, 10);
  if (isNaN(ageNum)) return { valid: false, message: 'Age must be a number' };
  if (ageNum < VALIDATION_RULES.MIN_AGE) {
    return { valid: false, message: `Age must be ${VALIDATION_RULES.MIN_AGE} or above` };
  }
  if (ageNum > VALIDATION_RULES.MAX_AGE) {
    return { valid: false, message: `Booking not allowed above age ${VALIDATION_RULES.MAX_AGE}` };
  }
  return { valid: true };
};

/**
 * Validates license number (minimum length)
 */
export const validateLicenseNumber = (licenseNumber) => {
  if (!licenseNumber || licenseNumber.length < VALIDATION_RULES.MIN_LICENSE_LENGTH) {
    return {
      valid: false,
      message: `Invalid driving license number (minimum ${VALIDATION_RULES.MIN_LICENSE_LENGTH} characters)`,
    };
  }
  return { valid: true };
};

/**
 * Validates number of persons
 */
export const validatePersons = (persons) => {
  const personsNum = parseInt(persons, 10);
  if (isNaN(personsNum) || personsNum < VALIDATION_RULES.MIN_PERSONS) {
    return {
      valid: false,
      message: `Minimum ${VALIDATION_RULES.MIN_PERSONS} persons required`,
    };
  }
  return { valid: true };
};

/**
 * Validates date range (return date must be after pickup date)
 */
export const validateDateRange = (pickupDate, returnDate) => {
  if (!pickupDate || !returnDate) {
    return { valid: false, message: 'Both pickup and return dates are required' };
  }
  const pickup = new Date(pickupDate);
  const returnDateObj = new Date(returnDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (pickup < today) {
    return { valid: false, message: 'Pickup date cannot be in the past' };
  }
  if (returnDateObj <= pickup) {
    return { valid: false, message: 'Return date must be after pickup date' };
  }
  return { valid: true };
};

/**
 * Validates booking form data
 */
export const validateBookingForm = (formData) => {
  const errors = {};

  // Validate age
  const ageValidation = validateAge(formData.age);
  if (!ageValidation.valid) {
    errors.age = ageValidation.message;
  }

  // Validate phone
  if (!validatePhone(formData.phone)) {
    errors.phone = `Enter valid ${VALIDATION_RULES.PHONE_LENGTH}-digit mobile number`;
  }

  // Validate license
  const licenseValidation = validateLicenseNumber(formData.licenseNumber);
  if (!licenseValidation.valid) {
    errors.licenseNumber = licenseValidation.message;
  }

  // Validate persons
  const personsValidation = validatePersons(formData.persons);
  if (!personsValidation.valid) {
    errors.persons = personsValidation.message;
  }

  // Validate vehicle
  if (!formData.vehicle) {
    errors.vehicle = 'Please select a vehicle';
  }

  // Validate dates
  const dateValidation = validateDateRange(formData.deliverDate, formData.returnDate);
  if (!dateValidation.valid) {
    errors.dates = dateValidation.message;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
