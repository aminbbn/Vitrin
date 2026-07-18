# Vitrin Domain Model Specification

This document serves as the official domain model specification and source of truth for the frontend application layer of Vitrin (Restaurant SaaS platform).

---

## 1. Domain Entities & Modular Organization

The domain contract layer is partitioned into six clear context modules to maintain strict architectural boundaries:

```
domain/
├── auth.ts       # Identity and Access Management
├── tenant.ts     # Multi-Tenant & Organizational Hierarchy
├── catalog.ts    # Global Restaurant Menu catalog
├── menu.ts       # Menu Draft, Revisions, and Immutable Publications
├── orders.ts     # Customer Dine-In, Delivery and Take-Away Orders
├── payments.ts   # Separate Payment Ledger matching payments to orders
└── index.ts      # Unified domain contract exports
```

---

## 2. Context Boundary Specifications

### 2.1 Identity and Access (`auth.ts`)
- **User**: Represents a platform user with a distinct `id` (string UUID representation), contact details, and platform-level status.
- **AuthProvider**: Defines available authentication workflows (`PASSWORD`, `OTP`, `GOOGLE`).
- **AppSession**: Active user login session capturing authentication token validity.

### 2.2 Multi-Tenant Hierarchy (`tenant.ts`)
- **Restaurant**: Platform-level tenant. Has custom slug branding.
- **Branch**: Physical storefront belonging to a Restaurant.
- **RestaurantMembership**: Binds a `User` to a `Restaurant` tenant, providing specific role-based permissions (`MembershipRole`) and status tracking.
- **MembershipPermission**: Specific capabilities assigned to a membership (e.g., `MENU_PUBLISH`, `MENU_ROLLBACK`).

### 2.3 Product Catalog Hierarchy (`catalog.ts`)
- **Category**: Structural divider for menu items.
- **Product**: Core restaurant-level product template (defining name, description, media assets, ingredients, rating metadata, and customizable options).
  - *Invariant*: **Product is independent of pricing or specific physical availability.** It does not hold branch-specific pricing, discount prices, branch availability, or legacy inventory variables like `rawMaterials`.
  - *Invariant*: **A Product belongs to exactly one Category.**
- **BranchProduct**: Maps a core `Product` to a physical `Branch`. Holds properties like localized pricing (`branchPriceRial`), branch-specific discount prices (`branchDiscountPriceRial`), status availability (`isAvailable`), visual visibility (`isVisible`), and ordering state (`orderingEnabled`).
- **ModifierGroup & ModifierOption**: Customizable additions or configurations (like drink choices, pizza sizes, extra toppings).

### 2.4 Menu Release Management (`menu.ts`)
- **MenuDraft**: Working in-progress configuration representing catalog additions and updates.
- **MenuPublication**: An immutable release configuration of a restaurant's menu catalog. Includes a versioned point-in-time snapshot (`MenuPublicationSnapshot`) containing structural Category and Product configuration.
- **CustomerMenuSource**: Customer-facing menu snapshot loaded upon branch menu request.

### 2.5 Orders & Table Context (`orders.ts`)
- **OrderType**: Order execution channel (`DINE_IN`, `TAKE_AWAY`, `DELIVERY`).
- **OrderStatus**: Snapshots the workflow from request to resolution:
  `PENDING_APPROVAL` ➔ `ACCEPTED` ➔ `PREPARING` ➔ `READY` ➔ `OUT_FOR_DELIVERY` / `COMPLETED` / `CANCELLED`
- **CustomerOrder**: Encapsulates selected order items, subtotal, tax calculations, customer metadata, table contexts, and display numbers.
  - *Identity Constraint*: Staff dashboard display refers to `displayNumber` (e.g., `#12`), while customer-facing/receipt references use `publicCode`.
- **DineInContext**: Physical branch table identifier (table number, QR code metadata, seating capacities) utilized during `DINE_IN` requests.

### 2.6 Payments (`payments.ts`)
- **Payment**: Separate transaction ledger representing monetary clearing matching a `CustomerOrder`.
- **PaymentStatus**: Independent state flow:
  `UNPAID` ➔ `PENDING` ➔ `PAID` ➔ `FAILED` ➔ `EXPIRED` / `REFUNDED`
  - *Invariant*: **Payment status and Order status are independent.** An order can be marked `ACCEPTED` before being `PAID` (e.g., pay-after-dine in), or remain `UNPAID` but in `PREPARING` state.

---

## 3. Mandatory Engineering Rules

1. **System Identifiers**: All identifiers (`id`, `restaurantId`, `branchId`, `userId`, `orderId`, `productId`) are represented as unique strings mapping to UUIDs in mock databases.
2. **Monetary Discipline**:
   - All money fields are integer values in Iranian Rial (IRR).
   - Money field declarations must be named with a clear suffix `Rial` (e.g. `branchPriceRial`, `subtotalRial`, `grandTotalRial`, `amountRial`, `priceRial`) to guarantee absolute clarity.
3. **No Legacy Fields**:
   - Legacy `rawMaterials` is an obsolete inventory feature and is completely excluded from the domain types.
4. **Separation of Concerns**:
   - UI structural configuration (like `ComponentItem`, `ViewState`, page layouts, canvas designer states) belongs to visual configuration files (`types.ts` or local UI state) and is completely separate from the core restaurant and business domain entities.
