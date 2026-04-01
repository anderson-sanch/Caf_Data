import { IsEmail, IsOptional, IsString, Length } from "class-validator";

export class CreateClientDto {
    @IsString()
    @Length(2, 100)
    name: string

    @IsOptional()
    @IsEmail()
    email: string

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
}