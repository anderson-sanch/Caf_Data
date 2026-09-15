import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post, Req } from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/Create-sale.dto';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  create(@Body() dto: CreateSaleDto, @Req() request: { user: { id: string } }) {
    return this.salesService.create(dto, request.user.id);
  }

  @Get()
  findAll() {
    return this.salesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id:string){
    return this.salesService.findOne(id);
  }

  // cancelar venta
  @Patch(':id/cancel')
  cancel(
    @Param('id', new ParseUUIDPipe()) id:string,
    @Req() request: { user: { id: string } },
  ){
    return this.salesService.cancel(id, request.user.id)
  }
}
