import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
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
    const habit = await this.habitsService.findOne(
      userId,
      createCalendarEventDto.habit,
    );

    const calendarEvent = this.calendarEventRepository.create({
      ...createCalendarEventDto,
      habit,
      user: { id: userId },
    });

    return this.calendarEventRepository.save(calendarEvent);
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

  async findOne(userId: number, calendarEventId: number) {
    const calendarEvent = await this.calendarEventRepository.findOne({
      where: {
        id: calendarEventId,
      },
      relations: ['user'],
    });

    if (!calendarEvent) {
      throw new NotFoundException(
        `Calendar event #${calendarEventId} for user #${userId} not found`,
      );
    }

    if (calendarEvent.user.id !== userId) {
      throw new UnauthorizedException(
        `User #${userId} is not authorized to access calendar event #${calendarEventId}`,
      );
    }

    return this.calendarEventRepository.findOne({
      where: {
        id: calendarEventId,
      },
    });
  }

  async remove(userId: number, calendarEventId: number) {
    await this.findOne(userId, calendarEventId);

    return this.calendarEventRepository.delete(calendarEventId);
  }
}
