import { Injectable } from '@nestjs/common';
import { LogDto } from './shared/dtos/log.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Log } from './shared/schemas/log.schema';
import { Model } from 'mongoose';

@Injectable()
export class AppService {
  constructor(@InjectModel(Log.name) private readonly logModel: Model<Log>) {}
  getHello(): string {
    return 'Hello World!';
  }
  async addLog(body: LogDto) {
    const newLog = new this.logModel(body);
    await newLog.save();
    return newLog;
  }
}
