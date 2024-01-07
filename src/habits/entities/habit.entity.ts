import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CalendarEvent } from '../../calendar-events/entities/calendar-event.entity';

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
}
