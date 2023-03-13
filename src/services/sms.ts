import { Inject, Service } from 'typedi';
import AWS from 'aws-sdk';
import ErrorHandler from '../utility/errors';

import config from '../config';

@Service()
export class SMS {
  constructor(@Inject('logger') private logger) {}
  public async sendSMS(data: any) {
    try {
      this.logger.info('Send SMS service starts here %o', data);
      AWS.config.update({
        accessKeyId: config.aws.accessKey,
        secretAccessKey: config.aws.secretKey,
        region: config.aws.region,
      });
    //   const SNS = ;
      const publishData: any = {
        Message: `Your Agrarian verification code is ${data.otp}.\nThis code will expire in 10 minnutes.Please do not share it with anyone.`,
        Subject: 'testing',
        PhoneNumber: data.phone,
      };
      const response: any = await new AWS.SNS({ apiVersion: '2010-03-31' }).publish(publishData).promise();
      if (response?.MessageId) {
        return {
          error: false,
          message: `OTP sent to ${data.phone}`,
        };
      }
      this.logger.debug("###################%o",response)
      return {
        error: true,
        message: 'Someting went wrong try again later',
      };
    } catch (err) {
        this.logger.error("send sms service end with error %o",err);
      throw new ErrorHandler.BadError('Erorr in Send SMS service');
    }
  }
}
