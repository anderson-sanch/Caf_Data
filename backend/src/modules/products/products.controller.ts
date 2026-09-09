import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('products')
@UseGuards(AuthGuard('jwt'))
export class ProductsController {
  constructor(private readonly producService: ProductsService) {}

  // creacion

  @Post('category')
  createCategory(@Body() dto: CreateCategoryDto) {
    return this.producService.createCategory(dto);
  }
  @Get('category')
  findAllCategories() {
    return this.producService.findAllCategories();
  }

  @Post()
  createProduct(@Body() dto: CreateProductDto) {
    return this.producService.createProduct(dto);
  }

  // consulta

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.producService.findOne(id);
  }

  @Get()
  findAll() {
    return this.producService.findAllProducts();
  }

  //Actualizacion

  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateProductDto,
  ) {
    return this.producService.update(id, dto);
  }

  // borrado

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.producService.remove(id);
  }
}
