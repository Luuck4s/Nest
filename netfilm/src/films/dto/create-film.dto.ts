import { IsString, IsUrl } from 'class-validator';

export class CreateFilmDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly description: string;

  @IsUrl()
  readonly image: string;

  @IsUrl()
  readonly video: string;
}
