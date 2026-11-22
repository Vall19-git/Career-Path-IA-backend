import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterAuthDto {
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString({
    message: 'El nombre debe ser un texto.',
  })
  @IsNotEmpty({
    message: 'El nombre es obligatorio.',
  })
  @MinLength(2, {
    message: 'El nombre debe tener al menos 2 caracteres.',
  })
  @MaxLength(120, {
    message: 'El nombre no puede superar los 120 caracteres.',
  })
  nombre: string;

  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsString({
    message: 'El correo electrónico debe ser un texto.',
  })
  @IsNotEmpty({
    message: 'El correo electrónico es obligatorio.',
  })
  @IsEmail(
    {},
    {
      message: 'Ingresá un correo electrónico válido.',
    },
  )
  @MaxLength(180, {
    message: 'El correo no puede superar los 180 caracteres.',
  })
  email: string;

  @IsString({
    message: 'La contraseña debe ser un texto.',
  })
  @IsNotEmpty({
    message: 'La contraseña es obligatoria.',
  })
  @MinLength(8, {
    message: 'La contraseña debe tener al menos 8 caracteres.',
  })
  @MaxLength(72, {
    message: 'La contraseña no puede superar los 72 caracteres.',
  })
  password: string;
}
