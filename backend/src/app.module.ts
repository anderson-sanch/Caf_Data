import { PrismaModule } from './database/prisma.module';
import { Module } from '@nestjs/common';
import { ProductsModule } from './modules/products/products.module';
import { ClientsModule } from './modules/clients/clients.module';
import { SalesModule } from './modules/sales/sales.module';

@Module({
  imports: [PrismaModule, ProductsModule, ClientsModule, SalesModule],
})
export class AppModule {}
