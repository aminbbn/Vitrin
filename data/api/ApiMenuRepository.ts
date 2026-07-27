import { MenuRepository } from '../contracts/MenuRepository';
import { MenuPublication, PublicMenuSnapshot } from '../../domain';
import { api } from './client';
import { ApiTenantRepository } from './ApiTenantRepository';

// ── Backend DTO shapes ─────────────────────────────────────────────
interface MenuDraftResponse {
  id: string;
  branchId: string;
  layout: Record<string, unknown>;
  theme: Record<string, unknown>;
  categoryConfig: Record<string, unknown>;
  productConfig: Record<string, unknown>;
  displaySettings: Record<string, unknown>;
  lastPublishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface PublicationResponse {
  id: string;
  branchId: string;
  version: number;
  schemaVersion: number;
  snapshot: Record<string, unknown>;
  publishedByUserId: string;
  createdAt: string;
}

interface PublicMenuResponse {
  branchId: string;
  branchName: string;
  restaurantName: string;
  tableNumber: string | null;
  timezone: string;
  currencyCode: string;
  publicationVersion: number;
  publishedAt: string;
  menu: Record<string, unknown>;
}

// ── Mappers ────────────────────────────────────────────────────────
function mapPublication(p: PublicationResponse): MenuPublication {
  return {
    id: p.id,
    branchId: p.branchId,
    restaurantId: '',
    publishedBy: p.publishedByUserId,
    version: p.version,
    publishedAt: p.createdAt,
    snapshot: {
      schemaVersion: p.schemaVersion,
      categories: [],
      products: [],
      branchProducts: [],
      snapshotAt: p.createdAt,
      elements: (p.snapshot as any)?.draft?.layout?.elements ?? [],
    } as any,
  };
}

function activeRestaurantId(): string {
  const id = ApiTenantRepository.getActiveRestaurantId();
  if (!id) throw new Error('No active restaurant');
  return id;
}

// ── Draft element persistence key (localStorage, since backend draft stores JSON config, not elements) ──
const DRAFT_ELEMENTS_KEY = 'vitrin_draft_elements';

function loadDraftElements(branchId: string): unknown[] {
  try {
    const raw = localStorage.getItem(`${DRAFT_ELEMENTS_KEY}_${branchId}`);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

function saveDraftElements(branchId: string, elements: unknown[]): void {
  localStorage.setItem(`${DRAFT_ELEMENTS_KEY}_${branchId}`, JSON.stringify(elements));
}

// ── Implementation ─────────────────────────────────────────────────
export class ApiMenuRepository implements MenuRepository {
  private draftPath(branchId: string): string {
    return `/restaurants/${activeRestaurantId()}/branches/${branchId}`;
  }

  async getDraft(branchId: string): Promise<unknown[]> {
    // Backend draft stores config objects, not designer elements.
    // Elements are stored client-side for now.
    return loadDraftElements(branchId);
  }

  async saveDraft(branchId: string, elements: unknown[]): Promise<void> {
    saveDraftElements(branchId, elements);
    // Also sync the backend draft (PUT upsert) so server state is up to date
    try {
      await api.put(`${this.draftPath(branchId)}/draft`, {
        displaySettings: { elements },
      });
    } catch {
      // Non-critical; element storage is client-side
    }
  }

  async previewDraft(_branchId: string): Promise<PublicMenuSnapshot> {
    return {
      schemaVersion: 1,
      elements: [],
      categories: [],
      products: [],
      branchProducts: [],
      snapshotAt: new Date().toISOString(),
    };
  }

  async getDesignerDraft(branchId?: string): Promise<unknown[]> {
    return this.getDraft(branchId || 'br_west');
  }

  async saveDesignerDraft(branchId?: string, elements?: unknown[]): Promise<void> {
    return this.saveDraft(branchId || 'br_west', elements || []);
  }

  async listPublications(branchId: string): Promise<MenuPublication[]> {
    try {
      const pubs = await api.get<PublicationResponse[]>(
        `${this.draftPath(branchId)}/publications`,
      );
      return pubs.map(mapPublication);
    } catch {
      return [];
    }
  }

  async publish(
    branchId: string,
    _publishedBy: string,
    _elements: unknown[],
    _categoriesSnapshot: any,
    _productsSnapshot: any,
    _branchProductsSnapshot: any,
  ): Promise<MenuPublication> {
    const pub = await api.post<PublicationResponse>(
      `${this.draftPath(branchId)}/publish`,
    );
    return mapPublication(pub);
  }

  async rollback(
    branchId: string,
    targetPublicationId: string,
  ): Promise<MenuPublication> {
    const pub = await api.post<PublicationResponse>(
      `${this.draftPath(branchId)}/rollback/${targetPublicationId}`,
    );
    return mapPublication(pub);
  }

  async getActivePublication(branchId: string): Promise<MenuPublication | null> {
    try {
      const pubs = await api.get<PublicationResponse[]>(
        `${this.draftPath(branchId)}/publications`,
      );
      if (pubs.length === 0) return null;
      return mapPublication(pubs[0]);
    } catch {
      return null;
    }
  }

  async getPublicMenuSnapshot(branchId: string): Promise<PublicMenuSnapshot | null> {
    try {
      const menu = await api.get<PublicMenuResponse>(
        `/public/menu/branch/${branchId}`,
      );
      const snapshot = menu.menu as any;
      return {
        schemaVersion: 1,
        categories: snapshot?.categories ?? [],
        products: snapshot?.products ?? [],
        branchProducts: snapshot?.branchProducts ?? [],
        snapshotAt: menu.publishedAt,
      };
    } catch {
      return null;
    }
  }

  // Backward compat
  async publishMenu(
    branchId?: string,
    publishedBy?: string,
    elements?: unknown[],
    categoriesSnapshot?: unknown[],
    productsSnapshot?: unknown[],
    branchProductsSnapshot?: unknown[],
  ): Promise<MenuPublication> {
    return this.publish(
      branchId || 'br_west',
      publishedBy || '',
      elements || [],
      categoriesSnapshot || [],
      productsSnapshot || [],
      branchProductsSnapshot || [],
    );
  }

  async getPublicationHistory(branchId?: string): Promise<MenuPublication[]> {
    return this.listPublications(branchId || 'br_west');
  }

  async getPublishedDesign(branchId?: string): Promise<unknown[]> {
    const pub = await this.getActivePublication(branchId || 'br_west');
    return (pub?.snapshot as any)?.elements ?? [];
  }
}

export const apiMenuRepository = new ApiMenuRepository();
