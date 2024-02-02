import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ClassSerializerInterceptor,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '../common/guards/auth.guard';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('users/:userId')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get()
  findOne(@Param('userId') userId: number) {
    return this.usersService.findOne(userId);
  }

  @UseGuards(AuthGuard)
  @Patch()
  update(
    @Param('userId') userId: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(userId, updateUserDto);
  }

  @UseGuards(AuthGuard)
  @Delete()
  remove(@Param('userId') userId: number) {
    return this.usersService.remove(userId);
  }
}
