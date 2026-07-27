import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BranchCatalogProductResponseDto {
  @ApiProperty()
  productId!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  displayName!: string;

  @ApiProperty({ nullable: true })
  description!: string | null;

  @ApiProperty()
  categoryId!: string;

  @ApiProperty()
  categoryName!: string;

  @ApiProperty()
  isActive!: boolean;

  @ApiProperty()
  productCreatedAt!: Date;

  @ApiPropertyOptional({ nullable: true })
  branchPrice!: number | null;

  @ApiPropertyOptional({ nullable: true })
  branchDiscountPrice!: number | null;

  @ApiPropertyOptional({ nullable: true, enum: ['AVAILABLE', 'UNAVAILABLE'] })
  availability!: string | null;

  @ApiPropertyOptional({ nullable: true })
  isVisible!: boolean | null;

  @ApiProperty()
  isConfigured!: boolean;
}
