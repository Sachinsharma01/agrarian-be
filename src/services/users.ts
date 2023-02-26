import { Inject, Service } from 'typedi';
import ErrorHandler from '../utility/errors';
import { verify } from 'jsonwebtoken';
import config from '../config';
import { IEditdetails } from '../interfaces/IEditdetails';
import { ERROR_CODES } from '../config/errors';
import mongoose from 'mongoose';

@Service()
export default class UsersService {
  constructor(@Inject('userModel') private userModel: Models.UserModel, @Inject('logger') private logger) {}

  public async getMetaData(query: { token: string }) {
    try {
      this.logger.info('Get Meta Data Service starts here %o', query);
      const token = query.token;
      this.logger.info('token response %o', token);
      const verifyToken: any = await verify(token, config.jwtSecret);
      this.logger.info('verify token response in service %o', verifyToken);
      const user: any = await this.userModel.findOne({
        _id: verifyToken._id,
      });
      this.logger.info('User details %o', user);
      if (!user) {
        throw new ErrorHandler.BadError('User Does not exists !');
      }
      return user;
    } catch (err) {
      this.logger.error('Error in Get meta data service %o', err);
      throw new ErrorHandler.BadError('getMetaData service end with error!');
    }
  }
  public async editDetails(input: IEditdetails) {
    try {
      this.logger.info('edit details service starts here %o', input);
      const _id = input.currentUser._id;
      delete input.currentUser;
      const updateUser = await this.userModel.updateOne(
        { _id: mongoose.Types.ObjectId(_id) },
        {
          $set: {
            ...input,
          },
        },
      );
      this.logger.debug('User details updated in DB %o', updateUser);
      const updatedUser = await this.userModel.findOne({_id: mongoose.Types.ObjectId(_id)});
      this.logger.debug('User DB response after updation %o', updatedUser);

      return updatedUser;
    } catch (err) {
      this.logger.error('edit details service end with error %o', err);
      if (err instanceof ErrorHandler.BadError) {
        throw new ErrorHandler.BadError(ErrorHandler.getErrorMessageWithCode(ERROR_CODES.AGED_DEF));
      } else {
        throw err;
      }
    }
  }
}
