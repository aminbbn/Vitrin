import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpsertBranchProductDto {
  @ApiProperty({ example: 150000, description: 'Branch-specific price (integer)' })
  @IsInt()
  @Min(0)
  branchPrice!: number;

  @ApiPropertyOptional({
    example: 120000,
    description: 'Branch-specific discount price (must be lower than branchPrice)',
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  branchDiscountPrice?: number;

  @ApiPropertyOptional({
    enum: ['AVAILABLE', 'UNAVAILABLE'],
    default: 'AVAILABLE',
  })
  @IsOptional()
  @IsString()
  availability?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isVisible?: boolean;
}
