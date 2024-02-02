import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { AuthConfigType } from '../common/config/auth.config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService<AuthConfigType>,
  ) {}

  async register(username: string, password: string): Promise<any> {
    const existingUser = await this.usersService.findOneByUsername(username);

    if (existingUser) {
      throw new UnauthorizedException('Username already exists');
    }

    const user = await this.usersService.create({
      username,
      password,
    });

    delete user.password;

    return user;
  }

  async validateLogin(username: string, password: string): Promise<any> {
    const existingUser = await this.usersService.findOneByUsername(username);

    if (!existingUser) {
      throw new UnauthorizedException('Wrong username');
    }

    const isPasswordMatching = await bcrypt.compare(
      password,
      existingUser.password,
    );

    if (!isPasswordMatching) {
      throw new UnauthorizedException('Wrong password');
    }

    delete existingUser.password;

    const payload = { sub: existingUser.id };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_ACCESS_SECRET'),
      expiresIn: this.configService.get('JWT_ACCESS_EXPIRATION_TIME'),
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION_TIME'),
    });

    return {
      accessToken,
      refreshToken,
      ...existingUser,
    };
  }

  async validateTokens(
    accessToken: string,
    refreshToken: string,
  ): Promise<any> {
    try {
      const verifyAccessToken = this.jwtService.verifyAsync(accessToken, {
        secret: this.configService.get('JWT_ACCESS_SECRET'),
      });
      const verifyRefreshToken = this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      await Promise.all([await verifyAccessToken, await verifyRefreshToken]);

      return {
        accessToken,
        refreshToken,
        accessTokenExpired: false,
      };
    } catch (error) {
      if (error.message === 'jwt expired') {
        return {
          accessTokenExpired: true,
        };
      }

      throw new UnauthorizedException(error.message);
    }
  }

  async regenerateAccessToken(refreshToken: string): Promise<any> {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      const user = await this.usersService.findOne(payload.sub);
      delete user.password;

      const accessToken = await this.jwtService.signAsync(
        { sub: user.id },
        {
          secret: this.configService.get('JWT_ACCESS_SECRET'),
          expiresIn: this.configService.get('JWT_ACCESS_EXPIRATION_TIME'),
        },
      );

      return {
        accessToken,
        refreshToken,
        refreshTokenExpired: false,
        ...user,
      };
    } catch (error) {
      if (error.message === 'jwt expired') {
        return {
          refreshTokenExpired: true,
        };
      }

      throw new Error(error);
    }
  }
}
