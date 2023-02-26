import { NextFunction, Request, Response } from 'express';
import logger from '../../../loaders/logger';
import APIResponses from '../../../utility/response';
import { Container } from 'typedi';
import UsersService from '../../../services/users';
import { IEditdetails } from '../../../interfaces/IEditdetails';
import ErrorHandler from '../../../utility/errors'
import { ERROR_CODES } from '../../../config/errors';

export default {
  getMetaData: async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.info('Customer API getMetaData starts here with body', req.body);
      const token: any = req.body.token;
      const customerServiceInstance = Container.get(UsersService);
      const response = await customerServiceInstance.getMetaData({ token });
      return APIResponses.success(res, 'Get Meta Data Successfully fetched', response);
    } catch (err) {
      console.log(err);
      return APIResponses.badRequest(res, 'OOPS! Cannot process your request ', {});
    }
  },
  editDetails: async (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.info('Edit details API starts here %o', req.body);
      const body = {
        currentUser: req.currentUser,
        ...req.body,
      }
      const customerServiceInstance = Container.get(UsersService);
      const response:any = await customerServiceInstance.editDetails(body as IEditdetails)
      logger.info('edit details response in controller %o', response);
      return APIResponses.success(res, 'Details edit successfully!', response);
    } catch(err) {
      if (err instanceof ErrorHandler.BadError) {
        logger.error('Generate Otp API fails with error %o', err);
        return APIResponses.badRequest(res, err.message, {});
      } else {
        logger.error('Generate Otp API end with error %o', err);
        return APIResponses.badRequest(res, ErrorHandler.getErrorMessageWithCode(ERROR_CODES.AGED), {});
      }
    }
  }
};
