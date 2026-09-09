import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export enum InventoryMovementType {
  IN = 'IN',
  OUT = 'OUT',
  ADJUSTMENT = 'ADJUSTMENT',
}

export class CreateInventoryMovementDto {
  @IsUUID()
  productId!: string;

  @IsEnum(InventoryMovementType)
  type!: InventoryMovementType;

  @IsInt()
  @Min(1)
  quantity!: number;

  @IsOptional()
  @IsString()
  reason?: string;
}
