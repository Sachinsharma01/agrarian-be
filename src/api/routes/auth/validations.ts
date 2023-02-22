import { Joi } from 'celebrate';

export default {
  getOtp: Joi.object({
    phone: Joi.string().required(),
  }),
  verifyOtp: Joi.object({
    phone: Joi.string().required(),
    otp: Joi.string().required(),
  }),
};
