import { NextFunction, Request, Response } from 'express';
import APIResponses from '../../../utility/response';
import { Container } from 'typedi';
import UsersService from '../../../services/users';

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
  createUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.info('Customer API createUser starts here', req.body);
      const customerServiceInstance = Container.get(UsersService);
      const response = await customerServiceInstance.createUser(req.body);
      console.log('user created', response);
      return APIResponses.success(res, 'User registered Successfully', response);
    } catch (err) {
      console.log(err);
      return APIResponses.badRequest(res, 'OOPS! Cannot process your request ', {});
    }
  },
};
