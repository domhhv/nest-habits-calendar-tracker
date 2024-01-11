import { Injectable } from '@nestjs/common';
import { CreateCalendarEventDto } from './dto/create-calendar-event.dto';
import { CalendarEvent } from './entities/calendar-event.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HabitsService } from '../habits/habits.service';

@Injectable()
export class CalendarEventsService {
  constructor(
    @InjectRepository(CalendarEvent)
    private calendarEventRepository: Repository<CalendarEvent>,
    private habitsService: HabitsService,
  ) {}

  async create(createCalendarEventDto: CreateCalendarEventDto, userId: number) {
    try {
      const habit = await this.habitsService.findOne(
        createCalendarEventDto.habit,
      );

      const calendarEvent = this.calendarEventRepository.create({
        ...createCalendarEventDto,
        habit,
        user: { id: userId },
      });

      return this.calendarEventRepository.save(calendarEvent);
    } catch (e) {
      throw new Error(e);
    }
  }

  findAll(userId: number) {
    return this.calendarEventRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
      relations: ['habit'],
    });
  }

  findOne(id: number) {
    return this.calendarEventRepository.findOneOrFail({
      where: {
        id,
      },
    });
  }

  remove(id: number) {
    return this.calendarEventRepository.delete(id);
  }
}
