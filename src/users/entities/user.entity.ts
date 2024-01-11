import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Habit } from '../../habits/entities/habit.entity';
import { CalendarEvent } from '../../calendar-events/entities/calendar-event.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column()
  username: string;

  @Exclude()
  @Column()
  password: string;

  @OneToMany(() => Habit, (habit) => habit.user, {
    onDelete: 'CASCADE',
  })
  habits: Habit[];

  @OneToMany(() => CalendarEvent, (calendarEvent) => calendarEvent, {
    onDelete: 'CASCADE',
  })
  calendarEvents: CalendarEvent[];
}
