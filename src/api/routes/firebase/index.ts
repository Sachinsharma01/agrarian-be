import { Router } from 'express';
import controller from './firebase.controller';
import middlewares from '../../middlewares';

const route = Router();

export default (app: any) => {
  app.use('/firebase', route);

  route.get('/npk', controller.getData);
};
