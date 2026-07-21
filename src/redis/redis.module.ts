import { Module } from '@nestjs/common';
import { RedisService } from './services/redis.service';

@Module({
  exports: [RedisService],
  providers: [RedisService],
})
export class RedisModule {}
