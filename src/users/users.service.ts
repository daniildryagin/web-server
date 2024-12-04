import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>
  ) { }


  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { email, password } = createUserDto;
    const user = await this.usersRepository.findOneBy({ email });

    if (user) {
      throw new BadRequestException('Этот email уже занят.')
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const newUser = this.usersRepository.create({
      password: encryptedPassword,
      ...createUserDto
    })

    return await this.usersRepository.save(newUser);
  }


  async getAllUsers(): Promise<User[]> {
    return await this.usersRepository.find();
  }


  async getUserById(id: number): Promise<User> {

    const user = await this.usersRepository.findOneBy({ id });

    if (!user) {
      throw new BadRequestException(`Пользователя с id = ${id} не существует`);
    }

    return user;
  }

  async getUserByEmail(email: string): Promise<User> {

    const user = await this.usersRepository.findOneBy({ email });

    if (!user) {
      throw new BadRequestException(`Пользователя с таким email не существует.`);
    }

    return user;
  }


  async updateUserById(id: number, updateUserDto: UpdateUserDto): Promise<UpdateResult> {

    const user = await this.usersRepository.findOneBy({ id });

    if (!user) {
      throw new BadRequestException(`Пользователя с id = ${id} не существует`);
    }

    return await this.usersRepository.update({ id }, { ...updateUserDto });
  }

  async deleteUserById(id: number): Promise<DeleteResult> {

    const user = await this.usersRepository.findOneBy({ id });

    if (!user) {
      throw new BadRequestException(`Пользователя с id = ${id} не существует`);
    }

    return await this.usersRepository.delete({ id });
  }
}
