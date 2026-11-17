import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateLearningRouteDto {
  @IsInt({ message: 'El user_id debe ser un número entero' })
  @Min(1, { message: 'El user_id debe ser positivo' })
  @Max(Number.MAX_SAFE_INTEGER, { message: 'El user_id excede el máximo permitido' })
  user_id!: number;

  @IsInt({ message: 'El career_id debe ser un número entero' })
  @Min(1, { message: 'El career_id debe ser positivo' })
  @Max(Number.MAX_SAFE_INTEGER, { message: 'El career_id excede el máximo permitido' })
  career_id!: number;

  @IsString({ message: 'El estado debe ser un texto' })
  @IsNotEmpty({ message: 'El estado es obligatorio' })
  @Matches(/\S/, { message: 'El estado no puede contener solo espacios' })
  @MaxLength(50, { message: 'El estado no puede superar los 50 caracteres' })
  estado!: string;

  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'El progreso debe ser un número con hasta dos decimales' })
  @Min(0, { message: 'El progreso no puede ser menor a 0' })
  @Max(100, { message: 'El progreso no puede ser mayor a 100' })
  progreso!: number;
}
