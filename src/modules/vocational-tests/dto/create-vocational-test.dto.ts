import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateVocationalTestDto {
  @IsString({ message: 'El enunciado debe ser un texto' })
  @IsNotEmpty({ message: 'El enunciado es obligatorio' })
  @MinLength(10, { message: 'El enunciado debe tener al menos 10 caracteres' })
  @MaxLength(255, {
    message: 'El enunciado no puede superar los 255 caracteres',
  })
  enunciado: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  categoria: string;
}
