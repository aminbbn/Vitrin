import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PublicMenuResponseDto {
  @ApiProperty()
  branchId!: string;

  @ApiProperty()
  branchName!: string;

  @ApiProperty()
  restaurantName!: string;

  @ApiProperty({ nullable: true })
  tableNumber!: string | null;

  @ApiProperty()
  timezone!: string;

  @ApiProperty()
  currencyCode!: string;

  @ApiProperty()
  publicationVersion!: number;

  @ApiProperty()
  publishedAt!: Date;

  @ApiProperty()
  menu!: Record<string, unknown>;
}
