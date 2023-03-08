import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import logger from '../../../loaders/logger';
import CropService from '../../../services/crop';
import APIResponses from '../../../utility/response';
import ErrorHandler from '../../../utility/errors';
import { ERROR_CODES } from '../../../config/errors';

export default {
  getAllCrops: async (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.info('get all crops API starts here %o', req.query);
      const cropServiceInstance = Container.get(CropService);
      const response = await cropServiceInstance.getAllCrops();
      logger.info('get all crops response in controller %o', response);
      return APIResponses.success(res, 'All crops fetched successfully!', response);
    } catch (err) {
      if (err instanceof ErrorHandler.BadError) {
        logger.error('List crops API fails with error %o', err);
        throw new ErrorHandler.BadError(err.message);
      } else {
        logger.error('List crops API end with error %o', err);
        throw new ErrorHandler.BadError(ErrorHandler.getErrorMessageWithCode(ERROR_CODES.AGLC_DEF));
      }
    }
  },
};
