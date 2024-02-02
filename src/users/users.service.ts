import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  async findOne(id: number): Promise<User | undefined> {
    return this.usersRepository.findOneOrFail({
      where: {
        id,
      },
    });
  }

  async findOneByUsername(username: string): Promise<User | undefined> {
    return this.usersRepository.findOne({
      where: {
        username,
      },
    });
  }

  create(createUserDto: CreateUserDto) {
    const user = this.usersRepository.create(createUserDto);

    return this.usersRepository.save(user);
  }

  findAll() {
    return this.usersRepository.find();
  }

  async update(userId: number, updateUserDto: UpdateUserDto) {
    const { id } = await this.findOne(userId);

    return this.usersRepository.save({
      id,
      ...updateUserDto,
    });
  }

  remove(id: number) {
    return this.usersRepository.delete({ id });
  }
}
