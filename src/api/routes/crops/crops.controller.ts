import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import logger from '../../../loaders/logger';
import CropService from '../../../services/crop';
import APIResponses from '../../../utility/response';
import ErrorHandler from '../../../utility/errors';
import { ERROR_CODES } from '../../../config/errors';
import { IAddCropDTO } from '../../../interfaces/IUserCrops';

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
        return APIResponses.badRequest(res, err.message, {});
      } else {
        logger.error('List crops API end with error %o', err);
        return APIResponses.badRequest(res, ErrorHandler.getErrorMessageWithCode(ERROR_CODES.AGLC_DEF), {});
      }
    }
  },

  getUserCrops: async (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.info('Get all users crops starts here %o', req.query);
      const cropServiceInstance = Container.get(CropService);
      const response: any = await cropServiceInstance.getAllUserCrops(req.query as { userId: string });
      logger.info('get all users crops response in controller %o', response);
      return APIResponses.success(res, 'All users crops fetched successfully!', response);
    } catch (err) {
      if (err instanceof ErrorHandler.BadError) {
        logger.error('List users crops API fails with error %o', err);
        return APIResponses.badRequest(res, err.message, {});
      } else {
        logger.error('List users crops API end with error %o', err);
        return APIResponses.badRequest(res, 'Get all users crops default error', {});
      }
    }
  },

  cropDetails: async (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.info('crop details API start here %o', req.params);
      const cropServiceInstance = Container.get(CropService);
      const response: any = await cropServiceInstance.cropDetails({ cropId: req.params.id });
      logger.info('Crop details response in Controller %o', response);
      return APIResponses.success(res, 'Crop details fetched successfully', response);
    } catch (err) {
      if (err instanceof ErrorHandler.BadError) {
        logger.error('crop details API fails with error %o', err);
        return APIResponses.badRequest(res, err.message, {});
      } else {
        logger.error('crop details API end with error %o', err);
        return APIResponses.badRequest(res, 'Get all users crops default error', {});
      }
    }
  },

  addCrop: async (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.info('add user crops API starts here %o', req.body);
      const cropServiceInstance = Container.get(CropService);
      const payload = {
        userId: req.body.userId,
        crop: {
          ...req.body.crop,
        },
        sowingDate: req.body.sowingDate,
        area: req.body.area,
      };
      const response = await cropServiceInstance.addCrop(payload as IAddCropDTO);
      logger.info('Add Crop Service response in Controller %o', response);
      return APIResponses.success(res, 'Crop details added successfully', response);
    } catch (err) {
      if (err instanceof ErrorHandler.BadError) {
        logger.error('add crop API fails with error %o', err);
        return APIResponses.badRequest(res, err.message, {});
      } else {
        logger.error('add crop API end with error %o', err);
        return APIResponses.badRequest(res, 'add user crop default error', {});
      }
    }
  },

  removeCrop: async (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.info('Remove Crop API starts here %o', req.body);
      let query = {
        userId: req.body.userId,
        cropId: req.body.cropId,
      };
      const cropServiceInstance = Container.get(CropService);
      const response = await cropServiceInstance.removeCrop(query);
      logger.info('Remove crop service response in Controller %o', response);
      return APIResponses.success(res, 'crop removed successfully', response);
    } catch (err) {
      if (err instanceof ErrorHandler.BadError) {
        logger.error('remove crop API fails with error %o', err);
        throw new ErrorHandler.BadError(err.message);
      } else {
        logger.error('remove crop API end with error %o', err);
        return APIResponses.badRequest(res, 'remove uses crop default error', {});
      }
    }
  },
};
