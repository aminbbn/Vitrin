import { ApiProperty } from '@nestjs/swagger';

export class SpecialHoursResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  branchId!: string;

  @ApiProperty()
  localDate!: Date;

  @ApiProperty()
  isClosed!: boolean;

  @ApiProperty({ nullable: true })
  opensAt!: string | null;

  @ApiProperty({ nullable: true })
  closesAt!: string | null;

  @ApiProperty({ nullable: true })
  note!: string | null;
}
