import { Controller, Post, Body, Param, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UseGuards, Get, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private userServices: UsersService) {}

  // crear
  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.userServices.create(dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  me(@Req() req) {
    return req.user;
  }

  // ✅ obtener todos
  @Get()
  findAll() {
    return this.userServices.findAll();
  }

  // ✅ buscar por email
  @Get('email/:email')
  findByEmail(@Param('email') email: string) {
    return this.userServices.findByEmail(email);
  }

  // ✅ buscar por id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userServices.findOne(id);
  }

  // ✅ actualizar
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
  ) {
    return this.userServices.update(id, dto);
  }


}
