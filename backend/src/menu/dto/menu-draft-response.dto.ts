import { ApiProperty } from '@nestjs/swagger';

export class MenuDraftResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  branchId!: string;

  @ApiProperty()
  layout!: Record<string, unknown>;

  @ApiProperty()
  theme!: Record<string, unknown>;

  @ApiProperty()
  categoryConfig!: Record<string, unknown>;

  @ApiProperty()
  productConfig!: Record<string, unknown>;

  @ApiProperty()
  displaySettings!: Record<string, unknown>;

  @ApiProperty({ nullable: true })
  lastPublishedAt!: Date | null;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
