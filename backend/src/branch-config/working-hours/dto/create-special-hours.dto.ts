import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateSpecialHoursDto {
  @ApiProperty({ example: '2026-01-01', description: 'Date (YYYY-MM-DD)' })
  @IsString()
  localDate!: string;

  @ApiProperty({ example: false, description: 'Whether the branch is closed on this date' })
  @IsBoolean()
  isClosed!: boolean;

  @ApiPropertyOptional({ example: '10:00', description: 'Override open time (null if closed)' })
  @IsOptional()
  @IsString()
  opensAt?: string;

  @ApiPropertyOptional({ example: '18:00', description: 'Override close time (null if closed)' })
  @IsOptional()
  @IsString()
  closesAt?: string;

  @ApiPropertyOptional({ example: 'Holiday', description: 'Human-readable reason' })
  @IsOptional()
  @IsString()
  note?: string;
}
