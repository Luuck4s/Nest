import {
  OnQueueActive,
  OnQueueCompleted,
  OnQueueError,
  Process,
  Processor,
} from '@nestjs/bull';
import { Job } from 'bull';
import { MailService } from './mail.service';
import { logger } from '../common/utils/logger';

@Processor('queue-email-queue')
export class MailConsumer {
  constructor(private readonly mail: MailService) {}

  @Process('queue-email-job')
  async emailJob(job: Job<any>) {
    try {
      await this.mail.register(job.data);
    } catch (error) {
      logger.error('Erro ao enviar email');
    }
  }

  @OnQueueActive()
  onActive(job: Job) {
    logger.info(
      `Processing job ${job.id} of type ${job.name} - ${job.data.type}`,
    );
  }

  @OnQueueCompleted()
  onCompleted(job: Job) {
    logger.info(
      `Completed job ${job.id} of type ${job.name} - ${job.data.type}`,
    );
  }
}
