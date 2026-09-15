import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { InventoryService } from '../inventory/inventory.service';

type TodaySalesAggregate = {
  salesTodayCount: number;
  salesTodayTotal: string;
};

@Injectable()
export class DashboardService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly inventoryService: InventoryService,
  ) {}

  async getSummary() {
    const [clientsCount, inventory, todayRows, recentSales] = await Promise.all([
      this.prisma.clients.count({ where: { deleted_at: null } }),
      this.inventoryService.findAll(),
      this.prisma.$queryRaw<TodaySalesAggregate[]>(Prisma.sql`
        SELECT
          COUNT(*)::int AS "salesTodayCount",
          COALESCE(SUM(total), 0)::text AS "salesTodayTotal"
        FROM sales
        WHERE status IS DISTINCT FROM 'canceled'::sale_status
          AND created_at >= (
            date_trunc('day', CURRENT_TIMESTAMP AT TIME ZONE 'America/Bogota')
            AT TIME ZONE 'America/Bogota'
          ) AT TIME ZONE 'UTC'
          AND created_at < (
            (date_trunc('day', CURRENT_TIMESTAMP AT TIME ZONE 'America/Bogota') + interval '1 day')
            AT TIME ZONE 'America/Bogota'
          ) AT TIME ZONE 'UTC'
      `),
      this.prisma.sales.findMany({
        take: 5,
        orderBy: { created_at: 'desc' },
        include: {
          clients: { select: { id: true, name: true } },
        },
      }),
    ]);

    const today = todayRows[0] ?? {
      salesTodayCount: 0,
      salesTodayTotal: '0',
    };
    const outOfStockProducts = inventory
      .filter((product) => product.stock <= 0)
      .map((product) => ({
        id: product.productId,
        name: product.name,
        stock: product.stock,
      }));

    return {
      clientsCount,
      productsCount: inventory.length,
      salesTodayCount: today.salesTodayCount,
      salesTodayTotal: Number(today.salesTodayTotal),
      outOfStockCount: outOfStockProducts.length,
      outOfStockProducts,
      recentSales: recentSales.map((sale) => ({
        id: sale.id,
        client: sale.clients,
        total: Number(sale.total.toString()),
        status: sale.status,
        createdAt: sale.created_at,
      })),
    };
  }
}
