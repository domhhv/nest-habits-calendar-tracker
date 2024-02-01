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
    const existingUser = await this.usersService.findOne(username);

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
    const existingUser = await this.usersService.findOne(username);

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

    const payload = { sub: existingUser.id };

    return {
      token: await this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_SECRET'),
      }),
      ...existingUser,
    };
  }
}
