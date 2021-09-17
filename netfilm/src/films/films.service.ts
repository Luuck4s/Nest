import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFilmDto } from './dto/create-film.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateFilmDto } from './dto/update-film.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { CacheRedisService } from '../cache-redis/cache-redis.service';

@Injectable()
export class FilmsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cacheRedis: CacheRedisService,
  ) {}

  async create(createFilmDto: CreateFilmDto) {
    return await this.prisma.client().film.create({
      data: {
        name: createFilmDto.name,
        description: createFilmDto.description,
        image: createFilmDto.image,
        video: createFilmDto.video,
      },
    });
  }

  async findAll(paginationQuery: PaginationQueryDto) {
    const { limit, offset } = paginationQuery;

    let cached: any = await this.cacheRedis.get('films');
    cached = JSON.parse(cached);

    if (cached && cached.limit == limit && cached.offset == offset) {
      return cached.films;
    }

    await this.cacheRedis.del('films');

    const result = await this.prisma.client().film.findMany({
      take: limit,
      skip: offset,
    });

    await this.cacheRedis.set(
      'films',
      JSON.stringify({ films: result, limit, offset }),
    );

    return result;
  }
  async findOne(id: number) {
    let cached: any = await this.cacheRedis.get('film');
    cached = JSON.parse(cached);

    if (cached && cached.id === id) {
      return cached;
    }

    const film = await this.prisma.client().film.findFirst({
      where: {
        id,
      },
    });

    if (!film) {
      throw new NotFoundException(`Film requested not found`);
    }

    await this.cacheRedis.set('film', JSON.stringify(film));

    return film;
  }
  async update(id: number, updateFilmDto: UpdateFilmDto) {
    const film = await this.findOne(id);

    const newData = {
      ...film,
      ...updateFilmDto,
    };

    await this.prisma.client().film.update({
      where: {
        id: id,
      },
      data: {
        name: newData.name,
        description: newData.description,
        image: newData.image,
        video: newData.video,
      },
    });

    return newData;
  }
  async delete(id: number) {
    const film = await this.findOne(id);

    await this.prisma.client().film.delete({
      where: {
        id: id,
      },
    });

    return film;
  }
}
