import { IsBoolean, IsOptional, IsString, IsUUID, Length } from 'class-validator';

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    @Length(2, 100)
    name?:string

    @IsOptional()
    @IsUUID()
    roleId?:string

    @IsOptional()
    @IsBoolean()
    isActive?: boolean
}
