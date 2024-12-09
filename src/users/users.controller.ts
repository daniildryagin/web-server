import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { PostsService } from 'src/posts/posts.service';
import { UpdateResult } from 'typeorm';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { UserDto } from './dto/user.dto';
import { UsersGuard } from './guards/users.guard';
import { PostDto } from 'src/posts/dto/post.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { ChangePasswordDto } from './dto/change-password.dto';

@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly postsService: PostsService
  ) { }

  @Get()
  async getAll(): Promise<UserDto[]> {
    return await this.usersService.getAllUsers();
  }

  @Get(':id')
  async getUserById(@Param('id', ParseIntPipe) id: number): Promise<UserDto> {
    return await this.usersService.findOneById(id);
  }

  @UseGuards(AdminGuard)
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
    return await this.usersService.createNewUser(createUserDto);
  }

  @UseGuards(UsersGuard)
  @Patch(':id')
  async updateUserById(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<UpdateResult> {
    return await this.usersService.updateUserById(id, updateUserDto);
  }

  @UseGuards(UsersGuard)
  @Delete(':id')
  async deleteUserById(@Param('id', ParseIntPipe) id: number): Promise<UserDto> {
    return await this.usersService.deleteUserById(id);
  }

  @Get(':id/posts')
  async getPostsByAuthor(@Param('id', ParseIntPipe) userId: number): Promise<PostDto[]> {
    return await this.postsService.findAllByAuthor(userId);
  }

  @UseGuards(UsersGuard)
  @Post(':id/change-password')
  async changePassword(
    @Param('id', ParseIntPipe) userId: number,
    @Body() changePasswordDto: ChangePasswordDto
  ): Promise<UpdateResult> {
    return await this.usersService.changePassword(userId, changePasswordDto);
  }
}
