import { RestaurantMembership, MembershipStatus, MembershipPermission } from './tenant';
import { BranchProduct } from './catalog';

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
 * Returns the effective branch price in IRR (considering discount price if available).
 */
export function getBranchProductEffectivePrice(branchProduct: BranchProduct): number {
  if (
    branchProduct.branchDiscountPriceIRR !== undefined &&
    branchProduct.branchDiscountPriceIRR !== null &&
    branchProduct.branchDiscountPriceIRR > 0
  ) {
    return branchProduct.branchDiscountPriceIRR;
  }
  return branchProduct.branchPriceIRR;
}
