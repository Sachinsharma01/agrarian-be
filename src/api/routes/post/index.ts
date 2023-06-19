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
  route.post(
    '/addComment',
    middlewares.isAuth,
    middlewares.attachCurrentUser,
    celebrate({
      body: validations.addComment
    }),
    controller.addComment
  )
  route.post(
    '/addPost',
    middlewares.isAuth,
    middlewares.attachCurrentUser,
    celebrate({
      body: validations.addPost
    }),
    controller.addPost
  ),
  route.put(
    '/updatePost/:postId',
    middlewares.isAuth,
    middlewares.attachCurrentUser,
    controller.updatePost
  )
  route.delete(
    '/delete/:postId',
    middlewares.isAuth,
    middlewares.attachCurrentUser,
    // middlewares.isAuthorizedToDeletePost,
    celebrate({
      params: validations.deletePost
    }),
    controller.deletePost
  )
};
