export const ERROR_CODES = {
  AGGOTP: 'AGGOTP',
  AGGOTP_DEF: 'AGGOTP_DEF',
  AGGTW: 'AGGTW',
  AGVOTP_DEF: 'AGVOTP_DEF',
  AGVOTP: 'AGVOTP'
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
];
