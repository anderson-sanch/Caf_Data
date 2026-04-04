import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class InventoryService {
    constructor(private prisma: PrismaService){}

    async getStock(productId: string, tx?: any){
        const db = tx || this.prisma;

        const movements = await db.inventory_movements.groupBy({
            by: ['type'],
            where: {product_id: productId},
            _sum: { quantity: true }
        });

        let stock = 0;

        for(const m of movements){
            if(m.type === 'IN') stock += m._sum.quantity || 0;
            if(m.type === 'OUT') stock -= m._sum.quantity || 0
        }

        return stock;
    }
}
