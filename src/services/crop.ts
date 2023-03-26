import { Inject, Service } from 'typedi';
import ErrorHandler from '../utility/errors';
import S3 from '../utility/s3';
import mongoose from 'mongoose';
import { ERROR_CODES } from '../config/errors';

@Service()
export default class CropService {
  constructor(
    @Inject('logger') private logger,
    @Inject('cropsModel') private cropsModel: Models.CropModel,
    @Inject('userCropsModel') private userCropsModel: Models.UserCropsModel,
    @Inject('cropDetailsModel') private cropDetailsModel: Models.CropDetailsModel,
  ) {}

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

  public async getAllUserCrops(input: { userId: string }) {
    try {
      this.logger.info('get all users crops starts here %o', input);
      const cropsResponse = await this.userCropsModel.find({ userId: mongoose.Types.ObjectId(input.userId) });
      await this.userCropsModel.create({ userId: mongoose.Types.ObjectId(input.userId) });
      this.logger.info('all user crops response from DB %o', cropsResponse);
      return cropsResponse;
    } catch (err) {
      if (err instanceof ErrorHandler.BadError) {
        this.logger.error('List all users crops service fails with error %o', err);
        throw new ErrorHandler.BadError(err.message);
      } else {
        this.logger.error('List all users crops service end with error %o', err);
        throw new ErrorHandler.BadError('Get all users crops default error');
      }
    }
  }

  public async cropDetails(input: { cropId: string }) {
    try {
      this.logger.info('Crop details Service starts here %o', input);
      const response: any = await this.cropDetailsModel.findOne({ cropId: mongoose.Types.ObjectId(input.cropId) });
      this.logger.info('Crops Data Response from DB %o', response);
      const file = await S3.signedUrl(response.key);
      this.logger.info('File response from crop details DB %o', file);
      return file;
    } catch (err) {
      if (err instanceof ErrorHandler.BadError) {
        this.logger.error('crop details service fails with error %o', err);
        throw new ErrorHandler.BadError(err.message);
      } else {
        this.logger.error('crop details service end with error %o', err);
        throw new ErrorHandler.BadError('crop details default error');
      }
    }
  }
}
