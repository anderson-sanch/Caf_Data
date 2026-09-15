import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { CreateSaleDto } from './dto/Create-sale.dto';
import { InventoryService } from '../inventory/inventory.service';

type SaleWithRelations = {
  id: string;
  total: { toString(): string };
  payment_method: string | null;
  status: string | null;
  created_at: Date | null;
  clients: { id: string; name: string | null; email: string | null } | null;
  users: { id: string; name: string | null; email: string } | null;
  sale_items: Array<{
    id: string;
    product_id: string;
    quantity: number;
    price: { toString(): string } | null;
    subtotal: { toString(): string } | null;
    products: { id: string; name: string | null };
  }>;
};

@Injectable()
export class SalesService {
  constructor(
    private prisma: PrismaService,
    private inventoryService: InventoryService,
  ) {}

  async create(dto: CreateSaleDto, userId: string) {
    const aggregatedItems = new Map<string, number>();
    for (const item of dto.items) {
      aggregatedItems.set(
        item.productId,
        (aggregatedItems.get(item.productId) ?? 0) + item.quantity,
      );
    }
    const productIds = [...aggregatedItems.keys()].sort();

    return this.prisma.$transaction(async (transaction) => {
      const client = await transaction.clients.findFirst({
        where: { id: dto.clientId, deleted_at: null },
      });
      if (!client) {
        throw new NotFoundException('Cliente no encontrado o eliminado');
      }

      await this.lockProducts(transaction, productIds);

      const products = await transaction.products.findMany({
        where: { id: { in: productIds }, deleted_at: null },
        include: {
          product_prices: {
            where: { valid_to: null },
            orderBy: { valid_from: 'desc' },
            take: 1,
          },
        },
      });
      if (products.length !== productIds.length) {
        throw new NotFoundException(
          'Uno o más productos no existen o fueron eliminados',
        );
      }

      const productMap = new Map(products.map((product) => [product.id, product]));
      const processedItems: Array<{
        product_id: string;
        quantity: number;
        price: number;
        subtotal: number;
      }> = [];
      let total = 0;

      for (const productId of productIds) {
        const product = productMap.get(productId);
        const quantity = aggregatedItems.get(productId) ?? 0;
        const priceRecord = product?.product_prices[0];
        if (!product || !priceRecord) {
          throw new BadRequestException(
            `El producto ${product?.name ?? productId} no tiene precio vigente`,
          );
        }

        const stock = await this.inventoryService.getStock(
          productId,
          transaction,
        );
        if (stock < quantity) {
          throw new ConflictException(
            `Stock insuficiente para ${product.name ?? 'el producto'}. Disponible: ${stock}`,
          );
        }

        const price = Number(priceRecord.price);
        const subtotal = Number((price * quantity).toFixed(2));
        total = Number((total + subtotal).toFixed(2));
        processedItems.push({ product_id: productId, quantity, price, subtotal });
      }

      const sale = await transaction.sales.create({
        data: {
          client_id: dto.clientId,
          user_id: userId,
          total,
          payment_method: dto.paymentMethod,
          status: 'paid',
        },
      });

      await transaction.sale_items.createMany({
        data: processedItems.map((item) => ({ sale_id: sale.id, ...item })),
      });
      for (const item of processedItems) {
        await this.inventoryService.registerMovement(
          item.product_id,
          'OUT',
          item.quantity,
          `Venta ${sale.id}`,
          userId,
          transaction,
        );
      }

      return this.findOneInDatabase(transaction, sale.id);
    });
  }

  async findAll() {
    const sales = await this.prisma.sales.findMany({
      include: this.saleRelations,
      orderBy: { created_at: 'desc' },
    });
    return sales.map((sale) => this.toSaleResponse(sale));
  }

  async findOne(id: string) {
    return this.findOneInDatabase(this.prisma, id);
  }

  async cancel(id: string, userId: string) {
    return this.prisma.$transaction(async (transaction) => {
      const lockedSale = await transaction.$queryRaw<Array<{ id: string }>>(
        Prisma.sql`SELECT id FROM sales WHERE id = CAST(${id} AS uuid) FOR UPDATE`,
      );
      if (lockedSale.length === 0) {
        throw new NotFoundException('Venta no encontrada');
      }

      const sale = await transaction.sales.findUnique({
        where: { id },
        include: this.saleRelations,
      });
      if (!sale) {
        throw new NotFoundException('Venta no encontrada');
      }
      if (sale.status === 'canceled') {
        throw new ConflictException('La venta ya está cancelada');
      }

      for (const item of sale.sale_items) {
        await this.inventoryService.registerMovement(
          item.product_id,
          'IN',
          item.quantity,
          `Cancelación venta ${sale.id}`,
          userId,
          transaction,
          true,
        );
      }
      await transaction.sales.update({
        where: { id },
        data: { status: 'canceled' },
      });

      return this.findOneInDatabase(transaction, id);
    });
  }

  private readonly saleRelations = {
    clients: { select: { id: true, name: true, email: true } },
    users: { select: { id: true, name: true, email: true } },
    sale_items: {
      include: { products: { select: { id: true, name: true } } },
      orderBy: { id: 'asc' as const },
    },
  };

  private async findOneInDatabase(
    database: Pick<PrismaService, 'sales'>,
    id: string,
  ) {
    const sale = await database.sales.findUnique({
      where: { id },
      include: this.saleRelations,
    });
    if (!sale) {
      throw new NotFoundException('Venta no encontrada');
    }
    return this.toSaleResponse(sale);
  }

  private async lockProducts(
    transaction: Prisma.TransactionClient,
    productIds: string[],
  ) {
    for (const productId of productIds) {
      await transaction.$queryRaw(
        Prisma.sql`SELECT pg_advisory_xact_lock(hashtextextended(CAST(${productId} AS text), 0)) IS NULL AS locked`,
      );
    }
  }

  private toSaleResponse(sale: SaleWithRelations) {
    return {
      id: sale.id,
      status: sale.status,
      paymentMethod: sale.payment_method,
      total: Number(sale.total.toString()),
      createdAt: sale.created_at,
      client: sale.clients,
      user: sale.users,
      items: sale.sale_items.map((item) => ({
        id: item.id,
        productId: item.product_id,
        productName: item.products.name,
        quantity: item.quantity,
        unitPrice: item.price ? Number(item.price.toString()) : null,
        subtotal: item.subtotal ? Number(item.subtotal.toString()) : null,
      })),
    };
  }
}
