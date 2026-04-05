import { Body, Controller, Post, Get } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/CreateRole.dto';


@Controller('roles')
export class RolesController {
    constructor(private rolesService: RolesService){}
    // creacion
    @Post()
    create(@Body() dto:CreateRoleDto){
        return this.rolesService.create(dto);
    }

    @Get()
    findAll(){
        return this.rolesService.findAll();
    }
}
