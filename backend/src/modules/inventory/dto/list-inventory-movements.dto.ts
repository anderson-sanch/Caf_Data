import { IsOptional, IsUUID } from 'class-validator';

export class ListInventoryMovementsDto {
  @IsOptional()
  @IsUUID()
  productId?: string;
}
