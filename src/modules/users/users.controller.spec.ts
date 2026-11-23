import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { UsersController } from './users.controller.js';
import { UsersService } from './users.service.js';

describe('UsersController', () => {
  let controller: UsersController;

  const usersServiceMock = {
    findAll: vi.fn(),
    findOne: vi.fn(),
    update: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: usersServiceMock,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('debe estar definido', () => {
    expect(controller).toBeDefined();
  });

  it('debe obtener todos los usuarios', async () => {
    const users = [
      {
        id: '1',
        nombre: 'Usuario Prueba',
        email: 'usuario@example.com',
      },
    ];

    usersServiceMock.findAll.mockResolvedValue(users);

    await expect(controller.findAll()).resolves.toEqual(users);
    expect(usersServiceMock.findAll).toHaveBeenCalledTimes(1);
  });

  it('debe obtener un usuario por id', async () => {
    const user = {
      id: '1',
      nombre: 'Usuario Prueba',
      email: 'usuario@example.com',
    };

    usersServiceMock.findOne.mockResolvedValue(user);

    await expect(controller.findOne(1)).resolves.toEqual(user);
    expect(usersServiceMock.findOne).toHaveBeenCalledWith(1);
  });

  it('debe actualizar un usuario', async () => {
    const dto = {
      nombre: 'Usuario Actualizado',
      email: 'usuario@example.com',
    };

    const updatedUser = {
      id: '1',
      ...dto,
    };

    usersServiceMock.update.mockResolvedValue(updatedUser);

    await expect(controller.update(1, dto)).resolves.toEqual(updatedUser);

    expect(usersServiceMock.update).toHaveBeenCalledWith(1, dto);
  });
});