const isRequired = (value: string) => {
  if (value && value.trim()) {
    return true;
  }

  return 'This is required';
};

const isLongerThan = (value: string, longerThan: number) => {
  if (value && value.trim().length > longerThan) {
    return true;
  }

  return `This needs to be longer than ${longerThan} characters`;
};

const isValidEmail = (value: string) => {
  if (value && /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}/i.test(value)) {
    return true;
  }
  return 'This field must be a valid email';
};

const isPhoneNumber = (value: string) => {
  if (value && value.length === 9) {
    return true;
  }
  return 'Phone number should have exact 9 number';
};

const isChecked = (value: boolean) => {
  if (value) {
    return true;
  }

  return 'You need to check this before going any further';
};

export default {
  name(value: string) {
    return isLongerThan(value, 2);
  },
  lastname(value: string) {
    return isLongerThan(value, 3);
  },
  address(value: string) {
    return isRequired(value);
  },
  country(value: string) {
    return isRequired(value);
  },
  email(value: string) {
    return isValidEmail(value);
  },
  phone(value: string) {
    return isPhoneNumber(value);
  },
  info(value: string) {
    return isLongerThan(value, 10);
  },
  checkbox(value: boolean) {
    return isChecked(value);
  },
};
