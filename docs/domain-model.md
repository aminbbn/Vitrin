# Vitrin — Domain Model

**Version:** 1.2
**Date:** 2026-07-16
**Source of truth:** `docs/product-blueprint.md` v1.1

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Tenant Hierarchy](#2-tenant-hierarchy)
3. [Identity and Authentication](#3-identity-and-authentication)
4. [Restaurant and Membership](#4-restaurant-and-membership)
5. [Branch Configuration](#5-branch-configuration)
6. [Tables and QR Security](#6-tables-and-qr-security)
7. [Product Catalog](#7-product-catalog)
8. [Branch Product Configuration](#8-branch-product-configuration)
9. [Modifiers](#9-modifiers)
10. [Menu Draft and Publishing](#10-menu-draft-and-publishing)
11. [Customer Profile and Addresses](#11-customer-profile-and-addresses)
12. [Orders](#12-orders)
13. [Payments](#13-payments)
14. [History and Audit](#14-history-and-audit)
15. [Media Assets](#15-media-assets)
16. [Tenant Isolation](#16-tenant-isolation)
17. [Finalized Technical Decisions](#17-finalized-technical-decisions)

---

## 1. Architecture Overview

Vitrin is a **multi-tenant SaaS platform** for restaurants. The tenant hierarchy flows:

```
User → RestaurantMembership → Restaurant → Branch
```

A single `User` may simultaneously be:

- A customer browsing menus
- An OWNER of one restaurant
- A MANAGER of another restaurant

Roles are **not** stored on `User` — they belong to `RestaurantMembership`. Every business-owned record traces an explicit ownership path to a `Restaurant` or `Branch`. Public customer endpoints must not expose internal database identifiers.

---

## 2. Tenant Hierarchy

```
User
  ├── RestaurantMembership ──► Restaurant
  │                                 ├── Branch
  │                                 │     ├── BranchTable
  │                                 │     ├── BranchProduct
  │                                 │     ├── MenuDraft
  │                                 │     └── MenuPublication
  │                                 ├── Category
  │                                 ├── Product
  │                                 ├── ModifierGroup
  │                                 └── MediaAsset
  ├── CustomerAddress
  └── CustomerOrder ──► Branch ──► Restaurant
```

Every authenticated restaurant operation resolves membership against the owning `Restaurant`. A request-provided `restaurantId` or `branchId` must **never** be trusted without authorization checks against the caller's `RestaurantMembership`.

---

## 3. Identity and Authentication

### 3.1 User

**Purpose:** Unified identity for all platform actors (customer, owner, manager, etc.).

**Ownership scope:** Global (not tenant-scoped).

**Conceptual fields:**

| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID | Internal primary key |
| `email` | string | Unique, normalized (lowercase) |
| `passwordHash` | string \| null | null for Google-only users |
| `fullName` | string | Display name |
| `avatarMediaId` | UUID \| null | FK → MediaAsset |
| `emailVerifiedAt` | timestamp \| null | null = unverified |
| `status` | enum | ACTIVE, SUSPENDED |
| `createdAt` | timestamp | |
| `updatedAt` | timestamp | |

**Relationships:**

- Has many `AuthAccount`
- Has many `RefreshSession`
- Has many `RestaurantMembership`
- Has many `CustomerOrder`
- Has many `CustomerAddress`

**Invariants:**

- One email maps to exactly one `User`.
- `email` is unique across the platform.
- A `User` without `passwordHash` can only authenticate via Google.
- `emailVerifiedAt` must be set before creating a restaurant, accepting an invitation, or placing an order.

**Lifecycle:** Created on first registration (email or Google). Never hard-deleted — suspended if needed.

**Delete/archive:** Soft status change to SUSPENDED. Never physically deleted due to historical order references.

**MVP stage:** Core.

---

### 3.2 AuthAccount

**Purpose:** Links external authentication providers to a unified User. Initially supports GOOGLE only.

**Ownership scope:** Global, belongs to one `User`.

**Conceptual fields:**

| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID | Internal primary key |
| `userId` | UUID | FK → User |
| `provider` | enum | GOOGLE |
| `providerAccountId` | string | Provider's unique ID |
| `providerEmail` | string \| null | Email reported by provider |
| `createdAt` | timestamp | |

**Relationships:**

- Belongs to one `User`

**Invariants:**

- A Google account with a verified matching email links to the **existing** `User` (if one exists with that email).
- The `(provider, providerAccountId)` pair must be unique.
- Google authentication must only trust the email after backend validation of the Google ID Token.

**Lifecycle:** Created when a user first authenticates via Google, or linked to an existing account.

**Delete/archive:** Never deleted (audit trail). Can be soft-unlinked if future feature requires it.

**MVP stage:** Core.

---

### 3.3 RefreshSession

**Purpose:** Manages refresh-token sessions per device/login for stateless access-token architecture.

**Ownership scope:** Global, belongs to one `User`.

**Conceptual fields:**

| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID | Internal primary key |
| `userId` | UUID | FK → User |
| `tokenHash` | string | Hashed refresh token (never store raw) |
| `deviceInfo` | string \| null | User agent / device description |
| `expiresAt` | timestamp | Token expiration |
| `revokedAt` | timestamp \| null | null = active |
| `createdAt` | timestamp | |

**Invariants:**

- Only hashed tokens are stored.
- Revoked sessions are never reused.
- Expired sessions are cleaned up periodically.

**Lifecycle:** Created on login. Revoked on logout or token refresh failure.

**Delete/archive:** Expired/revoked sessions can be purged after a retention period.

**MVP stage:** Core.

---

### 3.4 EmailVerificationToken

**Purpose:** One-time token for email verification.

**Ownership scope:** Global, belongs to one `User`.

**Conceptual fields:**

| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID | Internal primary key |
| `userId` | UUID | FK → User |
| `tokenHash` | string | Hashed token (never raw) |
| `expiresAt` | timestamp | Short-lived (e.g. 24 hours) |
| `usedAt` | timestamp \| null | Single-use enforcement |
| `createdAt` | timestamp | |

**Invariants:**

- Token is stored hashed.
- Token is single-use (`usedAt` set on consumption).
- Token expires and becomes invalid.
- Old tokens for the same user may be revoked when a new one is issued.

**Lifecycle:** Created on registration or resend request. Consumed on verification. Old tokens revoked.

**Delete/archive:** Can be purged after expiration.

**MVP stage:** Core.

---

### 3.5 PasswordResetToken

**Purpose:** One-time token for password reset flow.

**Ownership scope:** Global, belongs to one `User`.

**Conceptual fields:**

| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID | Internal primary key |
| `userId` | UUID | FK → User |
| `tokenHash` | string | Hashed token (never raw) |
| `expiresAt` | timestamp | Short-lived (e.g. 1 hour) |
| `usedAt` | timestamp \| null | Single-use enforcement |
| `createdAt` | timestamp | |

**Invariants:**

- Token is stored hashed.
- Token is single-use.
- Token expires.
- Issuing a new reset token revokes all previous unused tokens for that user.

**Lifecycle:** Created on "forgot password" request. Consumed on password reset. Old tokens revoked.

**Delete/archive:** Can be purged after expiration.

**MVP stage:** Core.

---

## 4. Restaurant and Membership

### 4.1 Restaurant

**Purpose:** Top-level tenant entity representing a restaurant business.

**Ownership scope:** Owned by the platform; associated with users through `RestaurantMembership`.

**Conceptual fields:**

| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID | Internal primary key |
| `name` | string | Restaurant display name |
| `slug` | string | URL-friendly identifier, unique |
| `logoMediaId` | UUID \| null | FK → MediaAsset |
| `description` | string \| null | Short description |
| `status` | enum | ACTIVE, SUSPENDED |
| `createdAt` | timestamp | |
| `updatedAt` | timestamp | |

**Relationships:**

- Has many `RestaurantMembership`
- Has many `Branch`
- Has many `Category`
- Has many `Product`
- Has many `ModifierGroup`
- Has many `RestaurantInvitation`

**Invariants:**

- Every `Branch`, `Category`, `Product`, and `ModifierGroup` belongs to exactly one `Restaurant`.

**Lifecycle:** Created by a verified user who becomes OWNER.

**Delete/archive:** Suspended rather than deleted. Historical data (orders, publications) must remain queryable.

**MVP stage:** Core.

---

### 4.2 Branch

**Purpose:** A physical or online location of a restaurant. Each branch has independent configuration, pricing, availability, and menu publication.

**Ownership scope:** Belongs to one `Restaurant`.

**Conceptual fields:**

| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID | Internal primary key |
| `restaurantId` | UUID | FK → Restaurant |
| `name` | string | Branch display name |
| `address` | string \| null | Physical address text |
| `latitude` | decimal \| null | Geographic coordinate |
| `longitude` | decimal \| null | Geographic coordinate |
| `timezone` | string | e.g. "Asia/Tehran" |
| `currencyCode` | string | ISO 4217 code, e.g. "IRR" |
| `status` | enum | ACTIVE, SUSPENDED |
| `orderingEnabled` | boolean | Can customers place orders? |
| `activeMenuPublicationId` | UUID \| null | FK → MenuPublication (null before first publish) |
| `createdAt` | timestamp | |
| `updatedAt` | timestamp | |

**Relationships:**

- Belongs to one `Restaurant`
- Has one `BranchFeeConfig`
- Has one `DeliveryConfig` (optional)
- Has many `BranchTable`
- Has many `BranchProduct`
- Has one `MenuDraft`
- Has many `MenuPublication`
- Has many `CustomerOrder`
- Has many `BranchWorkingInterval`
- Has many `BranchSpecialHours`
- Has many `BranchDailyOrderCounter`

**Invariants:**

- A `Branch` must belong to exactly one `Restaurant`.
- Branch names should be unique within a restaurant (not strictly required at DB level).

**Lifecycle:** Created by OWNER or MANAGER. Can be suspended.

**Delete/archive:** Suspended rather than deleted when historical references exist.

**MVP stage:** Core.

---

### 4.3 RestaurantMembership

**Purpose:** Connects a `User` to a `Restaurant` with a specific role and optional explicit permissions.

**Ownership scope:** Belongs to one `User` and one `Restaurant`.

**Conceptual fields:**

| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID | Internal primary key |
| `userId` | UUID | FK → User |
| `restaurantId` | UUID | FK → Restaurant |
| `role` | enum | OWNER, MANAGER, ORDER_OPERATOR, CASHIER |
| `status` | enum | ACTIVE, SUSPENDED, REMOVED |
| `createdAt` | timestamp | |
| `updatedAt` | timestamp | |

**Relationships:**

- Belongs to one `User`
- Belongs to one `Restaurant`
- Has many `MembershipPermission`

**Invariants:**

- A `User` may have only **one** `RestaurantMembership` per `Restaurant`. The `(userId, restaurantId)` pair is unique across all membership records.
- Duplicate membership records for the same User and Restaurant are not allowed.
- If a removed or suspended user rejoins, the existing Membership record is reactivated or updated — a new record is never created.
- Invitation acceptance must not create a duplicate Membership.
- `OWNER` role is implied by restaurant creation (first membership).

**Lifecycle:** Created on restaurant creation (OWNER) or invitation acceptance. Only exists after one of these events.

**Delete/archive:** Can be set to REMOVED or SUSPENDED. Never hard-deleted. Ownership transfer is architecturally possible but outside MVP.

**MVP stage:** Core.

---

### 4.4 RestaurantInvitation

**Purpose:** Invites a user (by email) to join a restaurant with a specific role.

**Ownership scope:** Belongs to one `Restaurant`.

**Conceptual fields:**

| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID | Internal primary key |
| `restaurantId` | UUID | FK → Restaurant |
| `invitedEmail` | string | Email of the invitee |
| `role` | enum | MANAGER, ORDER_OPERATOR, CASHIER |
| `invitedByUserId` | UUID | FK → User (who sent invitation) |
| `tokenHash` | string | Hashed acceptance token |
| `status` | enum | PENDING, ACCEPTED, EXPIRED, REVOKED |
| `expiresAt` | timestamp | Invitation expiration |
| `acceptedAt` | timestamp \| null | When invitation was accepted |
| `createdAt` | timestamp | |

**Relationships:**

- Belongs to one `Restaurant`
- References one `User` (inviter)
- On acceptance, creates a `RestaurantMembership`

**Invariants:**

- A PENDING invitation for the same email and restaurant should not be duplicated.
- Invitation acceptance requires the invitee's email to be verified.
- Expired or revoked invitations cannot be accepted.

**Lifecycle:** Created by OWNER or MANAGER. Accepted by invitee. Expires after a timeout.

**Delete/archive:** Never deleted (audit trail). Status transitions to ACCEPTED, EXPIRED, or REVOKED.

**MVP stage:** Extended.

---

### 4.5 MembershipPermission

**Purpose:** Stores explicit permission grants on a membership. Supports the OWNER → MANAGER permission delegation model.

**Ownership scope:** Belongs to one `RestaurantMembership`.

**Conceptual fields:**

| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID | Internal primary key |
| `membershipId` | UUID | FK → RestaurantMembership |
| `permission` | enum | MENU_PUBLISH, MENU_ROLLBACK |
| `grantedAt` | timestamp | |
| `grantedByUserId` | UUID | FK → User (the OWNER who granted) |

**Relationships:**

- Belongs to one `RestaurantMembership`

**Invariants:**

- `OWNER` always has all permissions implicitly — no records needed.
- Permissions are **grants only** (no deny model).
- A permission grant must be issued by an OWNER.
- Duplicate grants for the same permission on the same membership should be idempotent.

**Lifecycle:** Created by OWNER. Can be revoked (delete the record).

**Delete/archive:** Records can be deleted to revoke. This is safe because permissions are grants-only.

**MVP stage:** Core.

---

## 5. Branch Configuration

### 5.1 BranchFeeConfig

**Purpose:** Stores per-branch fee configuration for tax, service, packaging, and delivery.

**Ownership scope:** Belongs to one `Branch`.

**Conceptual fields:**

| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID | Internal primary key |
| `branchId` | UUID | FK → Branch (unique) |
| `taxEnabled` | boolean | |
| `taxType` | enum | FIXED, PERCENTAGE |
| `taxValue` | integer | Minor units if FIXED, basis points if PERCENTAGE (1/100 of 1%) |
| `serviceFeeEnabled` | boolean | |
| `serviceFeeType` | enum | FIXED, PERCENTAGE |
| `serviceFeeValue` | integer | Minor units or basis points |
| `packagingFeeEnabled` | boolean | |
| `packagingFeeType` | enum | FIXED, PERCENTAGE |
| `packagingFeeValue` | integer | Minor units or basis points |
| `createdAt` | timestamp | |
| `updatedAt` | timestamp | |

**Invariants:**

- One `BranchFeeConfig` per `Branch`.
- All monetary values are integers in the smallest currency unit (minor units).
- For percentage fees, values are stored as basis points (1 bp = 0.01%). Example: 9% tax = 900 basis points.
- Never use floating-point for monetary values.

**Lifecycle:** Created when a branch is configured. Updated by OWNER or MANAGER.

**Delete/archive:** Never deleted — always updated.

**MVP stage:** Core.

---

### 5.2 DeliveryConfig

**Purpose:** Stores per-branch delivery configuration for radius-based coverage.

**Ownership scope:** Belongs to one `Branch`.

**Conceptual fields:**

| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID | Internal primary key |
| `branchId` | UUID | FK → Branch (unique) |
| `deliveryEnabled` | boolean | |
| `originLatitude` | decimal | Center point latitude |
| `originLongitude` | decimal | Center point longitude |
| `maxRadiusKm` | decimal | Maximum delivery radius in km |
| `baseFee` | integer | Base delivery fee in minor units |
| `perKmFee` | integer \| null | Optional distance-based fee in minor units per km |
| `minimumOrderAmount` | integer | Minimum order total for delivery eligibility, in minor units |
| `createdAt` | timestamp | |
| `updatedAt` | timestamp | |

**Invariants:**

- One `DeliveryConfig` per `Branch`.
- `baseFee` and `minimumOrderAmount` are in minor currency units.
- Live driver tracking and driver app are explicitly excluded from MVP.

**Lifecycle:** Created when delivery is enabled for a branch. Updated by OWNER or MANAGER.

**Delete/archive:** Can be soft-deleted (set `deliveryEnabled = false`) or kept.

**MVP stage:** Extended.

---

### 5.3 BranchWorkingInterval

**Purpose:** Defines a recurring working-hours interval for a branch on a specific weekday. Supports split shifts (multiple intervals per day).

**Ownership scope:** Belongs to one `Branch`.

**Conceptual fields:**

| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID | Internal primary key |
| `branchId` | UUID | FK → Branch |
| `weekday` | integer | 0 = Sunday … 6 = Saturday (or equivalent) |
| `opensAt` | string | Time of day, e.g. "09:00" |
| `closesAt` | string | Time of day, e.g. "22:00" |
| `displayOrder` | integer | Sort order for multiple intervals on same weekday |
| `createdAt` | timestamp | |
| `updatedAt` | timestamp | |

**Relationships:**

- Belongs to one `Branch`

**Invariants:**

- A `Branch` may have multiple intervals per weekday (split shifts).
- Times are interpreted in the `Branch.timezone`.
- No historical versioning — current state only.
- `opensAt` must be before `closesAt` within a single interval.

**Lifecycle:** Created and updated by OWNER or MANAGER.

**Delete/archive:** Can be deleted when no longer needed.

**MVP stage:** Core.

---

### 5.4 BranchSpecialHours

**Purpose:** Overrides normal working-hours intervals for specific dates (holidays, special events, temporary closures).

**Ownership scope:** Belongs to one `Branch`.

**Conceptual fields:**

| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID | Internal primary key |
| `branchId` | UUID | FK → Branch |
| `localDate` | date | The calendar date being overridden |
| `isClosed` | boolean | True = branch is closed on this date |
| `opensAt` | string \| null | Override open time (null if closed) |
| `closesAt` | string \| null | Override close time (null if closed) |
| `note` | string \| null | Human-readable reason, e.g. " holiday" |
| `createdAt` | timestamp | |
| `updatedAt` | timestamp | |

**Relationships:**

- Belongs to one `Branch`

**Invariants:**

- Special-date configuration overrides normal `BranchWorkingInterval` for that date.
- Temporary closures are represented by `isClosed = true`.
- Current/future configuration only — no historical schedule-version system.
- The `(branchId, localDate)` pair should be unique.

**Lifecycle:** Created and updated by OWNER or MANAGER.

**Delete/archive:** Can be deleted when the special date has passed or is no longer needed.

**MVP stage:** Core.

---

### 5.5 BranchDailyOrderCounter

**Purpose:** Manages per-branch, per-business-day sequential counters for generating `displayNumber` values on orders. Internal use only — never exposed publicly.

**Ownership scope:** Belongs to one `Branch`.

**Conceptual fields:**

| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID | Internal primary key |
| `branchId` | UUID | FK → Branch |
| `businessDate` | date | Local operational date of the branch |
| `nextValue` | integer | Next display number to allocate |
| `updatedAt` | timestamp | |

**Relationships:**

- Belongs to one `Branch`

**Invariants:**

- Exactly one counter per `Branch` + `businessDate` — the `(branchId, businessDate)` pair must be unique.
- Counter allocation must be transactional and concurrency-safe (e.g. `SELECT … FOR UPDATE` or atomic increment).
- The counter is internal and never exposed to customers or staff directly.
- `nextValue` starts at 1 and increments per order.

**Lifecycle:** Created implicitly on first order of the day. Updated on each order creation.

**Delete/archive:** Old counters can be archived or purged after a retention period.

**MVP stage:** Core.

---

## 6. Tables and QR Security

### 6.1 BranchTable

**Purpose:** Represents a physical table in a restaurant branch.

**Ownership scope:** Belongs to one `Branch`.

**Conceptual fields:**

| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID | Internal primary key |
| `branchId` | UUID | FK → Branch |
| `tableNumber` | string | Display label (e.g. "5", "VIP-2") |
| `capacity` | integer \| null | Seating capacity (optional) |
| `status` | enum | ACTIVE, INACTIVE |
| `createdAt` | timestamp | |
| `updatedAt` | timestamp | |

**Relationships:**

- Belongs to one `Branch`
- Has one active `TableQrToken`
- Has many `TableQrToken` (historical)

**Invariants:**

- `tableNumber` should be unique within a `Branch` (application-level enforcement).
- A table may have only one active QR token at a time.

**Lifecycle:** Created by OWNER or MANAGER. Can be deactivated.

**Delete/archive:** Suspended (INACTIVE) rather than deleted when orders reference it.

**MVP stage:** Core.

---

### 6.2 TableQrToken

**Purpose:** Secure, non-sequential public token for QR code scanning. Resolves to a table → branch → active published menu.

**Ownership scope:** Belongs to one `BranchTable`.

**Conceptual fields:**

| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID | Internal primary key |
| `tableId` | UUID | FK → BranchTable |
| `token` | string | Public, unique, non-sequential, non-guessable |
| `status` | enum | ACTIVE, REVOKED |
| `revokedAt` | timestamp \| null | |
| `createdAt` | timestamp | |

**Relationships:**

- Belongs to one `BranchTable`

**Invariants:**

- `token` must be unique across all `TableQrToken` records.
- `token` must not expose internal database IDs (use a cryptographically random string, e.g. UUIDv4 or similar).
- Only one `ACTIVE` token per table at a time.
- Regenerating a token creates a new ACTIVE record and sets the old one to REVOKED.
- REVOKED tokens are retained as historical records.

**QR resolution path:**

```
QR token
  → TableQrToken (find ACTIVE token)
  → BranchTable
  → Branch
  → MenuPublication (active version for this branch)
```

**Lifecycle:** Created when a table is set up. Regenerated (new token, old revoked) on demand. Revoked when table is removed.

**Delete/archive:** REVOKED tokens are retained for audit. ACTIVE tokens can be regenerated.

**MVP stage:** Core.

---

## 7. Product Catalog

### 7.1 Category

**Purpose:** Organizes products into display groups within a restaurant's menu.

**Ownership scope:** Belongs to one `Restaurant`.

**Conceptual fields:**

| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID | Internal primary key |
| `restaurantId` | UUID | FK → Restaurant |
| `name` | string | Display name |
| `displayOrder` | integer | Sort order within restaurant |
| `isActive` | boolean | Visible in admin |
| `archivedAt` | timestamp \| null | Null = active |
| `createdAt` | timestamp | |
| `updatedAt` | timestamp | |

**Relationships:**

- Belongs to one `Restaurant`
- Has many `Product` (via Product.categoryId)

**Invariants:**

- Categories are restaurant-scoped (shared across branches at the catalog level).
- `displayOrder` should be unique within a restaurant.
- A `Category` with active `Product` records cannot be destructively deleted — products must be moved to another category or archived first.
- Archiving a category does not delete its products.

**Lifecycle:** Created by OWNER or MANAGER. Can be archived.

**Delete/archive:** Archiving is preferred over deletion. Destructive deletion is blocked when active Products reference the category.

**MVP stage:** Core.

---

### 7.2 Product

**Purpose:** Represents a menu item in the restaurant's master product catalog.

**Ownership scope:** Belongs to one `Restaurant`.

**Conceptual fields:**

| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID | Internal primary key |
| `restaurantId` | UUID | FK → Restaurant |
| `categoryId` | UUID | FK → Category (required) |
| `name` | string | Internal name |
| `displayName` | string | Customer-facing name |
| `description` | string \| null | Customer-facing description |
| `imageMediaId` | UUID \| null | FK → MediaAsset |
| `isActive` | boolean | Whether product is in active use |
| `archivedAt` | timestamp \| null | Null = active |
| `createdAt` | timestamp | |
| `updatedAt` | timestamp | |

**Relationships:**

- Belongs to one `Restaurant`
- Belongs to one `Category` (required)
- Has many `BranchProduct`
- Has many `ProductModifierGroup`

**Invariants:**

- A `Product` belongs to exactly **one** `Category`. The `categoryId` is mandatory at creation time.
- Products are never hard-deleted when historical orders or menu publications reference them — use archiving.
- `displayName` is what customers see; `name` is for internal/admin use.

**Lifecycle:** Created by OWNER or MANAGER. Can be archived.

**Delete/archive:** Archiving (`archivedAt` set, `isActive = false`) is required over deletion when order or publication snapshots reference the product.

**MVP stage:** Core.

---

## 8. Branch Product Configuration

### 8.1 BranchProduct

**Purpose:** Connects a master `Product` to a `Branch` with branch-specific pricing, availability, and visibility.

**Ownership scope:** Belongs to one `Branch`.

**Conceptual fields:**

| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID | Internal primary key |
| `branchId` | UUID | FK → Branch |
| `productId` | UUID | FK → Product |
| `branchPrice` | integer | Price in minor currency units |
| `branchDiscountPrice` | integer \| null | Discounted price, null = no discount |
| `availability` | enum | AVAILABLE, UNAVAILABLE |
| `orderingEnabled` | boolean | Can customers order this product? |
| `isVisible` | boolean | Should product appear in this branch's menu? |
| `createdAt` | timestamp | |
| `updatedAt` | timestamp | |

**Relationships:**

- Belongs to one `Branch`
- Belongs to one `Product`

**Invariants:**

- The `(branchId, productId)` pair must be unique.
- `branchPrice` and `branchDiscountPrice` are in minor currency units.
- **Price changes require menu Publish** before becoming customer-visible.
- **Availability changes apply immediately** — no Publish required.
- A product may exist in the active published menu but be hidden instantly because its live availability is UNAVAILABLE.

**Three distinct price concepts:**

1. **Current configuration price** (`BranchProduct.branchPrice`) — what the admin sees and edits. Source of truth for the next publish.
2. **Published customer-visible price** — stored inside `MenuPublication.snapshot`. What customers see on the menu.
3. **Immutable order price snapshot** — stored in `OrderItem`. What was charged for a specific order.

**Lifecycle:** Created when a product is assigned to a branch. Updated by OWNER or MANAGER.

**Delete/archive:** Can be removed when a product is no longer offered at a branch. Historical references (orders) are preserved in snapshots.

**MVP stage:** Core.

---

## 9. Modifiers

### 9.1 ModifierGroup

**Purpose:** A named group of modifier options (e.g. "Size", "Spice Level", "Add-ons").

**Ownership scope:** Belongs to one `Restaurant`.

**Conceptual fields:**

| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID | Internal primary key |
| `restaurantId` | UUID | FK → Restaurant |
| `name` | string | Customer-facing group name (e.g. "Size") |
| `isRequired` | boolean | Must customer select from this group? |
| `minSelections` | integer | Minimum options to select (0 if not required) |
| `maxSelections` | integer \| null | Maximum options (null = unlimited) |
| `displayOrder` | integer | Sort order |
| `isActive` | boolean | |
| `createdAt` | timestamp | |
| `updatedAt` | timestamp | |

**Relationships:**

- Belongs to one `Restaurant`
- Has many `ModifierOption`
- Has many `ProductModifierGroup`

**Invariants:**

- `minSelections` must be ≤ `maxSelections` (when `maxSelections` is not null).
- If `isRequired` is true, `minSelections` must be ≥ 1.

**Lifecycle:** Created by OWNER or MANAGER. Can be archived.

**Delete/archive:** Archive when products still reference it.

**MVP stage:** Core.

---

### 9.2 ModifierOption

**Purpose:** An individual selectable option within a modifier group (e.g. "Large", "Medium", "Spicy").

**Ownership scope:** Belongs to one `ModifierGroup`.

**Conceptual fields:**

| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID | Internal primary key |
| `modifierGroupId` | UUID | FK → ModifierGroup |
| `name` | string | Customer-facing option name |
| `priceAdjustment` | integer | Price delta in minor units (can be 0 or negative) |
| `displayOrder` | integer | Sort order within group |
| `isActive` | boolean | |
| `createdAt` | timestamp | |
| `updatedAt` | timestamp | |

**Relationships:**

- Belongs to one `ModifierGroup`
- Referenced by `OrderItemModifier`

**Invariants:**

- `priceAdjustment` is in minor currency units.
- `displayOrder` is unique within a group.

**Lifecycle:** Created within a modifier group. Can be deactivated.

**Delete/archive:** Archive rather than delete when order snapshots reference it.

**MVP stage:** Core.

---

### 9.3 ProductModifierGroup

**Purpose:** Associates a `Product` with one or more `ModifierGroup`s, establishing which modifier groups apply to which products.

**Ownership scope:** Restaurant-scoped (via Product → Restaurant).

**Conceptual fields:**

| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID | Internal primary key |
| `productId` | UUID | FK → Product |
| `modifierGroupId` | UUID | FK → ModifierGroup |
| `displayOrder` | integer | Order of modifier groups on this product |
| `createdAt` | timestamp | |

**Relationships:**

- Belongs to one `Product`
- Belongs to one `ModifierGroup`

**Invariants:**

- The `(productId, modifierGroupId)` pair must be unique.
- Both referenced entities must belong to the same restaurant.

**Lifecycle:** Created when linking a modifier group to a product.

**Delete/archive:** Can be deleted (link table).

**MVP stage:** Core.

---

## 10. Menu Draft and Publishing

### 10.1 MenuDraft

**Purpose:** The single editable draft for a branch's menu. Preview reads from this. Publish creates an immutable snapshot from this.

**Ownership scope:** One per `Branch`.

**Conceptual fields:**

| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID | Internal primary key |
| `branchId` | UUID | FK → Branch (unique) |
| `layout` | JSON | Menu layout configuration |
| `theme` | JSON | Theme settings (colors, fonts, etc.) |
| `categoryConfig` | JSON | Category visibility, ordering per category |
| `productConfig` | JSON | Product visibility, ordering per product |
| `displaySettings` | JSON | Other customer-facing display settings |
| `lastPublishedAt` | timestamp \| null | When this draft was last published |
| `createdAt` | timestamp | |
| `updatedAt` | timestamp | |

**Relationships:**

- Belongs to one `Branch`

**Invariants:**

- Exactly one `MenuDraft` per `Branch`.
- Editing this draft has **no effect** on customers — they read from `MenuPublication`.
- The draft stores configuration, not live data.

**Lifecycle:** Created when a branch is set up. Updated continuously by OWNER or MANAGER.

**Delete/archive:** Never deleted.

**MVP stage:** Core.

---

### 10.2 MenuPublication

**Purpose:** An immutable snapshot of the menu at the time of publishing. Customers see only the active publication.

**Ownership scope:** Belongs to one `Branch`.

**Conceptual fields:**

| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID | Internal primary key |
| `branchId` | UUID | FK → Branch |
| `version` | integer | Monotonically increasing per branch |
| `schemaVersion` | integer | Snapshot schema version for forward compatibility |
| `snapshot` | JSON | Complete menu state at publish time (immutable) |
| `publishedByUserId` | UUID | FK → User (must have MENU_PUBLISH permission) |
| `createdAt` | timestamp | Immutable — represents publish time |

**Relationships:**

- Belongs to one `Branch`
- Published by one `User`

**Snapshot must contain:**

```json
{
  "layout": { ... },
  "theme": { ... },
  "categories": [
    {
      "id": "uuid",
      "name": "...",
      "isVisible": true,
      "displayOrder": 1,
      "products": [
        {
          "id": "uuid",
          "productId": "uuid",
          "displayName": "...",
          "description": "...",
          "imageUrl": "...",
          "branchPrice": 245000,
          "branchDiscountPrice": null,
          "displayOrder": 1,
          "isVisible": true,
          "modifiers": [
            {
              "modifierGroupId": "uuid",
              "name": "Size",
              "isRequired": true,
              "options": [
                { "id": "uuid", "name": "Medium", "priceAdjustment": 0 },
                { "id": "uuid", "name": "Large", "priceAdjustment": 85000 }
              ]
            }
          ]
        }
      ]
    }
  ],
  "displaySettings": { ... }
}
```

**Invariants:**

- Published records are **never edited in place**.
- `version` is unique per `Branch`.
- `schemaVersion` is required and must be incremented when the snapshot structure changes.
- `snapshot` is a complete, self-contained JSON representation of the menu at publish time.
- **Rollback** creates a **new** publication (new version) whose `snapshot` matches an older version's snapshot. Historical data is never mutated.
- The active publication pointer is maintained on `Branch.activeMenuPublicationId`, not on the publication itself.

**Rollback example:**

```
Version 5 is active (Branch.activeMenuPublicationId points to Version 5)
→ rollback to Version 3
→ create Version 6 with snapshot copied from Version 3
→ Branch.activeMenuPublicationId updated to Version 6
→ Version 5 record is never modified
```

**Operational availability is OUTSIDE the snapshot.** A product may exist in the snapshot but be UNAVAILABLE in live `BranchProduct` data. The customer menu rendering layer must cross-reference `BranchProduct.availability` at display time.

**Lifecycle:** Created on Publish or Rollback. Never updated or deleted.

**Delete/archive:** Never deleted. Never modified.

**MVP stage:** Core.

---

## 11. Customer Profile and Addresses

### 11.1 CustomerProfile

**Decision:** No separate `CustomerProfile` entity is created. The unified `User` entity already holds `fullName`, `avatarUrl`, and `email`. Customer-specific behavior (ordering, addresses, order history) is derived from the `User` via related entities.

**Rationale:** Adding a separate profile table would duplicate data already on `User` without adding meaningful separation. The `User` is the single identity; its role context (customer vs. restaurant staff) is determined by the presence or absence of `RestaurantMembership` records.

**MVP stage:** Core (implicit via User).

---

### 11.2 CustomerAddress

**Purpose:** Stores delivery addresses for a customer.

**Ownership scope:** Belongs to one `User`.

**Conceptual fields:**

| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID | Internal primary key |
| `userId` | UUID | FK → User |
| `label` | string | e.g. "Home", "Work" |
| `recipientName` | string | Name of the recipient |
| `recipientPhone` | string | Contact phone |
| `addressText` | string | Full address text |
| `latitude` | decimal \| null | Geocoded latitude |
| `longitude` | decimal \| null | Geocoded longitude |
| `isDefault` | boolean | Default address for new orders |
| `archivedAt` | timestamp \| null | Soft delete |
| `createdAt` | timestamp | |
| `updatedAt` | timestamp | |

**Relationships:**

- Belongs to one `User`
- Referenced by `CustomerOrder` (for DELIVERY orders, as a snapshot)

**Invariants:**

- A `User` may have many addresses.
- Only one address per user can be `isDefault = true`.
- Addresses for DELIVERY orders are **snapshotted** into the `CustomerOrder` at creation time — changes to the address after order creation do not affect the order.

**Lifecycle:** Created, updated, or archived by the customer.

**Delete/archive:** Archiving preferred over deletion when orders reference the address.

**MVP stage:** Extended.

---

## 12. Orders

### 12.1 CustomerOrder

**Purpose:** Represents a customer's order at a specific branch.

**Ownership scope:** Belongs to one `Branch` and one `User` (customer).

**Conceptual fields:**

| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID | Internal primary key |
| `branchId` | UUID | FK → Branch |
| `customerUserId` | UUID | FK → User (the customer) |
| `publicCode` | string | Globally unique, non-sequential, non-guessable (for customer-facing URLs) |
| `displayNumber` | integer | Short sequential number for staff/customer display (e.g. #0042) |
| `businessDate` | date | Local operational date of the Branch |
| `currencyCode` | string | ISO 4217 code, snapshot of Branch.currencyCode |
| `orderType` | enum | DINE_IN, TAKEAWAY, DELIVERY |
| `orderStatus` | enum | PENDING_APPROVAL, REJECTED, ACCEPTED, PREPARING, READY, OUT_FOR_DELIVERY, COMPLETED, CANCELLED |
| `tableId` | UUID \| null | FK → BranchTable (DINE_IN only) |
| `deliveryAddressSnapshot` | JSON \| null | Snapshotted address (DELIVERY only) |
| `rejectionReason` | string \| null | Visible to customer |
| `cancellationReason` | string \| null | PAYMENT_EXPIRED or custom |
| `cancelledByUserId` | UUID \| null | FK → User |
| `cancelledAt` | timestamp \| null | |
| `subtotal` | integer | Sum of item line totals before fees |
| `discountTotal` | integer | Total discount |
| `tax` | integer | Applied tax in minor units |
| `serviceFee` | integer | Applied service fee |
| `packagingFee` | integer | Applied packaging fee |
| `deliveryFee` | integer | Applied delivery fee (0 for non-DELIVERY) |
| `grandTotal` | integer | Final charged amount |
| `createdAt` | timestamp | |
| `updatedAt` | timestamp | |

**Relationships:**

- Belongs to one `Branch`
- Belongs to one `User` (customer)
- Has one optional `BranchTable` (DINE_IN)
- Has many `OrderItem`
- Has many `OrderStatusHistory`
- Has exactly one `Payment`

**Invariants:**

- `publicCode` is globally unique across all orders. It is non-sequential and non-guessable (e.g. cryptographically random string).
- `displayNumber` is unique within the `(branchId, businessDate)` scope. It is a short integer (e.g. 1, 2, … 42) used in staff UIs as `#0042`.
- `businessDate` is the local operational date of the branch, used for daily counter scoping.
- `currencyCode` is snapshotted from `Branch.currencyCode` at order creation time.
- `orderStatus` is an independent state machine from payment state (which lives on `Payment`).
- `grandTotal` = `subtotal` - `discountTotal` + `tax` + `serviceFee` + `packagingFee` + `deliveryFee`.
- All monetary values are integers in minor currency units.
- `deliveryAddressSnapshot` is only populated for `DELIVERY` orders and is immutable.
- `tableId` is only populated for `DINE_IN` orders.

**Lifecycle:** Created by customer. Transitions through state machine via authorized actors.

**Delete/archive:** Never deleted. Status transitions to terminal states (COMPLETED, CANCELLED, REJECTED).

**MVP stage:** Core.

---

### 12.2 OrderItem

**Purpose:** An immutable snapshot of a single line item in an order.

**Ownership scope:** Belongs to one `CustomerOrder`.

**Conceptual fields:**

| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID | Internal primary key |
| `orderId` | UUID | FK → CustomerOrder |
| `productId` | UUID \| null | FK → Product (reference, not FK constraint) |
| `productName` | string | Snapshot of display name |
| `quantity` | integer | |
| `unitPrice` | integer | Published unit price at order time (minor units) |
| `discountPrice` | integer \| null | Published discount price at order time |
| `itemSubtotal` | integer | unitPrice × quantity before modifiers |
| `modifierTotal` | integer | Sum of modifier price adjustments |
| `taxAllocation` | integer | Tax allocated to this item |
| `serviceFeeAllocation` | integer | Service fee allocated to this item |
| `packagingFeeAllocation` | integer | Packaging fee allocated to this item |
| `lineTotal` | integer | Final line total |
| `notes` | string \| null | Customer notes for this item |
| `createdAt` | timestamp | |

**Relationships:**

- Belongs to one `CustomerOrder`
- Has many `OrderItemModifier`

**Invariants:**

- `productName`, `unitPrice`, and all snapshot fields are **immutable** after creation.
- `productId` is a reference for traceability but changing the product later must never modify existing order items.
- `lineTotal` = `itemSubtotal` + `modifierTotal` + `taxAllocation` + `serviceFeeAllocation` + `packagingFeeAllocation`.

**Lifecycle:** Created when an order is placed. Never modified.

**Delete/archive:** Never deleted.

**MVP stage:** Core.

---

### 12.3 OrderItemModifier

**Purpose:** Snapshot of a selected modifier option within an order item.

**Ownership scope:** Belongs to one `OrderItem`.

**Conceptual fields:**

| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID | Internal primary key |
| `orderItemId` | UUID | FK → OrderItem |
| `modifierOptionId` | UUID \| null | FK → ModifierOption (reference, not constraint) |
| `modifierGroupName` | string | Snapshot of group name |
| `optionName` | string | Snapshot of option name |
| `priceAdjustment` | integer | Snapshot of price adjustment (minor units) |
| `createdAt` | timestamp | |

**Relationships:**

- Belongs to one `OrderItem`

**Invariants:**

- All fields are immutable after creation.
- `modifierOptionId` is a reference; changing the modifier later must not affect existing orders.

**Lifecycle:** Created with the parent `OrderItem`. Never modified.

**Delete/archive:** Never deleted.

**MVP stage:** Core.

---

### 12.4 OrderStatusHistory

**Purpose:** Immutable audit trail of every `OrderStatus` transition.

**Ownership scope:** Belongs to one `CustomerOrder`.

**Conceptual fields:**

| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID | Internal primary key |
| `orderId` | UUID | FK → CustomerOrder |
| `status` | enum | New OrderStatus value |
| `previousStatus` | enum \| null | null for initial creation |
| `changedByUserId` | UUID \| null | FK → User (null for system actions like expiration) |
| `note` | string \| null | e.g. rejection reason, cancellation reason |
| `createdAt` | timestamp | Immutable — represents transition time |

**Relationships:**

- Belongs to one `CustomerOrder`

**Invariants:**

- Records are **never** updated or deleted.
- Every `OrderStatus` transition creates exactly one record.
- `previousStatus` should match the current `CustomerOrder.orderStatus` at the time of the transition (before update).

**Lifecycle:** Created on every status transition. Append-only.

**Delete/archive:** Never deleted. Never modified.

**MVP stage:** Core.

---

## 13. Payments

### 13.1 Payment

**Purpose:** The authoritative aggregate for payment data. One `Payment` per `CustomerOrder`. PaymentStatus is stored here — never duplicated on the order.

**Ownership scope:** Belongs to exactly one `CustomerOrder`.

**Conceptual fields:**

| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID | Internal primary key |
| `orderId` | UUID | FK → CustomerOrder (unique) |
| `paymentMethod` | enum | ONLINE, IN_PERSON |
| `paymentStatus` | enum | UNPAID, PENDING, PAID, FAILED, EXPIRED, REFUNDED |
| `amount` | integer | Payment amount in minor units |
| `currencyCode` | string | ISO 4217 code, snapshot |
| `paidAt` | timestamp \| null | When payment succeeded |
| `expiresAt` | timestamp \| null | For ONLINE: 15 min after restaurant acceptance |
| `createdAt` | timestamp | |
| `updatedAt` | timestamp | |

**Relationships:**

- Belongs to exactly one `CustomerOrder`
- Has many `PaymentAttempt`
- Has many `PaymentStatusHistory`

**Invariants:**

- One `Payment` per `CustomerOrder` — the relationship is one-to-one.
- `amount` must match `CustomerOrder.grandTotal` at the time of payment initiation.
- `currencyCode` is snapshotted from the order's currency.
- `expiresAt` is set when `paymentStatus` becomes `PENDING` for ONLINE payments (15 minutes from order acceptance).
- Online payment expiration triggers: `CustomerOrder.orderStatus → CANCELLED`, `Payment.paymentStatus → EXPIRED`, `cancellationReason → PAYMENT_EXPIRED`.
- `paymentStatus` is the single source of truth for payment state. The order does not duplicate this field.
- Retries create new `PaymentAttempt` records, not new `Payment` records.

**Lifecycle:** Created when order is placed (status = UNPAID). Status transitions through state machine.

**Delete/archive:** Never deleted.

**MVP stage:** Core (IN_PERSON). Extended (ONLINE with expiration).

---

### 13.2 PaymentAttempt

**Purpose:** Records individual payment attempts for retry support. Attempts are immutable after completion.

**Ownership scope:** Belongs to one `Payment`.

**Conceptual fields:**

| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID | Internal primary key |
| `paymentId` | UUID | FK → Payment |
| `attemptNumber` | integer | Sequential within this payment |
| `provider` | string | Payment provider identifier |
| `externalReference` | string \| null | Provider's reference for this attempt |
| `requestedAmount` | integer | Amount requested in minor units |
| `currencyCode` | string | ISO 4217 code |
| `status` | enum | PENDING, SUCCESS, FAILED |
| `failureCode` | string \| null | Structured failure code from provider |
| `failureReason` | string \| null | Human-readable failure description |
| `startedAt` | timestamp | When attempt was initiated |
| `completedAt` | timestamp \| null | When attempt was finalized |
| `expiresAt` | timestamp \| null | When this attempt window expires |

**Relationships:**

- Belongs to one `Payment`

**Invariants:**

- `attemptNumber` is sequential per `Payment`.
- Only one attempt can have `status = SUCCESS` per payment.
- Failed attempts are retained for audit and are immutable after completion.
- Multiple attempts may occur during the same active 15-minute payment window.
- `requestedAmount` and `currencyCode` record what was sent to the provider.

**Lifecycle:** Created on each payment attempt. Finalized on success or failure. Never modified after completion.

**Delete/archive:** Never deleted.

**MVP stage:** Extended (needed when ONLINE payment is implemented).

---

### 13.3 PaymentStatusHistory

**Purpose:** Immutable audit trail of every `PaymentStatus` transition.

**Ownership scope:** Belongs to one `Payment`.

**Conceptual fields:**

| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID | Internal primary key |
| `paymentId` | UUID | FK → Payment |
| `paymentStatus` | enum | New PaymentStatus value |
| `previousPaymentStatus` | enum \| null | null for initial creation |
| `changedByUserId` | UUID \| null | FK → User (null for system actions) |
| `note` | string \| null | e.g. gateway error, expiration |
| `transactionId` | string \| null | Associated transaction reference |
| `createdAt` | timestamp | Immutable |

**Relationships:**

- Belongs to one `Payment`

**Invariants:**

- Records are **never** updated or deleted.
- Every `PaymentStatus` transition creates exactly one record.

**Lifecycle:** Created on every payment status transition. Append-only.

**Delete/archive:** Never deleted. Never modified.

**MVP stage:** Core.

---

## 14. History and Audit

### Immutable records (never updated, never deleted):

| Record | Reason |
|--------|--------|
| `MenuPublication` | Published menu state must be frozen |
| `MenuPublication.snapshot` | The JSON blob itself is immutable |
| `OrderStatusHistory` | Audit trail of order state transitions |
| `PaymentStatusHistory` | Audit trail of payment state transitions |
| `OrderItem` | Price snapshots must not change |
| `OrderItemModifier` | Modifier snapshots must not change |
| `PaymentAttempt` | Individual attempt records |
| `RestaurantInvitation` | Acceptance/expiration audit |

### Records that should be archived rather than deleted:

| Record | Reason |
|--------|--------|
| `Product` | Referenced by order snapshots and menu publications |
| `Category` | Referenced by product associations and menu publications |
| `Branch` | Referenced by orders, tables, publications |
| `RestaurantMembership` | Audit trail of who had access |
| `BranchTable` | Referenced by DINE_IN orders |
| `CustomerAddress` | Referenced by DELIVERY order snapshots |
| `ModifierGroup` | Referenced by order item snapshots |
| `ModifierOption` | Referenced by order item modifier snapshots |
| `TableQrToken` | Security audit trail |
| `MediaAsset` | Referenced by User, Restaurant, Product |

### Timestamp semantics:

| Field | Meaning |
|-------|---------|
| `createdAt` | When the record was created |
| `updatedAt` | When the record was last modified |
| `archivedAt` | When the record was soft-archived (null = active) |
| `deletedAt` | Not used — prefer `archivedAt` or status changes |
| `revokedAt` | When a token, permission, or session was revoked |
| `usedAt` | When a single-use token was consumed |

**Note:** Soft delete is not applied blindly. Each entity's lifecycle is considered individually. Tokens use `revokedAt`, entities use `archivedAt`, and status fields (SUSPENDED, INACTIVE) are preferred where appropriate.

---

## 15. Media Assets

### 15.1 MediaAsset

**Purpose:** References externally stored images and files. PostgreSQL never stores raw image or base64 data.

**Ownership scope:** Belongs to one `Restaurant` (nullable for user avatars). Explicit references replace the previous polymorphic model.

**Conceptual fields:**

| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID | Internal primary key |
| `uploadedByUserId` | UUID | FK → User (who uploaded the asset) |
| `restaurantId` | UUID \| null | FK → Restaurant (null for user avatars, required for restaurant/product assets) |
| `storageKey` | string | Path/key in the storage provider |
| `publicUrl` | string | Publicly accessible URL |
| `mimeType` | string | e.g. "image/jpeg", "image/png" |
| `fileSizeBytes` | integer | File size |
| `widthPx` | integer \| null | Image width |
| `heightPx` | integer \| null | Image height |
| `createdAt` | timestamp | |
| `archivedAt` | timestamp \| null | Null = active |

**Relationships:**

- Uploaded by one `User` (`uploadedByUserId`)
- Optionally belongs to one `Restaurant` (`restaurantId`)
- Referenced by `User.avatarMediaId`, `Restaurant.logoMediaId`, `Product.imageMediaId`

**Invariants:**

- PostgreSQL never stores raw image or base64 data.
- User avatar assets may have `restaurantId = null`.
- Restaurant and product assets must have `restaurantId` set and must belong to the same Restaurant tenant.
- Assigning an asset across restaurants is forbidden.
- `uploadedByUserId` records who uploaded the asset.
- Menu snapshots may preserve customer-visible asset URL/key data.
- Orphan handling: when an owning entity is archived/deleted, the `MediaAsset` record should be retained (or optionally cleaned up by a background job, but not deleted immediately).

**Lifecycle:** Created on upload. Retained even if the owning entity is archived.

**Delete/archive:** Can be soft-archived (`archivedAt` set). Not cascaded from owner deletion.

**MVP stage:** Core (basic image upload).

---

## 16. Tenant Isolation

Every business record has an explicit ownership path to `Restaurant` or `Branch`:

```
Product
  → Restaurant

Category
  → Restaurant

ModifierGroup
  → Restaurant

Branch
  → Restaurant

BranchProduct
  → Branch → Restaurant

BranchTable
  → Branch → Restaurant

TableQrToken
  → BranchTable → Branch → Restaurant

MenuDraft
  → Branch → Restaurant

MenuPublication
  → Branch → Restaurant

CustomerOrder
  → Branch → Restaurant
  → User (customer)

Payment
  → CustomerOrder → Branch → Restaurant

BranchWorkingInterval
  → Branch → Restaurant

BranchSpecialHours
  → Branch → Restaurant

BranchDailyOrderCounter
  → Branch → Restaurant

MediaAsset
  → Restaurant (nullable)
```

### API context resolution (conceptual):

1. Every authenticated request carries the user's identity.
2. For restaurant operations, the request includes a `restaurantId` or `branchId`.
3. The backend resolves the user's `RestaurantMembership` for that restaurant.
4. The membership role and permissions determine access.
5. **Never trust a request-provided `restaurantId` or `branchId` without checking the membership.**

### Query-level isolation:

All restaurant-scoped queries must filter by the resolved `restaurantId`:

```sql
-- Example: fetching products for a restaurant
SELECT * FROM product WHERE restaurant_id = :resolvedRestaurantId

-- Example: fetching orders for a branch
SELECT * FROM customer_order
WHERE branch_id = :resolvedBranchId
  AND branch_id IN (
    SELECT b.id FROM branch b
    WHERE b.restaurant_id = :resolvedRestaurantId
  )
```

### Public customer endpoints:

- The QR token path (`/menu/:token`) resolves internally: token → table → branch → active publication.
- No internal IDs are exposed in the public menu URL.
- The order creation endpoint requires authentication and validates the branch exists.

---

## 17. Finalized Technical Decisions

The following technical decisions are finalized and implemented as described. No alternatives are open.

1. **Menu publications use immutable JSON snapshots.** `MenuPublication.snapshot` stores the entire menu state as a single JSON column. This avoids normalized snapshot tables and simplifies rollback/versioning.

2. **Product belongs to exactly one Category in MVP.** `Product.categoryId` is a required FK. A Category with active Products cannot be destructively deleted — products must be moved or archived first.

3. **Membership permissions use grants-only.** OWNER has all permissions implicitly. MANAGER and others receive permissions only via explicit `MembershipPermission` grant records. No deny model.

4. **Orders use internal ID, publicCode, and branch/business-date displayNumber.** Every `CustomerOrder` has: `id` (UUID, internal), `publicCode` (globally unique, non-sequential, non-guessable, for customer URLs), `displayNumber` (short integer, unique per branch+businessDate, for staff display as `#0042`), `businessDate` (local operational date). A `BranchDailyOrderCounter` manages sequential allocation per branch per day.

5. **Money uses integer minor units.** All monetary values are integers. Initial deployment uses IRR stored in Rial. Frontend may display Toman where appropriate (1 Toman = 10 Rial). Percentage values use integer basis points. Payment gateways require an explicit Rial/Toman adapter to prevent ten-times amount errors.

6. **Working hours use current-state normalized schedules.** `BranchWorkingInterval` stores recurring weekday intervals (supports split shifts). `BranchSpecialHours` overrides specific dates. No historical versioning. Times are interpreted in `Branch.timezone`.

7. **One Order has exactly one Payment.** `CustomerOrder` has a one-to-one relationship with `Payment`. `Payment` has many `PaymentAttempt` records for retry support. PaymentStatus lives exclusively on `Payment` — never duplicated on the order.

8. **Active menu publication pointer lives on Branch.** `MenuPublication` records are completely immutable — they never have an `isCurrentlyActive` flag. Instead, `Branch.activeMenuPublicationId` points to the currently active publication. This pointer is null before the first publish, and is updated in the same transaction that creates a new publication (on Publish or Rollback).

9. **MediaAsset uses explicit references, not polymorphic ownership.** `MediaAsset` has `uploadedByUserId` and an optional `restaurantId`. User avatars reference `User.avatarMediaId`, restaurant logos reference `Restaurant.logoMediaId`, and product images reference `Product.imageMediaId`. Assigning an asset across restaurants is forbidden.

10. **RestaurantMembership uses ACTIVE, SUSPENDED, REMOVED statuses.** The `INVITED` status does not exist on Membership — pending invitations are handled exclusively by `RestaurantInvitation`. A `(userId, restaurantId)` pair is unique across all membership records. If a removed user rejoins, the existing record is reactivated.

---

## Summary

| Area | Entities | MVP Stage |
|------|----------|-----------|
| Identity & Auth | User, AuthAccount, RefreshSession, EmailVerificationToken, PasswordResetToken | Core |
| Restaurant & Membership | Restaurant, Branch, RestaurantMembership, MembershipPermission | Core |
| Restaurant & Membership | RestaurantInvitation | Extended |
| Branch Configuration | BranchFeeConfig, BranchWorkingInterval, BranchSpecialHours, BranchDailyOrderCounter | Core |
| Branch Configuration | DeliveryConfig | Extended |
| Tables & QR | BranchTable, TableQrToken | Core |
| Product Catalog | Category, Product | Core |
| Branch Product | BranchProduct | Core |
| Modifiers | ModifierGroup, ModifierOption, ProductModifierGroup | Core |
| Menu Publishing | MenuDraft, MenuPublication | Core |
| Customer | CustomerAddress | Extended |
| Orders | CustomerOrder, OrderItem, OrderItemModifier, OrderStatusHistory | Core |
| Payments | Payment, PaymentStatusHistory | Core |
| Payments | PaymentAttempt | Extended |
| Media | MediaAsset | Core |

**Total entities:** 34
**Core entities:** 30
**Extended-only entities:** 4 (RestaurantInvitation, DeliveryConfig, CustomerAddress, PaymentAttempt)
