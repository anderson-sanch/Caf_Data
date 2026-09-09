import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  //   categories

  async createCategory(dto: CreateCategoryDto) {
    const { name } = dto;

    const categoryCapitalized =
      name.charAt(0).toUpperCase() + name.slice(1).toLocaleLowerCase();

    const existingCategory = await this.prisma.categories.findFirst({
      where: {
        name: categoryCapitalized,
      },
    });

    if (existingCategory) {
      throw new BadRequestException('La categoria ya existe');
    }

    return this.prisma.categories.create({
      data: {
        name: categoryCapitalized,
      },
    });
  }

  async findAllCategories() {
    return this.prisma.categories.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }

  //   Products

  async findAllProducts() {
    return this.prisma.products.findMany({
      where: {
        deleted_at: null,
      },
      include: {
        categories: true,
        product_prices: {
          orderBy: {
            valid_from: 'desc',
          },
          take: 1,
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async createProduct(dto: CreateProductDto) {
    return this.prisma.products.create({
      data: {
        name: dto.name,
        description: dto.description,
        category_id: dto.categoryId,

        product_prices: {
          create: {
            price: dto.price,
            valid_from: new Date(),
          },
        },
        ...(dto.initialStock
          ? {
              inventory_movements: {
                create: {
                  type: 'IN',
                  quantity: dto.initialStock,
                  reason: 'Inventario inicial',
                },
              },
            }
          : {}),
      },
      include: {
        categories: true,
        product_prices: true,
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.products.findFirst({
      where: { id, deleted_at: null },
      include: {
        categories: true,
        product_prices: true,
      },
    });
  }

  async update(id: string, dto: UpdateProductDto) {
    const data: Prisma.productsUncheckedUpdateInput = {};

    if (dto.name !== undefined) data.name = dto.name;
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.categoryId !== undefined) data.category_id = dto.categoryId;

    const updatedProduct = await this.prisma.products.update({
      where: { id },
      data,
    });

    if (dto.price !== undefined) {
      const now = new Date();

      await this.prisma.product_prices.updateMany({
        where: {
          product_id: id,
          valid_to: null,
        },
        data: {
          valid_to: now,
        },
      });

      await this.prisma.product_prices.create({
        data: {
          product_id: id,
          price: dto.price,
          valid_from: now,
        },
      });
    }

    return updatedProduct;
  }

  async remove(id: string) {
    return this.prisma.products.update({
      where: { id },
      data: {
        deleted_at: new Date(),
      },
    });
  }
}
