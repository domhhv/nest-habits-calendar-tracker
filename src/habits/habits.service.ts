import { Injectable, NotFoundException } from '@nestjs/common';
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
    });
  }

  async findOne(id: number) {
    const habit = await this.habitsRepository.findOne({
      where: { id: +id },
    });

    if (!habit) {
      throw new NotFoundException(`Habit #${id} not found`);
    }

    return habit;
  }

  update(id: number, updateHabitDto: UpdateHabitDto) {
    return this.habitsRepository.save({
      id: +id,
      ...updateHabitDto,
    });
  }

  async remove(id: number) {
    const calendarEvents = await this.calendarEventRepository.find({
      where: {
        habit: {
          id,
        },
      },
    });

    await Promise.all(
      calendarEvents.map((calendarEvent) =>
        this.calendarEventRepository.delete(calendarEvent.id),
      ),
    );
    const habit = await this.findOne(id);
    return this.habitsRepository.remove(habit);
  }
}
