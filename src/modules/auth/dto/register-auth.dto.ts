import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

import {
  EMAIL_MAX_LENGTH,
  NOMBRE_MAX_LENGTH,
  NOMBRE_MIN_LENGTH,
  PASSWORD_MAX_BYTES,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from '../auth.constants.js';
import { MaxBytes } from '../validators/max-bytes.validator.js';

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
  @MinLength(NOMBRE_MIN_LENGTH, {
    message: `El nombre debe tener al menos ${NOMBRE_MIN_LENGTH} caracteres.`,
  })
  @MaxLength(NOMBRE_MAX_LENGTH, {
    message: `El nombre no puede superar los ${NOMBRE_MAX_LENGTH} caracteres.`,
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
  @MaxLength(EMAIL_MAX_LENGTH, {
    message: `El correo no puede superar los ${EMAIL_MAX_LENGTH} caracteres.`,
  })
  email: string;

  @IsString({
    message: 'La contraseña debe ser un texto.',
  })
  @IsNotEmpty({
    message: 'La contraseña es obligatoria.',
  })
  @MinLength(PASSWORD_MIN_LENGTH, {
    message: `La contraseña debe tener al menos ${PASSWORD_MIN_LENGTH} caracteres.`,
  })
  @MaxLength(PASSWORD_MAX_LENGTH, {
    message: `La contraseña no puede superar los ${PASSWORD_MAX_LENGTH} caracteres.`,
  })
  @MaxBytes(PASSWORD_MAX_BYTES, {
    message: `La contraseña no puede superar los ${PASSWORD_MAX_BYTES} bytes (las letras con tilde ocupan más de un byte).`,
  })
  password: string;
}