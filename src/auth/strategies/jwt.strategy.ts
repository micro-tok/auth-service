import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from '../constants';
import { AuthService } from '../auth.service';
import { JwtRequest } from '../dtos/jwt.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly authService: AuthService) {
    super({
      secretOrKey: jwtConstants.secret,
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: JwtRequest) => {
          console.log('request ->', request, '<- request');
          console.log('=====================================');
          console.log('request?.token ->', request?.token, '<- request?.token');
          return request?.token;
        },
      ]),
    });
  }

  async validate(payload: { id: string }) {
    console.log('AAAAAA ->', payload, '<- AAAAAA');
    const user = await this.authService.findByUuid(payload.id);

    if (!user) {
      console.warn(payload);
      throw new UnauthorizedException();
    }

    return user;
  }
}
