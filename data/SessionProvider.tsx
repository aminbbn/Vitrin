import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, UserStatus, Restaurant, Branch, RestaurantMembership, MembershipRole, MembershipPermission } from '../domain';
import { useRepositories } from './RepositoryProvider';
import { localStore } from '../repositories/local/LocalStorageAdapter';

export interface AppSessionContextType {
  user: User | null;
  isAuthenticated: boolean;
  isEmailVerified: boolean;
  memberships: RestaurantMembership[];
  activeMembership: RestaurantMembership | null;
  activeRestaurant: Restaurant | null;
  activeBranch: Branch | null;
  role: MembershipRole | null;
  permissions: MembershipPermission[];
  loading: boolean;
  error: string | null;
  setActiveRestaurant: (restaurantId: string) => Promise<void>;
  setActiveBranch: (branchId: string) => Promise<void>;
  hasPermission: (permission: MembershipPermission) => boolean;
  canAccess: (feature: string) => boolean;
  refetchSession: () => Promise<void>;
}

const AppSessionContext = createContext<AppSessionContextType | null>(null);

export const AppSessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { authRepository, tenantRepository } = useRepositories();

  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [memberships, setMemberships] = useState<RestaurantMembership[]>([]);
  const [activeMembership, setActiveMembership] = useState<RestaurantMembership | null>(null);
  const [activeRestaurant, setActiveRestaurantState] = useState<Restaurant | null>(null);
  const [activeBranch, setActiveBranchState] = useState<Branch | null>(null);
  
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const syncAndValidateSession = useCallback(async () => {
    try {
      setLoading(true);
      const session = await authRepository.getCurrentSession();
      if (!session) {
        setUser(null);
        setIsAuthenticated(false);
        setMemberships([]);
        setActiveMembership(null);
        setActiveRestaurantState(null);
        setActiveBranchState(null);
        setError(null);
        return;
      }

      setUser(session.user);
      setIsAuthenticated(true);

      // Load memberships
      const allMemberships = await tenantRepository.getMemberships();
      const activeMemberships = allMemberships.filter(m => m.status === 'ACTIVE');
      setMemberships(allMemberships);

      const storage = localStore.load();
      let persistedRestId = storage.session.activeRestaurantId;
      let persistedBranchId = storage.session.activeBranchId;

      let activeRestId: string | null = null;
      let currentMembership: RestaurantMembership | null = null;

      if (activeMemberships.length > 0) {
        const found = activeMemberships.find(m => m.restaurantId === persistedRestId);
        if (found) {
          currentMembership = found;
          activeRestId = found.restaurantId;
        } else {
          currentMembership = activeMemberships[0];
          activeRestId = currentMembership.restaurantId;
        }
      } else {
        activeRestId = null;
        currentMembership = null;
      }

      setActiveMembership(currentMembership);

      // Save updated activeRestaurantId in localStore session
      let storageUpdated = false;
      const data = localStore.load();
      if (data.session.activeRestaurantId !== activeRestId) {
        data.session.activeRestaurantId = activeRestId;
        storageUpdated = true;
      }

      let fetchedRestaurant: Restaurant | null = null;
      let branches: Branch[] = [];

      if (activeRestId) {
        if (storageUpdated) {
          localStore.save(data);
        }
        // Fetch restaurant details and branches for this restaurant
        const [rest, brs] = await Promise.all([
          tenantRepository.getRestaurant(),
          tenantRepository.getBranches()
        ]);
        fetchedRestaurant = rest;
        branches = brs;
      }

      setActiveRestaurantState(fetchedRestaurant);

      // Validate persisted branch ID
      let activeBranchId: string | null = null;
      let currentBranch: Branch | null = null;

      if (branches.length > 0) {
        const foundB = branches.find(b => b.id === persistedBranchId);
        if (foundB) {
          currentBranch = foundB;
          activeBranchId = foundB.id;
        } else {
          currentBranch = branches[0];
          activeBranchId = currentBranch.id;
        }
      } else {
        activeBranchId = null;
        currentBranch = null;
      }

      setActiveBranchState(currentBranch);

      // Persist the final validated choices
      const finalData = localStore.load();
      let saveNeeded = false;
      if (finalData.session.activeRestaurantId !== activeRestId) {
        finalData.session.activeRestaurantId = activeRestId;
        saveNeeded = true;
      }
      if (finalData.session.activeBranchId !== activeBranchId) {
        finalData.session.activeBranchId = activeBranchId;
        saveNeeded = true;
      }
      if (saveNeeded) {
        localStore.save(finalData);
      }

      setError(null);
    } catch (err: any) {
      console.error('Error syncing session:', err);
      setError(err?.message || 'Error syncing session and tenant context');
    } finally {
      setLoading(false);
    }
  }, [authRepository, tenantRepository]);

  useEffect(() => {
    syncAndValidateSession();

    // Subscribe to localStore updates for instant reactive tab synchronization
    const unsubscribe = localStore.subscribe(() => {
      syncAndValidateSession();
    });

    return () => {
      unsubscribe();
    };
  }, [syncAndValidateSession]);

  const setActiveRestaurant = async (restaurantId: string) => {
    const valid = memberships.some(m => m.restaurantId === restaurantId && m.status === 'ACTIVE');
    if (!valid) {
      throw new Error('Restaurant ID is outside the user active membership context');
    }

    const data = localStore.load();
    data.session.activeRestaurantId = restaurantId;
    data.session.activeBranchId = null;
    localStore.save(data);

    await syncAndValidateSession();
  };

  const setActiveBranch = async (branchId: string) => {
    if (!activeRestaurant) {
      throw new Error('No active restaurant selected');
    }

    const branches = await tenantRepository.getBranches();
    const valid = branches.some(b => b.id === branchId);
    if (!valid) {
      throw new Error('Branch ID is outside the active restaurant context');
    }

    const data = localStore.load();
    data.session.activeBranchId = branchId;
    localStore.save(data);

    await syncAndValidateSession();
  };

  const role = activeMembership ? activeMembership.role : null;
  const permissions = activeMembership ? activeMembership.permissions : [];

  const hasPermission = (permission: MembershipPermission): boolean => {
    return permissions.includes(permission);
  };

  const canAccess = (feature: string): boolean => {
    if (!isAuthenticated) return false;
    if (memberships.length === 0) return feature === 'customer_menu';
    
    switch (feature) {
      case 'publish_menu':
        return hasPermission(MembershipPermission.MENU_PUBLISH);
      case 'rollback_menu':
        return hasPermission(MembershipPermission.MENU_ROLLBACK);
      case 'catalog_manage':
        return hasPermission(MembershipPermission.CATALOG_MANAGE);
      case 'order_manage':
        return hasPermission(MembershipPermission.ORDER_MANAGE);
      case 'payment_manage':
        return hasPermission(MembershipPermission.PAYMENT_MANAGE);
      case 'dashboard':
        return memberships.length > 0;
      default:
        return true;
    }
  };

  const value: AppSessionContextType = {
    user,
    isAuthenticated,
    isEmailVerified: isAuthenticated && user?.status === UserStatus.ACTIVE,
    memberships,
    activeMembership,
    activeRestaurant,
    activeBranch,
    role,
    permissions,
    loading,
    error,
    setActiveRestaurant,
    setActiveBranch,
    hasPermission,
    canAccess,
    refetchSession: syncAndValidateSession
  };

  return (
    <AppSessionContext.Provider value={value}>
      {children}
    </AppSessionContext.Provider>
  );
};

export const useAppSession = (): AppSessionContextType => {
  const context = useContext(AppSessionContext);
  if (!context) {
    throw new Error('useAppSession must be used within an AppSessionProvider');
  }
  return context;
};
