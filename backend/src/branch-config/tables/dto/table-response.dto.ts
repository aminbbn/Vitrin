import { ApiProperty } from '@nestjs/swagger';

export class TableResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  branchId!: string;

  @ApiProperty()
  tableNumber!: string;

  @ApiProperty({ nullable: true })
  capacity!: number | null;

  @ApiProperty()
  status!: string;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
