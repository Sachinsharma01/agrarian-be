import { Joi } from "celebrate";

export default {
  metaData: Joi.object().keys({
    token: Joi.string().required(),
  }),
};
