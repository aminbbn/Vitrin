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
    authRepository: mockAuthRepository,
    tenantRepository: mockTenantRepository,
    catalogRepository: mockCatalogRepository,
    menuRepository: mockMenuRepository,
    orderRepository: mockOrderRepository,
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
