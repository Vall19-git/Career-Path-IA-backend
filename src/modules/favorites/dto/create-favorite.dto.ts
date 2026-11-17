import { IsInt, Max, Min } from 'class-validator';

export class CreateFavoriteDto {
  @IsInt()
  @Min(1)
  @Max(Number.MAX_SAFE_INTEGER)
  user_id!: number;

  @IsInt()
  @Min(1)
  @Max(Number.MAX_SAFE_INTEGER)
  career_id!: number;
}
