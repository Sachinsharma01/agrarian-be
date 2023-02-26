export const ERROR_CODES = {
  AGGOTP: 'AGGOTP',
  AGGOTP_DEF: 'AGGOTP_DEF',
  AGGTW: 'AGGTW',
  AGVOTP_DEF: 'AGVOTP_DEF',
  AGVOTP: 'AGVOTP',
  AGED: 'AGED',
  AGED_DEF: 'AGED_DEF'
};
export const ERRORS_LIST = [
  {
    code: ERROR_CODES.AGGOTP,
    description: 'Agrarian: Generate OTP Error',
    message: 'Genarate OTP error',
  },
  {
    code: ERROR_CODES.AGGOTP_DEF,
    description: 'Agrarian: Generate OTP Default Error',
    message: 'Generate OTP Default Error',
  },
  {
    code: ERROR_CODES.AGGTW,
    description: 'Agrarian: Generate OTP Twilio Error',
    message: 'Generate OTP Twilio Error',
  },
  {
    code: ERROR_CODES.AGVOTP_DEF,
    description: 'Agrarian: Verify OTP Default Error',
    message: 'Verify OTP Twilio Error',
  },
  {
    code: ERROR_CODES.AGVOTP,
    description: 'Agrarian: Verify OTP Error',
    message: 'Verify OTP Error',
  },
  {
    code: ERROR_CODES.AGED,
    description: 'Agrarian: Edit Details Error',
    message: 'Edit Details Error',
  },
  {
    code: ERROR_CODES.AGED_DEF,
    description: 'Agrarian: Edit Details Default Error',
    message: 'Edit Details Default Error',
  },
];
