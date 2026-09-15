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
  email?: string | null;

  @IsOptional()
  @IsString()
  @Length(5, 20)
  phone?: string | null;

  @IsOptional()
  @IsString()
  @Length(5, 50)
  document?: string | null;

  @IsOptional()
  @IsString()
  address?: string | null;

  @IsOptional()
  @IsEnum(DocumentType)
  documentType?: DocumentType | null;
}
