import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { HabitsModule } from './habits/habits.module';
import { CalendarEventsModule } from './calendar-events/calendar-events.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import AuthConfig from './common/config/auth.config';
import { AppLoggerMiddleware } from './common/middlewares/app-logging.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'development' ? '.env' : '.env.production',
      load: [AuthConfig],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        url: process.env.DATABASE_URL,
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    DatabaseModule,
    HabitsModule,
    CalendarEventsModule,
    AuthModule,
    UsersModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }
}
