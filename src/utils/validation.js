// Form validation utilities
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const validateName = (name) => {
  return name && name.trim().length >= 2;
};

export const validateUsername = (username) => {
  const usernameRegex = /^[a-zA-Z0-9_]+$/;
  return username && username.length >= 3 && usernameRegex.test(username);
};

export const validateAge = (age) => {
  const ageNum = parseInt(age);
  return !isNaN(ageNum) && ageNum >= 13 && ageNum <= 120;
};

export const validateLocation = (location) => {
  return location && location.trim().length >= 2;
};

// Combined validation for signup form
export const validateSignupForm = (formData) => {
  const errors = {};

  if (!validateName(formData.fullName)) {
    errors.fullName = 'Full name must be at least 2 characters long';
  }

  if (!validateUsername(formData.username)) {
    errors.username = 'Username must be at least 3 characters and contain only letters, numbers, and underscores';
  }

  if (!validateEmail(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!validateAge(formData.age)) {
    errors.age = 'Please enter a valid age between 13 and 120';
  }

  if (!validateLocation(formData.location)) {
    errors.location = 'Location must be at least 2 characters long';
  }

  if (!validatePassword(formData.password)) {
    errors.password = 'Password must be at least 6 characters long';
  }

  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Combined validation for login form
export const validateLoginForm = (formData) => {
  const errors = {};

  if (!validateEmail(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!formData.password) {
    errors.password = 'Password is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
