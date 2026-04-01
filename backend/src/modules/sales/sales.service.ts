import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateSaleDto } from './dto/Create-sale.dto';

@Injectable()
export class SalesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateSaleDto) {
    return await this.prisma.$transaction(async (tx) => {

      let total = 0;

        const itemsProcessed: {
            product_id: string;
            quantity: number;
            price: number;
            subtotal: number
        }[] = [];

      for (const item of dto.items) {

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
}