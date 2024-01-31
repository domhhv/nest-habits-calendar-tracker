import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LogInDto } from './dto/log-in.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async logIn(@Body() signInDto: LogInDto) {
    return this.authService.validateLogin(
      signInDto.username,
      signInDto.password,
    );
  }

  @Post('register')
  async register(@Body() signInDto: LogInDto) {
    return this.authService.register(signInDto.username, signInDto.password);
  }
}
