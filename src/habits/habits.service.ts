import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateHabitDto } from './dto/create-habit.dto';
import { UpdateHabitDto } from './dto/update-habit.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Habit } from './entities/habit.entity';

@Injectable()
export class HabitsService {
  constructor(
    @InjectRepository(Habit)
    private readonly habitsRepository: Repository<Habit>,
  ) {}

  async create(createHabitDto: CreateHabitDto) {
    const habit = this.habitsRepository.create(createHabitDto);

    return this.habitsRepository.save(habit);
  }

  findAll() {
    return this.habitsRepository.find();
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
    return this.habitsRepository.update(id, updateHabitDto);
  }

  async remove(id: number) {
    const habit = await this.findOne(id);
    return this.habitsRepository.remove(habit);
  }
}
