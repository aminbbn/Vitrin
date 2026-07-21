import React, { createContext, useContext } from 'react';
import { AuthRepository } from './contracts/AuthRepository';
import { TenantRepository } from './contracts/TenantRepository';
import { CatalogRepository } from './contracts/CatalogRepository';
import { MenuRepository } from './contracts/MenuRepository';
import { OrderRepository } from './contracts/OrderRepository';

import { mockAuthRepository } from './mock/MockAuthRepository';
import { mockTenantRepository } from './mock/MockTenantRepository';
import { mockCatalogRepository } from './mock/MockCatalogRepository';
import { mockMenuRepository } from './mock/MockMenuRepository';
import { mockOrderRepository } from './mock/MockOrderRepository';

import { apiAuthRepository } from './api/ApiAuthRepository';
import { apiTenantRepository } from './api/ApiTenantRepository';
import { apiCatalogRepository } from './api/ApiCatalogRepository';
import { apiMenuRepository } from './api/ApiMenuRepository';

/**
 * When VITE_API_BASE_URL is set, use real backend repositories.
 * Otherwise fall back to local mock repositories.
 */
const USE_API =
  !!(import.meta as any).env?.VITE_API_BASE_URL &&
  (import.meta as any).env.VITE_API_BASE_URL !== '';

interface RepositoriesContextType {
  authRepository: AuthRepository;
  tenantRepository: TenantRepository;
  catalogRepository: CatalogRepository;
  menuRepository: MenuRepository;
  orderRepository: OrderRepository;
}

const RepositoriesContext = createContext<RepositoriesContextType | null>(null);

export const RepositoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const value: RepositoriesContextType = {
    authRepository: USE_API ? apiAuthRepository : mockAuthRepository,
    tenantRepository: USE_API ? apiTenantRepository : mockTenantRepository,
    catalogRepository: USE_API ? apiCatalogRepository : mockCatalogRepository,
    menuRepository: USE_API ? apiMenuRepository : mockMenuRepository,
    orderRepository: mockOrderRepository, // No backend order endpoint
  };

  return (
    <RepositoriesContext.Provider value={value}>
      {children}
    </RepositoriesContext.Provider>
  );
};

export const useRepositories = (): RepositoriesContextType => {
  const context = useContext(RepositoriesContext);
  if (!context) {
    throw new Error('useRepositories must be used within a RepositoryProvider');
  }
  return context;
};

/** Expose whether API mode is active (useful for UI decisions). */
export const isApiMode = USE_API;
