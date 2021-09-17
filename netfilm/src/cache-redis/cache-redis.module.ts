import { CACHE_MANAGER, CacheModule, Inject, Module } from '@nestjs/common';
import { CacheRedisService } from './cache-redis.service';
import * as redisStore from 'cache-manager-ioredis';
import { Cache } from 'cache-manager';

@Module({
  imports: [
    CacheModule.register({
      store: redisStore,
      host: 'localhost',
      port: 6379,
      ttl: 30,
    }),
  ],
  exports: [CacheRedisModule, CacheRedisService],
  providers: [CacheRedisService],
})
export class CacheRedisModule {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}
}
