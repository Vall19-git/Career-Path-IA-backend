
import { Test } from '@nestjs/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AuthController } from './auth.controller.js';
import { RegistrationService } from './registration.service.js';
import { LoginService } from './login.service.js';

describe('AuthController', () => {
  let controller: AuthController;

  const registrationMock = {
    register: vi.fn(),
  };

  const loginMock = {
    login: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    const module = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: RegistrationService,
          useValue: registrationMock,
        },
        {
          provide: LoginService,
          useValue: loginMock,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('debe estar definido correctamente', () => {
    expect(controller).toBeDefined();
  });

  it('debe delegar el registro al servicio correspondiente', async () => {
    const dto = {
      nombre: 'Usuario Prueba',
      email: 'usuario@example.com',
      password: 'ClaveSegura123',
    };

    const respuesta = {
      message: 'Usuario registrado correctamente.',
      user: {
        id: '1',
        nombre: dto.nombre,
        email: dto.email,
      },
    };

    registrationMock.register.mockResolvedValue(respuesta);

    await expect(controller.register(dto)).resolves.toEqual(respuesta);

    expect(registrationMock.register).toHaveBeenCalledWith(dto);
    expect(registrationMock.register).toHaveBeenCalledTimes(1);
  });

  it('debe delegar el inicio de sesión al servicio correspondiente', async () => {
    const dto = {
      email: 'usuario@example.com',
      password: 'ClaveSegura123',
    };

    const respuesta = {
      access_token: 'jwt-de-prueba',
    };

    loginMock.login.mockResolvedValue(respuesta);

    await expect(controller.login(dto)).resolves.toEqual(respuesta);

    expect(loginMock.login).toHaveBeenCalledWith(dto);
    expect(loginMock.login).toHaveBeenCalledTimes(1);
  });
});

