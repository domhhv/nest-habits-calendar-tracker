import { IsDate, IsInt } from 'class-validator';

export class CreateCalendarEventDto {
  @IsDate()
  readonly date: Date;

  @IsInt()
  readonly habit: number;
}
