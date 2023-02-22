import { Request, Response, NextFunction } from 'express';
import logger from '../../../loaders/logger';
import { Container } from 'typedi';
import AuthService from '../../../services/auth';
import ErrorHandler from '../../../utility/errors';
import { ERROR_CODES } from '../../../config/errors';
import APIResponses from '../../../utility/response';
export default {
  getOtp: async (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.info('get otp API starts here with body %o', req.body);
      const authServiceInstance = Container.get(AuthService);
      const response = await authServiceInstance.generateOtp(req.body);
      logger.debug('get otp response in controller %o', response);
      return APIResponses.success(res, 'otp sent successfully!', response);
    } catch (err) {
      if (err instanceof ErrorHandler.BadError) {
        logger.error('Generate Otp API fails with error %o', err);
        return APIResponses.badRequest(res, err.message, {});
      } else {
        logger.error('Generate Otp API end with error %o', err);
        return APIResponses.badRequest(res, ErrorHandler.getErrorMessageWithCode(ERROR_CODES.AGGOTP_DEF), {});
      }
    }
  },
  verifyOtp: async (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.info("verify otp API starts here %o", req.body);
      const authServiceInstance = Container.get(AuthService);
      const response:any = await authServiceInstance.verifyOtp(req.body as {phone: string, otp: string})
      logger.debug('verify otp response in controller %o', response);
      return APIResponses.success(res, 'otp verified successfully!', response);
    } catch(err) {
      if (err instanceof ErrorHandler.BadError) {
        logger.error('Verify Otp API fails with error %o', err);
        return APIResponses.badRequest(res, err.message, {});
      } else {
        logger.error('Verify Otp API end with error %o', err);
        return APIResponses.badRequest(res, ErrorHandler.getErrorMessageWithCode(ERROR_CODES.AGVOTP_DEF), {});
      }
    }
  }
};
