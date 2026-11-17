import { IsNotEmpty, IsString, MaxLength, Matches } from 'class-validator';

export class CreateCareerDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/\S/, { message: 'El nombre no puede estar vacío' })
  @MaxLength(150)
  nombre!: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/\S/, { message: 'La duración no puede estar vacía' })
  @MaxLength(50)
  duracion!: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/\S/, { message: 'La modalidad no puede estar vacía' })
  @MaxLength(50)
  modalidad!: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/\S/, { message: 'La descripción no puede estar vacía' })
  descripcion!: string;
}
