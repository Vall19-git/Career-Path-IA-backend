import 'reflect-metadata';

import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { describe, expect, it } from 'vitest';

import { LoginAuthDto } from './login-auth.dto.js';

describe('LoginAuthDto', () => {
  const datos = {
    email: 'morena@example.com',
    password: 'ClaveSegura123',
  };

  async function validar(cambios: Record<string, unknown> = {}) {
    const dto = plainToInstance(LoginAuthDto, { ...datos, ...cambios });
    return validate(dto);
  }

  it('acepta credenciales correctas', async () => {
    expect(await validar()).toHaveLength(0);
  });

  it('rechaza un email inválido', async () => {
    const errores = await validar({ email: 'correo-invalido' });
    expect(errores.some(error => error.property === 'email')).toBe(true);
  });

  it('rechaza email vacío', async () => {
    const errores = await validar({ email: '' });
    expect(errores.some(error => error.property === 'email')).toBe(true);
  });

  it('rechaza una contraseña corta', async () => {
    const errores = await validar({ password: '123' });
    expect(errores.some(error => error.property === 'password')).toBe(true);
  });

  it('rechaza una contraseña faltante', async () => {
    const errores = await validar({ password: undefined });
    expect(errores.some(error => error.property === 'password')).toBe(true);
  });

  it('rechaza contraseñas de más de 72 caracteres', async () => {
    const errores = await validar({ password: 'A'.repeat(73) });
    expect(errores.some(error => error.property === 'password')).toBe(true);
  });

  it('rechaza contraseñas con más de 72 bytes en UTF-8', async () => {
    const errores = await validar({ password: 'á'.repeat(40) });
    expect(errores.some(error => error.property === 'password')).toBe(true);
  });

  it('rechaza emails demasiado largos', async () => {
    const errores = await validar({ email: `${'a'.repeat(180)}@example.com` });
    expect(errores.some(error => error.property === 'email')).toBe(true);
  });

  it('normaliza el email sin alterar la contraseña', () => {
    const dto = plainToInstance(LoginAuthDto, {
      email: '  MORENA@EXAMPLE.COM  ',
      password: '  ClaveSegura123  ',
    });

    expect(dto.email).toBe('morena@example.com');
    expect(dto.password).toBe('  ClaveSegura123  ');
  });
});
