import { Controller, Post, Body, Patch, Param } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

@Controller('users')
export class UsersController {
  
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    // Si llega a esta línea, los datos ya están validados y son seguros
    return 'Usuario creado';
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return 'Usuario actualizado con ID: ' + id;
  }
}