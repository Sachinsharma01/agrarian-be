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
};
