import { Inject, Service } from 'typedi';
import ErrorHandler from '../utility/errors';
import { verify } from 'jsonwebtoken';
import config from '../config';

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
}
