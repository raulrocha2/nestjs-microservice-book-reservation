import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';
import { TokenPayload } from './interfaces/token-payload.interface';
import { UserDto } from '@app/common';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async login(user: UserDto, res: Response) {
    const tokenPayload: TokenPayload = {
      userId: user.id,
      email: user.email,
    };
    const expires = new Date();
    expires.setSeconds(
      expires.getSeconds() + this.configService.get('JWT_EXPIRATION'),
    );
    const token = await this.jwtService.signAsync(tokenPayload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: `${this.configService.get('JWT_EXPIRATION')}s`,
    });
    res.cookie('Authentication', token, {
      httpOnly: true,
      expires,
    });
    return token;
  }
}
