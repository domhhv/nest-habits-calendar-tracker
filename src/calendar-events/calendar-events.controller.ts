import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CalendarEventsService } from './calendar-events.service';
import { CreateCalendarEventDto } from './dto/create-calendar-event.dto';
import { AuthGuard } from '../auth/auth.guard';
import { Request } from 'express';

@UseGuards(AuthGuard)
@Controller('calendar-events')
export class CalendarEventsController {
  constructor(private readonly calendarEventsService: CalendarEventsService) {}

  @Post()
  create(
    @Req() request: Request,
    @Body() createCalendarEventDto: CreateCalendarEventDto,
  ) {
    return this.calendarEventsService.create(
      createCalendarEventDto,
      request['user'].sub,
    );
  }

  @Get()
  findAll(@Req() request: Request) {
    return this.calendarEventsService.findAll(request['user'].sub);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.calendarEventsService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.calendarEventsService.remove(+id);
  }
}
