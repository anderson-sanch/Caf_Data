import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async createCategory(dto: CreateCategoryDto) {
    const name = dto.name.trim();
    const existingCategory = await this.prisma.categories.findFirst({
      where: { name: { equals: name, mode: 'insensitive' } },
    });

    if (existingCategory) {
      throw new BadRequestException('La categoría ya existe');
    }

    return this.prisma.categories.create({ data: { name } });
  }

  async findAllCategories() {
    return this.prisma.categories.findMany({ orderBy: { name: 'asc' } });
  }

  async findAllProducts() {
    const products = await this.prisma.products.findMany({
      where: { deleted_at: null },
      include: {
        categories: true,
        product_prices: {
          where: { valid_to: null },
          orderBy: { valid_from: 'desc' },
          take: 1,
        },
      },
      orderBy: { created_at: 'desc' },
    });

    return products.map((product) => this.toProductResponse(product));
  }

  async createProduct(dto: CreateProductDto) {
    if (dto.categoryId) {
      await this.ensureCategoryExists(dto.categoryId);
    }

    const product = await this.prisma.products.create({
      data: {
        name: dto.name.trim(),
        description: dto.description?.trim(),
        category_id: dto.categoryId,
        product_prices: {
          create: { price: dto.price, valid_from: new Date() },
        },
      },
      include: {
        categories: true,
        product_prices: { where: { valid_to: null }, take: 1 },
      },
    });

    return this.toProductResponse(product);
  }

  async findOne(id: string) {
    const product = await this.prisma.products.findFirst({
      where: { id, deleted_at: null },
      include: {
        categories: true,
        product_prices: {
          where: { valid_to: null },
          orderBy: { valid_from: 'desc' },
          take: 1,
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }

    return this.toProductResponse(product);
  }

  async update(id: string, dto: UpdateProductDto) {
    await this.findOne(id);

    if (dto.categoryId) {
      await this.ensureCategoryExists(dto.categoryId);
    }

    await this.prisma.$transaction(async (transaction) => {
      await transaction.products.update({
        where: { id },
        data: {
          ...(dto.name !== undefined ? { name: dto.name.trim() } : {}),
          ...(dto.description !== undefined
            ? { description: dto.description.trim() }
            : {}),
          ...(dto.categoryId !== undefined
            ? { category_id: dto.categoryId }
            : {}),
          updated_at: new Date(),
        },
      });

      if (dto.price !== undefined) {
        const now = new Date();
        await transaction.product_prices.updateMany({
          where: { product_id: id, valid_to: null },
          data: { valid_to: now },
        });
        await transaction.product_prices.create({
          data: {
            product_id: id,
            price: dto.price,
            valid_from: now,
          },
        });
      }
    });

    return this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.products.update({
      where: { id },
      data: { deleted_at: new Date(), updated_at: new Date() },
    });

    return { id, message: 'Producto eliminado correctamente' };
  }

  private async ensureCategoryExists(id: string) {
    const category = await this.prisma.categories.findUnique({ where: { id } });
    if (!category) {
      throw new BadRequestException('La categoría seleccionada no existe');
    }
  }

  private toProductResponse(product: {
    id: string;
    name: string | null;
    description: string | null;
    category_id: string | null;
    categories: { id: string; name: string } | null;
    product_prices: Array<{ price: { toString(): string } }>;
    created_at: Date | null;
    updated_at: Date | null;
  }) {
    const currentPrice = product.product_prices[0]?.price;
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      categoryId: product.category_id,
      category: product.categories,
      currentPrice: currentPrice ? Number(currentPrice.toString()) : null,
      created_at: product.created_at,
      updated_at: product.updated_at,
    };
  }
}
