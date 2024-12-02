import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { DataSource, Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';


@Injectable()
export class UsersService {


    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>
    ) { }


    async createUser(createUserDto: CreateUserDto): Promise<User> {
        return this.usersRepository.create({ ...createUserDto });
    }


    async getAllUsers(): Promise<any> {
        return await this.usersRepository.find();
    }


    async getUserById(id: number): Promise<User> {

        const user = await this.usersRepository.findOne({
            where: {
                id
            }
        });

        if (!user) {
            throw new BadRequestException(`Пользователя с id = ${id} не существует`);
        }

        return user;
    }


    async updateUserById(id: number, updateUserDto: UpdateUserDto): Promise<UpdateResult> {

        const { email, username, password } = updateUserDto;

        const user = this.usersRepository.findOne({
            where: {
                id
            }
        })

        if (!user) {
            throw new BadRequestException(`Пользователя с id = ${id} не существует`);
        }

        return await this.usersRepository.update({ id }, { email, username, password });
    }

    deleteUserById(id: number): { id: number } {

        const user = this.usersRepository.findOneBy({ id });

        if (!user) {
            throw new BadRequestException(`Пользователя с id = ${id} не существует`);
        }

        try {
            this.usersRepository.delete(id);
            return { id };
        }
        catch (err) {
            throw new BadRequestException(err);
        }
    }
}
