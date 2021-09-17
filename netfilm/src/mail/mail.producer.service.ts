import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class MailProducerService {
  constructor(@InjectQueue('queue-email-queue') private queue: Queue) {}

  async sendEmail(data: any) {
    await this.queue.add(
      'queue-email-job',
      {
        type: 'register',
        ...data,
      },
      { delay: 3000, removeOnComplete: true, attempts: 3 },
    );
  }
}
