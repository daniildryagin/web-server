import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { PostsModule } from './posts/posts.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({

    providers: [],

    exports: [],

    imports: [

        ConfigModule.forRoot({
            envFilePath: `.${process.env.NODE_ENV}.env`
        }),

        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.DATABASE_HOST,
            port: Number(process.env.DATABASE_PORT),
            username: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_NAME,
            entities: [User],
            synchronize: true,
        }),

        UsersModule,
        PostsModule
    ],
})

export class AppModule { }
