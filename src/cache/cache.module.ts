import { CacheModule } from "@nestjs/cache-manager";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { redisCacheConfig } from "../config/redis-store.config";

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