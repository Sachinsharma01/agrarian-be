import { NextFunction, Request, Response } from 'express';
import logger from '../../../loaders/logger';
import { Container } from 'typedi';
import { HomeService } from '../../../services/home';
import APIResponses from '../../../utility/response';
import ErrorHandler from '../../../utility/errors';

export default {
  weather: async (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.info('Weather API starts here %o', req.query);
      const weatherServiceInstance = Container.get(HomeService);
      const response: any = await weatherServiceInstance.weather(req.query);
      logger.debug('Response of weather api in controller %o', response);
      return APIResponses.success(res, 'Weather Data fetched successfully!', response);
    } catch (err) {
      if (err instanceof ErrorHandler.BadError) {
        logger.error('weather API fails with error %o', err);
        return APIResponses.badRequest(res, err.message, {});
      } else {
        logger.error('weather API end with error %o', err);
        return APIResponses.badRequest(res, 'Error in get weather.', {});
      }
    }
  },
};
