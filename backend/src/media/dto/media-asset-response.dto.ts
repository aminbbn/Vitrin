import { ApiProperty } from '@nestjs/swagger';

export class MediaAssetResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  uploadedByUserId!: string;

  @ApiProperty({ nullable: true })
  restaurantId!: string | null;

  @ApiProperty()
  storageKey!: string;

  @ApiProperty()
  publicUrl!: string;

  @ApiProperty()
  mimeType!: string;

  @ApiProperty()
  fileSizeBytes!: number;

  @ApiProperty({ nullable: true })
  widthPx!: number | null;

  @ApiProperty({ nullable: true })
  heightPx!: number | null;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty({ nullable: true })
  archivedAt!: Date | null;
}
