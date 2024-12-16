import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { User } from '../users/entities/user.entity';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [PostsController],
  providers: [PostsService],
  imports: [
    TypeOrmModule.forFeature([Post, User]),
    UsersModule
  ]
})
export class PostsModule { }
