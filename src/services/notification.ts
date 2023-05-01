import { Inject, Service } from 'typedi';
import ErrorHandler from '../utility/errors';
import mongoose from 'mongoose';

@Service()
export default class NotificationService {
  constructor(
    @Inject('logger') private logger,
    @Inject('notificationModel') private notificationModel: Models.NotificationModel,
  ) {}

  public async create(payload: { content: string; userId: any, description: string }) {
    try {
      this.logger.info('Create notification service starts here %o', payload);
      const notificationId = 'N-' + Math.floor(100000 + Math.random() * 900000);
      this.logger.info('Notification Id is %o', notificationId);
      const notificationCreated = await this.notificationModel.create({
        ...payload,
        notificationId: notificationId,
      });
      this.logger.debug('notification added %o', notificationCreated);
      return notificationCreated;
    } catch (err) {
      if (err instanceof ErrorHandler.BadError) {
        this.logger.error('Notification service fails with error %o', err);
        throw new ErrorHandler.BadError(err.message);
      } else {
        this.logger.error('Notification service emd with error %o', err);
        throw new ErrorHandler.BadError('get all notification default error');
      }
    }
  }

  public async getAllNotifications(payload: { userId: any }) {
    try {
      this.logger.info('Get All notification service starts here %o', payload);
      const data: any = await this.notificationModel.find({ userId: payload.userId, read: false });
      const count = data.length;
      return {
        data: data,
        count: count,
      };
    } catch (err) {
      if (err instanceof ErrorHandler.BadError) {
        this.logger.error('get all Notification service fails with error %o', err);
        throw new ErrorHandler.BadError(err.message);
      } else {
        this.logger.error('get all Notification service emd with error %o', err);
        throw new ErrorHandler.BadError('get all notification default error');
      }
    }
  }

  public async read(payload: { userId: string; notificationId: string }) {
    try {
      this.logger.info('Read notification service starts here %o', payload);
      const notificationExists = await this.notificationModel.findOne({
        userId: mongoose.Types.ObjectId(payload.userId),
        notificationId: payload.notificationId,
      });
      if (!notificationExists) {
        throw new ErrorHandler.BadError('Notification does not exist');
      }
      const notificationCreated = await this.notificationModel.updateOne(
        {
          userId: mongoose.Types.ObjectId(payload.userId),
          notificationId: payload.notificationId,
        },
        {
          read: true,
        },
      );
      this.logger.debug('notification updated %o', notificationCreated);
      return {
        ...payload,
      };
    } catch (err) {
      if (err instanceof ErrorHandler.BadError) {
        this.logger.error('Notification service fails with error %o', err);
        throw new ErrorHandler.BadError(err.message);
      } else {
        this.logger.error('Notification service emd with error %o', err);
        throw new ErrorHandler.BadError('create notification default error');
      }
    }
  }
}
