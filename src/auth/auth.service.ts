import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { SignInDto } from './dto/sign-in.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './jwt.constants';
import { Tokens } from './types/tokens.type';
import { Payload } from './types/payload.type';
import { Request } from 'express';
import { utils } from './utils/utils'
import { RequestUserData } from './types/request-user-data.type';


@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) { }

  async signUp(signUpDto: SignInDto): Promise<Tokens> {

    const newUser = await this.usersService.createUser(signUpDto);
    const payload = this.createPayload(newUser);
    const tokens = await this.getTokens(payload);

    await this.usersService.saveUser(newUser);

    return tokens;
  }

  async signIn(signInDto: SignInDto): Promise<Tokens> {

    const { email, password } = signInDto;

    let user: User;

    try {
      user = await this.usersService.getUserByEmail(email);
    }
    catch (exception) {
      if (exception.name === 'BadRequestException') {
        throw new UnauthorizedException('Неверный логин или пароль.');
      }
    }

    const passwordsEquals = await bcrypt.compare(password, user.password);

    if (!passwordsEquals) {
      throw new UnauthorizedException('Неверный логин или пароль.');
    }

    return await this.getTokens(this.createPayload(user));
  }

  async refreshTokens(request: Request): Promise<Tokens> {

    const refreshToken = utils.extractToken(request);

    try {
      const payload = await this.jwtService.verifyAsync<Payload>(
        refreshToken,
        {
          secret: jwtConstants.RT_SECRET
        }
      );

      return await this.getTokens(payload);
    }
    catch (err) {
      throw new UnauthorizedException(err.message);
    }
  }

  private async getTokens(payload: Payload): Promise<Tokens> {

    const access_token = await this.jwtService.signAsync(
      payload,
      {
        secret: jwtConstants.AT_SECRET,
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES
      }
    );

    const refresh_token = await this.jwtService.signAsync(
      payload,
      {
        secret: jwtConstants.RT_SECRET,
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES
      }
    );

    return { access_token, refresh_token };
  }

  private createPayload({ id, email }: RequestUserData): Payload {
    return { sub: id, email };
  }
}
