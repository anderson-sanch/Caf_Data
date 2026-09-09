import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  async getStock(productId: string, tx?: Prisma.TransactionClient) {
    const db = tx || this.prisma;

    const movements = await db.inventory_movements.groupBy({
      by: ['type'],
      where: { product_id: productId },
      _sum: { quantity: true },
    });

    let stock = 0;

    for (const m of movements) {
      if (m.type === 'IN') stock += m._sum.quantity || 0;
      if (m.type === 'OUT') stock -= m._sum.quantity || 0;
    }

    return stock;
  }

  async listStock() {
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
      orderBy: { name: 'asc' },
    });

    return Promise.all(
      products.map(async (product) => ({
        ...product,
        stock: await this.getStock(product.id),
      })),
    );
  }

  async createMovement(dto: {
    productId: string;
    type: 'IN' | 'OUT' | 'ADJUSTMENT';
    quantity: number;
    reason?: string;
  }) {
    const product = await this.prisma.products.findFirst({
      where: { id: dto.productId, deleted_at: null },
    });

    if (!product) {
      throw new BadRequestException('Producto no encontrado');
    }

    if (
      dto.type === 'OUT' &&
      (await this.getStock(dto.productId)) < dto.quantity
    ) {
      throw new BadRequestException('Stock insuficiente');
    }

    return this.prisma.inventory_movements.create({
      data: {
        product_id: dto.productId,
        type: dto.type,
        quantity: dto.quantity,
        reason: dto.reason,
      },
    });
  }
}
