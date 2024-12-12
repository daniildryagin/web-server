import { CacheModule } from "@nestjs/cache-manager";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { redisCacheConfig } from "src/config/redis-store.config";
import { typeOrmConfig } from "src/config/typeorm.config";

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: redisCacheConfig,
    })
  ],
  providers: [],
  exports: []
})
export class RedisCacheModule { }