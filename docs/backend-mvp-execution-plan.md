# Vitrin Backend MVP — Execution Plan

**Branch:** `backend-mvp-completion`
**Date:** 2026-07-20

---

## Current State

### Implemented
- Auth (register, login, refresh, logout, me) with JWT
- Restaurant CRUD (create, list, get one)
- Branch CRUD (create, list)
- Categories CRUD (create, list, update, delete)
- Products CRUD (create, list, get one, update, delete)
- BranchProducts (list catalog with config, upsert, update)
- Health check
- Prisma module with BetterSqlite3 adapter
- Guards: AccessToken, RestaurantMembership, RestaurantRole
- 161 passing unit tests

### Not Yet Implemented
- Branch configuration (tables, QR tokens, working hours, special hours)
- Menu Draft CRUD (upsert/get/update)
- Menu Draft Preview endpoint
- Menu Publication (publish with snapshot)
- Publication History
- Menu Rollback
- Public read-only menu endpoint (unauthenticated)
- QR token resolution endpoint (unauthenticated)
- MediaAsset registration and management
- Menu Permissions (MENU_PUBLISH, MENU_ROLLBACK for MANAGER)
- Tables/QR admin endpoints

---

## Milestones

### M1: Branch Configuration (Tables, Working Hours, QR Tokens)
**Goal:** Complete branch-level configuration so branches have tables, working hours, special hours, and QR tokens.

**Files to create:**
- `src/branch-config/branch-config.module.ts`
- `src/branch-config/tables/` — controller, service, DTOs, specs
- `src/branch-config/working-hours/` — controller, service, DTOs, specs
- `src/branch-config/qr-tokens/` — controller, service, DTOs, specs

**Endpoints:**
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/restaurants/:rid/branches/:bid/tables` | OWNER/MANAGER | List branch tables |
| POST | `/restaurants/:rid/branches/:bid/tables` | OWNER/MANAGER | Create table |
| PATCH | `/restaurants/:rid/branches/:bid/tables/:tid` | OWNER/MANAGER | Update table |
| DELETE | `/restaurants/:rid/branches/:bid/tables/:tid` | OWNER/MANAGER | Delete table |
| POST | `/restaurants/:rid/branches/:bid/tables/:tid/qr-token` | OWNER/MANAGER | Generate/regenerate QR token |
| GET | `/restaurants/:rid/branches/:bid/tables/:tid/qr-token` | OWNER/MANAGER | Get active QR token |
| DELETE | `/restaurants/:rid/branches/:bid/tables/:tid/qr-token` | OWNER/MANAGER | Revoke QR token |
| GET | `/restaurants/:rid/branches/:bid/working-hours` | OWNER/MANAGER | Get working hours |
| PUT | `/restaurants/:rid/branches/:bid/working-hours` | OWNER/MANAGER | Replace all working hours |
| GET | `/restaurants/:rid/branches/:bid/special-hours` | OWNER/MANAGER | Get special hours |
| POST | `/restaurants/:rid/branches/:bid/special-hours` | OWNER/MANAGER | Create/update special hours |
| DELETE | `/restaurants/:rid/branches/:bid/special-hours/:date` | OWNER/MANAGER | Remove special hours |

**Acceptance criteria:**
- Tables created with unique table numbers per branch
- QR tokens are non-guessable, unique, revocable
- Regenerating QR token revokes old and creates new
- Working hours stored as intervals per weekday with display order
- Special hours override specific dates

---

### M2: Menu Draft Management
**Goal:** Allow authenticated users to create/update the menu draft for a branch.

**Files to create:**
- `src/menu/` — module
- `src/menu/draft/` — controller, service, DTOs, specs

**Endpoints:**
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/restaurants/:rid/branches/:bid/draft` | OWNER/MANAGER | Get current draft |
| PUT | `/restaurants/:rid/branches/:bid/draft` | OWNER/MANAGER | Create/update draft (upsert) |

**Acceptance criteria:**
- One draft per branch (upsert semantics)
- Draft stores layout, theme, categoryConfig, productConfig, displaySettings as JSON
- Returns full draft state after upsert
- Ownership checks enforced

---

### M3: Menu Publication and Rollback
**Goal:** Publish creates immutable snapshot, rollback creates new version from older snapshot.

**Files to create:**
- `src/menu/publication/` — controller, service, DTOs, specs

