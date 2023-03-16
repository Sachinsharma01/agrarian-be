import { Router } from 'express';
import { celebrate } from 'celebrate';
import validations from './validations';
import middlewares from '../../middlewares';
import controller from './home.controller'
const route = Router();

export default (app: any) => {
  app.use('/home', route);

  route.get(
    '/weather',
    middlewares.isAuth,
    middlewares.attachCurrentUser,
    celebrate({
      query: validations.weather,
    }),
    controller.weather,
  );
};
