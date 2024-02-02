import { registerAs } from '@nestjs/config';

export type AuthConfigType = {
  JWT_ACCESS_SECRET: string;
  JWT_REFRESH_SECRET: string;
  JWT_ACCESS_EXPIRATION_TIME: string;
  JWT_REFRESH_EXPIRATION_TIME: string;
};

export default registerAs<AuthConfigType>('auth', () => ({
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  JWT_ACCESS_EXPIRATION_TIME: process.env.JWT_ACCESS_EXPIRATION_TIME,
  JWT_REFRESH_EXPIRATION_TIME: process.env.JWT_REFRESH_EXPIRATION_TIME,
}));
