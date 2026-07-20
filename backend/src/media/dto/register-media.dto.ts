import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class RegisterMediaDto {
  @ApiProperty({ example: 'uploads/product-123.jpg', description: 'Storage key/path' })
  @IsString()
  storageKey!: string;

  @ApiProperty({ example: 'https://cdn.example.com/product-123.jpg', description: 'Publicly accessible URL' })
  @IsString()
  publicUrl!: string;

  @ApiProperty({ example: 'image/jpeg', description: 'MIME type' })
  @IsString()
  mimeType!: string;

  @ApiProperty({ example: 245000, description: 'File size in bytes' })
  @IsInt()
  @Min(1)
  fileSizeBytes!: number;

  @ApiPropertyOptional({ example: 800, description: 'Image width in pixels' })
  @IsOptional()
  @IsInt()
  @Min(1)
  widthPx?: number;

  @ApiPropertyOptional({ example: 600, description: 'Image height in pixels' })
  @IsOptional()
  @IsInt()
  @Min(1)
  heightPx?: number;
}
