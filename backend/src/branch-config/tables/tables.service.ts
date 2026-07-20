import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateTableDto } from './dto/create-table.dto.js';
import { UpdateTableDto } from './dto/update-table.dto.js';
import { TableResponseDto } from './dto/table-response.dto.js';

@Injectable()
export class TablesService {
  constructor(private readonly prisma: PrismaService) {}

  async list(restaurantId: string, branchId: string): Promise<TableResponseDto[]> {
    await this.assertValidBranch(restaurantId, branchId);

    const tables = await this.prisma.branchTable.findMany({
      where: { branchId },
      orderBy: { createdAt: 'asc' },
    });

    return tables.map((t) => this.toResponse(t));
  }

  async create(
    restaurantId: string,
    branchId: string,
    dto: CreateTableDto,
  ): Promise<TableResponseDto> {
    await this.assertValidBranch(restaurantId, branchId);

    const table = await this.prisma.branchTable.create({
      data: {
        branchId,
        tableNumber: dto.tableNumber,
        capacity: dto.capacity ?? null,
      },
    });

    return this.toResponse(table);
  }

  async update(
    restaurantId: string,
    branchId: string,
    tableId: string,
    dto: UpdateTableDto,
  ): Promise<TableResponseDto> {
    await this.assertValidBranch(restaurantId, branchId);
    await this.assertValidTable(restaurantId, branchId, tableId);

    const table = await this.prisma.branchTable.update({
      where: { id: tableId },
      data: {
        ...(dto.tableNumber !== undefined && { tableNumber: dto.tableNumber }),
        ...(dto.capacity !== undefined && { capacity: dto.capacity }),
        ...(dto.status !== undefined && {
          status: dto.status as 'ACTIVE' | 'INACTIVE',
        }),
      },
    });

    return this.toResponse(table);
  }

  async remove(
    restaurantId: string,
    branchId: string,
    tableId: string,
  ): Promise<void> {
    await this.assertValidBranch(restaurantId, branchId);
    await this.assertValidTable(restaurantId, branchId, tableId);

    await this.prisma.branchTable.delete({ where: { id: tableId } });
  }

  private async assertValidBranch(
    restaurantId: string,
    branchId: string,
  ): Promise<void> {
    const branch = await this.prisma.branch.findUnique({
      where: { id: branchId },
      select: { id: true, restaurantId: true, status: true },
    });

    if (!branch || branch.restaurantId !== restaurantId) {
      throw new NotFoundException();
    }

    if (branch.status !== 'ACTIVE') {
      throw new BadRequestException('Branch is not active');
    }
  }

  private async assertValidTable(
    restaurantId: string,
    branchId: string,
    tableId: string,
  ): Promise<void> {
    const table = await this.prisma.branchTable.findUnique({
      where: { id: tableId },
      select: { id: true, branchId: true },
    });

    if (!table || table.branchId !== branchId) {
      throw new NotFoundException();
    }
  }

  private toResponse(t: {
    id: string;
    branchId: string;
    tableNumber: string;
    capacity: number | null;
    status: string;
    createdAt: Date;
    updatedAt: Date;
  }): TableResponseDto {
    return {
      id: t.id,
      branchId: t.branchId,
      tableNumber: t.tableNumber,
      capacity: t.capacity,
      status: t.status,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
    };
  }
}
