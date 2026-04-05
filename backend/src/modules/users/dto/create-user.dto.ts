import { IsArray, IsEmail, IsOptional, IsString, IsUUID, MinLength } from "class-validator";

export class CreateUserDto {
    @IsString()
    name!:string
    
    @IsEmail()
    email!:string

    @IsString()
    @MinLength(5)
    password!:string

    @IsUUID()
    roleId!: string

    @IsOptional()
    @IsArray()
    permissionIds?: string[]
}