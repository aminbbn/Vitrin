# Vitrin — Product Blueprint (Menu-Only MVP)

**Version:** 2.0
**Date:** 2026-07-20
**Status:** Menu-Only MVP — all transactional features removed.

---

## Table of Contents

1. [Product Definition](#1-product-definition)
2. [Actor Definitions](#2-actor-definitions)
3. [Confirmed Decisions](#3-confirmed-deisions)
4. [Finalized Product Decisions](#4-finalized-product-decisions)
5. [Platform Domains](#5-platform-domains)
6. [Core User Journeys](#6-core-user-journeys)
7. [Menu Publishing Lifecycle](#7-menu-publishing-lifecycle)
8. [Role and Permission Matrix](#8-role-and-permission-matrix)
9. [Glossary](#9-glossary)
10. [Frontend Inventory](#10-frontend-inventory)
11. [MVP Scope](#11-mvp-scope)
12. [Implementation Order](#12-implementation-order)
13. [Future Decisions (Non-blocking)](#13-future-decisions)
14. [Roadmap Acceptance Criteria](#14-roadmap-acceptance-criteria)

---

## 1. Product Definition

**Vitrin** is a SaaS platform for restaurants that provides a **digital menu** accessible via QR codes or direct links. Customers can browse published menus without authentication.

**This MVP is a read-only digital restaurant menu for customers.** There is no cart, no order creation, no payment capability, and no delivery system. Authentication is exclusively for restaurant administrators.

**Target audience:** Restaurants, cafes, fast-food outlets, and any food business that needs a digital menu presence.

---

## 2. Actor Definitions

### 2.1 Customer

- Any user who browses a restaurant's public menu.
- **No authentication is required to browse the menu.**
- No ordering, checkout, or payment capability exists in this MVP.

### 2.2 Restaurant Owner

- A user who has created a restaurant or owns it.
- Full access to all restaurant settings including branches, members, roles, and menu publication.
- Can manage branches, categories, products, modifiers, menu drafts, and publications.

### 2.3 Manager

- A user invited by the OWNER with the MANAGER role.
- Access to manage products, categories, modifiers, menu design, and branch configuration.
- No access to ownership transfer.
- No access to Publish or Rollback unless explicitly granted by OWNER.

### 2.4 Platform Admin (Internal Admin) — Out of Scope

- Managing platform restaurants and users.
- Support and service suspension.

---

## 3. Confirmed Decisions

| # | Decision |
|---|----------|
| 1 | A user may be an OWNER or MANAGER of any number of restaurants. |
| 2 | A restaurant may have any number of branches. |
| 3 | Each table has a dedicated QR code that opens the read-only menu for that branch. |
| 4 | Customers do not require authentication to browse the menu; authentication is only for restaurant administrators. |
| 5 | Membership roles: OWNER, MANAGER. |
| 6 | Each branch independently controls: product price, discount price, availability, visibility, and public menu toggle. |
| 7 | Menu publication: Draft editing → Preview → Publish → Publication history → Full rollback. No field-by-field comparison in MVP. |
| 8 | Authentication methods: Email + Password and Google Login. |
| 9 | One email maps to one User. A user may use both methods. Google accounts with matching verified emails link to the existing User. Google-only users may have a null passwordHash. Email verification and password recovery are required. Access Token and Refresh Token architecture is required. Phone numbers are profile information, not login methods. |
| 10 | A User may simultaneously be a regular customer, OWNER of one restaurant, and MANAGER of another. Roles belong to RestaurantMembership, not directly to User. |
| 11 | Menu publication is independent per branch. Each branch has its own Draft and active published version. Publications are not shared between branches. The restaurant's master product catalog may be shared. |
| 12 | MANAGER does not have Publish or Rollback access by default. OWNER may explicitly grant MENU_PUBLISH and MENU_ROLLBACK permissions to Manager. Authentication is based on permissions, not button visibility in the frontend. |
| 13 | Availability MVP only includes AVAILABLE/UNAVAILABLE status. Numeric inventory accounting is not implemented in this MVP. Availability changes apply immediately and do not require publishing a new menu version. |
| 14 | Table QR tokens must be unique, non-sequential, non-guessable, replaceable, and revocable. Token replacement revokes the previous token. The public QR token must not expose internal database identifiers. |
| 15 | Email verification is required before creating a restaurant or accepting an invitation. Google-verified emails are automatically considered verified. |

---

## 4. Finalized Product Decisions

### 4.1 Menu Publication per Branch

- Each branch has its own independent Draft.
- Each branch has its own active published version.
- Publications are not shared between branches in this MVP.
- The restaurant's master product catalog may be shared across branches.
- Each branch independently controls price, discount, visibility, and availability.

### 4.2 Manager Publish Permission

- MANAGER does not have Publish or Rollback access by default.
- OWNER may explicitly grant MENU_PUBLISH or MENU_ROLLBACK permissions to Manager.
- Authentication is based on **permissions**, not button visibility in the frontend.
- OWNER always has these permissions.

### 4.3 Availability Model

- MVP does not implement numeric inventory accounting.
- Branch availability uses operational statuses: AVAILABLE, UNAVAILABLE.
- Availability changes apply **immediately** and do not require publishing a new menu version.

### 4.4 Table QR Token Security

Table QR tokens must be:
- **Unique** across all tokens.
- **Non-sequential** (non-guessable).
- **Replaceable** — regenerating a token revokes the previous one.
- **Revocable** — tokens can be explicitly revoked.

The public QR token must not expose internal database IDs.

---

## 5. Platform Domains

### 5.1 Public Marketing Website

**Purpose:**
- Landing pages
- Feature and solution showcase
- Registration and login
- Demo requests

### 5.2 Restaurant Management Platform (Admin Panel)

**Purpose:**
- Restaurant and identity management
- Branch management
- Team member and role management
- Table and QR code management
- Categories
- Products
- Modifiers
- Branch-specific pricing and availability
- Menu design, preview, and publication

### 5.3 Customer Menu (Read-Only)

**Purpose:**
- Browse public menu
- Branch and table detection via QR
- Category and product browsing
- Product details with modifiers

**Authentication is not required.** Customers simply browse the published menu.

### 5.4 Internal Platform Admin — Out of Scope

- Restaurant management
- User management
- Support and suspension
- Subscription and plan management (future)

---

## 6. Core User Journeys

### 6.1 Restaurant Management Flow (Admin)

```
1. User registers or logs in.
2. User verifies email (required before creating a restaurant).
3. User creates a restaurant or accepts a membership invitation.
4. User creates one or more branches.
5. User configures branch settings (timezone, currency).
6. User creates tables and QR codes.
7. User creates categories.
8. User creates the restaurant's master product catalog.
9. User configures branch-specific pricing and availability.
10. User creates modifier groups and options.
11. User edits the menu Draft.
12. User previews the menu.
13. User publishes the menu.
14. Customers access the published menu via QR or direct link.
```

### 6.2 Customer Menu Browsing Flow

```
Scan QR code on table
→ Detect branch and table
→ Load published menu (no authentication required)
→ Browse categories and products
→ View product details with modifiers
→ No cart, no order, no payment
```

---

## 7. Menu Publishing Lifecycle

### 7.1 Publishing Model

```
┌─────────────┐     ┌─────────────┐     ┌──────────────┐
│    Draft     │ ──→ │   Preview   │ ──→ │   Publish    │
│  (editable)  │     │  (reads     │     │  (immutable  │
│              │     │   Draft)    │     │   snapshot)  │
└─────────────┘     └─────────────┘     └──────────────┘
      ↑                                       │
      │           ┌──────────────┐            │
      └───────────│   Rollback   │ ←──────────┘
                  │  (creates new│
                  │   version    │
                  │   from       │
                  │   snapshot)  │
                  └──────────────┘
```

- **One editable Draft** exists per branch.
- **Preview** reads the Draft and displays it without changes.
- **Each Publish** creates an immutable snapshot.
- **One active published version** exists at any time (after first publish).
- **Customer menu reads only the active published version.**
- **Editing the Draft has no effect on customers.**
- **Rollback** creates a **new version** based on a previous snapshot (historical data is never mutated).
- **Published versions are never modified in place.**

### 7.2 Rollback Details

```
Version 5 is active
→ rollback to Version 3
→ create Version 6 with snapshot matching Version 3
→ Version 6 becomes active
→ Version 5 record is never modified
```

### 7.3 Pricing in Publications

- Changes to branch price or discount price do **not** affect customers immediately.
- Price changes become customer-visible only after **Publish**.
- Customer menu prices are read from the **active published snapshot**.

### 7.4 Availability vs Publishing

- `AVAILABLE / UNAVAILABLE` are **live operational** data.
- Availability changes apply **immediately**.
- Availability changes do not require a new Publish.
- A product may exist in the published snapshot but be instantly hidden because its live availability is UNAVAILABLE.

### 7.5 Publication Snapshot Content

Each publication snapshot must include:

- Menu layout
- Theme settings
- Category visibility and ordering
- Product visibility and ordering
- Product display name and description
- Product image
- Branch-specific prices at publication time
- Branch-specific discount prices at publication time
- Modifier options visible to customers
- Other display settings

### 7.6 Publication History

Each publication creates a record with:
- `publishedAt`: publication timestamp
- `publishedBy`: user who published (must have MENU_PUBLISH permission)
- `version`: version number
- `snapshot`: complete Draft state at publication time

### 7.7 Independent Branch Publication

- Each branch has its own Draft, Preview, and publications.
- Publications are not shared between branches in this MVP.
- The restaurant's master product catalog may be shared.
- Each branch independently controls price, discount, visibility, and availability.

---

## 8. Role and Permission Matrix

### 8.1 OWNER

| Area | Access |
|------|--------|
| Restaurant | Full |
| Branches | Create, edit, delete |
| Team members and roles | Create, edit, delete, change role |
| Permissions | Grant MENU_PUBLISH and MENU_ROLLBACK |
| MENU_PUBLISH | ✓ (always) |
| MENU_ROLLBACK | ✓ (always) |
| Categories | Create, edit, delete |
| Products | Create, edit, delete |
| Modifiers | Create, edit, delete |
| Menu design | Edit Draft |
| Preview | ✓ |
| Settings | Full |

### 8.2 MANAGER

| Area | Access |
|------|--------|
| Products | Create, edit, delete |
| Categories | Create, edit, delete |
| Modifiers | Create, edit, delete |
| Branch operational config | Edit |
| Menu design | Edit Draft |
| Preview | ✓ |
| MENU_PUBLISH | ✗ (only with explicit OWNER grant) |
| MENU_ROLLBACK | ✗ (only with explicit OWNER grant) |
| Ownership transfer | ✗ |

---

## 9. Glossary

| Term | Definition |
|------|------------|
| **Branch** | A physical or online location of a restaurant |
| **QR Code** | A code unique to each table linking to the branch menu |
| **QR Token** | A secure, non-guessable token associated with each table |
| **Draft** | The editable menu version with no customer impact |
| **Preview** | Customer-facing view of the Draft without server changes |
| **Publish** | Creation of an immutable snapshot from the Draft |
| **Rollback** | Creation of a new version from a previous snapshot (no data mutation) |
| **Snapshot** | A complete, immutable copy of menu state at a point in time |
| **Modifier** | An additional selectable option for a product (e.g. size, spice level) |
| **ModifierGroup** | A group of modifiers (e.g. "Size" including medium, large, family) |
| **RestaurantMembership** | A user's membership in a restaurant with a specific role |
| **Master Product Catalog** | The restaurant's shared product catalog (shared across branches) |
| **MENU_PUBLISH** | Permission to publish menu |
| **MENU_ROLLBACK** | Permission to rollback to a previous menu version |

---

## 10. Frontend Inventory

### 10.1 Existing Pages

| Page | File | Status |
|------|------|--------|
| Landing page | `LandingPage.tsx` | ✅ Exists |
| Features page | `FeaturesPage.tsx` | ✅ Exists |
| Solutions page | `SolutionsPage.tsx` | ✅ Exists |
| Marketing header | `MarketingHeader.tsx` | ✅ Exists |
| Login page | `LoginPage.tsx` | ⚠️ Exists — no real auth |
| Dashboard | `Dashboard.tsx` | ⚠️ Exists — mock data |
| Canvas designer | `CanvasDesigner.tsx` | ⚠️ Exists — localStorage |
| Product manager | `ProductManager.tsx` | ⚠️ Exists — localStorage CRUD |
| Category manager | `CategoryManager.tsx` | ⚠️ Exists — localStorage CRUD |
| Settings | `Settings.tsx` | ⚠️ Exists — localStorage |
| Customer menu | `CustomerMenu.tsx` | ⚠️ Exists — mock data |
| Menu blocks | `menu-blocks/` (9 files) | ✅ Exists |

---

## 11. MVP Scope

### 11.1 Menu-Only MVP

> This is a **read-only digital restaurant menu** for customers.

**Included:**
- Authentication (Email + Password, Google Login)
- Email verification
- Password recovery
- Unified User model
- Restaurant creation
- Multiple branches
- Membership and roles (OWNER, MANAGER)
- Permission system (MENU_PUBLISH, MENU_ROLLBACK)
- Categories
- Master product catalog
- Branch-specific pricing
- Branch-specific discount pricing
- Branch-specific availability (AVAILABLE/UNAVAILABLE)
- Modifiers
- Branch Draft (single editable draft)
- Preview
- Publish (snapshot)
- Public customer menu
- Tables and secure QR tokens
- Branch-specific public menu toggle
- Image upload

**Not included (by design):**
- Cart
- Checkout
- Order creation
- Order management
- Payment (online or in-person)
- Payment gateway
- Delivery
- Customer addresses
- Tax, service fees, or packaging fees
- Cashier workflows
- Sales or transaction reporting

### 11.2 Explicitly Excluded from MVP

These features are **not planned** for the Vitrin MVP and have been completely removed from scope:

| Feature | Status |
|---------|--------|
| Cart and checkout | **Not in MVP** |
| Order creation and management | **Not in MVP** |
| Online and in-person payment | **Not in MVP** |
| Delivery and delivery fees | **Not in MVP** |
| Customer addresses | **Not in MVP** |
| Tax, service fees, packaging fees | **Not in MVP** |
| Cashier and order operator roles | **Not in MVP** |
| Sales and transaction reporting | **Not in MVP** |

---

## 12. Implementation Order

| # | Title | Status |
|---|-------|--------|
| 1 | Backend infrastructure (NestJS, Health, Swagger, Config) | ✅ Complete |
| 2 | Product blueprint (approved) | ✅ Complete |
| 3 | Domain model and ERD | ✅ Complete |
| 4 | Prisma schema and migration | ✅ Complete |
| 5 | Authentication infrastructure | ✅ Complete |
| 6 | Restaurant onboarding | ✅ Complete |
| 7 | Catalog foundation (categories, products) | ✅ Complete |
| 8 | Menu-only MVP backend cleanup | ✅ Complete |

---

## 13. Future Decisions (Non-blocking)

> These decisions do not block database design and will be evaluated in the future.

| # | Topic | Notes |
|---|-------|-------|
| 1 | Advanced inventory (numeric) | Should numeric inventory be supported? |
| 2 | Team invitations | Detailed team invitation workflow |
| 3 | Advanced analytics | Real analytics and reporting |

---

## 14. Roadmap Acceptance Criteria

This product blueprint is considered **approved** when:

- [x] The MVP is defined as a read-only digital menu.
- [x] No cart, order, or payment capability exists.
- [x] Customer authentication is not required for browsing.
- [x] Authentication is for restaurant administrators only.
- [x] Branch-specific pricing, discounts, visibility, and availability are supported.
- [x] Menu draft, preview, publication history, and rollback are supported.
- [x] Role and permission matrix is explicit and final.

---

## Summary

**File:** `docs/product-blueprint.md`

**Version:** 2.0 — Menu-Only MVP Product Blueprint

**Key changes from previous version:**
1. All ordering, checkout, payment, and delivery features removed from scope.
2. Customer role redefined — no ordering capability.
3. ORDER_OPERATOR and CASHIER roles removed.
4. Transactional concepts (orders, payments, fees, delivery) removed from all sections.
5. MVP explicitly defined as a read-only digital restaurant menu.
6. Documentation clearly states excluded features are **not planned**, not "Coming Soon".
