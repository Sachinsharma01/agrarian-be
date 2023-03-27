import { Inject, Service } from 'typedi';
import ErrorHandler from '../utility/errors';
import S3 from '../utility/s3';
import mongoose from 'mongoose';
import { ERROR_CODES } from '../config/errors';
import { update } from 'lodash';

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
      // await this.userCropsModel.create({ userId: mongoose.Types.ObjectId(input.userId) });
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

  public async addCrop(input: { userId: string; crop: any }) {
    try {
      this.logger.info('Add Crop Service starts here %o', input);
      let query = {
        userId: mongoose.Types.ObjectId(input.userId),
        crop: [
          {
            name: input.crop.name,
            image: input.crop.image,
            _id: mongoose.Types.ObjectId(input.crop._id),
          },
        ],
      };
      this.logger.info('user crop added query %o', query);
      const cropsExists = await this.userCropsModel.findOne({ userId: mongoose.Types.ObjectId(input.userId) });
      if (!cropsExists) {
        const userCropAdded = await this.userCropsModel.create(query);
        this.logger.info('user crops added in DB %o', userCropAdded);
        return userCropAdded;
      }
      let crop = [
        {
          name: input.crop.name,
          image: input.crop.image,
          _id: mongoose.Types.ObjectId(input.crop._id),
        },
      ];
      const cropAdded = await this.userCropsModel.updateOne(
        { userId: mongoose.Types.ObjectId(input.userId) },
        { $push: { crop } },
      );
      const finalCrops = await this.userCropsModel.findOne({ userId: mongoose.Types.ObjectId(input.userId) });
      this.logger.info('Final Updated Crops %o', finalCrops);
      return finalCrops;
    } catch (err) {
      if (err instanceof ErrorHandler.BadError) {
        this.logger.error('Add crop service fails with error %o', err);
        throw new ErrorHandler.BadError(err.message);
      } else {
        this.logger.error('Add crop service end with error %o', err);
        throw new ErrorHandler.BadError('add crop default error');
      }
    }
  }

  public async removeCrop(input: { cropId: string; userId: string }) {
    try {
      this.logger.info('Remove Crop service starts here %o', input);
      let crop = {
        _id: mongoose.Types.ObjectId(input.cropId),
      };
      this.logger.info('Query to remove crop %o', crop);
      const crops: any = await this.userCropsModel.findOne({ userId: mongoose.Types.ObjectId(input.userId) });
      let updated = crops?.crop?.filter(cr => {
        return cr._id != input.cropId;
      });
      this.logger.debug('Filtered Crops %o', updated);
      await this.userCropsModel.updateOne(
        { userId: mongoose.Types.ObjectId(input.userId) },
        { $set: { crop: updated } },
      );
      const finalCrops = await this.userCropsModel.findOne({ userId: mongoose.Types.ObjectId(input.userId) });
      this.logger.info('Final crops after removed %o', finalCrops);
      return finalCrops;
    } catch (err) {
      if (err instanceof ErrorHandler.BadError) {
        this.logger.error('remove crop service fails with error %o', err);
        throw new ErrorHandler.BadError(err.message);
      } else {
        this.logger.error('remove crop service end with error %o', err);
        throw new ErrorHandler.BadError('remove crp[] default error');
      }
    }
  }
}
