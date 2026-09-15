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
        const data = this.normalizeClientData(rest);

        this.validateDocumentPair(data.document, documentType);

        if(data.document && documentType){
            const existingClient = await this.prisma.clients.findFirst({
                where:{
                    document: data.document,
                    document_type: documentType,
                },
            });

            if(existingClient){
                throw new BadRequestException('El documento ya esta registrado para otro cliente')
            }
        }

        return this.prisma.clients.create({
            data: {
                ...data,
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
        const currentClient = await this.findOne(id);

        const { documentType, ...rest } = dto;
        const data = this.normalizeClientData(rest);
        const finalDocument = Object.prototype.hasOwnProperty.call(data, 'document')
            ? data.document
            : currentClient.document;
        const finalDocumentType =
            documentType !== undefined ? documentType : currentClient.document_type;

        this.validateDocumentPair(finalDocument, finalDocumentType);

        if(finalDocument && finalDocumentType){
            const existingClient = await this.prisma.clients.findFirst({
                where: {
                    document: finalDocument,
                    document_type: finalDocumentType,
                }
            })

            if(existingClient && existingClient.id !== id){
                throw new BadRequestException('El documento ya esta registrado para otro cliente')
            }
        }

        return this.prisma.clients.update({
            where: { id },
            data: {
                ...data,
                ...(documentType !== undefined ? { document_type: documentType } : {}),
                updated_at: new Date()
            }

        });
    }

    // soft delete
    async remove(id: string){
        await this.findOne(id);

        const client = await this.prisma.clients.update({
            where: { id },
            data: {
                deleted_at: new Date()
            }
        });

        return { id: client.id, message: 'Cliente eliminado correctamente' };
    }

    private validateDocumentPair(
        document?: string | null,
        documentType?: string | null,
    ) {
        if (Boolean(document) !== Boolean(documentType)) {
            throw new BadRequestException(
                'El tipo y el número de documento deben enviarse juntos',
            );
        }
    }

    private normalizeClientData<T extends Record<string, unknown>>(data: T): T {
        return Object.fromEntries(
            Object.entries(data).map(([key, value]) => [
                key,
                typeof value === 'string' ? value.trim() : value,
            ]),
        ) as T;
    }
}
