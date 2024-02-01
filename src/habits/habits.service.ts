import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateHabitDto } from './dto/create-habit.dto';
import { UpdateHabitDto } from './dto/update-habit.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Habit } from './entities/habit.entity';
import { CalendarEvent } from '../calendar-events/entities/calendar-event.entity';

@Injectable()
export class HabitsService {
  constructor(
    @InjectRepository(Habit)
    private readonly habitsRepository: Repository<Habit>,
    @InjectRepository(CalendarEvent)
    private readonly calendarEventRepository: Repository<CalendarEvent>,
  ) {}

  async create(createHabitDto: CreateHabitDto, userId: number) {
    const habit = this.habitsRepository.create({
      ...createHabitDto,
      user: { id: userId },
    });

    return this.habitsRepository.save(habit);
  }

  findAll(userId: number) {
    return this.habitsRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
      relations: ['user'],
    });
  }

  async findOne(userId: number, habitId: number) {
    const habit = await this.habitsRepository.findOne({
      where: { id: habitId },
      relations: ['user'],
    });

    if (!habit) {
      throw new NotFoundException(
        `Habit #${habitId} for user #${userId} not found`,
      );
    }

    if (habit.user.id !== userId) {
      throw new UnauthorizedException(
        `User #${userId} is not authorized to access habit #${habitId}`,
      );
    }

    return habit;
  }

  async update(
    userId: number,
    habitId: number,
    updateHabitDto: UpdateHabitDto,
  ) {
    const habit = await this.findOne(userId, habitId);

    await this.habitsRepository.update(habitId, {
      ...habit,
      ...updateHabitDto,
    });

    return this.findOne(userId, habitId);
  }

  async remove(userId: number, habitId: number) {
    await this.findOne(userId, habitId);

    const calendarEvents = await this.calendarEventRepository.find({
      where: {
        habit: {
          id: habitId,
        },
        user: {
          id: userId,
        },
      },
    });

    await Promise.all(
      calendarEvents.map((calendarEvent) =>
        this.calendarEventRepository.delete(calendarEvent.id),
      ),
    );

    const habit = await this.findOne(userId, habitId);
    return this.habitsRepository.remove(habit);
  }
}
