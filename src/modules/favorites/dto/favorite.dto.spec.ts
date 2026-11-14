import { describe, expect, it } from 'vitest';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateFavoriteDto } from './create-favorite.dto.js';
import { UpdateFavoriteDto } from './update-favorite.dto.js';

const valid = { user_id: 1, career_id: 2 };

const validateCreate = (data: Record<string, unknown>) =>
  validate(plainToInstance(CreateFavoriteDto, data));

const validateUpdate = (data: Record<string, unknown>) =>
  validate(plainToInstance(UpdateFavoriteDto, data));

describe('CreateFavoriteDto', () => {
  it('acepta los IDs correctos de usuario y carrera', async () => {
    expect(await validateCreate(valid)).toHaveLength(0);
  });

  it('acepta el entero positivo seguro más grande', async () => {
    expect(await validateCreate({
      user_id: Number.MAX_SAFE_INTEGER,
      career_id: Number.MAX_SAFE_INTEGER,
    })).toHaveLength(0);
  });

  it.each([0, -1, -5, 2.7, '2', null, true])(
    'rechaza un user_id inválido %j',
    async (user_id) => {
      const errors = await validateCreate({ ...valid, user_id });
      expect(errors.some((error) => error.property === 'user_id')).toBe(true);
    },
  );

  it.each([0, -1, -5, 2.7, '2', null, false])(
    'rechaza un career_id inválido %j',
    async (career_id) => {
      const errors = await validateCreate({ ...valid, career_id });
      expect(errors.some((error) => error.property === 'career_id')).toBe(true);
    },
  );

  it('rechaza user_id mayor que el entero seguro', async () => {
    const errors = await validateCreate({ ...valid, user_id: Number.MAX_SAFE_INTEGER + 1 });
    expect(errors.some((error) => error.property === 'user_id')).toBe(true);
  });

  it('rechaza career_id mayor que el entero seguro', async () => {
    const errors = await validateCreate({ ...valid, career_id: Number.MAX_SAFE_INTEGER + 1 });
    expect(errors.some((error) => error.property === 'career_id')).toBe(true);
  });

  it('exige ambos valores al crear', async () => {
    const errors = await validateCreate({});
    expect(errors.map((error) => error.property).sort()).toEqual([
      'career_id', 'user_id',
    ]);
  });

  it('señala ambos errores si los dos campos son inválidos', async () => {
    const errors = await validateCreate({ user_id: -2, career_id: 'test' });
    expect(errors.map((error) => error.property).sort()).toEqual([
      'career_id', 'user_id',
    ]);
  });
});

describe('UpdateFavoriteDto', () => {
  it('admite PATCH vacío', async () => {
    expect(await validateUpdate({})).toHaveLength(0);
  });

  it('admite actualizar sólo user_id', async () => {
    expect(await validateUpdate({ user_id: 5 })).toHaveLength(0);
  });

  it('admite actualizar sólo career_id', async () => {
    expect(await validateUpdate({ career_id: 7 })).toHaveLength(0);
  });

  it('admite actualizar ambos IDs juntos', async () => {
    expect(await validateUpdate({ user_id: 5, career_id: 7 })).toHaveLength(0);
  });

  it('rechaza user_id no numérico', async () => {
    const errors = await validateUpdate({ user_id: 'abc' });
    expect(errors.some((error) => error.property === 'user_id')).toBe(true);
  });

  it('rechaza career_id fraccional', async () => {
    const errors = await validateUpdate({ career_id: 2.2 });
    expect(errors.some((error) => error.property === 'career_id')).toBe(true);
  });

  it('rechaza user_id cero', async () => {
    const errors = await validateUpdate({ user_id: 0 });
    expect(errors.some((error) => error.property === 'user_id')).toBe(true);
  });

  it('rechaza career_id mayor al entero seguro', async () => {
    const errors = await validateUpdate({ career_id: Number.MAX_SAFE_INTEGER + 1 });
    expect(errors.some((error) => error.property === 'career_id')).toBe(true);
  });
});
