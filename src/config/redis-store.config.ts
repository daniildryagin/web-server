import { CacheModuleAsyncOptions, CacheOptions } from "@nestjs/cache-manager";
import { ConfigModule, ConfigService } from "@nestjs/config";
import * as redisStore from 'cache-manager-redis-store'

export const redisCacheConfig = (configService: ConfigService): CacheOptions => ({
  store: redisStore,
  host: configService.get<string>('redisStore.host'),
  port: configService.get<string>('redisStore.port'),
  ttl: 10
});