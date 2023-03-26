import { Joi } from 'celebrate';
export default {
  getUserCrops: Joi.object().keys({
    userId: Joi.string().required(),
  }),
};
