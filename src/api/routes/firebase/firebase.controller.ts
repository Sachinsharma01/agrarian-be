import { NextFunction, Request, Response } from 'express';
import logger from '../../../loaders/logger';
import APIResponses from '../../../utility/response';
import ErrorHandler from '../../../utility/errors';
import firebase from '../../../utility/firebase';

export default {
  getData: async (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.info('Firebase API start here');
      const nitrogenData: any = await firebase.getFirebaseRealTimeData('N');
      const phosphorusData: any = await firebase.getFirebaseRealTimeData('P');
      const potassiumData: any = await firebase.getFirebaseRealTimeData('K');
      const result: {} = {
        N: nitrogenData,
        P: phosphorusData,
        K: potassiumData,
      };
      return APIResponses.success(res, 'NPK data fetched successfully', result);
    } catch (err) {
      logger.error('Generate Otp API end with error %o', err);
      return APIResponses.badRequest(
        res,
        ErrorHandler.getErrorMessageWithCode('Error occured in getting firebase data!!'),
        {},
      );
    }
  },
};
