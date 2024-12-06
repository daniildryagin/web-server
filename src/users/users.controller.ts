import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { PostsService } from 'src/posts/posts.service';
import { User } from './entities/user.entity';
import { DeleteResult, UpdateResult } from 'typeorm';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly postsService: PostsService
  ) { }

  @UseGuards(AuthGuard)
  @Get()
  async getAll(): Promise<User[]> {
    return await this.usersService.getAllUsers();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getUserById(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return await this.usersService.getUserById(id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async updateUserById(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto): Promise<UpdateResult> {
    return await this.usersService.updateUserById(id, updateUserDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteUserById(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    return await this.usersService.deleteUserById(id);
  }

  @UseGuards(AuthGuard)
  @Get(':id/posts')
  getPostsByAuthor(@Param('id', ParseIntPipe) userId: number) {
    return this.postsService.findAllByAuthor(userId);
  }
}
