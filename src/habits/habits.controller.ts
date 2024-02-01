import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { HabitsService } from './habits.service';
import { CreateHabitDto } from './dto/create-habit.dto';
import { UpdateHabitDto } from './dto/update-habit.dto';
import { AuthGuard } from '../common/guards/auth.guard';

@Controller('users/:userId/habits')
export class HabitsController {
  constructor(private readonly habitsService: HabitsService) {}

  @Post()
  create(
    @Param('userId') userId: number,
    @Body() createHabitDto: CreateHabitDto,
  ) {
    return this.habitsService.create(createHabitDto, userId);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(@Param('userId') userId: number) {
    return this.habitsService.findAll(userId);
  }

  @Get(':habitId')
  findOne(@Param('userId') userId: number, @Param('habitId') habitId: number) {
    return this.habitsService.findOne(userId, habitId);
  }

  @Patch(':habitId')
  update(
    @Param('userId') userId: number,
    @Param('habitId') habitId: number,
    @Body() updateHabitDto: UpdateHabitDto,
  ) {
    return this.habitsService.update(userId, habitId, updateHabitDto);
  }

  @Delete(':habitId')
  async remove(
    @Param('userId') userId: number,
    @Param('habitId') habitId: number,
  ) {
    return this.habitsService.remove(userId, habitId);
  }
}
