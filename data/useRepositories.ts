import { useState, useEffect, useRef, useCallback } from 'react';
import { useRepositories } from './RepositoryProvider';
import { Category, Product, Restaurant } from '../domain';
import { ComponentItem } from '../types';

/**
 * Custom helper to track mount status and prevent updates on unmounted components.
 */
function useIsMounted() {
  const isMounted = useRef(true);
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);
  return useCallback(() => isMounted.current, []);
}

/**
 * Hook for managing tenant/restaurant information.
 */
export function useTenant() {
  const { tenantRepository } = useRepositories();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [brandColor, setBrandColor] = useState<string>('emerald');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useIsMounted();

  const loadTenant = useCallback(async () => {
    try {
      setLoading(true);
      const [rest, color] = await Promise.all([
        tenantRepository.getRestaurant(),
        tenantRepository.getBrandColor()
      ]);
      if (isMounted()) {
        setRestaurant(rest);
        setBrandColor(color);
        setError(null);
      }
    } catch (err: any) {
      if (isMounted()) {
        setError(err?.message || 'Error loading tenant info');
      }
    } finally {
      if (isMounted()) {
        setLoading(false);
      }
    }
  }, [tenantRepository, isMounted]);

  useEffect(() => {
    loadTenant();
  }, [loadTenant]);

  const updateInfo = async (updates: {
    name?: string;
    logoUrl?: string;
    description?: string;
    address?: string;
    phone?: string;
    hours?: Record<string, string>;
  }) => {
    try {
      setLoading(true);
      const updatedRest = await tenantRepository.updateRestaurantInfo(updates);
      if (isMounted()) {
        setRestaurant(updatedRest);
      }
      return updatedRest;
    } catch (err: any) {
      if (isMounted()) {
        setError(err?.message || 'Error updating restaurant info');
      }
      throw err;
    } finally {
      if (isMounted()) {
        setLoading(false);
      }
    }
  };

  const updateBrandColor = async (color: string) => {
    try {
      await tenantRepository.updateBrandColor(color);
      if (isMounted()) {
        setBrandColor(color);
      }
    } catch (err: any) {
      if (isMounted()) {
        setError(err?.message || 'Error updating brand color');
      }
      throw err;
    }
  };

  return {
    restaurant,
    brandColor,
    loading,
    error,
    updateInfo,
    updateBrandColor,
    refetch: loadTenant
  };
}

/**
 * Hook for managing the product catalog and categories.
 */
