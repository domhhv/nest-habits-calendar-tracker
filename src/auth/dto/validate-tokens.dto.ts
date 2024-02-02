import { IsNotEmpty, IsString } from 'class-validator';

export class ValidateTokensDto {
  @IsString()
  @IsNotEmpty()
  accessToken: string;

  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
