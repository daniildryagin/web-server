import { CacheOptions } from "@nestjs/cache-manager";
import { ConfigService } from "@nestjs/config";
import * as redisStore from 'cache-manager-redis-store'

export const redisCacheConfig = (configService: ConfigService): CacheOptions => ({
  store: redisStore,
  host: configService.get<string>('redisStore.host'),
  port: configService.get<number>('redisStore.port'),
  ttl: configService.get<number>('redisStore.ttl')
});