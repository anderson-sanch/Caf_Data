import { Body, Controller, Post, Get, Param, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/CreateRole.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('roles')
@UseGuards(AuthGuard('jwt'))
export class RolesController {
  constructor(private rolesService: RolesService) {}
  // creacion
  @Post()
  create(@Body() dto: CreateRoleDto) {
    return this.rolesService.create(dto);
  }

  @Get()
  findAll() {
    return this.rolesService.findAll();
  }

  @Post(':id/permissions')
  addPermission(
    @Param('id') roleId: string,
    @Body('permissionIds') permissionIds: string[],
  ) {
    console.log(permissionIds);

    return this.rolesService.addPermissions(roleId, permissionIds);
  }
}
