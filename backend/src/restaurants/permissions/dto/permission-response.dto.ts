import { ApiProperty } from '@nestjs/swagger';

export class PermissionResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  membershipId!: string;

  @ApiProperty()
  permission!: string;

  @ApiProperty()
  grantedByUserId!: string;

  @ApiProperty()
  grantedAt!: Date;
}
