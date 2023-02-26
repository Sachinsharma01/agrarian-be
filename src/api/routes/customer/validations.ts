import { Joi } from "celebrate";

export default {
  metaData: Joi.object().keys({
    token: Joi.string().required(),
  }),
  editDetails: Joi.object().keys({
    name: Joi.string().optional(),
    address: Joi.string().optional(),
    email: Joi.string().optional(),
    city: Joi.string().optional(),
    pincode: Joi.string().optional(),
    state: Joi.string().optional(),
    image: Joi.string().optional(),
    crops: Joi.array().optional()
  })
};
