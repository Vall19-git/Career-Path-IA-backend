import { describe, expect, it } from 'vitest';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateProfileDto } from './create-profile.dto.js';
import { UpdateProfileDto } from './update-profile.dto.js';

const valid = {
  user_id: 1,
  intereses: 'Tecnología',
  habilidades: 'Investigación',
};

const validateCreate = (data: Record<string, unknown>) =>
  validate(plainToInstance(CreateProfileDto, data));

const validateUpdate = (data: Record<string, unknown>) =>
  validate(plainToInstance(UpdateProfileDto, data));

describe('CreateProfileDto', () => {
  it('acepta los datos obligatorios correctos', async () => {
    expect(await validateCreate(valid)).toHaveLength(0);
  });

  it('acepta palabras acentuadas y espacios', async () => {
    expect(await validateCreate({
      user_id: 2,
      intereses: 'Diseño, música y robótica',
      habilidades: 'Comunicación y lógica',
    })).toHaveLength(0);
  });

  it.each([0, -1, 1.5, '1', null, true])(
    'rechaza user_id inválido %j',
    async (user_id) => {
      const errors = await validateCreate({ ...valid, user_id });
      expect(errors.some((error) => error.property === 'user_id')).toBe(true);
    },
  );

  it('rechaza user_id fuera del rango seguro de JavaScript', async () => {
    const errors = await validateCreate({ ...valid, user_id: Number.MAX_SAFE_INTEGER + 1 });
    expect(errors.some((error) => error.property === 'user_id')).toBe(true);
  });

  it.each(['', 17, null, false])(
    'rechaza intereses inválidos %j',
    async (intereses) => {
      const errors = await validateCreate({ ...valid, intereses });
      expect(errors.some((error) => error.property === 'intereses')).toBe(true);
    },
  );

  it.each(['', 17, null, false])(
    'rechaza habilidades inválidas %j',
    async (habilidades) => {
      const errors = await validateCreate({ ...valid, habilidades });
      expect(errors.some((error) => error.property === 'habilidades')).toBe(true);
    },
  );

  it('permite intereses de exactamente 255 caracteres', async () => {
    expect(await validateCreate({ ...valid, intereses: 'A'.repeat(255) })).toHaveLength(0);
  });

  it('rechaza intereses que superen 255 caracteres', async () => {
    const errors = await validateCreate({ ...valid, intereses: 'A'.repeat(256) });
    expect(errors.some((error) => error.property === 'intereses')).toBe(true);
  });

  it('permite habilidades de exactamente 255 caracteres', async () => {
    expect(await validateCreate({ ...valid, habilidades: 'A'.repeat(255) })).toHaveLength(0);
  });

  it('rechaza habilidades que superen 255 caracteres', async () => {
    const errors = await validateCreate({ ...valid, habilidades: 'A'.repeat(256) });
    expect(errors.some((error) => error.property === 'habilidades')).toBe(true);
  });

  it('detecta propiedades obligatorias faltantes', async () => {
    const errors = await validateCreate({});
    expect(errors.map((error) => error.property).sort()).toEqual([
      'habilidades', 'intereses', 'user_id',
    ]);
  });
});

describe('UpdateProfileDto', () => {
  it('acepta un PATCH vacío porque sus campos son opcionales', async () => {
    expect(await validateUpdate({})).toHaveLength(0);
  });

  it('acepta sólo intereses', async () => {
    expect(await validateUpdate({ intereses: 'Arte' })).toHaveLength(0);
  });

  it('acepta sólo habilidades', async () => {
    expect(await validateUpdate({ habilidades: 'Liderazgo' })).toHaveLength(0);
  });

  it('acepta sólo un ID de usuario válido', async () => {
    expect(await validateUpdate({ user_id: 3 })).toHaveLength(0);
  });

  it('rechaza un texto de intereses excesivamente largo', async () => {
    const errors = await validateUpdate({ intereses: 'X'.repeat(256) });
    expect(errors.some((error) => error.property === 'intereses')).toBe(true);
  });

  it('rechaza user_id negativo en el PATCH', async () => {
    const errors = await validateUpdate({ user_id: -7 });
    expect(errors.some((error) => error.property === 'user_id')).toBe(true);
  });

  it('rechaza habilidades del tipo incorrecto', async () => {
    const errors = await validateUpdate({ habilidades: 99 });
    expect(errors.some((error) => error.property === 'habilidades')).toBe(true);
  });
});
