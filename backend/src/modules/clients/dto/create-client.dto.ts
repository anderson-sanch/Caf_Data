import { PartialType } from '@nestjs/mapped-types';
import { CreateClientDto } from './update-client.dto';

export class UpdateClientDto extends PartialType(CreateClientDto) {}