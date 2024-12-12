import { MiddlewareConsumer, Module, NestMiddleware, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { TypeormConfig } from './config/typeorm.config';
import { DataSourceOptions } from 'typeorm';
import { PagerMiddleware } from './common/middlewares/pager.middleware';
import { CacheModule, CacheModuleOptions, CacheOptions } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store'
import { appConfig } from './config/app.config';
import redisOptions from './config/redis-store.config'

@Module({

  providers: [],
  exports: [],
  imports: [

    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env`,
      load: [appConfig]
    }),

    TypeOrmModule.forRoot(new TypeormConfig().createTypeOrmOptions()),

    CacheModule.registerAsync(redisOptions),

    UsersModule,
    PostsModule,
    AuthModule
  ],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(PagerMiddleware)
      .forRoutes({ path: 'posts', method: RequestMethod.GET })
  }
}
