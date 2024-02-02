import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LogInDto } from './dto/log-in.dto';
import { RefreshTokensDto } from './dto/refresh-tokens.dto';
import { ValidateTokensDto } from './dto/validate-tokens.dto';

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

  @Post('tokens/validate')
  async validateTokens(@Body() body: ValidateTokensDto) {
    return this.authService.validateTokens(body.accessToken, body.refreshToken);
  }

  @Post('tokens/access/regenerate')
  async regenerateAccessToken(@Body() body: RefreshTokensDto) {
    return this.authService.regenerateAccessToken(body.refreshToken);
  }
}
