import { ApiProperty } from '@nestjs/swagger';

export class BranchProductResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  branchId!: string;

  @ApiProperty()
  productId!: string;

  @ApiProperty()
  branchPrice!: number;

  @ApiProperty({ nullable: true })
  branchDiscountPrice!: number | null;

  @ApiProperty()
  availability!: string;

  @ApiProperty()
  isVisible!: boolean;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
