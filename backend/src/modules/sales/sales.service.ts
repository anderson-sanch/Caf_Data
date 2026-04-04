import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateSaleDto } from './dto/Create-sale.dto';
import { InventoryService } from '../inventory/inventory.service';

@Injectable()
export class SalesService {
  constructor(
    private prisma: PrismaService,
    private invenrotyService: InventoryService,
  ) {}

  async create(dto: CreateSaleDto) {
    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('La venta debe tener al menos un item');
    }

    return await this.prisma.$transaction(async (tx) => {
      const client = await tx.clients.findUnique({
        where: { id: dto.clientId },
      });

      if (!client) {
        throw new BadRequestException('Cliente no encontrado');
      }

      let total = 0;

      const itemsProcessed: {
        product_id: string;
        quantity: number;
        price: number;
        subtotal: number;
      }[] = [];

      const productIds = dto.items.map((item) => item.productId);

      const products = await tx.products.findMany({
        where: {
          id: {
            in: productIds,
          },
        },
        select: {
          id: true,
          name: true,
        },
      });

      const productMap = new Map(products.map((p) => [p.id, p]));

      for (const item of dto.items) {
        const product = productMap.get(item.productId);

        if (!product) {
          throw new BadRequestException(
            `Producto con ID ${item.productId} no encontrado`,
          );
        }

        // validamos stock
        const stock = await this.invenrotyService.getStock(item.productId, tx);

        if (stock < item.quantity) {
          throw new BadRequestException(
            `Stock insuficiente para el producto ${product?.name || 'producto'}. Disponible: ${stock}`,
          );
        }

        // 🔹 1. Obtener precio actual
        const priceRecord = await tx.product_prices.findFirst({
          where: {
            product_id: item.productId,
            valid_to: null,
          },
          orderBy: {
            valid_from: 'desc',
          },
        });

        if (!priceRecord) {
          throw new BadRequestException('Producto sin precio');
        }

        const price = Number(priceRecord.price);
        const subtotal = price * item.quantity;

        total += subtotal;

        itemsProcessed.push({
          product_id: item.productId,
          quantity: item.quantity,
          price,
          subtotal,
        });
      }

      // 🔥 2. Crear venta
      const sale = await tx.sales.create({
        data: {
          client_id: dto.clientId,
          total,
          payment_method: dto.paymentMethod,
        },
      });

      // 🔥 3. Crear items + inventario
      for (const item of itemsProcessed) {
        // detalle
        await tx.sale_items.create({
          data: {
            sale_id: sale.id,
            ...item,
          },
        });

        // inventario (salida)
        await tx.inventory_movements.create({
          data: {
            product_id: item.product_id,
            type: 'OUT',
            quantity: item.quantity,
            reason: 'Venta',
          },
        });
      }

      return sale;
    });
  }

  async findAll() {
    return await this.prisma.sales.findMany({
      include: {
        clients: true,
        sale_items: {
          include: {
            products: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async findOne(id: string) {
    console.log(id);

    const sale = await this.prisma.sales.findUnique({
      where: { id },
      include: {
        clients: true,
        sale_items: {
          include: {
            products: true,
          },
        },
      },
    });

    if (!sale) {
      throw new BadRequestException('Venta no encontrada');
    }

    return sale;
  }

  async cancel(id: string) {
    return this.prisma.$transaction(async (tx) => {
      const sale = await tx.sales.findUnique({
        where: { id },
        include: {
          sale_items: true,
        },
      });
      if (!sale) {
        throw new BadRequestException('Venta no encontrada');
      }

      // devolvemos el inventario
      for (const item of sale.sale_items) {
        await tx.inventory_movements.create({
          data: {
            product_id: item.product_id,
            type: 'IN',
            quantity: item.quantity,
            reason: 'Cancelacion de Venta',
          },
        });
      }
      // cambiamos estado de la venta
      return tx.sales.update({
        where: { id },
        data: { status: 'canceled' },
      });
    });
  }
}
