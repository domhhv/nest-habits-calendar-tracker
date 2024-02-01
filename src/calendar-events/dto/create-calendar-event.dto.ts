import { IsInt, IsString } from 'class-validator';

export class CreateCalendarEventDto {
  @IsString()
  readonly date: string;

  @IsInt()
  readonly habit: number;
}
