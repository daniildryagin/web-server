import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { ArticlesModule } from './articles/articles.module';
import { AuthModule } from './auth/auth.module';
import { appConfig } from './config/app.config';
import { DatabaseModule } from './database/database.module';
import { RedisCacheModule } from './cache/cache.module';

@Module({
  providers: [],
  exports: [],
  imports: [

    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env`,
      load: [appConfig]
    }),
    DatabaseModule,
    RedisCacheModule,
    UsersModule,
    ArticlesModule,
    AuthModule
  ],
})

export class AppModule { }
