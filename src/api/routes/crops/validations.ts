import { Joi } from 'celebrate';
export default {
  getUserCrops: Joi.object().keys({
    userId: Joi.string().required(),
  }),
  addCrop: Joi.object().keys({
    userId: Joi.string().required(),
    crop: Joi.object()
      .keys({
        name: Joi.string().required(),
        image: Joi.string().required(),
        _id: Joi.string().required(),
        totalWeeks: Joi.number().required(),
      })
      .required(),
    sowingDate: Joi.string().optional(),
    area: Joi.number().optional(),
  }),
  removeCrop: Joi.object().keys({
    userId: Joi.string().required(),
    cropId: Joi.string().required(),
  }),
};
