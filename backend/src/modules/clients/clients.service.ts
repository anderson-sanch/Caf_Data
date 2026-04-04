import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
    constructor(private prisma: PrismaService){}

    // crear
    async create(dto: CreateClientDto){
        const { documentType, ...rest } = dto;

        if(rest.document){
            const existingClient = await this.prisma.clients.findFirst({
                where:{
                    document: rest.document,
                },
            });

            if(existingClient){
                throw new BadRequestException('El documento ya esta registrado para otro cliente')
            }
        }

        return this.prisma.clients.create({
            data: {
                ...rest,
                document_type: documentType,
            },
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

        const { documentType, ...rest } = dto;

        if(rest.document){
            const existingClient = await this.prisma.clients.findFirst({
                where: {
                    document: rest.document,
                }
            })

            if(existingClient && existingClient.id !== id){
                throw new BadRequestException('El documento ya esta registrado para otro cliente')
            }
        }

        return this.prisma.clients.update({
            where: { id },
            data: {
                ...rest,
                ...(documentType !== undefined ? { document_type: documentType } : {}),
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
