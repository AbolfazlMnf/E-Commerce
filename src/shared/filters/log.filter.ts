import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AppService } from 'src/app.service';
import { LogType } from '../schemas/log.schema';

@Catch(HttpException)
export class LogFilter<T extends HttpException> implements ExceptionFilter {
  constructor(private readonly appService: AppService) {}
  async catch(exception: T, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const request = host.switchToHttp().getRequest<Request>();
    const status = exception.getStatus();
    if (status === 404) {
      response
        .status(status)
        .send({ statusCode: 404, message: `Not Found !!` });
    } else {
      response.send(exception.getResponse());
    }
    await this.appService.addLog({
      type: LogType.Error,
      url: request.url,
      content: JSON.stringify(exception.getResponse()),
    });
  }
}
