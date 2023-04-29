import { Joi } from 'celebrate';

export default {
  getAllNotification: Joi.object().keys({
    userId: Joi.string().required(),
  }),
  read: Joi.object().keys({
    notificationId: Joi.string().required(),
  }),
};
