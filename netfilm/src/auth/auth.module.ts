import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { jwtConstants } from './shared/constants';
import { JwtAdminStrategy } from './shared/jwt/admin/jwt-admin.strategy';
import { JwtStrategy } from './shared/jwt/user/jwt.strategy';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expires },
    }),
    MailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAdminStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
