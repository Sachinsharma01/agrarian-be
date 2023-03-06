import middlewares from '../../middlewares';
import { Router } from 'express';
import controller from './post.controller';
import { celebrate } from 'celebrate';
import validations from './validations';
const route = Router();

export default (app: any) => {
  app.use('/post', route);

  route.get(
    '/',
    middlewares.isAuth,
    middlewares.attachCurrentUser,
    celebrate({
      query: validations.getPosts,
    }),
    controller.listPosts,
  );
  route.get(
    '/:id',
    middlewares.isAuth,
    middlewares.attachCurrentUser,
    controller.getPostDetails
  )
};
