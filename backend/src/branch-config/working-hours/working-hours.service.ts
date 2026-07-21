import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { UpsertWorkingHoursDto, WorkingIntervalDto } from './dto/upsert-working-hours.dto.js';
import { CreateSpecialHoursDto } from './dto/create-special-hours.dto.js';
import { WorkingIntervalResponseDto } from './dto/working-hours-response.dto.js';
import { SpecialHoursResponseDto } from './dto/special-hours-response.dto.js';

@Injectable()
export class WorkingHoursService {
  constructor(private readonly prisma: PrismaService) {}

  async listWorkingHours(
    restaurantId: string,
    branchId: string,
  ): Promise<WorkingIntervalResponseDto[]> {
    await this.assertValidBranch(restaurantId, branchId);

    const intervals = await this.prisma.branchWorkingInterval.findMany({
      where: { branchId },
      orderBy: [{ weekday: 'asc' }, { displayOrder: 'asc' }],
    });

    return intervals.map((i) => this.toWorkingIntervalResponse(i));
  }

  async upsertWorkingHours(
    restaurantId: string,
    branchId: string,
    dto: UpsertWorkingHoursDto,
  ): Promise<WorkingIntervalResponseDto[]> {
    await this.assertValidBranch(restaurantId, branchId);

    // Validate intervals
    for (const interval of dto.intervals) {
      if (!this.isValidTime(interval.opensAt) || !this.isValidTime(interval.closesAt)) {
        throw new BadRequestException(
          `Invalid time format for weekday ${interval.weekday}. Use HH:MM (24h).`,
        );
      }
    }

    // Delete all existing and insert new in a transaction
    const result = await this.prisma.$transaction(async (tx: any) => {
      await tx.branchWorkingInterval.deleteMany({ where: { branchId } });

      if (dto.intervals.length === 0) {
        return [];
      }

      const created = await Promise.all(
        dto.intervals.map((interval, index) =>
          tx.branchWorkingInterval.create({
            data: {
              branchId,
              weekday: interval.weekday,
              opensAt: interval.opensAt,
              closesAt: interval.closesAt,
              displayOrder: interval.displayOrder ?? index,
            },
          }),
        ),
      );

      return created;
    });

    return result.map((i) => this.toWorkingIntervalResponse(i));
  }

  async listSpecialHours(
    restaurantId: string,
    branchId: string,
  ): Promise<SpecialHoursResponseDto[]> {
    await this.assertValidBranch(restaurantId, branchId);

    const hours = await this.prisma.branchSpecialHours.findMany({
      where: { branchId },
      orderBy: { localDate: 'asc' },
    });

    return hours.map((h) => this.toSpecialHoursResponse(h));
  }

  async upsertSpecialHours(
    restaurantId: string,
    branchId: string,
    dto: CreateSpecialHoursDto,
  ): Promise<SpecialHoursResponseDto> {
    await this.assertValidBranch(restaurantId, branchId);

    const localDate = new Date(dto.localDate + 'T00:00:00.000Z');

    const hours = await this.prisma.branchSpecialHours.upsert({
      where: { branchId_localDate: { branchId, localDate } },
      create: {
        branchId,
        localDate,
        isClosed: dto.isClosed,
        opensAt: dto.opensAt ?? null,
        closesAt: dto.closesAt ?? null,
        note: dto.note ?? null,
      },
      update: {
        isClosed: dto.isClosed,
        opensAt: dto.opensAt ?? null,
        closesAt: dto.closesAt ?? null,
        note: dto.note ?? null,
      },
    });

    return this.toSpecialHoursResponse(hours);
  }

  async removeSpecialHours(
    restaurantId: string,
    branchId: string,
    dateString: string,
  ): Promise<void> {
    await this.assertValidBranch(restaurantId, branchId);

    const localDate = new Date(dateString + 'T00:00:00.000Z');

    const existing = await this.prisma.branchSpecialHours.findUnique({
      where: { branchId_localDate: { branchId, localDate } },
    });

    if (!existing) {
      throw new NotFoundException('Special hours not found for this date');
    }

    await this.prisma.branchSpecialHours.delete({
      where: { branchId_localDate: { branchId, localDate } },
    });
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

  private isValidTime(time: string): boolean {
    return /^([01]\d|2[0-3]):[0-5]\d$/.test(time);
  }

  private toWorkingIntervalResponse(i: {
    id: string;
    branchId: string;
    weekday: number;
    opensAt: string;
    closesAt: string;
    displayOrder: number;
  }): WorkingIntervalResponseDto {
    return {
      id: i.id,
      branchId: i.branchId,
      weekday: i.weekday,
      opensAt: i.opensAt,
      closesAt: i.closesAt,
      displayOrder: i.displayOrder,
    };
  }

  private toSpecialHoursResponse(h: {
    id: string;
    branchId: string;
    localDate: Date;
    isClosed: boolean;
    opensAt: string | null;
    closesAt: string | null;
    note: string | null;
  }): SpecialHoursResponseDto {
    return {
      id: h.id,
      branchId: h.branchId,
      localDate: h.localDate,
      isClosed: h.isClosed,
      opensAt: h.opensAt,
      closesAt: h.closesAt,
      note: h.note,
    };
  }
}
