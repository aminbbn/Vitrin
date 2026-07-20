import { Controller, Get, Param } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PublicMenuService } from './public-menu.service.js';
import { PublicMenuResponseDto } from './dto/public-menu-response.dto.js';
import { QrResolutionResponseDto } from './dto/qr-resolution-response.dto.js';

@ApiTags('public-menu')
@Controller('public')
export class PublicMenuController {
  constructor(private readonly publicMenuService: PublicMenuService) {}

  @Get('menu/qr/:token')
  @ApiOperation({ summary: 'Resolve QR token to branch menu (unauthenticated)' })
  @ApiResponse({ status: 200, description: 'QR resolved with menu' })
  @ApiResponse({ status: 404, description: 'Invalid/revoked token or no menu' })
  async resolveQr(@Param('token') token: string): Promise<QrResolutionResponseDto> {
    return this.publicMenuService.resolveQrToken(token);
  }

  @Get('menu/branch/:branchId')
  @ApiOperation({ summary: 'Get published menu for branch (unauthenticated)' })
  @ApiResponse({ status: 200, description: 'Published menu' })
  @ApiResponse({ status: 404, description: 'Branch not found or no menu' })
  async getMenu(@Param('branchId') branchId: string): Promise<PublicMenuResponseDto> {
    return this.publicMenuService.getPublicMenu(branchId);
  }
}
