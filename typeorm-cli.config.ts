import { DataSource } from 'typeorm';
import { User } from './src/users/entities/user.entity';
import { Habit } from './src/habits/entities/habit.entity';
import { CalendarEvent } from './src/calendar-events/entities/calendar-event.entity';
import dotenv from 'dotenv';
import { AddNote1707045565447 } from './src/migrations/1707045565447-AddNote';

const envPaths = {
  development: './.env.development',
  production: './.env.production',
};

dotenv.config({ path: envPaths[process.env.NODE_ENV] });

export default new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [User, Habit, CalendarEvent],
  migrations: [AddNote1707045565447],
  synchronize: process.env.NODE_ENV === 'development',
});
