import { Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly client: Redis;

  constructor() {
    this.client = new Redis({
      host: 'localhost',
      port: 6379,
    });
  }

  async get(key: string) {
    return await this.client.get(key);
  }

  async set(key: string, value: string, ttl?: number) {
    if (ttl) {
      return await this.client.set(key, value, 'EX', ttl);
    }

    return await this.client.set(key, value);
  }

  async del(key: string) {
    return await this.client.del(key);
  }

  async onModuleDestroy() {
    await this.client.quit();
  }
}
