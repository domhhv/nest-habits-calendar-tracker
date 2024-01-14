import { registerAs } from '@nestjs/config';

export type AuthConfigType = {
  JWT_SECRET: string;
};

export default registerAs<AuthConfigType>('auth', () => ({
  JWT_SECRET: process.env.JWT_SECRET,
}));
