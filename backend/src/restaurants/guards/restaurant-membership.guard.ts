import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class RestaurantMembershipGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId: string | undefined = request.user?.sub;
    const restaurantId: string | undefined = request.params?.restaurantId;

    if (!userId || !restaurantId) {
      throw new NotFoundException();
    }

    const membership = await this.prisma.restaurantMembership.findUnique({
      where: {
        userId_restaurantId: { userId, restaurantId },
      },
      select: {
        id: true,
        role: true,
        status: true,
      },
    });

    if (!membership || membership.status !== 'ACTIVE') {
      throw new NotFoundException();
    }

    (request as Record<string, unknown>)['membership'] = membership;
    return true;
  }
}
