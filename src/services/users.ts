import { Inject, Service } from 'typedi';
import ErrorHandler from '../utility/errors';
import { sign, verify } from 'jsonwebtoken';
import { hash } from 'bcryptjs';
import config from '../config';

@Service()
export default class UsersService {
  constructor(@Inject('userModel') private userModel: Models.UserModel, @Inject('logger') private logger) {}

  public async getMetaData(query: any) {
    try {
      this.logger.info('Get Meta Data Service starts here %o', query);
      let response: {} = {};
      const token = query.token;
      // if (!token) {
      //   throw new ErrorHandler.BadError('Token does not exists!');
      // }
      this.logger.info('token response %o', token);
      const verifyToken: any = verify(token, config.jwtSecret);
      this.logger.info('verify token response in service %o', verifyToken);
      const user: any = await this.userModel.findOne({
        userName: verifyToken.name,
        email: verifyToken.email,
      });
      if (!user) {
        response = {
          message: 'User deos not exist!',
        };
      } else {
        response = {
          username: user.username,
          email: user.email,
          quizes: user?.quizes,
          totalQuizes: user?.totalQuizes,
        };
      }
      this.logger.info('User details %o', user);
      return response;
    } catch (err) {
      this.logger.error('Error in Get meta data service %o', err);
      throw new ErrorHandler.BadError('getMetaData service end with error!');
    }
  }

  public async createUser(input: any) {
    try {
      this.logger.info('Create User Service starts here %o', input);
      let response: any = {};
      const userNameExist = await this.userModel.findOne({
        username: input.username,
      });
      const userEmailExist = await this.userModel.findOne({
        email: input.email,
      });
      if (userNameExist) {
        response = {
          message: 'username already Exists!',
        };
      } else if (userEmailExist) {
        response = {
          message: 'email already Exists!',
        };
      } else {
        const hashedPassword: string = await hash(input.password, 15);
        const created: any = await this.userModel.create({
          email: input.email,
          password: hashedPassword,
          username: input.username,
        });
        response = {
          mesasge: 'user created successfully',
          data: {
            email: created.email,
            username: created.username,
          },
        };
      }
      return response;
    } catch (err) {
      this.logger.error('Create User service end with error %o', err);
      throw new ErrorHandler.BadError('Error in create user ');
    }
  }
}
