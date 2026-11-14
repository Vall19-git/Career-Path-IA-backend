import { IsInt, IsNotEmpty, IsString, Max, MaxLength, Min } from 'class-validator';

export class CreateProfileDto {
  @IsInt()
  @Min(1)
  @Max(Number.MAX_SAFE_INTEGER)
  user_id!: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  intereses!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  habilidades!: string;
}