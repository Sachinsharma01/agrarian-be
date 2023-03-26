import { Router } from 'express';
import middlewares from '../../middlewares';
import controller from '../crops/crops.controller';
import { celebrate } from 'celebrate';
import validations from './validations';

const route = Router();

export default (app: any) => {
  app.use('/crops', route);

  route.get('/', middlewares.isAuth, middlewares.attachCurrentUser, controller.getAllCrops);
  route.get(
    '/user',
    middlewares.isAuth,
    middlewares.attachCurrentUser,
    celebrate({
      query: validations.getUserCrops,
    }),
    controller.getUserCrops,
  );
  route.get('/:id', middlewares.isAuth, middlewares.attachCurrentUser, controller.cropDetails);
};
