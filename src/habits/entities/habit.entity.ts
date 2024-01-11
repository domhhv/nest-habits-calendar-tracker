import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CalendarEvent } from '../../calendar-events/entities/calendar-event.entity';
import { User } from '../../users/entities/user.entity';

export enum HabitTraits {
  GOOD = 'good',
  BAD = 'bad',
}

@Entity()
export class Habit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  trait: HabitTraits;

  @OneToMany(() => CalendarEvent, (calendarEvent) => calendarEvent.habit, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ referencedColumnName: 'id' })
  calendarEvents: CalendarEvent[];

  @ManyToOne(() => User, (user) => user.habits)
  @JoinColumn({ referencedColumnName: 'id', name: 'user_id' })
  user: User;
}
