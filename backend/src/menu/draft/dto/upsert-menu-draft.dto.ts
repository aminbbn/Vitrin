import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsOptional } from 'class-validator';

export class UpsertMenuDraftDto {
  @ApiPropertyOptional({ description: 'Menu layout configuration' })
  @IsOptional()
  @IsObject()
  layout?: Record<string, unknown>;

  @ApiPropertyOptional({ description: 'Theme settings' })
  @IsOptional()
  @IsObject()
  theme?: Record<string, unknown>;

  @ApiPropertyOptional({ description: 'Category visibility and ordering' })
  @IsOptional()
  @IsObject()
  categoryConfig?: Record<string, unknown>;

  @ApiPropertyOptional({ description: 'Product visibility and ordering' })
  @IsOptional()
  @IsObject()
  productConfig?: Record<string, unknown>;

  @ApiPropertyOptional({ description: 'Other display settings' })
  @IsOptional()
  @IsObject()
  displaySettings?: Record<string, unknown>;
}
