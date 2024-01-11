import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(username: string, password: string): Promise<any> {
    const salt = await bcrypt.genSalt();

    const passwordHash = await bcrypt.hash(password, salt);

    const user = await this.usersService.create({
      username,
      password: passwordHash,
    });

    const { password: _, ...userWithoutPassword } = user;

    const payload = { sub: user.id, username: user.username };

    return {
      access_token: await this.jwtService.signAsync(payload),
      signedUp: true,
      user: userWithoutPassword,
    };
  }

  async signIn(username: string, password: string): Promise<any> {
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
      access_token: await this.jwtService.signAsync(payload),
      loggedIn: true,
      user: existingUser,
    };
  }
}
