import { ConflictException } from '@nestjs/common';

import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { PasswordUtil } from './password.util.js';
import { RegistrationService } from './registration.service.js';

describe('RegistrationService', () => {
  const prismaMock = {
    users: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  };

  const datos = {
    nombre: 'Tatiana Herrera',
    email: 'tatiana@example.com',
    password: 'ClaveSegura123',
  };

  let service: RegistrationService;

  beforeEach(() => {
    vi.restoreAllMocks();

    prismaMock.users.findUnique.mockReset();
    prismaMock.users.create.mockReset();

    prismaMock.users.findUnique.mockResolvedValue(null);

    prismaMock.users.create.mockResolvedValue({
      id: 1n,
      nombre: datos.nombre,
      email: datos.email,
    });

    vi.spyOn(PasswordUtil, 'hash')
      .mockResolvedValue('hash_seguro');

    service = new RegistrationService(
      prismaMock as unknown as
        ConstructorParameters<typeof RegistrationService>[0],
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('registra correctamente un usuario', async () => {
    const resultado = await service.register(datos);

    expect(resultado.user.id).toBe('1');

    expect(resultado.message).toBe(
      'Usuario registrado correctamente.',
    );
  });

  it('rechaza correos duplicados', async () => {
    prismaMock.users.findUnique.mockResolvedValue({
      id: 1n,
    });

    await expect(
      service.register(datos),
    ).rejects.toBeInstanceOf(ConflictException);

    expect(prismaMock.users.create).not.toHaveBeenCalled();
  });

  it('guarda el hash y no la contraseña original', async () => {
    await service.register(datos);

    expect(prismaMock.users.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          passwordHash: 'hash_seguro',
        }),
      }),
    );
  });

  it('no devuelve información sensible', async () => {
    const resultado = await service.register(datos);

    expect(resultado.user).not.toHaveProperty('password');
    expect(resultado.user).not.toHaveProperty('passwordHash');
  });

  it('normaliza el correo electrónico', async () => {
    await service.register({
      ...datos,
      email: '  TATIANA@EXAMPLE.COM  ',
    });

    expect(prismaMock.users.findUnique).toHaveBeenCalledWith({
      where: {
        email: 'tatiana@example.com',
      },
      select: {
        id: true,
      },
    });
  });

  it('permite serializar BigInt como JSON', async () => {
    const resultado = await service.register(datos);

    expect(() => JSON.stringify(resultado)).not.toThrow();
  });
});
