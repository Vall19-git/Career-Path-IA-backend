import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateLearningRouteDto {
  @IsInt({ message: 'El user_id debe ser un número entero' })
  user_id!: number;

  @IsInt({ message: 'El career_id debe ser un número entero' })
  career_id!: number;

  @IsString({ message: 'El estado debe ser un texto' })
  @IsNotEmpty({ message: 'El estado es obligatorio' })
  @MaxLength(50, {
    message: 'El estado no puede superar los 50 caracteres',
  })
  estado!: string;

  @IsNumber({}, { message: 'El progreso debe ser un número' })
  @Min(0, { message: 'El progreso no puede ser menor a 0' })
  @Max(100, { message: 'El progreso no puede ser mayor a 100' })
  progreso!: number;
}
