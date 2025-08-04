import { useState, useEffect } from 'react';
import type { Provider, CategoryCount } from '../types/provider';
import { UI_CONSTANTS, DISCOVER_PROVIDERS } from '../constants/ui';

interface UseProvidersReturn {
  providers: Provider[];
  filteredProviders: Provider[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  selectedCategories: string[];
  setSearchTerm: (term: string) => void;
  setSelectedCategories: (categories: string[]) => void;
  toggleCategory: (category: string) => void;
  clearCategoryFilters: () => void;
  getCategories: () => CategoryCount[];
}

export const useProviders = (): UseProvidersReturn => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [filteredProviders, setFilteredProviders] = useState<Provider[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load providers from API
  useEffect(() => {
    const loadProviders = async () => {
      try {
        const response = await fetch('/providers.json');
        if (!response.ok) {
          throw new Error('Failed to load providers');
        }
        const data: Provider[] = await response.json();
        setProviders(data);
        setFilteredProviders(data);
      } catch (err) {
        console.error('Error loading providers:', err);
        setError(err instanceof Error ? err.message : 'Failed to load providers');
      } finally {
        setLoading(false);
      }
    };

    loadProviders();
  }, []);

  // Filter providers based on search term and selected categories
  useEffect(() => {
    let filtered = providers;
    
    // Filter by categories if selected
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(provider => {
        const providerCategory = provider.metadata?.category || UI_CONSTANTS.DEFAULT_CATEGORY;
        
        // Handle Discover category specially
        if (selectedCategories.includes(UI_CONSTANTS.DISCOVER_CATEGORY)) {
          const isDiscoverProvider = DISCOVER_PROVIDERS.includes(provider.name as any);
          const isOtherSelectedCategory = selectedCategories.some(cat => 
            cat !== UI_CONSTANTS.DISCOVER_CATEGORY && cat === providerCategory
          );
          return isDiscoverProvider || isOtherSelectedCategory;
        }
        
        // Regular category filtering
        return selectedCategories.includes(providerCategory);
      });
    }
    
    // Filter by search term
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(provider =>
        provider.name.toLowerCase().includes(lowerSearchTerm) ||
        provider.provider_type.toLowerCase().includes(lowerSearchTerm) ||
        (provider.metadata?.description?.toLowerCase().includes(lowerSearchTerm)) ||
        (provider.metadata?.category?.toLowerCase().includes(lowerSearchTerm)) ||
        (provider.metadata?.maintainer?.toLowerCase().includes(lowerSearchTerm))
      );
    }
    
    setFilteredProviders(filtered);
  }, [searchTerm, selectedCategories, providers]);

  // Get categories with counts, sorted by popularity
  const getCategories = (): CategoryCount[] => {
    const categoryMap = new Map<string, number>();
    providers.forEach(provider => {
      const category = provider.metadata?.category || UI_CONSTANTS.DEFAULT_CATEGORY;
      categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
    });
    
    // Add Discover category with count of curated providers
    const discoverCount = providers.filter(provider => 
      DISCOVER_PROVIDERS.includes(provider.name as any)
    ).length;
    
    const categories = Array.from(categoryMap.entries())
      .sort(([,a], [,b]) => b - a) // Sort by count descending
      .map(([category, count]) => ({ category, count }));
    
    // Add Discover at the top
    return [
      { category: UI_CONSTANTS.DISCOVER_CATEGORY, count: discoverCount },
      ...categories
    ];
  };

  // Toggle category selection
  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  // Clear all category filters
  const clearCategoryFilters = () => {
    setSelectedCategories([]);
  };

  return {
    providers,
    filteredProviders,
    loading,
    error,
    searchTerm,
    selectedCategories,
    setSearchTerm,
    setSelectedCategories,
    toggleCategory,
    clearCategoryFilters,
    getCategories
  };
};