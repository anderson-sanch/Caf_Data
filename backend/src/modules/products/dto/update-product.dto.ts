import { IsNumber, IsOptional, IsString, IsUUID, Length, MaxLength, Min } from 'class-validator'

export class UpdateProductDto {
    @IsOptional()
    @IsString()
    @Length(2, 150)
    name?: string;

    @IsOptional()
    @IsString()
    @MaxLength(1000)
    description?: string;

    @IsOptional()
    @IsUUID()
    categoryId?: string | null;

    @IsOptional()
    @IsNumber()
    @Min(0.01)
    price?: number;

}
