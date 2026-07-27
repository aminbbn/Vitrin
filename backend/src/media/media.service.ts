import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { RegisterMediaDto } from './dto/register-media.dto.js';
import { MediaAssetResponseDto } from './dto/media-asset-response.dto.js';

@Injectable()
export class MediaService {
  constructor(private readonly prisma: PrismaService) {}

  async registerMedia(
    restaurantId: string,
    userId: string,
    dto: RegisterMediaDto,
  ): Promise<MediaAssetResponseDto> {
    await this.assertValidRestaurant(restaurantId);

    const asset = await this.prisma.mediaAsset.create({
      data: {
        uploadedByUserId: userId,
        restaurantId,
        storageKey: dto.storageKey,
        publicUrl: dto.publicUrl,
        mimeType: dto.mimeType,
        fileSizeBytes: dto.fileSizeBytes,
        widthPx: dto.widthPx ?? null,
        heightPx: dto.heightPx ?? null,
      },
    });

    return this.toResponse(asset);
  }

  async listMedia(
    restaurantId: string,
  ): Promise<MediaAssetResponseDto[]> {
    await this.assertValidRestaurant(restaurantId);

    const assets = await this.prisma.mediaAsset.findMany({
      where: { restaurantId, archivedAt: null },
      orderBy: { createdAt: 'desc' },
    });

    return assets.map((a) => this.toResponse(a));
  }

  async archiveMedia(
    restaurantId: string,
    mediaId: string,
  ): Promise<void> {
    await this.assertValidRestaurant(restaurantId);

    const asset = await this.prisma.mediaAsset.findUnique({
      where: { id: mediaId },
      select: { id: true, restaurantId: true, archivedAt: true },
    });

    if (!asset || asset.restaurantId !== restaurantId) {
      throw new NotFoundException('Media asset not found');
    }

    if (asset.archivedAt) {
      throw new BadRequestException('Media asset is already archived');
    }

    await this.prisma.mediaAsset.update({
      where: { id: mediaId },
      data: { archivedAt: new Date() },
    });
  }

  async setProductImage(
    restaurantId: string,
    productId: string,
    mediaId: string,
  ): Promise<void> {
    await this.assertValidRestaurant(restaurantId);

    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, restaurantId: true, archivedAt: true },
    });

    if (!product || product.restaurantId !== restaurantId) {
      throw new NotFoundException('Product not found');
    }

    if (product.archivedAt) {
      throw new BadRequestException('Product is archived');
    }

    const asset = await this.prisma.mediaAsset.findUnique({
      where: { id: mediaId },
      select: { id: true, restaurantId: true, archivedAt: true },
    });

    if (!asset || asset.restaurantId !== restaurantId) {
      throw new NotFoundException('Media asset not found');
    }

    if (asset.archivedAt) {
      throw new BadRequestException('Media asset is archived');
    }

    await this.prisma.product.update({
      where: { id: productId },
      data: { imageMediaId: mediaId },
    });
  }

  async removeProductImage(
    restaurantId: string,
    productId: string,
  ): Promise<void> {
    await this.assertValidRestaurant(restaurantId);

    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, restaurantId: true, archivedAt: true },
    });

    if (!product || product.restaurantId !== restaurantId) {
      throw new NotFoundException('Product not found');
    }

    if (product.archivedAt) {
      throw new BadRequestException('Product is archived');
    }

    await this.prisma.product.update({
      where: { id: productId },
      data: { imageMediaId: null },
    });
  }

  private async assertValidRestaurant(restaurantId: string): Promise<void> {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id: restaurantId },
      select: { id: true, status: true },
    });

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    if (restaurant.status !== 'ACTIVE') {
      throw new BadRequestException('Restaurant is not active');
    }
  }

  private toResponse(a: {
    id: string;
    uploadedByUserId: string;
    restaurantId: string | null;
    storageKey: string;
    publicUrl: string;
    mimeType: string;
    fileSizeBytes: number;
    widthPx: number | null;
    heightPx: number | null;
    createdAt: Date;
    archivedAt: Date | null;
  }): MediaAssetResponseDto {
    return {
      id: a.id,
      uploadedByUserId: a.uploadedByUserId,
      restaurantId: a.restaurantId,
      storageKey: a.storageKey,
      publicUrl: a.publicUrl,
      mimeType: a.mimeType,
      fileSizeBytes: a.fileSizeBytes,
      widthPx: a.widthPx,
      heightPx: a.heightPx,
      createdAt: a.createdAt,
      archivedAt: a.archivedAt,
    };
  }
}
