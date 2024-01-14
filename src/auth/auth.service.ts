import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { AuthConfigType } from './auth.config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService<AuthConfigType>,
  ) {}

  async signUp(username: string, password: string): Promise<any> {
    try {
      const user = await this.usersService.create({
        username,
        password,
      });

      delete user.password;

      const payload = { sub: user.id, username: user.username };

      return {
        access_token: await this.jwtService.signAsync(payload, {
          secret: this.configService.get('JWT_SECRET'),
        }),
        signedUp: true,
        user,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async signIn(username: string, password: string): Promise<any> {
    try {
      const existingUser = await this.usersService.findOne(username);

      if (!existingUser) {
        return this.signUp(username, password);
      }

      const isPasswordMatching = await bcrypt.compare(
        password,
        existingUser.password,
      );

      if (!isPasswordMatching) {
        throw new UnauthorizedException('Wrong password');
      }

      const payload = { sub: existingUser.id, username: existingUser.username };

      return {
        access_token: await this.jwtService.signAsync(payload, {
          secret: this.configService.get('JWT_SECRET'),
        }),
        loggedIn: true,
        user: existingUser,
      };
    } catch (error) {
      console.log(error);
    }
  }
}
