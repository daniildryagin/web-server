import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { UsersModule } from '../users/users.module';

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
