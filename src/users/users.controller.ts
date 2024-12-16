import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateResult } from 'typeorm';
import { UserResponseDto } from './dto/user-response.dto';
import { UsersGuard } from './guards/users.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam } from '@nestjs/swagger';
import { Request } from 'express';
import { UpdateResultDto } from '../common/dto/update-result.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { PostsService } from '../posts/posts.service';
import { AdminGuard } from '../common/guards/admin.guard';
import { PostResponseDto } from '../posts/dto/post-response.dto';


@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly postsService: PostsService
  ) { }

  @ApiOperation({ summary: 'Получить всех пользователей' })
  @ApiOkResponse({ type: [UserResponseDto] })
  @Get()
  async getAll(): Promise<UserResponseDto[]> {
    return await this.usersService.getAllUsers();
  }

  @ApiOperation({ summary: 'Получить пользователя' })
  @ApiParam({ name: 'id', description: 'ID пользователя' })
  @ApiOkResponse({ type: UserResponseDto })
  @Get(':id')
  async getUserById(@Param('id', ParseIntPipe) id: number): Promise<UserResponseDto> {
    return await this.usersService.findOneById(id);
  }

  @ApiOperation({ summary: 'Создать пользователя (только для админов)' })
  @ApiCreatedResponse({ type: UserResponseDto })
  @UseGuards(AdminGuard)
  @Post()
  async createUser(
    @Body() createUserDto: CreateUserDto,
    @Req() request: Request
  ): Promise<UserResponseDto> {
    return await this.usersService.createNewUser(createUserDto, request);
  }

  @ApiOperation({ summary: 'Изменить пользователя' })
  @ApiParam({ name: 'id', description: 'ID пользователя' })
  @ApiOkResponse({ type: UpdateResultDto })
  @UseGuards(UsersGuard)
  @Patch(':id')
  async updateUserById(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<UpdateResult> {
    return await this.usersService.updateUserById(id, updateUserDto);
  }

  @ApiOperation({ summary: 'Удалить пользователя' })
  @ApiParam({ name: 'id', description: 'ID пользователя' })
  @ApiOkResponse({ type: UserResponseDto })
  @UseGuards(UsersGuard)
  @Delete(':id')
  async deleteUserById(@Param('id', ParseIntPipe) id: number): Promise<UserResponseDto> {
    return await this.usersService.deleteUserById(id);
  }

  @ApiOperation({ summary: 'Получить статьи пользователя' })
  @ApiParam({ name: 'id', description: 'ID пользователя' })
  @ApiOkResponse({ type: [PostResponseDto] })
  @Get(':id/posts')
  async getPostsByAuthor(@Param('id', ParseIntPipe) userId: number): Promise<PostResponseDto[]> {
    return await this.postsService.findAllByAuthor(userId);
  }

  @ApiOperation({ summary: 'Изменить пароль' })
  @ApiParam({ name: 'id', description: 'ID пользователя' })
  @ApiOkResponse({ type: UpdateResultDto })
  @UseGuards(UsersGuard)
  @HttpCode(HttpStatus.OK)
  @Post(':id/change-password')
  async changePassword(
    @Param('id', ParseIntPipe) userId: number,
    @Body() changePasswordDto: ChangePasswordDto
  ): Promise<UpdateResult> {
    return await this.usersService.changePassword(userId, changePasswordDto);
  }
}
