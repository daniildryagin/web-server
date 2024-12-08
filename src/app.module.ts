import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { TypeormConfig } from './config/typeorm.config';
import { DataSourceOptions } from 'typeorm';

@Module({

  providers: [],
  exports: [],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env`,
    }),
    TypeOrmModule.forRoot(new TypeormConfig().createTypeOrmOptions() as DataSourceOptions),
    UsersModule,
    PostsModule,
    AuthModule
  ],
})

export class AppModule { }
