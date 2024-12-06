import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './jwt.constants';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [

    TypeOrmModule.forFeature([User]),

    JwtModule.register({ global: true }),

    UsersModule
  ],
  exports: []
})
export class AuthModule { }
