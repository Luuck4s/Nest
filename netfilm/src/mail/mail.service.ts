import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { RegisterDto } from '../auth/dto/register.dto';
import { logger } from '../common/utils/logger';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async register(data: RegisterDto) {
    await this.mailerService.sendMail({
      to: data.email,
      subject: 'Seja vem vindo a plataforma',
      text: `Eae ${data.email}`,
    });

    logger.info(`E-mail enviado com sucesso para ${data.email}`);
  }
}