**Endpoints:**
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/restaurants/:rid/branches/:bid/publish` | OWNER/MANAGER+PERM | Publish draft |
| GET | `/restaurants/:rid/branches/:bid/publications` | OWNER/MANAGER | List publication history |
| GET | `/restaurants/:rid/branches/:bid/publications/:pid` | OWNER/MANAGER | Get one publication |
| POST | `/restaurants/:rid/branches/:bid/rollback/:pid` | OWNER/MANAGER+PERM | Rollback to publication |

**Permission model:**
- OWNER always has MENU_PUBLISH and MENU_ROLLBACK
- MANAGER needs explicit `MembershipPermission` records

**Snapshot content:**
- All draft configuration (layout, theme, categoryConfig, productConfig, displaySettings)
- Branch products with prices and visibility
- Active categories with products
- Modifier groups and options
- Branch settings (name, timezone, currency)

**Acceptance criteria:**
- Publish creates new MenuPublication record with incremented version
- Snapshot is immutable (never modified after creation)
- Branch.activeMenuPublicationId updated atomically
- Rollback creates new publication with snapshot copied from target version
- Version numbers are monotonically increasing per branch
- Publish/rollback permission checks enforced

---

### M4: Public Menu and QR Resolution
**Goal:** Unauthenticated customers can resolve a QR token to see a branch's published menu.

**Files to create:**
- `src/public/` — module
- `src/public/menu/` — controller, service, DTOs, specs
- `src/public/qr/` — controller, service, DTOs, specs

**Endpoints:**
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/public/menu/qr/:token` | None | Resolve QR token → table info + public menu |
| GET | `/public/menu/branch/:bid` | None | Get published menu for branch (direct access) |

**Resolution path:**
```
QR token → TableQrToken (ACTIVE) → BranchTable → Branch (ACTIVE, publicMenuEnabled) → MenuPublication (active) → snapshot
```

**Acceptance criteria:**
- No authentication required
- Returns only published menu data
- QR token resolution includes table number and branch info
- Returns 404 for inactive tokens, suspended branches, disabled public menu
- No internal IDs exposed that shouldn't be (tableId is fine for frontend routing)

---

### M5: Media Asset Management
**Goal:** Register media uploads (for product images, restaurant logos, user avatars).

**Files to create:**
- `src/media/` — module
- `src/media/media.controller.ts`
- `src/media/media.service.ts`
- `src/media/dto/` — request/response DTOs
- `src/media/media.service.spec.ts`

**Endpoints:**
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/restaurants/:rid/media` | OWNER/MANAGER | Register uploaded media asset |
| GET | `/restaurants/:rid/media` | OWNER/MANAGER | List restaurant media |
| DELETE | `/restaurants/:rid/media/:mid` | OWNER/MANAGER | Archive media asset |
| PATCH | `/restaurants/:rid/products/:pid/image` | OWNER/MANAGER | Set product image |
| DELETE | `/restaurants/:rid/products/:pid/image` | OWNER/MANAGER | Remove product image |

**Acceptance criteria:**
- MVP stores metadata only (no actual file upload — client uploads to storage, registers URL with backend)
- Media assets scoped to restaurant
- Product image assignment validated (product must belong to restaurant)
- Archiving soft-deletes (sets archivedAt)

---

### M6: Menu Permission Management
**Goal:** OWNER can grant/revoke MENU_PUBLISH and MENU_ROLLBACK to MANAGERs.

**Files to create:**
- `src/restaurants/permissions/` — controller, service, DTOs, specs

**Endpoints:**
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/restaurants/:rid/members/:mid/permissions` | OWNER | List permissions for a member |
| PUT | `/restaurants/:rid/members/:mid/permissions` | OWNER | Grant permissions |
| DELETE | `/restaurants/:rid/members/:mid/permissions/:code` | OWNER | Revoke a permission |

**Acceptance criteria:**
- Only OWNER can grant/revoke permissions
- OWNER implicitly has all permissions (no records needed)
- Permissions are grants-only (MENU_PUBLISH, MENU_ROLLBACK)
- Unique constraint on (membershipId, permission)

---

### M7: Integration Tests and Production Readiness
**Goal:** End-to-end tests, environment validation, error handling review, documentation.

**Tasks:**
1. Create comprehensive integration test suite
2. Environment validation on startup
3. Consistent error response format
4. Update .env.example with all required variables
5. Update README.md with setup instructions

---

## Execution Order

1. **M1** → Branch Configuration (tables, working hours, QR tokens)
2. **M2** → Menu Draft Management
3. **M3** → Menu Publication and Rollback
4. **M4** → Public Menu and QR Resolution
5. **M5** → Media Asset Management
6. **M6** → Menu Permission Management
7. **M7** → Integration Tests and Production Readiness

Each milestone includes:
- Prisma validation
- Build verification
- Unit test execution
- Git diff review
- Focused commit
- Progress doc update
- Branch push
