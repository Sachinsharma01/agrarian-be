import { Router } from 'express';
import middlewares from '../../middlewares';
import controller from '../crops/crops.controller';

const route = Router();

export default (app: any) => {
  app.use('/crops', route);

  route.get('/', middlewares.isAuth, middlewares.attachCurrentUser, controller.getAllCrops);
};
