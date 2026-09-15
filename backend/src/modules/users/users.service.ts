import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';

type UserForResponse = {
  id: string;
  name: string | null;
  email: string;
  is_active: boolean | null;
  created_at: Date | null;
  roles: { id: string; name: string } | null;
};

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findForAuthentication(email: string) {
    return this.prisma.users.findUnique({
      where: { email },
      include: {
        roles: {
          include: {
            role_permissions: { include: { permissions: true } },
          },
        },
        user_permissions: { include: { permissions: true } },
      },
    });
  }

  async findActiveSessionUser(id: string) {
    const user = await this.prisma.users.findFirst({
      where: { id, is_active: true, deleted_at: null },
      include: {
        roles: {
          include: {
            role_permissions: { include: { permissions: true } },
          },
        },
        user_permissions: { include: { permissions: true } },
      },
    });
    if (!user) return null;

    const rolePermissions =
      user.roles?.role_permissions.map((item) => item.permissions.name) ?? [];
    const userPermissions = user.user_permissions.map(
      (item) => item.permissions.name,
    );

    return {
      ...this.toUserResponse(user),
      role: user.roles?.name,
      permissions: [...new Set([...rolePermissions, ...userPermissions])],
    };
  }

  toUserResponse(user: UserForResponse) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      isActive: Boolean(user.is_active),
      role: user.roles
        ? { id: user.roles.id, name: user.roles.name }
        : null,
      createdAt: user.created_at,
    };
  }

  async create(dto: CreateUserDto) {
    const normalizedEmail = dto.email.trim().toLowerCase();
    const role = await this.prisma.roles.findUnique({
      where: { id: dto.roleId },
    });
    if (!role) throw new NotFoundException('Rol no encontrado');

    const existing = await this.prisma.users.findUnique({
      where: { email: normalizedEmail },
    });
    if (existing) throw new ConflictException('El email ya existe');

    const password = await bcrypt.hash(dto.password, 10);
    try {
      const user = await this.prisma.users.create({
        data: {
          name: dto.name.trim(),
          email: normalizedEmail,
          password,
          role_id: role.id,
          is_active: true,
        },
        include: { roles: true },
      });
      return this.toUserResponse(user);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('El email ya existe');
      }
      throw error;
    }
  }

  async findByEmail(email: string) {
    const user = await this.prisma.users.findFirst({
      where: { email, deleted_at: null },
      include: { roles: true },
    });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return this.toUserResponse(user);
  }

  async findOne(id: string) {
    const user = await this.prisma.users.findFirst({
      where: { id, deleted_at: null },
      include: { roles: true },
    });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return this.toUserResponse(user);
  }

  async update(id: string, dto: UpdateUserDto, requestingUserId: string) {
    return this.prisma.$transaction(async (transaction) => {
      await transaction.$queryRaw(
        Prisma.sql`SELECT pg_advisory_xact_lock(hashtextextended('cafdata-active-administrator', 0)) IS NULL AS locked`,
      );

      const target = await transaction.users.findFirst({
        where: { id, deleted_at: null },
        include: { roles: true },
      });
      if (!target) throw new NotFoundException('Usuario no encontrado');

      if (id === requestingUserId && dto.isActive === false) {
        throw new ConflictException(
          'No puedes desactivar tu propia cuenta durante esta sesión',
        );
      }

      let nextRole = target.roles;
      if (dto.roleId !== undefined) {
        nextRole = await transaction.roles.findUnique({
          where: { id: dto.roleId },
        });
        if (!nextRole) throw new NotFoundException('Rol no encontrado');
      }

      const removesActiveAdministrator =
        target.roles?.name === 'Administrador' &&
        target.is_active === true &&
        (dto.isActive === false || nextRole?.name !== 'Administrador');

      if (removesActiveAdministrator) {
        const activeAdministrators = await transaction.users.count({
          where: {
            is_active: true,
            deleted_at: null,
            roles: { name: 'Administrador' },
          },
        });
        if (activeAdministrators <= 1) {
          throw new ConflictException(
            'Debe permanecer al menos un Administrador activo',
          );
        }
      }

      const user = await transaction.users.update({
        where: { id },
        data: {
          ...(dto.name !== undefined ? { name: dto.name.trim() } : {}),
          ...(dto.roleId !== undefined ? { role_id: dto.roleId } : {}),
          ...(dto.isActive !== undefined ? { is_active: dto.isActive } : {}),
          updated_at: new Date(),
        },
        include: { roles: true },
      });
      return this.toUserResponse(user);
    });
  }

  async findAll() {
    const users = await this.prisma.users.findMany({
      where: { deleted_at: null },
      orderBy: [{ created_at: 'desc' }, { name: 'asc' }],
      include: { roles: true },
    });
    return users.map((user) => this.toUserResponse(user));
  }
}
