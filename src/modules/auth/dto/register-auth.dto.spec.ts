import 'reflect-metadata';

import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { describe, expect, it } from 'vitest';

import { RegisterAuthDto } from './register-auth.dto.js';

describe('RegisterAuthDto', () => {
  const datos = {
    nombre: 'Tatiana Herrera',
    email: 'tatiana@example.com',
    password: 'ClaveSegura123',
  };

  async function validar(cambios = {}) {
    const dto = plainToInstance(RegisterAuthDto, {
      ...datos,
      ...cambios,
    });

    return validate(dto);
  }

  it('acepta datos correctos', async () => {
    expect(await validar()).toHaveLength(0);
  });

  it('rechaza un nombre vacío', async () => {
    const errores = await validar({ nombre: '' });

    expect(
      errores.some(e => e.property === 'nombre'),
    ).toBe(true);
  });

  it('rechaza un correo inválido', async () => {
    const errores = await validar({
      email: 'correo-invalido',
    });

    expect(
      errores.some(e => e.property === 'email'),
    ).toBe(true);
  });

  it('rechaza una contraseña corta', async () => {
    const errores = await validar({
      password: '123',
    });

    expect(
      errores.some(e => e.property === 'password'),
    ).toBe(true);
  });

  it('normaliza el correo electrónico', () => {
    const dto = plainToInstance(RegisterAuthDto, {
      ...datos,
      email: '  TATIANA@EXAMPLE.COM  ',
    });

    expect(dto.email).toBe('tatiana@example.com');
  });

  it('rechaza un nombre demasiado largo', async () => {
    const errores = await validar({
      nombre: 'A'.repeat(121),
    });

    expect(
      errores.some(e => e.property === 'nombre'),
    ).toBe(true);
  });
});
