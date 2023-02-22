import { Joi } from 'celebrate';

export default {
  getOtp: Joi.object({
    phone: Joi.string().required(),
  }),
};
