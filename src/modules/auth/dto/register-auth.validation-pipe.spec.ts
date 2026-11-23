import 'reflect-metadata';

import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { describe, expect, it } from 'vitest';
import { RegisterAuthDto } from './register-auth.dto.js';

const pipe = new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
});

const metadata = { type: 'body' as const, metatype: RegisterAuthDto, data: '' };
const datosValidos = {
  nombre: 'Morena Marina',
  email: 'morena@example.com',
  password: 'ClaveSegura123',
};

function validar(input: Record<string, unknown>) {
  return pipe.transform(input, metadata);
}

describe('RegisterAuthDto con ValidationPipe', () => {
  it('acepta un registro válido y normaliza el correo', async () => {
    const dto = await validar({ ...datosValidos, email: '  MORENA@EXAMPLE.COM  ' });
    expect(dto).toBeInstanceOf(RegisterAuthDto);
    expect(dto.email).toBe('morena@example.com');
  });

  it('responde 400 por correo inválido', async () => {
    await expect(validar({ ...datosValidos, email: 'invalido' }))
      .rejects.toBeInstanceOf(BadRequestException);
  });

  it('responde 400 por contraseña menor a 8 caracteres', async () => {
    await expect(validar({ ...datosValidos, password: '123' }))
      .rejects.toBeInstanceOf(BadRequestException);
  });

  it('responde 400 por contraseña que supera 72 bytes UTF-8', async () => {
    await expect(validar({ ...datosValidos, password: 'á'.repeat(40) }))
      .rejects.toBeInstanceOf(BadRequestException);
  });

  it('responde 400 por nombre ausente', async () => {
    const { nombre: _nombre, ...incompletos } = datosValidos;
    await expect(validar(incompletos))
      .rejects.toBeInstanceOf(BadRequestException);
  });

  it('responde 400 por campos extra no permitidos', async () => {
    await expect(validar({ ...datosValidos, rol: 'admin' }))
      .rejects.toBeInstanceOf(BadRequestException);
  });
});
