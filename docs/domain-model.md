# Vitrin — Domain Model (Menu-Only MVP)

**Version:** 2.0
**Date:** 2026-07-20
**Source of truth:** `docs/product-blueprint.md` v2.0

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
11. [Media Assets](#11-media-assets)
12. [Tenant Isolation](#12-tenant-isolation)
13. [Finalized Technical Decisions](#13-finalized-technical-decisions)

---

## 1. Architecture Overview

Vitrin is a **multi-tenant SaaS platform** for restaurants. The tenant hierarchy flows:

```
User → RestaurantMembership → Restaurant → Branch
```

A single `User` may simultaneously be:

- A customer browsing menus (no authentication required)
- An OWNER of one restaurant
- A MANAGER of another restaurant

Roles are **not** stored on `User` — they belong to `RestaurantMembership`. Every business-owned record traces an explicit ownership path to a `Restaurant` or `Branch`.

**This MVP is a read-only digital restaurant menu.** Customers browse without authentication. No ordering, checkout, or payment capability exists.

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
```

Every authenticated restaurant operation resolves membership against the owning `Restaurant`. A request-provided `restaurantId` or `branchId` must **never** be trusted without authorization checks against the caller's `RestaurantMembership`.

---

## 3. Identity and Authentication

### 3.1 User

**Purpose:** Unified identity for all platform actors (restaurant owner, manager).

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

**Invariants:**

- One email maps to exactly one `User`.
- `email` is unique across the platform.
- A `User` without `passwordHash` can only authenticate via Google.
- `emailVerifiedAt` must be set before creating a restaurant or accepting an invitation.

**Lifecycle:** Created on first registration (email or Google). Never hard-deleted — suspended if needed.

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

**Invariants:**

- The `(provider, providerAccountId)` pair must be unique.
- Google authentication must only trust the email after backend validation of the Google ID Token.

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

**MVP stage:** Core.

---

### 3.4 EmailVerificationToken

**Purpose:** One-time token for email verification.

**MVP stage:** Core.

---

### 3.5 PasswordResetToken

**Purpose:** One-time token for password reset flow.

**MVP stage:** Core.

---

## 4. Restaurant and Membership

### 4.1 Restaurant

**Purpose:** Top-level tenant entity representing a restaurant business.

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

**MVP stage:** Core.

---

### 4.2 Branch

**Purpose:** A physical or online location of a restaurant. Each branch has independent configuration, pricing, availability, and menu publication.

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
| `publicMenuEnabled` | boolean | Whether the public menu is accessible for this branch |
| `activeMenuPublicationId` | UUID \| null | FK → MenuPublication (null before first publish) |
| `createdAt` | timestamp | |
| `updatedAt` | timestamp | |

**Relationships:**

- Belongs to one `Restaurant`
- Has many `BranchTable`
- Has many `BranchProduct`
- Has one `MenuDraft`
- Has many `MenuPublication`
- Has many `BranchWorkingInterval`
- Has many `BranchSpecialHours`

**MVP stage:** Core.

---

### 4.3 RestaurantMembership

**Purpose:** Connects a `User` to a `Restaurant` with a specific role and optional explicit permissions.

**Conceptual fields:**

| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID | Internal primary key |
| `userId` | UUID | FK → User |
| `restaurantId` | UUID | FK → Restaurant |
| `role` | enum | OWNER, MANAGER |
| `status` | enum | ACTIVE, SUSPENDED, REMOVED |
| `createdAt` | timestamp | |
| `updatedAt` | timestamp | |

**Invariants:**

- A `User` may have only **one** `RestaurantMembership` per `Restaurant`.
- `OWNER` role is implied by restaurant creation (first membership).

**MVP stage:** Core.

---

### 4.4 RestaurantInvitation

**Purpose:** Invites a user (by email) to join a restaurant with a specific role.

**Conceptual fields:**

| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID | Internal primary key |
| `restaurantId` | UUID | FK → Restaurant |
| `invitedEmail` | string | Email of the invitee |
| `role` | enum | MANAGER |
| `invitedByUserId` | UUID | FK → User (who sent invitation) |
| `tokenHash` | string | Hashed acceptance token |
| `status` | enum | PENDING, ACCEPTED, EXPIRED, REVOKED |
| `expiresAt` | timestamp | Invitation expiration |
| `acceptedAt` | timestamp \| null | When invitation was accepted |
| `createdAt` | timestamp | |

**MVP stage:** Extended.

---

### 4.5 MembershipPermission

**Purpose:** Stores explicit permission grants on a membership.

**Conceptual fields:**

| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID | Internal primary key |
| `membershipId` | UUID | FK → RestaurantMembership |
| `permission` | enum | MENU_PUBLISH, MENU_ROLLBACK |
| `grantedAt` | timestamp | |
| `grantedByUserId` | UUID | FK → User (the OWNER who granted) |

**Invariants:**

- `OWNER` always has all permissions implicitly — no records needed.
- Permissions are **grants only** (no deny model).

**MVP stage:** Core.

---

## 5. Branch Configuration

### 5.1 BranchWorkingInterval

**Purpose:** Defines a recurring working-hours interval for a branch on a specific weekday.

**Conceptual fields:**

| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID | Internal primary key |
| `branchId` | UUID | FK → Branch |
| `weekday` | integer | 0 = Sunday … 6 = Saturday |
| `opensAt` | string | Time of day, e.g. "09:00" |
| `closesAt` | string | Time of day, e.g. "22:00" |
| `displayOrder` | integer | Sort order for multiple intervals per day |
| `createdAt` | timestamp | |
| `updatedAt` | timestamp | |

**MVP stage:** Core.

---

### 5.2 BranchSpecialHours

**Purpose:** Overrides normal working-hours intervals for specific dates.

**Conceptual fields:**

| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID | Internal primary key |
| `branchId` | UUID | FK → Branch |
| `localDate` | date | The calendar date being overridden |
| `isClosed` | boolean | True = branch is closed on this date |
| `opensAt` | string \| null | Override open time (null if closed) |
| `closesAt` | string \| null | Override close time (null if closed) |
| `note` | string \| null | Human-readable reason |
| `createdAt` | timestamp | |
| `updatedAt` | timestamp | |

**MVP stage:** Core.

---

## 6. Tables and QR Security

### 6.1 BranchTable

**Purpose:** Represents a physical table in a restaurant branch. Used to open the correct read-only menu via QR code.

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

**MVP stage:** Core.

---

### 6.2 TableQrToken

**Purpose:** Secure, non-sequential public token for QR code scanning. Resolves to a table → branch → active published menu.

**QR resolution path:**

```
QR token
  → TableQrToken (find ACTIVE token)
  → BranchTable
  → Branch
  → MenuPublication (active version for this branch)
```

**MVP stage:** Core.

---

## 7. Product Catalog

### 7.1 Category

**Purpose:** Organizes products into display groups within a restaurant's menu.

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

**MVP stage:** Core.

---

### 7.2 Product

**Purpose:** Represents a menu item in the restaurant's master product catalog.

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

**MVP stage:** Core.

---

## 8. Branch Product Configuration

### 8.1 BranchProduct

**Purpose:** Connects a master `Product` to a `Branch` with branch-specific pricing, availability, and visibility.

**Conceptual fields:**

| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID | Internal primary key |
| `branchId` | UUID | FK → Branch |
| `productId` | UUID | FK → Product |
| `branchPrice` | integer | Price in minor currency units |
| `branchDiscountPrice` | integer \| null | Discounted price, null = no discount |
| `availability` | enum | AVAILABLE, UNAVAILABLE |
| `isVisible` | boolean | Should product appear in this branch's menu? |
| `createdAt` | timestamp | |
| `updatedAt` | timestamp | |

**Two distinct price concepts:**

1. **Current configuration price** (`BranchProduct.branchPrice`) — what the admin sees and edits. Source of truth for the next publish.
2. **Published customer-visible price** — stored inside `MenuPublication.snapshot`. What customers see on the menu.

**Invariants:**

- **Price changes require menu Publish** before becoming customer-visible.
- **Availability changes apply immediately** — no Publish required.

**MVP stage:** Core.

---

## 9. Modifiers

### 9.1 ModifierGroup

**Purpose:** A named group of modifier options (e.g. "Size", "Spice Level", "Add-ons").

**MVP stage:** Core.

---

### 9.2 ModifierOption

**Purpose:** An individual selectable option within a modifier group.

**MVP stage:** Core.

---

### 9.3 ProductModifierGroup

**Purpose:** Associates a `Product` with one or more `ModifierGroup`s.

**MVP stage:** Core.

---

## 10. Menu Draft and Publishing

### 10.1 MenuDraft

**Purpose:** The single editable draft for a branch's menu. Preview reads from this. Publish creates an immutable snapshot from this.

**Conceptual fields:**

| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID | Internal primary key |
| `branchId` | UUID | FK → Branch (unique) |
| `layout` | JSON | Menu layout configuration |
| `theme` | JSON | Theme settings |
| `categoryConfig` | JSON | Category visibility, ordering |
| `productConfig` | JSON | Product visibility, ordering |
| `displaySettings` | JSON | Other display settings |
| `lastPublishedAt` | timestamp \| null | When this draft was last published |
| `createdAt` | timestamp | |
| `updatedAt` | timestamp | |

**MVP stage:** Core.

---

### 10.2 MenuPublication

**Purpose:** An immutable snapshot of the menu at the time of publishing. Customers see only the active publication.

**Conceptual fields:**

| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID | Internal primary key |
| `branchId` | UUID | FK → Branch |
| `version` | integer | Monotonically increasing per branch |
| `schemaVersion` | integer | Snapshot schema version |
| `snapshot` | JSON | Complete menu state at publish time (immutable) |
| `publishedByUserId` | UUID | FK → User |
| `createdAt` | timestamp | |

**Invariants:**

- Published records are **never edited in place**.
- `version` is unique per `Branch`.
- `snapshot` is a complete, self-contained JSON representation.
- **Rollback** creates a **new** publication whose `snapshot` matches an older version's snapshot.
- The active publication pointer is maintained on `Branch.activeMenuPublicationId`.

**MVP stage:** Core.

---

## 11. Media Assets

### 11.1 MediaAsset

**Purpose:** References externally stored images and files.

**Conceptual fields:**

| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID | Internal primary key |
| `uploadedByUserId` | UUID | FK → User |
| `restaurantId` | UUID \| null | FK → Restaurant (null for user avatars) |
| `storageKey` | string | Path/key in storage |
| `publicUrl` | string | Publicly accessible URL |
| `mimeType` | string | e.g. "image/jpeg" |
| `fileSizeBytes` | integer | File size |
| `widthPx` | integer \| null | Image width |
| `heightPx` | integer \| null | Image height |
| `createdAt` | timestamp | |
| `archivedAt` | timestamp \| null | |

**MVP stage:** Core.

---

## 12. Tenant Isolation

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

BranchWorkingInterval
  → Branch → Restaurant

BranchSpecialHours
  → Branch → Restaurant

MediaAsset
  → Restaurant (nullable)
```

### Public customer endpoints:

- The QR token path resolves internally: token → table → branch → active publication.
- No internal IDs are exposed in the public menu URL.
- No authentication is required to browse the public menu.

---

## 13. Finalized Technical Decisions

1. **Menu publications use immutable JSON snapshots.** `MenuPublication.snapshot` stores the entire menu state as a single JSON column.

2. **Product belongs to exactly one Category in MVP.** `Product.categoryId` is a required FK.

3. **Membership permissions use grants-only.** OWNER has all permissions implicitly. MANAGER receives permissions only via explicit `MembershipPermission` grant records.

4. **Money uses integer minor units.** All monetary values are integers. Initial deployment uses IRR stored in Rial.

5. **Working hours use current-state normalized schedules.** `BranchWorkingInterval` stores recurring weekday intervals. `BranchSpecialHours` overrides specific dates.

6. **Active menu publication pointer lives on Branch.** `Branch.activeMenuPublicationId` points to the currently active publication.

7. **MediaAsset uses explicit references, not polymorphic ownership.** `MediaAsset` has `uploadedByUserId` and an optional `restaurantId`.

8. **RestaurantMembership uses ACTIVE, SUSPENDED, REMOVED statuses.** A `(userId, restaurantId)` pair is unique across all membership records.

---

## Summary

| Area | Entities | MVP Stage |
|------|----------|-----------|
| Identity & Auth | User, AuthAccount, RefreshSession, EmailVerificationToken, PasswordResetToken | Core |
| Restaurant & Membership | Restaurant, Branch, RestaurantMembership, MembershipPermission | Core |
| Restaurant & Membership | RestaurantInvitation | Extended |
| Branch Configuration | BranchWorkingInterval, BranchSpecialHours | Core |
| Tables & QR | BranchTable, TableQrToken | Core |
| Product Catalog | Category, Product | Core |
| Branch Product | BranchProduct | Core |
| Modifiers | ModifierGroup, ModifierOption, ProductModifierGroup | Core |
| Menu Publishing | MenuDraft, MenuPublication | Core |
| Media | MediaAsset | Core |

**Total entities:** 23
