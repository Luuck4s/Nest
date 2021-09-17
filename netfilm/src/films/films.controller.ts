import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateFilmDto } from './dto/create-film.dto';
import { FilmsService } from './films.service';
import { JwtAdminGuard } from '../auth/shared/jwt/admin/jwt-admin.guard';
import { UpdateFilmDto } from './dto/update-film.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { JwtAuthGuard } from '../auth/shared/jwt/user/jwt-auth.guard';

@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @UseGuards(JwtAdminGuard)
  @Post('admin/create')
  create(@Body() createFilmDto: CreateFilmDto) {
    return this.filmsService.create(createFilmDto);
  }

  @UseGuards(JwtAdminGuard)
  @Patch('admin/update/:id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFilmDto: UpdateFilmDto,
  ) {
    return this.filmsService.update(id, updateFilmDto);
  }

  @UseGuards(JwtAdminGuard)
  @Delete('admin/delete/:id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.filmsService.delete(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.filmsService.findOne(id);
  }

  @Get()
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.filmsService.findAll(paginationQuery);
  }
}
