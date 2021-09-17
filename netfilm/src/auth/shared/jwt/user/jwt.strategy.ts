import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from '../../constants';

export class JwtStrategy extends PassportStrategy(Strategy, 'user-strategy') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Indica o uso do Bearer antes do Token
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  // Podemos aplicar RN aqui
  async validate(payload: any) {
    return { id: payload.sub, email: payload.email };
  }
}
