import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from '../../constants';
import { RoleTypeEnum } from '../../../../common/enum/role-type.enum';

export class JwtAdminStrategy extends PassportStrategy(
  Strategy,
  'admin-strategy',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Indica o uso do Bearer antes do Token
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any) {
    if (payload.role === RoleTypeEnum.Admin) {
      return { id: payload.sub, email: payload.email };
    }

    return false;
  }
}
