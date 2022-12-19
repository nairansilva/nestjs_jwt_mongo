import { UnauthorizedException } from '@nestjs/common';
/* eslint-disable prettier/prettier */
import { JwtPayload } from './../models/jwt-payload.model';
import { AuthService } from './../auth.service';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { User } from 'src/users/models/users.model';

@Injectable()
export class JwtEstrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: authService.returnJwtExtractor(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(jwtPayload: JwtPayload): Promise<User> {
    const user = await this.authService.validateUser(jwtPayload);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
