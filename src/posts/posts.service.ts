import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Post } from './entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class PostsService {

    constructor(
        @InjectRepository(Post)
        private readonly postsRepository: Repository<Post>,

        @InjectRepository(Post)
        private readonly usersRepository: Repository<User>
    ) { }


    async create(createPostDto: CreatePostDto): Promise<Post> {

        const { name, description, authorId } = createPostDto;

        const author = await this.usersRepository.findOneBy({ id: authorId })

        if (!author) {
            throw new BadRequestException('Нет такого пользователя.');
        }

        return this.postsRepository.create({ name, description, author });
    }


    async findAll(): Promise<Post[]> {
        return await this.postsRepository.find();
    }


    async findOne(id: number): Promise<Post> {
        return await this.postsRepository.findOneBy({ id });
    }


    async findAllByAuthor(userId: number): Promise<Post[]> {

        const author = await this.usersRepository.findOneBy({ id: userId });

        if (!author) {
            throw new BadRequestException('Нет такого пользователя.');
        }

        return await this.postsRepository.find({
            where: {
                author
            }
        });
    }


    async update(id: number, updatePostDto: UpdatePostDto): Promise<UpdateResult> {

        const { name, description, authorId } = updatePostDto;

        const author = await this.usersRepository.findOneBy({ id: authorId });

        if (!author) {
            throw new BadRequestException(`Нет пользователя с id = ${authorId}.`);
        }

        const post = await this.postsRepository.findOneBy({ id });

        if (!post) {
            throw new BadRequestException(`Нет поста с id = ${id}.`);
        }

        return this.postsRepository.update({ id }, { name, description, author });
    }


    async remove(id: number): Promise<DeleteResult> {
        return await this.postsRepository.delete({ id });
    }
}
