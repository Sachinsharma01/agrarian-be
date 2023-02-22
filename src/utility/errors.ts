import { ERRORS_LIST } from '../config/errors';

class BadError extends Error {
  constructor(message) {
    super(message);
    this.name = 'BadError';
  }
}

class RequestBodyValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'RequestBodyValidationError';
  }
}
const getErrorMessageWithCode = code => {
  let errorDetails = ERRORS_LIST.find(item => item.code == code);
  if (errorDetails) {
    return `${errorDetails.code}: ${errorDetails.message}`;
  } else {
    // let defaultCode = code.split('_')[0] + '_DEF';
    // errorDetails = ERRORS_LIST.find((item) => item.code == defaultCode);
    // if (errorDetails) return `${errorDetails.code}: ${errorDetails.message}`;
    // else {
    return `HD_DEF: Something went wrong`;
    // }
  }
};

export default {
  BadError,
  RequestBodyValidationError,
  getErrorMessageWithCode,
};
