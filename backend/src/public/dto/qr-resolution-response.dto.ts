import { ApiProperty } from '@nestjs/swagger';
import { PublicMenuResponseDto } from './public-menu-response.dto.js';

export class QrResolutionResponseDto {
  @ApiProperty()
  tableId!: string;

  @ApiProperty()
  tableNumber!: string;

  @ApiProperty()
  branchId!: string;

  @ApiProperty()
  branchName!: string;

  @ApiProperty()
  restaurantName!: string;

  @ApiProperty({ type: () => PublicMenuResponseDto })
  menu!: PublicMenuResponseDto;
}
