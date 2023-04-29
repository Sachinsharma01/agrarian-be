import { Router } from 'express';
import { celebrate } from 'celebrate';
import middlewares from '../../middlewares';
import validations from './validations';
import controller from './notification.controller';

const route = Router();

export default (app: any) => {
  app.use('/notification', route);

  route.get(
    '/',
    middlewares.isAuth,
    middlewares.attachCurrentUser,
    celebrate({
      query: validations.getAllNotification,
    }),
    controller.getAllNotifications,
  );

  route.put(
    '/read',
    middlewares.isAuth,
    middlewares.attachCurrentUser,
    celebrate({
      query: validations.read,
    }),
    controller.read,
  );
};
