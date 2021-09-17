import { IsEmail, IsEnum, IsString } from 'class-validator';
import { RoleTypeEnum } from '../../common/enum/role-type.enum';

export class RegisterDto {
  @IsString()
  readonly name: string;

  @IsEmail()
  readonly email: string;

  @IsString()
  readonly password: string;

  @IsEnum(RoleTypeEnum)
  readonly role: string;
}
