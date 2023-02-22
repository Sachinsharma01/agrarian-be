import { Inject, Service } from 'typedi';
import axios from 'axios';
import config from '../config';
import ErrorHandler from '../utility/errors';
import { ERROR_CODES } from '../config/errors';

@Service()
export default class twilioService {
  constructor(@Inject('logger') private logger) {}

  public async generateOtp(input: string) {
    try {
      this.logger.info('Twilio generate OTP starts here %o', input);
      const axiosReqObj = {
        url: config.twilio.sendOtp,
        method: 'POST',
        headers: {
          Authorization: `Basic ${config.twilio.twilioAuthToken}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: {
          To: input,
          Channel: 'sms',
          TemplateSid: config.twilio.templateId,
        },
      };
      const response = await axios(axiosReqObj);
      const data = await response.data;
      this.logger.debug('Twilio Send OTP response %o', data);
      return data;
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
  public async verifyOtp(input:any) {
    try {
      this.logger.info('Twilio verify otp service starts here %o', input);
      const axiosReqObj = {
        url: config.twilio.verifyOtp,
        method: 'POST',
        headers: {
          Authorization: `Basic ${config.twilio.twilioAuthToken}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: {
          To: input.phone,
          Code: input.otp,
        },
      };
      const response = await axios(axiosReqObj);
      const data = await response.data;
      this.logger.debug('Twilio verify OTP response %o', data);
      return data;
    } catch(err) {
      if (err instanceof ErrorHandler.BadError) {
        this.logger.error('verify Otp twilio service fails with error %o', err);
        throw err;
      } else {
        this.logger.error('Generate Otp twilio service end with error %o', err);
        throw new ErrorHandler.BadError('OOPS! Something went wrong please try again later.');
      }
    }
  }
}
