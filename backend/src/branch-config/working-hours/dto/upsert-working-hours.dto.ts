import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsBoolean, IsInt, IsOptional, IsString, Max, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class WorkingIntervalDto {
  @ApiProperty({ example: 0, description: 'Weekday (0=Sunday … 6=Saturday)' })
  @IsInt()
  @Min(0)
  @Max(6)
  weekday!: number;

  @ApiProperty({ example: '09:00', description: 'Opening time (HH:MM)' })
  @IsString()
  opensAt!: string;

  @ApiProperty({ example: '22:00', description: 'Closing time (HH:MM)' })
  @IsString()
  closesAt!: string;

  @ApiPropertyOptional({ example: 0, description: 'Sort order for multiple intervals per day' })
  @IsOptional()
  @IsInt()
  @Min(0)
  displayOrder?: number;
}

export class UpsertWorkingHoursDto {
  @ApiProperty({ type: [WorkingIntervalDto], description: 'Complete set of working intervals (replaces all existing)' })
  @IsArray()
  @ArrayMinSize(0)
  @ValidateNested({ each: true })
  @Type(() => WorkingIntervalDto)
  intervals!: WorkingIntervalDto[];
}
