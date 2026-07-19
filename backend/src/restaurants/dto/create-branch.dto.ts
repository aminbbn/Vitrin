import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBranchDto {
  @ApiProperty({ example: 'Main Branch' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: '123 Main St, Tehran', required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ example: 'Asia/Tehran', required: false })
  @IsOptional()
  @IsString()
  timezone?: string;

  @ApiProperty({ example: 'IRR', required: false })
  @IsOptional()
  @IsString()
  currencyCode?: string;
}
