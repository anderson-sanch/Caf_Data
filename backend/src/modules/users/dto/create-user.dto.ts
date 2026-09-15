import { IsEmail, IsString, IsUUID, Length, MinLength } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @Length(2, 100)
    name!:string
    
    @IsEmail()
    email!:string

    @IsString()
    @MinLength(5)
    password!:string

    @IsUUID()
    roleId!: string
}
