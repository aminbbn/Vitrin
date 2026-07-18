import { RestaurantMembership, MembershipStatus, MembershipPermission } from './tenant';
import { BranchProduct } from './catalog';
import { OrderStatus } from './orders';

/**
 * Checks if the given order status is terminal (cannot transition further).
 */
export function isTerminalOrderStatus(status: OrderStatus): boolean {
  return [
    OrderStatus.REJECTED,
    OrderStatus.COMPLETED,
    OrderStatus.CANCELLED
  ].includes(status);
}

/**
 * Checks if a membership is active.
 */
export function isActiveMembership(membership: RestaurantMembership): boolean {
  return membership.status === MembershipStatus.ACTIVE;
}

/**
 * Checks if a membership has a specific permission.
 */
export function hasPermission(membership: RestaurantMembership, permission: MembershipPermission): boolean {
  return isActiveMembership(membership) && membership.permissions.includes(permission);
}

/**
 * Returns the effective branch price in Rial (considering discount price if available).
 */
export function getBranchProductEffectivePrice(branchProduct: BranchProduct): number {
  if (
    branchProduct.branchDiscountPriceRial !== undefined &&
    branchProduct.branchDiscountPriceRial !== null &&
    branchProduct.branchDiscountPriceRial > 0
  ) {
    return branchProduct.branchDiscountPriceRial;
  }
  return branchProduct.branchPriceRial;
}
