import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './users.model';
import { CreateUserDto } from './dto/create-user.dto';


@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private UserRepository: typeof User) {}

  async createUser(dto: CreateUserDto): Promise<any> {
    try {
      const user = await this.UserRepository.create(dto);
      return user;
    }
    catch (err) {
      console.log(`Ошибка при создании пользователя ${dto.email}: ${err.message}`);
      throw new BadRequestException();
    }
  }

  async getAllUsers(): Promise<any> {
    const users = await this.UserRepository.findAll();
    return users;
  }

  async getUserById(id: number) {
    const user = await this.UserRepository.findOne({
      where: {
        id
      }
    });

    if (!user) {
      console.log(`Пользователя с id = ${id} не существует`);
      throw new BadRequestException();
    }

    return user;
  }

  async getUser(email: string) {
    const user = await this.UserRepository.findOne({
      where: {
        email
      }
    });

    if (!user) {
      throw new BadRequestException();
    }
  }
}
