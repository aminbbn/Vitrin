import { ApiProperty } from '@nestjs/swagger';

export class WorkingIntervalResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  branchId!: string;

  @ApiProperty()
  weekday!: number;

  @ApiProperty()
  opensAt!: string;

  @ApiProperty()
  closesAt!: string;

  @ApiProperty()
  displayOrder!: number;
}
