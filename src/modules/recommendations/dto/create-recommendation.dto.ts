import { IsInt, IsNotEmpty, IsNumber, IsString, Max, MaxLength, Min } from 'class-validator';

export class CreateRecommendationDto {
  @IsInt({ message: 'El user_id debe ser un número entero' })
  @Min(1, { message: 'El user_id debe ser positivo' })
  @Max(Number.MAX_SAFE_INTEGER, { message: 'El user_id excede el máximo permitido' })
  user_id!: number;

  @IsInt({ message: 'El career_id debe ser un número entero' })
  @Min(1, { message: 'El career_id debe ser positivo' })
  @Max(Number.MAX_SAFE_INTEGER, { message: 'El career_id excede el máximo permitido' })
  career_id!: number;

  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'El puntaje debe ser un número con hasta dos decimales' })
  @Min(0, { message: 'El puntaje no puede ser menor que 0' })
  @Max(100, { message: 'El puntaje no puede ser mayor que 100' })
  puntaje!: number;

  @IsString({ message: 'El resultado debe ser un texto' })
  @IsNotEmpty({ message: 'El resultado es obligatorio' })
  @MaxLength(100, { message: 'El resultado no puede superar los 100 caracteres' })
  resultado!: string;
}
