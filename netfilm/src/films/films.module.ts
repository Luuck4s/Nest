import { Module } from '@nestjs/common';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { AuthModule } from '../auth/auth.module';
import { CacheRedisModule } from '../cache-redis/cache-redis.module';

@Module({
  imports: [AuthModule, CacheRedisModule],
  controllers: [FilmsController],
  providers: [FilmsService],
})
export class FilmsModule {}
