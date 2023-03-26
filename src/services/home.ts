import { Inject, Service } from 'typedi';
import config from '../config';
import axios from 'axios';
import ErrorHandler from '../utility/errors';

@Service()
export class HomeService {
  constructor(@Inject('logger') private logger) {}

  public async weather(input: any) {
    try {
      this.logger.info('Weather Service starts here %o', input);
      const reqObj = {
        method: 'GET',
        url: config.weather.api,
        params: { q: `${input.lat},${input.long}`, days: '3' },
        headers: {
          'X-RapidAPI-Key': config.weather.apiKey,
          'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com',
        },
      };
      this.logger.debug('req axios object %o', reqObj);
      const response = await axios(reqObj);
      const data = await response.data;
      this.logger.info('Response from all week weather api %o', data);
      return {
        ...data
      };
    } catch (err) {
      if (err instanceof ErrorHandler.BadError) {
        this.logger.error('List posts service fails with error %o', err);
        throw new ErrorHandler.BadError(err.message);
      } else {
        this.logger.error('List posts service end with error %o', err);
        throw new ErrorHandler.BadError('Weather service default error');
      }
    }
  }
}
