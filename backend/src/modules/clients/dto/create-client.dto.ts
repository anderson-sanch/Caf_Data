import { IsEmail, IsEnum, IsOptional, IsString, Length } from 'class-validator';

export const DocumentType = {
  CC: 'CC',
  CE: 'CE',
  NIT: 'NIT',
  PASSPORT: 'PASSPORT',
} as const;

export type DocumentType = (typeof DocumentType)[keyof typeof DocumentType];

export class CreateClientDto {
  @IsString()
  @Length(2, 100)
  name!: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @Length(5, 20)
  phone?: string;

  @IsOptional()
  @IsString()
  @Length(5, 50)
  document?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsEnum(DocumentType)
  documentType?: DocumentType;
}
