
import { Test } from '@nestjs/testing';
import { describe, it, expect, vi } from 'vitest';

import { AuthController } from './auth.controller.js';
import { RegistrationService } from './registration.service.js';
import { LoginService } from './login.service.js';

describe('AuthController', () => {
  it('debe estar definido correctamente', async () => {
    const module = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: RegistrationService,
          useValue: { register: vi.fn() },
        },
        {
          provide: LoginService,
          useValue: { login: vi.fn() },
        },
      ],
    }).compile();

    const controller = module.get<AuthController>(AuthController);

    expect(controller).toBeDefined();
  });
});

