import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import appConfig from './config/app.config';
import { DatabaseModule } from './database/database.module';
import { HabitsModule } from './habits/habits.module';
import { CalendarEventsModule } from './calendar-events/calendar-events.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig],
      envFilePath:
        process.env.NODE_ENV === 'development' ? '.env' : '.env.production',
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
export class AppModule {}
