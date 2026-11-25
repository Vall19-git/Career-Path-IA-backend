import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { describe, expect, it } from 'vitest';
import { UpdateUserDto } from './update-user.dto.js';

describe('UpdateUserDto', () => {
  it('rechaza nombres formados únicamente por espacios', async () => {
    const dto = plainToInstance(UpdateUserDto, { nombre: '   ' });
    const errores = await validate(dto);
    expect(errores.some((e) => e.property === 'nombre')).toBe(true);
  });

  it('recorta espacios alrededor de un nombre válido', async () => {
    const dto = plainToInstance(UpdateUserDto, { nombre: '  Morena  ' });
    expect(dto.nombre).toBe('Morena');
    expect(await validate(dto)).toHaveLength(0);
  });
});
