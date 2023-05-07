import { Response, Request, NextFunction } from 'express';
import Container from 'typedi';
import logger from '../../../loaders/logger';
import NotificationService from '../../../services/notification';
import APIResponses from '../../../utility/response';
import ErrorHandler from '../../../utility/errors';

export default {
  getAllNotifications: async (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.info('Get All Notification API starts here with query %o', req.query);
      const userId = req.query.userId;
      const notificationServiceInstance = Container.get(NotificationService);
      const response = await notificationServiceInstance.getAllNotifications({ userId: userId });
      logger.debug('Get All notification response in controller %o', response);
      return APIResponses.success(res, 'All notifications fetched successfully', response);
    } catch (err) {
      if (err instanceof ErrorHandler.BadError) {
        logger.error('List notification API fails with error %o', err);
        return APIResponses.badRequest(res, err.message, {});
      } else {
        logger.error('List notification API end with error %o', err);
        return APIResponses.badRequest(res, 'OOPS! Something went Wrong!!', {});
      }
    }
  },

  read: async (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.info('read Notification API starts here with query %o', req.query);
      const userId: any = req.currentUser._id;
      const notificationId: any = req.query.notificationId;
      const notificationServiceInstance = Container.get(NotificationService);
      const response = await notificationServiceInstance.read({ userId: userId, notificationId: notificationId });
      logger.debug('Read notification response in controller %o', response);
      return APIResponses.success(res, 'Notifications read successfully', response);
    } catch (err) {
      if (err instanceof ErrorHandler.BadError) {
        logger.error('read notification API fails with error %o', err);
        return APIResponses.badRequest(res, err.message, {});
      } else {
        logger.error('read notification API end with error %o', err);
        return APIResponses.badRequest(res, 'OOPS! Something went Wrong!!', {});
      }
    }
  },

  count: async (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.info('notification count API start here %o', req.params);
      const userId: string = req.params.userId;
      const notificationService = Container.get(NotificationService);
      const response: any = await notificationService.getCount(userId as string);
      logger.debug('notification count response in controller %o', response);
      return APIResponses.success(res, 'Notifications count fetched successfully', response);
    } catch (err) {
      if (err instanceof ErrorHandler.BadError) {
        logger.error('notification count API fails with error %o', err);
        return APIResponses.badRequest(res, err.message, {});
      } else {
        logger.error('read notification API end with error %o', err);
        return APIResponses.badRequest(res, 'OOPS! Something went Wrong!!', {});
      }
    }
  },
};
