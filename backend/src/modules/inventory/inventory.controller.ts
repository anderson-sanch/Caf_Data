import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateInventoryMovementDto } from './dto/create-inventory-movement.dto';
import { InventoryService } from './inventory.service';

@Controller('inventory')
@UseGuards(AuthGuard('jwt'))
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get('stock')
  listStock() {
    return this.inventoryService.listStock();
  }

  @Post('movements')
  createMovement(@Body() dto: CreateInventoryMovementDto) {
    return this.inventoryService.createMovement(dto);
  }
}
