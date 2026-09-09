import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService, // 🔥 FALTABA
  ) {}

  async login(dto: LoginDto) {
    const user = await this.userService.findByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isValid = await bcrypt.compare(dto.password, user.password);

    if (!isValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (!user.is_active || user.deleted_at) {
      throw new UnauthorizedException('Usuario inactivo');
    }

    // permisos
    const rolePermissions =
      user.roles?.role_permissions.map((rp) => rp.permissions.name) || [];

    const userPermissions =
      user.user_permissions?.map((up) => up.permissions.name) || [];

    const permissions = [...new Set([...rolePermissions, ...userPermissions])];

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.roles?.name,
      permissions,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.roles?.name ?? null,
        permissions,
      },
    };
  }
}
