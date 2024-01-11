import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { LogInDto } from './dto/log-in.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async logIn(@Res() response: Response, @Body() signInDto: LogInDto) {
    try {
      const result = await this.authService.signIn(
        signInDto.username,
        signInDto.password,
      );

      if (result.loggedIn) {
        return response.status(HttpStatus.OK).send(result);
      }

      if (result.signedUp) {
        return response.status(HttpStatus.CREATED).send(result);
      }
    } catch (e) {
      if (e.message === 'Wrong password') {
        return response.status(HttpStatus.BAD_REQUEST).send({
          message: 'Wrong password',
        });
      }

      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        message: 'Something went wrong',
      });
    }
  }
}
