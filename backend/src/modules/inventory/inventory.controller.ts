import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { CreateInventoryEntryDto } from './dto/create-inventory-entry.dto';
import { ListInventoryMovementsDto } from './dto/list-inventory-movements.dto';
import { InventoryService } from './inventory.service';

type AuthenticatedRequest = {
  user: { id: string };
};

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  findAll() {
    return this.inventoryService.findAll();
  }

  @Get('movements')
  findMovements(@Query() query: ListInventoryMovementsDto) {
    return this.inventoryService.findMovements(query.productId);
  }

  @Post('entries')
  createEntry(
    @Body() dto: CreateInventoryEntryDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.inventoryService.registerMovement(
      dto.productId,
      'IN',
      dto.quantity,
      dto.reason,
      request.user.id,
    );
  }
}
