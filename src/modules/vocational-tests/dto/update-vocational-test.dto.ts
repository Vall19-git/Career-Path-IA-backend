import { PartialType } from '@nestjs/mapped-types';
import { CreateVocationalTestDto } from './create-vocational-test.dto.js';

export class UpdateVocationalTestDto extends PartialType(CreateVocationalTestDto) {}
