import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { movement_type } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

type InventoryDatabase = Pick<
  PrismaService,
  'inventory_movements' | 'products'
>;

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  async getStock(productId: string, transaction?: InventoryDatabase) {
    const database = transaction ?? this.prisma;
    const movements = await database.inventory_movements.groupBy({
      by: ['type'],
      where: {
        product_id: productId,
        type: { in: [movement_type.IN, movement_type.OUT] },
      },
      _sum: { quantity: true },
    });

    return movements.reduce((stock, movement) => {
      const quantity = movement._sum.quantity ?? 0;
      if (movement.type === movement_type.IN) return stock + quantity;
      if (movement.type === movement_type.OUT) return stock - quantity;
      return stock;
    }, 0);
  }

  async findAll() {
    const [products, movements] = await Promise.all([
      this.prisma.products.findMany({
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
      }),
      this.prisma.inventory_movements.groupBy({
        by: ['product_id', 'type'],
        where: { type: { in: [movement_type.IN, movement_type.OUT] } },
        _sum: { quantity: true },
      }),
    ]);

    const stockByProduct = new Map<string, number>();
    for (const movement of movements) {
      const current = stockByProduct.get(movement.product_id) ?? 0;
      const quantity = movement._sum.quantity ?? 0;
      stockByProduct.set(
        movement.product_id,
        movement.type === movement_type.IN
          ? current + quantity
          : current - quantity,
      );
    }

    return products.map((product) => {
      const price = product.product_prices[0]?.price;
      return {
        productId: product.id,
        name: product.name,
        category: product.categories,
        currentPrice: price ? Number(price.toString()) : null,
        stock: stockByProduct.get(product.id) ?? 0,
      };
    });
  }

  async registerMovement(
    productId: string,
    type: 'IN' | 'OUT',
    quantity: number,
    reason: string,
    userId: string,
    transaction?: InventoryDatabase,
    allowDeletedProduct = false,
  ) {
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new BadRequestException(
        'La cantidad debe ser un entero mayor que cero',
      );
    }
    if (type !== 'IN' && type !== 'OUT') {
      throw new BadRequestException('Tipo de movimiento no soportado');
    }

    const database = transaction ?? this.prisma;
    const product = await database.products.findFirst({
      where: {
        id: productId,
        ...(allowDeletedProduct ? {} : { deleted_at: null }),
      },
    });
    if (!product) {
      throw new NotFoundException('Producto no encontrado o eliminado');
    }

    if (type === 'OUT') {
      const stock = await this.getStock(productId, database);
      if (stock < quantity) {
        throw new BadRequestException('Stock insuficiente');
      }
    }

    const movement = await database.inventory_movements.create({
      data: {
        product_id: productId,
        type,
        quantity,
        reason: reason.trim(),
        created_by: userId,
      },
      include: {
        products: { select: { id: true, name: true } },
        users: { select: { id: true, name: true, email: true } },
      },
    });

    return this.toMovementResponse(movement);
  }

  async findMovements(productId?: string) {
    if (productId) {
      const product = await this.prisma.products.findFirst({
        where: { id: productId, deleted_at: null },
      });
      if (!product) {
        throw new NotFoundException('Producto no encontrado o eliminado');
      }
    }

    const movements = await this.prisma.inventory_movements.findMany({
      where: {
        ...(productId ? { product_id: productId } : {}),
        type: { in: [movement_type.IN, movement_type.OUT] },
      },
      include: {
        products: { select: { id: true, name: true } },
        users: { select: { id: true, name: true, email: true } },
      },
      orderBy: { created_at: 'desc' },
    });

    return movements.map((movement) => this.toMovementResponse(movement));
  }

  private toMovementResponse(movement: {
    id: string;
    type: movement_type;
    quantity: number;
    reason: string | null;
    created_at: Date | null;
    products: { id: string; name: string | null };
    users: { id: string; name: string | null; email: string } | null;
  }) {
    return {
      id: movement.id,
      product: movement.products,
      type: movement.type,
      quantity: movement.quantity,
      reason: movement.reason,
      createdAt: movement.created_at,
      responsible: movement.users,
    };
  }
}
