import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  @IsString({ message: 'El nombre debe ser un texto.' })
  @Matches(/\S/, { message: 'El nombre no puede estar vacío.' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres.' })
  @MaxLength(120, {
    message: 'El nombre no puede superar los 120 caracteres.',
  })
  nombre?: string;

  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsString({ message: 'El correo electrónico debe ser un texto.' })
  @IsEmail({}, { message: 'Ingresá un correo electrónico válido.' })
  @MaxLength(180, {
    message: 'El correo no puede superar los 180 caracteres.',
  })
  email?: string;
}