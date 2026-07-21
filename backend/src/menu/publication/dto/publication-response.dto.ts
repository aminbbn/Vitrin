import { ApiProperty } from '@nestjs/swagger';

export class PublicationResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  branchId!: string;

  @ApiProperty()
  version!: number;

  @ApiProperty()
  schemaVersion!: number;

  @ApiProperty()
  snapshot!: Record<string, unknown>;

  @ApiProperty()
  publishedByUserId!: string;

  @ApiProperty()
  createdAt!: Date;
}
