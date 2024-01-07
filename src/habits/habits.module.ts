import { Module } from '@nestjs/common';
import { HabitsService } from './habits.service';
import { HabitsController } from './habits.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Habit } from './entities/habit.entity';
import { CalendarEvent } from '../calendar-events/entities/calendar-event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Habit, CalendarEvent])],
  controllers: [HabitsController],
  providers: [HabitsService],
  exports: [HabitsService],
})
export class HabitsModule {}
