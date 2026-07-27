import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateTableDto {
  @ApiProperty({ example: '5', description: 'Table display number/label' })
  @IsString()
  tableNumber!: string;

  @ApiPropertyOptional({ example: 4, description: 'Seating capacity' })
  @IsOptional()
  @IsInt()
  @Min(1)
  capacity?: number;
}
