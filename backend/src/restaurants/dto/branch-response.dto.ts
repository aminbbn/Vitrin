import { ApiProperty } from '@nestjs/swagger';

export class BranchResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  restaurantId!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty({ nullable: true })
  address!: string | null;

  @ApiProperty()
  timezone!: string;

  @ApiProperty()
  currencyCode!: string;

  @ApiProperty()
  status!: string;

  @ApiProperty()
  orderingEnabled!: boolean;

  @ApiProperty()
  createdAt!: Date;
}
