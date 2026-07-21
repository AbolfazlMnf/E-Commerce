import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Request, Response } from 'express';
import { AppService } from 'src/app.service';
import { LogType } from '../schemas/log.schema';

@Catch()
export class MongoExceptionFilter implements ExceptionFilter {
  constructor(private readonly appService: AppService) {}

  async catch(exception: any, host: ArgumentsHost) {
    if (exception.code !== 11000) {
      throw exception;
    }

    const request = host.switchToHttp().getRequest<Request>();
    const response = host.switchToHttp().getResponse<Response>();

    const field = Object.keys(exception?.keyPattern)[0];

    try {
      await this.appService.addLog({
        type: LogType.Error,
        url: request.url,
        content: JSON.stringify(exception),
      });
    } catch (err) {
      console.log(`Mongo Error`, err);
    }
    response
      .status(409)
      .send({ statusCode: 409, message: `${field} already exists` });
  }
}
