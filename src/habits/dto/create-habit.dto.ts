import { IsOptional, IsString, IsEnum } from 'class-validator';
import { HabitTraits } from '../entities/habit.entity';

export class CreateHabitDto {
  @IsString()
  readonly name: string;

  @IsString()
  @IsOptional()
  readonly description: string;

  @IsEnum(HabitTraits)
  readonly trait: HabitTraits;
}
