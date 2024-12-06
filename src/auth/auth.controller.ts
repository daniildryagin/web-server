import { Body, Controller, HttpCode, HttpStatus, Post, Request as Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { SignInDto } from './dto/signIn.dto';
import { Tokens } from './types/tokens.type';
import { Request } from 'express';

@Controller('auth')
export class AuthController {

  constructor(
    private readonly authService: AuthService
  ) { }

  @HttpCode(HttpStatus.OK)
  @Post('signup')
  async register(@Body() signUpDto: SignInDto): Promise<Tokens> {
    return await this.authService.signUp(signUpDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signIn(@Body() signInDto: SignInDto): Promise<Tokens> {
    return await this.authService.signIn(signInDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refresh(@Req() req: Request): Promise<Tokens> {
    return await this.authService.refreshTokens(req);
  }
}
