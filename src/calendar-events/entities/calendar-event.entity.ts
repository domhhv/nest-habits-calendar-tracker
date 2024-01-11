import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Habit } from '../../habits/entities/habit.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class CalendarEvent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamptz' })
  date: Date;

  @ManyToOne(() => Habit, (habit) => habit.calendarEvents)
  @JoinColumn({ name: 'habit_id', referencedColumnName: 'id' })
  habit: Habit;

  @ManyToOne(() => User, (user) => user.calendarEvents)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;
}
