import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummary() {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const [salesAggregate, ordersToday, products, clients, recentSales] =
      await Promise.all([
        this.prisma.sales.aggregate({
          _sum: { total: true },
          where: {
            created_at: { gte: startOfToday },
            status: { not: 'canceled' },
          },
        }),
        this.prisma.sales.count({
          where: {
            created_at: { gte: startOfToday },
            status: { not: 'canceled' },
          },
        }),
        this.prisma.products.count({ where: { deleted_at: null } }),
        this.prisma.clients.count({ where: { deleted_at: null } }),
        this.prisma.sales.findMany({
          take: 5,
          orderBy: { created_at: 'desc' },
          include: { clients: true },
        }),
      ]);

    return {
      salesToday: Number(salesAggregate._sum.total ?? 0),
      ordersToday,
      products,
      clients,
      recentSales: recentSales.map((sale) => ({
        id: sale.id,
        total: Number(sale.total),
        status: sale.status,
        created_at: sale.created_at,
        client: sale.clients?.name ?? 'Venta sin cliente',
      })),
    };
  }
}
