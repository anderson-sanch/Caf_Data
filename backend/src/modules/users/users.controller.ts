import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('users')
export class UsersController {
  constructor(private userServices: UsersService) {}

  // crear
  @Roles('Administrador')
  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.userServices.create(dto);
  }

  @Get('me')
  me(@Req() req) {
    return req.user;
  }

  // ✅ obtener todos
  @Roles('Administrador')
  @Get()
  findAll() {
    return this.userServices.findAll();
  }

  // ✅ buscar por email
  @Roles('Administrador')
  @Get('email/:email')
  findByEmail(@Param('email') email: string) {
    return this.userServices.findByEmail(email);
  }

  // ✅ buscar por id
  @Roles('Administrador')
  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.userServices.findOne(id);
  }

  // ✅ actualizar
  @Roles('Administrador')
  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateUserDto,
    @Req() request: { user: { id: string } },
  ) {
    return this.userServices.update(id, dto, request.user.id);
  }


}