export function useCatalog() {
  const { catalogRepository } = useRepositories();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [layoutSettings, setLayoutSettings] = useState<{ layout: 'grid' | 'list'; columns: number }>({
    layout: 'grid',
    columns: 2
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useIsMounted();

  const loadCatalog = useCallback(async () => {
    try {
      setLoading(true);
      const [cats, prods, settings] = await Promise.all([
        catalogRepository.getCategories(),
        catalogRepository.getProducts(),
        catalogRepository.getCategoryPageSettings()
      ]);
      if (isMounted()) {
        setCategories(cats);
        setProducts(prods);
        setLayoutSettings(settings);
        setError(null);
      }
    } catch (err: any) {
      if (isMounted()) {
        setError(err?.message || 'Error loading catalog');
      }
    } finally {
      if (isMounted()) {
        setLoading(false);
      }
    }
  }, [catalogRepository, isMounted]);

  useEffect(() => {
    loadCatalog();
  }, [loadCatalog]);

  const saveCategories = async (newCats: Category[]) => {
    try {
      await catalogRepository.saveCategories(newCats);
      if (isMounted()) {
        setCategories(newCats);
      }
    } catch (err: any) {
      if (isMounted()) {
        setError(err?.message || 'Error saving categories');
      }
      throw err;
    }
  };

  const saveProducts = async (newProds: Product[]) => {
    try {
      await catalogRepository.saveProducts(newProds);
      if (isMounted()) {
        setProducts(newProds);
      }
    } catch (err: any) {
      if (isMounted()) {
        setError(err?.message || 'Error saving products');
      }
      throw err;
    }
  };

  const updateCategoryPageSettings = async (settings: { layout?: 'grid' | 'list'; columns?: number }) => {
    try {
      await catalogRepository.updateCategoryPageSettings(settings);
      if (isMounted()) {
        setLayoutSettings(prev => ({ ...prev, ...settings }));
      }
    } catch (err: any) {
      if (isMounted()) {
        setError(err?.message || 'Error updating layout settings');
      }
      throw err;
    }
  };

  return {
    categories,
    products,
    layoutSettings,
    loading,
    error,
    saveCategories,
    saveProducts,
    updateCategoryPageSettings,
    refetch: loadCatalog
  };
}

/**
 * Hook for managing menu visual design draft and published menus.
 */
export function useMenuDraft() {
  const { menuRepository } = useRepositories();
  const [draftElements, setDraftElements] = useState<ComponentItem[]>([]);
  const [publishedElements, setPublishedElements] = useState<ComponentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useIsMounted();

  const loadMenu = useCallback(async () => {
    try {
      setLoading(true);
      const [draft, published] = await Promise.all([
        menuRepository.getDesignerDraft(),
        menuRepository.getPublishedDesign()
      ]);
      if (isMounted()) {
        setDraftElements(draft);
        setPublishedElements(published);
        setError(null);
      }
    } catch (err: any) {
      if (isMounted()) {
        setError(err?.message || 'Error loading menu design');
      }
    } finally {
      if (isMounted()) {
        setLoading(false);
      }
    }
  }, [menuRepository, isMounted]);

  useEffect(() => {
    loadMenu();
  }, [loadMenu]);

  const saveDraft = async (elements: ComponentItem[]) => {
    try {
      await menuRepository.saveDesignerDraft(elements);
      if (isMounted()) {
        setDraftElements(elements);
      }
    } catch (err: any) {
      if (isMounted()) {
        setError(err?.message || 'Error saving draft');
      }
      throw err;
    }
  };

  const publishMenu = async (elements: ComponentItem[]) => {
    try {
      await menuRepository.publishMenu(elements);
      if (isMounted()) {
        setDraftElements(elements);
        setPublishedElements(elements);
      }
    } catch (err: any) {
      if (isMounted()) {
        setError(err?.message || 'Error publishing menu');
      }
      throw err;
    }
  };

  return {
    draftElements,
    publishedElements,
    loading,
    error,
    saveDraft,
    publishMenu,
    refetch: loadMenu
  };
}

/**
 * Hook for managing orders. Uses active subscription for real-time updates.
 */
export function useOrders() {
  const { orderRepository } = useRepositories();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useIsMounted();

  useEffect(() => {
    setLoading(true);
    const unsubscribe = orderRepository.subscribeOrders((updatedOrders) => {
      if (isMounted()) {
        setOrders(updatedOrders);
        setLoading(false);
        setError(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [orderRepository, isMounted]);

  const createOrder = async (order: any) => {
    try {
      return await orderRepository.createOrder(order);
    } catch (err: any) {
      if (isMounted()) {
        setError(err?.message || 'Error creating order');
      }
      throw err;
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      await orderRepository.updateOrderStatus(orderId, status);
    } catch (err: any) {
      if (isMounted()) {
        setError(err?.message || 'Error updating order status');
      }
      throw err;
    }
  };

  return {
    orders,
    loading,
    error,
    createOrder,
    updateOrderStatus
  };
}

/**
 * Hook for managing the customer's shopping context (name, phone, table number).
 */
export function useCustomerContext() {
  const { orderRepository } = useRepositories();
  const [context, setContext] = useState<{ name: string; phone: string; table: string }>({
    name: '',
    phone: '',
    table: '5'
  });
  const [loading, setLoading] = useState(true);
  const isMounted = useIsMounted();

  useEffect(() => {
    const loadContext = async () => {
      try {
        const ctx = await orderRepository.getCustomerContext();
        if (isMounted()) {
          setContext(ctx);
        }
      } catch (err) {
        console.error('Error loading customer context:', err);
      } finally {
        if (isMounted()) {
          setLoading(false);
        }
      }
    };
    loadContext();
  }, [orderRepository, isMounted]);

  const saveContext = async (newContext: { name: string; phone: string; table: string }) => {
    try {
      await orderRepository.saveCustomerContext(newContext);
      if (isMounted()) {
        setContext(newContext);
      }
    } catch (err) {
      console.error('Error saving customer context:', err);
      throw err;
    }
  };

  return {
    context,
    loading,
    saveContext
  };
}
