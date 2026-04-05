import { IsNotEmpty, IsString } from "class-validator"

export class CreateRoleDto {
    
    @IsString()
    @IsNotEmpty({message:'El nombre del rol es requerido'})
    name!:string
    
    @IsString()
    @IsNotEmpty({message:'La descripcion del rol es requerida'})
    description!:string
}