# Vitrin Backend MVP — Progress Tracker

**Branch:** `backend-mvp-completion`

---

## Milestones

| M | Title | Status | Tests | Commit |
|---|-------|--------|-------|--------|
| 1 | Branch Configuration (Tables, Working Hours, QR Tokens) | ✅ Complete | +23 (184 total) | `05d2f88` |
| 2 | Menu Draft Management | ✅ Complete | +7 (191 total) | `8afb505` |
| 3 | Menu Publication and Rollback | ✅ Complete | +8 (199 total) | `d35ad6b` |
| 4 | Public Menu and QR Resolution | ✅ Complete | +8 (207 total) | `8ec8a94` |
| 5 | Media Asset Management | ✅ Complete | +8 (215 total) | `48ec4f6` |
| 6 | Menu Permission Management | ✅ Complete | +8 (223 total) | `a67fb30` |
| 7 | Integration Tests and Production Readiness | ✅ Complete | 223 total | `TBD` |

---

## Test Summary

- **19 test suites, 223 tests — all passing**
- Prisma schema validated
- TypeScript build clean

---

## Files Created

### M1: Branch Configuration
- `src/branch-config/branch-config.module.ts`
- `src/branch-config/tables/` — controller, service, DTOs, specs (6 files)
- `src/branch-config/working-hours/` — controller, service, DTOs, specs (7 files)
- `src/branch-config/qr-tokens/` — controller, service, DTOs, specs (5 files)

### M2: Menu Draft
- `src/menu/menu.module.ts`
- `src/menu/menu-draft.controller.ts`
- `src/menu/menu-draft.service.ts`
- `src/menu/menu-draft.service.spec.ts`
- `src/menu/draft/dto/upsert-menu-draft.dto.ts`
- `src/menu/dto/menu-draft-response.dto.ts`

### M3: Menu Publication
- `src/menu/publication/menu-publication.controller.ts`
- `src/menu/publication/menu-publication.service.ts`
- `src/menu/publication/menu-publication.service.spec.ts`
- `src/menu/publication/dto/publication-response.dto.ts`

### M4: Public Menu
- `src/public/public.module.ts`
- `src/public/public-menu.controller.ts`
- `src/public/public-menu.service.ts`
- `src/public/public-menu.service.spec.ts`
- `src/public/dto/public-menu-response.dto.ts`
- `src/public/dto/qr-resolution-response.dto.ts`

### M5: Media
- `src/media/media.module.ts`
- `src/media/media.controller.ts`
- `src/media/media.service.ts`
- `src/media/media.service.spec.ts`
- `src/media/dto/register-media.dto.ts`
- `src/media/dto/media-asset-response.dto.ts`

### M6: Permissions
- `src/restaurants/permissions/permissions.controller.ts`
- `src/restaurants/permissions/permissions.service.ts`
- `src/restaurants/permissions/permissions.service.spec.ts`
- `src/restaurants/permissions/dto/grant-permissions.dto.ts`
- `src/restaurants/permissions/dto/permission-response.dto.ts`

### M7: Production Readiness
- `docs/backend-mvp-execution-plan.md`
- `docs/backend-mvp-progress.md`
- Updated `.env.example`
