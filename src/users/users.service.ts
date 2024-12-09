import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { UserDto } from './dto/user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';


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
      throw new BadRequestException('Этот email уже занят.');
    }

    const encryptedPassword = await this.hashPassword(password);

    const newUser = this.usersRepository.create(
      {
        ...createUserDto,
        password: encryptedPassword
      }
    );

    return newUser;
  }

  async createNewUser(createUserDto: CreateUserDto): Promise<UserDto> {
    const user = await this.createUser(createUserDto);

    return this.transformUser(await this.saveUser(user));
  }

  async saveUser(user: User): Promise<User> {
    return await this.usersRepository.save(user);
  }

  async getAllUsers(): Promise<UserDto[]> {
    const users = await this.usersRepository.find();

    return users.map(user => this.transformUser(user));
  }

  async getUserById(id: number): Promise<User> {

    const user = await this.usersRepository.findOneBy({ id });

    if (!user) {
      throw new BadRequestException(`Пользователь с id=${id} не найден`);
    }

    return user;
  }

  async findOneById(id: number): Promise<UserDto> {
    const user = await this.getUserById(id);

    return this.transformUser(user);
  }

  async getUserByEmail(email: string): Promise<User> {

    const user = await this.usersRepository.findOneBy({ email });

    if (!user) {
      throw new BadRequestException(`Пользователя с таким email не существует.`);
    }

    return user;
  }

  async findUserByEmail(email: string): Promise<UserDto> {
    const user = await this.getUserByEmail(email);

    return this.transformUser(user);
  }


  async updateUserById(id: number, updateUserDto: UpdateUserDto): Promise<UpdateResult> {
    const user = await this.getUserById(id);

    return await this.usersRepository.update({ id: user.id }, { ...updateUserDto });
  }

  async deleteUserById(id: number): Promise<UserDto> {

    const user = await this.getUserById(id);

    const removedUser = await this.usersRepository.remove(user);

    return this.transformUser(removedUser);
  }

  async changePassword(userId: number, changePasswordDto: ChangePasswordDto): Promise<UpdateResult> {

    const { password } = changePasswordDto;

    const user = await this.getUserById(userId);

    const hashedPassword = await this.hashPassword(password);

    return this.usersRepository.update({ id: user.id }, { password: hashedPassword })
  }

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  transformUser(user: User): UserDto {
    const { password, ...transformedUser } = user;

    return transformedUser;
  }
}
