import {
  Controller,
  Post,
  Body,
  Param,
  Patch,
  UseGuards,
  Get,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { UpdateUserDto } from './dto/update-user.dto';
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user: {
    sub: string;
    email: string;
    role?: string;
    permissions: string[];
  };
}

@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UsersController {
  constructor(private userServices: UsersService) {}

  // crear
  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.userServices.create(dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  me(@Req() req: AuthenticatedRequest) {
    return req.user;
  }

  // ✅ obtener todos
  @Get()
  findAll() {
    return this.userServices.findAll();
  }

  // ✅ buscar por id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userServices.findOne(id);
  }

  // ✅ actualizar
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.userServices.update(id, dto);
  }
}
