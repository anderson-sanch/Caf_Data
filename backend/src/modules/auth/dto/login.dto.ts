import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class LoginDto {
    @IsEmail()
    @IsString()
    @IsNotEmpty({message: 'El email es requerido'})
    email!: string;

    @IsNotEmpty({message: 'La contraseña es requerida'})
    @IsString()
    password!: string;
}