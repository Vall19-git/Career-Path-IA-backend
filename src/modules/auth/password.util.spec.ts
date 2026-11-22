import { describe, expect, it } from 'vitest';
import { PasswordUtil } from './password.util.js';

describe('PasswordUtil', () => {
  const password = 'ClaveSegura123';

  it('genera un hash bcrypt', async () => {
    const hash = await PasswordUtil.hash(password);

    expect(hash).not.toBe(password);
    expect(hash).toMatch(/^\$2[aby]\$12\$/);
  });

  it('verifica una contraseña correcta', async () => {
    const hash = await PasswordUtil.hash(password);

    expect(
      await PasswordUtil.compare(password, hash),
    ).toBe(true);
  });

  it('rechaza una contraseña incorrecta', async () => {
    const hash = await PasswordUtil.hash(password);

    expect(
      await PasswordUtil.compare('OtraClave123', hash),
    ).toBe(false);
  });

  it('rechaza contraseñas cortas', async () => {
    await expect(
      PasswordUtil.hash('123'),
    ).rejects.toThrow();
  });

  it('rechaza contraseñas mayores a 72 bytes', () => {
    expect(
      PasswordUtil.isValidLength('á'.repeat(40)),
    ).toBe(false);
  });

  it('genera hashes distintos para la misma contraseña', async () => {
    const hash1 = await PasswordUtil.hash(password);
    const hash2 = await PasswordUtil.hash(password);

    expect(hash1).not.toBe(hash2);
  });
});
