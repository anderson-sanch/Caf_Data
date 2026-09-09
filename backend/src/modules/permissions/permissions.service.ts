import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreatePermissionDto } from './dto/create-permission.dto';

@Injectable()
export class PermissionsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.permissions.findMany({ orderBy: { name: 'asc' } });
  }

  async create(dto: CreatePermissionDto) {
    const name = dto.name.trim().toLowerCase();
    const existing = await this.prisma.permissions.findUnique({
      where: { name },
    });
    if (existing) {
      throw new BadRequestException('El permiso ya existe');
    }
    return this.prisma.permissions.create({
      data: { name, description: dto.description?.trim() },
    });
  }
}
