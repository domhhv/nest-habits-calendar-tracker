import { DataSource } from 'typeorm';
import { User } from './src/users/entities/user.entity';
import { Habit } from './src/habits/entities/habit.entity';
import { CalendarEvent } from './src/calendar-events/entities/calendar-event.entity';

export default new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [User, Habit, CalendarEvent],
  migrations: ['src/migrations/*.js'],
  synchronize: process.env.NODE_ENV === 'development',
});
