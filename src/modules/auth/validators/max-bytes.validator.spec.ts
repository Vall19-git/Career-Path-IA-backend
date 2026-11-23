import 'reflect-metadata';

import { validate } from 'class-validator';
import { describe, expect, it } from 'vitest';
import { MaxBytes } from './max-bytes.validator.js';

class PasswordDtoDePrueba {
  @MaxBytes(72)
  password: string;
}

async function valido(password: string): Promise<boolean> {
  const dto = new PasswordDtoDePrueba();
  dto.password = password;
  return (await validate(dto)).length === 0;
}

describe('MaxBytes', () => {
  it('acepta una contraseña de exactamente 72 bytes', async () => {
    expect(await valido('A'.repeat(72))).toBe(true);
  });

  it('rechaza más de 72 bytes', async () => {
    expect(await valido('A'.repeat(73))).toBe(false);
  });

  it('cuenta correctamente los bytes de caracteres acentuados', async () => {
    expect(await valido('á'.repeat(36))).toBe(true);
    expect(await valido('á'.repeat(37))).toBe(false);
  });
});
