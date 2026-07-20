import { Process, Processor } from '@nestjs/bull';
import { OrderService } from '../services/order.service';
import type { Job } from 'bull';
@Processor(`callback-queue`)
export class CallbackProcessor {
  constructor(private readonly orderService: OrderService) {}
  @Process({ name: `callback-queue`, concurrency: 5 })
  async handleJob(job: Job) {
    await this.orderService.callback(job.data.refId);
  }
}
