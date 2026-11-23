
import { Body, Controller, Post } from '@nestjs/common';

import { RegistrationService } from './registration.service.js';
import { LoginService } from './login.service.js';
import { RegisterAuthDto } from './dto/register-auth.dto.js';
import { LoginAuthDto } from './dto/login-auth.dto.js';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registrationService: RegistrationService,
    private readonly loginService: LoginService,
  ) {}

  @Post('register')
  register(@Body() dto: RegisterAuthDto) {
    return this.registrationService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginAuthDto) {
    return this.loginService.login(dto);
  }
}
