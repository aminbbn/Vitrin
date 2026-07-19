import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RESTAURANT_ROLES_KEY } from '../decorators/restaurant-roles.decorator.js';

@Injectable()
export class RestaurantRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      RESTAURANT_ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const membership = request.membership as
      | { role: string }
      | undefined;

    if (!membership || !requiredRoles.includes(membership.role)) {
      throw new ForbiddenException();
    }

    return true;
  }
}
