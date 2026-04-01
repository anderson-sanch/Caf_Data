import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateClientDto } from './dto/update-client.dto';
import { iif } from 'rxjs';
import { UpdateClientDto } from './dto/create-client.dto';

@Injectable()
export class ClientsService {
    constructor(private prisma: PrismaService){}

    // crear
    async create(dto: CreateClientDto){
        return this.prisma.clients.create({
            data: dto,
        });
    }

    // Tomar todos
    async findAll() {
        return this.prisma.clients.findMany({
            where: {
                deleted_at: null
            },
            orderBy: {
                created_at: 'desc'
            }
        });
    }

    // tomar uno
    async findOne(id: string){
        const client = await this.prisma.clients.findUnique({
            where: {id},
        });

        if(!client || client.deleted_at){
            throw new NotFoundException('Cliente no encontrado');
        }
        return client
    }

    // actualizar
    async update(id: string, dto: UpdateClientDto){
        await this.findOne(id) // valida existencia

        return this.prisma.clients.update({
            where: { id },
            data: {
                ...dto,
                updated_at: new Date()
            }

        });
    }

    // soft delete
    async remove(id: string){
        await this.findOne(id);

        return this.prisma.clients.update({
            where: { id },
            data: {
                deleted_at: new Date()
            }
        });
    }
}
