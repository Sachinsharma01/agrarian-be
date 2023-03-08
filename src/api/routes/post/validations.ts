import { Joi } from 'celebrate';

export default {
  getPosts: Joi.object().keys({
    crop: Joi.string().optional(),
    page: Joi.number().optional(),
    limit: Joi.number().optional(),
  }),
  addComment: Joi.object().keys({
    postId: Joi.string().required(),
    comment: Joi.string().required(),
  }),
  addPost: Joi.object().keys({
    description: Joi.string().required(),
    crop: Joi.object({
      cropName: Joi.string().required(),
      cropImage: Joi.string().required(),
      cropId: Joi.string().required(),
    }).required(),
    image: Joi.string().optional(),
  }),
};
