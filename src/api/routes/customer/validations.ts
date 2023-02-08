import { Joi } from "celebrate";

export default {
  metaData: Joi.object().keys({
    token: Joi.string().required(),
  }),
  createUser: Joi.object().keys({
    username: Joi.string().required().min(3).max(16),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6).max(16),
  }),
};
