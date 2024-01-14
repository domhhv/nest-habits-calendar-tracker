import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Habit } from '../../habits/entities/habit.entity';
import { CalendarEvent } from '../../calendar-events/entities/calendar-event.entity';
import { Exclude } from 'class-transformer';
import * as bcrypt from 'bcrypt';

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

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  }
}
