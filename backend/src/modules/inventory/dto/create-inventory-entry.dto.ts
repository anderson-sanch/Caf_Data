import { IsInt, IsString, IsUUID, Length, Min } from 'class-validator';

export class CreateInventoryEntryDto {
  @IsUUID()
  productId!: string;

  @IsInt()
  @Min(1)
  quantity!: number;

  @IsString()
  @Length(3, 250)
  reason!: string;
}
