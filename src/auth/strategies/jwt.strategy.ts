import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import configuration from 'src/configuration';
import { AuthService } from '../services/auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly authService: AuthService) {

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configuration.jwt.secret,
      ignoreExpiration: false,
    });
  }
  async validate(payload: { id: string; email: string }) {

    const user = await this.authService.findOneByUserId(payload.id);
    if (!user) {
      return new UnauthorizedException();
    }
    return user;
  }
}
