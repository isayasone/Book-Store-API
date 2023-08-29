import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../services/auth.service';
import configuration from 'src/configuration';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configuration.jwt.secret,
      ignoreExpiration: false,
    });
  }
  async validate(payload: { userId: string; name: string }) {
    const user = await this.authService.findOneByUserId(payload.userId);
    if (!user) {
      return new UnauthorizedException();
    }
    return user;
  }
}
