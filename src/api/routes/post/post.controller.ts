import { Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import APIResponses from '../../../utility/response';
import logger from '../../../loaders/logger';
import PostService from '../../../services/post';
import ErrorHandler from '../../../utility/errors';
import { ERROR_CODES } from '../../../config/errors';

export default {
  listPosts: async (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.info('list posts API starts here %o', req.query);
      const postServiceInstance = Container.get(PostService);
      const query = {
        currentUser: req.currentUser,
        query: { ...req.query },
      };
      const response: any = await postServiceInstance.listPosts(query as unknown);
      logger.debug('list posts service response in controller %o', response);
      return APIResponses.success(res, 'Posts Listed successfully!', response);
    } catch (err) {
      if (err instanceof ErrorHandler.BadError) {
        logger.error('List posts API fails with error %o', err);
        return APIResponses.badRequest(res, err.message, {});
      } else {
        logger.error('List posts API end with error %o', err);
        return APIResponses.badRequest(res, ErrorHandler.getErrorMessageWithCode(ERROR_CODES.AGLP), {});
      }
    }
  },

  getPostDetails: async (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.info('Get post details API starts here %o', req.params);
      const postServiceInstance = Container.get(PostService);
      const response: any = await postServiceInstance.getPostDetails(req.params as { id: string });
      logger.debug('get post details service response in controller %o', response);
      return APIResponses.success(res, 'Posts details fetched successfully!', response);
    } catch (err) {
      if (err instanceof ErrorHandler.BadError) {
        logger.error('get post details API fails with error %o', err);
        return APIResponses.badRequest(res, err.message, {});
      } else {
        logger.error('get post details API end with error %o', err);
        return APIResponses.badRequest(res, ErrorHandler.getErrorMessageWithCode(ERROR_CODES.AGPD), {});
      }
    }
  },

  addComment: async (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.info('Add comment API start here %o', req.body);
      const input = {
        currentUser: req.currentUser,
        body: req.body,
      };
      const postServiceInstance = Container.get(PostService);
      const response: any = await postServiceInstance.addComment(input as any);
      logger.debug('add comment service response in controller %o', response);
      return APIResponses.success(res, 'Comment added successfully!', response);
    } catch (err) {
      if (err instanceof ErrorHandler.BadError) {
        logger.error('get post details API fails with error %o', err);
        return APIResponses.badRequest(res, err.message, {});
      } else {
        logger.error('get post details API end with error %o', err);
        return APIResponses.badRequest(res, ErrorHandler.getErrorMessageWithCode(ERROR_CODES.AGPD), {});
      }
    }
  },

  addPost: async (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.info('Add post API starts here %o', req.body);
      const input = {
        currentUser: req.currentUser,
        body: req.body,
      };
      const postServiceInstance = Container.get(PostService);
      const response: any = await postServiceInstance.addPost(input as any);
      logger.info('Add Post response in controller %o', response);
      return APIResponses.success(res, 'Post added successfully!', response);
    } catch (err) {
      if (err instanceof ErrorHandler.BadError) {
        logger.error('get post details API fails with error %o', err);
        return APIResponses.badRequest(res, err.message, {});
      } else {
        logger.error('get post details API end with error %o', err);
        return APIResponses.badRequest(res, ErrorHandler.getErrorMessageWithCode(ERROR_CODES.AGPD), {});
      }
    }
  },
};
