import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    return await this.prisma.users.findUnique({
      where: {
        email: email,
      },
      include: {
        roles: {
          include: {
            role_permissions: {
              include: {
                permissions: true,
              },
            },
          },
        },
        user_permissions: {
          include: {
            permissions: true,
          },
        },
      },
    });
  }

  async create(dto: CreateUserDto) {
    // 🔹 validar email único
    const existing = await this.prisma.users.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      throw new BadRequestException('El email ya existe');
    }

    // 🔹 hash password
    const hashed = await bcrypt.hash(dto.password, 10);

    // 🔹 crear usuario (SOLO rol)
    const user = await this.prisma.users.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hashed,
        role_id: dto.roleId,
        is_active: true,
      },
    });

    // 🔥 overrides (si vienen en el DTO)
    if (dto.permissionIds && dto.permissionIds.length > 0) {
      await this.prisma.user_permissions.createMany({
        data: dto.permissionIds.map((permissionId) => ({
          user_id: user.id,
          permission_id: permissionId,
        })),
        skipDuplicates: true,
      });
    }

    return user;
  }

  async findOne(id: string) {
    const user = await this.prisma.users.findUnique({
      where: { id },
      include: {
        roles: {
          include: {
            role_permissions: {
              include: {
                permissions: true,
              },
            },
          },
        },
        user_permissions: {
          include: {
            permissions: true,
          },
        },
      },
    });

    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }

    return user;
  }

  async update(id: string, dto: UpdateUserDto) {
    await this.findOne(id); // valida existencia

    // 🔹 actualizar datos básicos
    const user = await this.prisma.users.update({
      where: { id },
      data: {
        name: dto.name,
        role_id: dto.roleId,
        updated_at: new Date(),
      },
    });

    // 🔥 lógica de overrides
    if (dto.permissionsIds) {
      // 🧹 eliminar overrides actuales
      await this.prisma.user_permissions.deleteMany({
        where: { user_id: id },
      });

      // ➕ crear nuevos overrides
      if (dto.permissionsIds.length > 0) {
        await this.prisma.user_permissions.createMany({
          data: dto.permissionsIds.map((permissionId) => ({
            user_id: id,
            permission_id: permissionId,
          })),
        });
      }
    }

    return user;
  }

  async findAll() {
    return this.prisma.users.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }
}
