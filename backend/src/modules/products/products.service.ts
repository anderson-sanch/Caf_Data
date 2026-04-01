import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
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

    async createCategory(dto: CreateCategoryDto) {
        return this.prisma.categories.create({
            data: {
                name: dto.name
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
            },
            include: {
                categories: true,
                product_prices: true,
            },
        });
    }

    async findOne(id: string) {
        return this.prisma.products.findUnique({
            where: { id },
            include: {
                categories: true,
                product_prices: true
            }
        });
    }

    async update(id: string, dto: UpdateProductDto) {
        const data: any = {};

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
                deleted_at: new Date()
            }
        });
    }
}
