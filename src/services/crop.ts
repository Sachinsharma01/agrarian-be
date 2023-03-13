import { Inject, Service } from 'typedi';
import ErrorHandler from '../utility/errors';
import { ERROR_CODES } from '../config/errors';

@Service()
export default class CropService {
  constructor(@Inject('logger') private logger, @Inject('cropsModel') private cropsModel: Models.CropModel) {}

  public async getAllCrops() {
    try {
      this.logger.info('get all crops service starts here');
      const response = await this.cropsModel.find({});
      this.logger.debug('all crops response from DB %o', response);
      return response;
    } catch (err) {
        if (err instanceof ErrorHandler.BadError) {
          this.logger.error('List crops service fails with error %o', err);
          throw new ErrorHandler.BadError(err.message);
        } else {
          this.logger.error('List crops service end with error %o', err);
          throw new ErrorHandler.BadError('Get all crops default error');
        }
    }
  }
}
