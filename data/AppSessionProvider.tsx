import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRepositories } from './RepositoryProvider';
import { storageAdapter } from './storage/StorageAdapter';
import { 
  User, 
  Restaurant, 
  Branch, 
  RestaurantMembership, 
  MembershipRole, 
  MembershipPermission 
} from '../domain';
import { SEED_RESTAURANTS, SEED_BRANCHES } from './mock/MockTenantRepository';

interface AppSessionContextType {
  user: User | null;
  isAuthenticated: boolean;
  isEmailVerified: boolean;
  memberships: RestaurantMembership[];
  activeMembership: RestaurantMembership | null;
  activeRestaurant: Restaurant | null;
  activeBranch: Branch | null;
  role: MembershipRole | null;
  permissions: MembershipPermission[];
  setActiveRestaurant: (restaurantId: string) => Promise<void>;
  setActiveBranch: (branchId: string) => Promise<void>;
  hasPermission: (permission: MembershipPermission) => boolean;
  canAccess: (feature: string) => boolean;
  loading: boolean;
  error: string | null;
  refetchSession: () => Promise<void>;
}

const AppSessionContext = createContext<AppSessionContextType | null>(null);

export const AppSessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { authRepository, tenantRepository } = useRepositories();
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [memberships, setMemberships] = useState<RestaurantMembership[]>([]);
  const [activeRestaurant, setActiveRestaurantState] = useState<Restaurant | null>(null);
  const [activeBranch, setActiveBranchState] = useState<Branch | null>(null);
  const [activeMembership, setActiveMembership] = useState<RestaurantMembership | null>(null);
  
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadSession = useCallback(async () => {
    try {
      setLoading(true);
      const isAuth = await authRepository.isAuthenticated();
      setIsAuthenticated(isAuth);

      if (!isAuth) {
        setUser(null);
        setMemberships([]);
        setActiveRestaurantState(null);
        setActiveBranchState(null);
        setActiveMembership(null);
        return;
      }

      const session = await authRepository.getCurrentSession();
      if (!session) {
        setUser(null);
        setIsAuthenticated(false);
        setMemberships([]);
        setActiveRestaurantState(null);
        setActiveBranchState(null);
        setActiveMembership(null);
        return;
      }

      setUser(session.user);
      const userMemberships = await tenantRepository.getMemberships();
      setMemberships(userMemberships);

      if (userMemberships.length === 0) {
        // Customer-only user has no memberships
        setActiveRestaurantState(null);
        setActiveBranchState(null);
        setActiveMembership(null);
        return;
      }

      // Read selections from storage schema
      const data = storageAdapter.load();
      let savedRestaurantId = data.auth.activeRestaurantId;
      let savedBranchId = data.auth.activeBranchId;

      // Validate restaurant selection
      let validMembership = userMemberships.find(m => m.restaurantId === savedRestaurantId);
      if (!validMembership) {
        // Fallback to first active membership
        validMembership = userMemberships[0];
        savedRestaurantId = validMembership.restaurantId;
      }

      // Load restaurant details
      const restBase = SEED_RESTAURANTS.find(r => r.id === savedRestaurantId) || SEED_RESTAURANTS[0];
      
      // Load and validate branch selection
      const restaurantBranches = SEED_BRANCHES.filter(b => b.restaurantId === savedRestaurantId);
      let validBranch = restaurantBranches.find(b => b.id === savedBranchId);
      if (!validBranch && restaurantBranches.length > 0) {
        validBranch = restaurantBranches[0];
        savedBranchId = validBranch.id;
      } else if (restaurantBranches.length === 0) {
        validBranch = null;
        savedBranchId = null;
      }

      // Persist validated IDs back to storage adapter
      if (data.auth.activeRestaurantId !== savedRestaurantId || data.auth.activeBranchId !== savedBranchId) {
        data.auth.activeRestaurantId = savedRestaurantId;
        data.auth.activeBranchId = savedBranchId;
        storageAdapter.save(data);
      }

      setActiveMembership(validMembership);
      setActiveRestaurantState(restBase);
      setActiveBranchState(validBranch);
      setError(null);
    } catch (err: any) {
      console.error('Error loading session context:', err);
      setError(err?.message || 'Error initializing app session');
    } finally {
      setLoading(false);
    }
  }, [authRepository, tenantRepository]);

  useEffect(() => {
    loadSession();
    // Subscribe to storage changes to keep tabs synchronized
    const unsubscribe = storageAdapter.subscribe(() => {
      loadSession();
    });
    return () => unsubscribe();
  }, [loadSession]);

  const setActiveRestaurant = async (restaurantId: string) => {
    // Validate restaurant ID is in user's memberships
    const targetMembership = memberships.find(m => m.restaurantId === restaurantId);
    if (!targetMembership) {
      console.warn('Attempted to switch to unauthorized restaurant context.');
      return;
    }

    // Resolve first branch inside target restaurant
    const targetBranches = SEED_BRANCHES.filter(b => b.restaurantId === restaurantId);
    const firstBranchId = targetBranches.length > 0 ? targetBranches[0].id : null;

    // Save validated selections
    const data = storageAdapter.load();
    data.auth.activeRestaurantId = restaurantId;
    data.auth.activeBranchId = firstBranchId;
    storageAdapter.save(data);

    // Reload active states
    await loadSession();
  };

  const setActiveBranch = async (branchId: string) => {
    if (!activeRestaurant) return;

    // Validate branch belongs to the active restaurant
    const validBranch = SEED_BRANCHES.find(b => b.id === branchId && b.restaurantId === activeRestaurant.id);
    if (!validBranch) {
      console.warn('Attempted to switch to invalid branch or branch outside active restaurant.');
      return;
    }

    const data = storageAdapter.load();
    data.auth.activeBranchId = branchId;
    storageAdapter.save(data);

    await loadSession();
  };

  const hasPermission = useCallback((permission: MembershipPermission): boolean => {
    if (!activeMembership) return false;
    return activeMembership.permissions.includes(permission);
  }, [activeMembership]);

  const canAccess = useCallback((feature: string): boolean => {
    if (!activeMembership) return false;
    // Simple feature mapper
    switch (feature) {
      case 'menu':
      case 'designer':
        return activeMembership.role === MembershipRole.OWNER || hasPermission(MembershipPermission.MENU_PUBLISH);
      case 'catalog':
      case 'products':
      case 'categories':
        return activeMembership.role === MembershipRole.OWNER || hasPermission(MembershipPermission.CATALOG_MANAGE);
      case 'orders':
        return activeMembership.role === MembershipRole.OWNER || hasPermission(MembershipPermission.ORDER_MANAGE);
      case 'settings':
        return activeMembership.role === MembershipRole.OWNER;
      case 'analytics':
        return activeMembership.role === MembershipRole.OWNER || activeMembership.role === MembershipRole.MANAGER;
      default:
        return true;
    }
  }, [activeMembership, hasPermission]);

  const value: AppSessionContextType = {
    user,
    isAuthenticated,
    isEmailVerified: true,
    memberships,
    activeMembership,
    activeRestaurant,
    activeBranch,
    role: activeMembership ? activeMembership.role : null,
    permissions: activeMembership ? activeMembership.permissions : [],
    setActiveRestaurant,
    setActiveBranch,
    hasPermission,
    canAccess,
    loading,
    error,
    refetchSession: loadSession
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
