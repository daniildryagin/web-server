import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsService } from '../posts/posts.service';
import { Post } from '../posts/entities/post.entity';


@Module({
  providers: [UsersService, PostsService],
  controllers: [UsersController],
  imports: [
    TypeOrmModule.forFeature([User, Post]),
  ],
  exports: [UsersService]
})
export class UsersModule { }
