import { ApiProperty } from '@nestjs/swagger';

export class QrTokenResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  tableId!: string;

  @ApiProperty()
  token!: string;

  @ApiProperty()
  status!: string;

  @ApiProperty({ nullable: true })
  revokedAt!: Date | null;

  @ApiProperty()
  createdAt!: Date;
}
