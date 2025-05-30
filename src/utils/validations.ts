export interface ValidationError {
  field: string;
  message: string;
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/;
  return passwordRegex.test(password);
};

export const validateMongoId = (id: string): boolean => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

export const validatePrice = (price: number): boolean => {
  return !isNaN(price) && price >= 0 && price <= 1000000000;
};

export const validateYear = (year: number): boolean => {
  const currentYear = new Date().getFullYear();
  return !isNaN(year) && year >= 1900 && year <= currentYear + 1;
};

export const validateVIN = (vin: string): boolean => {
  // Basic VIN validation (17 characters, alphanumeric except I, O, Q)
  const vinRegex = /^[A-HJ-NPR-Z0-9]{17}$/;
  return vinRegex.test(vin);
};

export const validateURL = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const validatePaginationParams = (page: number, limit: number): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  if (page < 1) {
    errors.push({ field: 'page', message: 'Page must be greater than 0' });
  }
  if (limit < 1) {
    errors.push({ field: 'limit', message: 'Limit must be greater than 0' });
  }
  if (limit > 100) {
    errors.push({ field: 'limit', message: 'Limit cannot exceed 100' });
  }

  return errors;
}; 