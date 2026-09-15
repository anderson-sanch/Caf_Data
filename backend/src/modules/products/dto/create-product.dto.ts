import { IsNumber, IsOptional, IsString, IsUUID, Length, MaxLength, Min } from 'class-validator'

export class CreateProductDto {
    @IsString()
    @Length(2, 150)
    name!:string

    @IsOptional()
    @IsString()
    @MaxLength(1000)
    description?:string

    @IsOptional()
    @IsUUID()
    categoryId?:string

    @IsNumber()
    @Min(0.01)
    price!:number
}
