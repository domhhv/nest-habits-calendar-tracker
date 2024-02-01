import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CalendarEventsService } from './calendar-events.service';
import { CreateCalendarEventDto } from './dto/create-calendar-event.dto';
import { AuthGuard } from '../common/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('users/:userId/calendar-events')
export class CalendarEventsController {
  constructor(private readonly calendarEventsService: CalendarEventsService) {}

  @Post()
  create(
    @Param('userId') userId: number,
    @Body() createCalendarEventDto: CreateCalendarEventDto,
  ) {
    return this.calendarEventsService.create(createCalendarEventDto, userId);
  }

  @Get()
  findAll(@Param('userId') userId: number) {
    return this.calendarEventsService.findAll(userId);
  }

  @Get(':calendarEventId')
  findOne(
    @Param('userId') userId: number,
    @Param('calendarEventId') calendarEventId: number,
  ) {
    return this.calendarEventsService.findOne(userId, calendarEventId);
  }

  @Delete(':calendarEventId')
  remove(
    @Param('userId') userId: number,
    @Param('calendarEventId') calendarEventId: number,
  ) {
    return this.calendarEventsService.remove(userId, calendarEventId);
  }
}
