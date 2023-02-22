import middlewares from '../../middlewares';
import { Router } from 'express';
import { celebrate } from 'celebrate';
import validations from './validations';
import controller from './auth.controller';
const route = Router();

export default (app: any) => {
  app.use('/auth', route);
  route.post(
    '/generate-otp',
    celebrate({
      body: validations.getOtp,
    }),
    controller.getOtp,
  );
  route.post(
    '/verify-otp',
    celebrate({
      body: validations.verifyOtp,
    }),
    controller.verifyOtp,
  );
};
