import { PrismaModule } from './database/prisma.module';
import { Module } from '@nestjs/common';
import { ProductsModule } from './modules/products/products.module';
import { ClientsModule } from './modules/clients/clients.module';
import { SalesModule } from './modules/sales/sales.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';
import { PermissionsModule } from './modules/permissions/permissions.module';

@Module({
  imports: [
        PrismaModule,
        ProductsModule,
        ClientsModule,
        SalesModule,
        InventoryModule,
        AuthModule,
        UsersModule,
        RolesModule,
        PermissionsModule
  ]
})
export class AppModule {}
