import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { MailProducerService } from '../mail/mail.producer.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly emailProducerService: MailProducerService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.prisma.client().user.findFirst({
      where: {
        email: loginDto.email,
      },
      include: {
        role: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException(
        'combination of password and queue-email are not valid',
      );
    }

    if (user.password == loginDto.password) {
      const data: any = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role.name,
      };
      return { access_token: this.jwtService.sign(data) };
    }

    throw new UnauthorizedException(
      'combination of password and queue-email are not valid',
    );
  }

  async register(registerDto: RegisterDto) {
    const user = await this.prisma.client().user.findFirst({
      where: {
        email: registerDto.email,
      },
    });

    if (user) {
      throw new ForbiddenException(
        'already exists a user with this queue-email',
      );
    }

    const role = await this.prisma.client().role.findFirst({
      where: {
        name: registerDto.role,
      },
    });

    if (!role) {
      throw new NotFoundException('role not valid');
    }

    await this.prisma.client().user.create({
      data: {
        email: registerDto.email,
        name: registerDto.name,
        password: registerDto.password,
        roleId: role.id,
      },
    });

    await this.emailProducerService.sendEmail(registerDto);

    return this.login(registerDto);
  }
}
