import { Body, Controller, HttpCode, HttpStatus, Post, Request as Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { SignInDto } from './dto/sign-in.dto';
import { Tokens } from './types/tokens.type';
import { Request } from 'express';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiOkResponse } from '@nestjs/swagger';
import { PostResponseDto } from 'src/posts/dto/post-response.dto';

@Controller('auth')
export class AuthController {

  constructor(
    private readonly authService: AuthService
  ) { }

  @ApiOperation({ summary: 'Регистрация' })
  @ApiOkResponse({ type: Tokens })
  @HttpCode(HttpStatus.OK)
  @Post('signup')
  async register(@Body() signUpDto: SignInDto): Promise<Tokens> {
    return await this.authService.signUp(signUpDto);
  }

  @ApiOperation({ summary: 'Аутентификация' })
  @ApiOkResponse({ type: Tokens })
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signIn(@Body() signInDto: SignInDto): Promise<Tokens> {
    return await this.authService.signIn(signInDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Обновить токены' })
  @ApiOkResponse({ type: Tokens })
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refresh(@Req() req: Request): Promise<Tokens> {
    return await this.authService.refreshTokens(req);
  }
}
