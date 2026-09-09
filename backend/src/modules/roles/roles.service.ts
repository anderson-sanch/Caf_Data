import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateRoleDto } from './dto/CreateRole.dto';

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateRoleDto) {
    const nameCapitalized =
      dto.name.charAt(0).toLocaleUpperCase() +
      dto.name.slice(1).toLocaleLowerCase();

    const roles = await this.prisma.roles.findUnique({
      where: {
        name: nameCapitalized,
      },
    });

    if (roles) {
      throw new BadRequestException('El rol ya existe');
    }

    return this.prisma.roles.create({
      data: {
        name: nameCapitalized,
        description: dto.description,
      },
    });
  }

  async findAll() {
    return this.prisma.roles.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }

  async addPermissions(roleId: string, permissionIds: string[]) {
    const result = await this.prisma.role_permissions.createMany({
      data: permissionIds.map((permissionId) => ({
        role_id: roleId,
        permission_id: permissionId,
      })),
      skipDuplicates: true,
    });

    if (result.count === 0) {
      throw new BadRequestException(
        'No se pudieron agregar los permisos al rol',
      );
    }

    return {
      message: 'Permisos agregados al rol exitosamente',
    };
  }
}
