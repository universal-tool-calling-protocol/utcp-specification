import React, { useState } from 'react';
import type { ReactNode } from 'react';
import Layout from '@theme/Layout';
import { useProviders } from '../hooks/useProviders';
import { SearchHeader } from '../components/Registry/SearchHeader';
import { MobileFilter } from '../components/Registry/MobileFilter';
import { CategoryFilter } from '../components/Registry/CategoryFilter';
import { ProvidersGrid } from '../components/Registry/ProvidersGrid';
import { DiscoverPage } from '../components/Registry/DiscoverPage';
import { ViewToggle } from '../components/Registry/ViewToggle';
import { UI_CONSTANTS } from '../constants/ui';
import styles from './registry.module.css';

export default function Registry(): ReactNode {
  const {
    providers,
    filteredProviders,
    loading,
    error,
    searchTerm,
    selectedCategories,
    setSearchTerm,
    toggleCategory,
    clearCategoryFilters,
    getCategories
  } = useProviders();
  
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [viewMode, setViewMode] = useState<'discover' | 'categories'>('discover');

  const handleViewToggle = (mode: 'discover' | 'categories') => {
    setViewMode(mode);
    if (mode === 'discover') {
      // Clear search when switching to discover view
      setSearchTerm('');
      clearCategoryFilters();
    } else {
      // When switching to categories view, clear search but don't auto-select categories
      setSearchTerm('');
    }
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    // When user starts searching, automatically switch to categories view
    if (term && viewMode === 'discover') {
      setViewMode('categories');
    }
  };

  if (error) {
    return (
      <Layout title="Provider Registry" description="Browse available UTCP providers">
        <div className={styles.registryContainer}>
          <div className={styles.loading}>Error loading providers: {error}</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      title="Provider Registry"
      description="Browse available UTCP providers"> 
      <div className={styles.registryContainer}>
        <SearchHeader
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
        />

        <ViewToggle 
          viewMode={viewMode}
          onToggle={handleViewToggle}
        />

        <MobileFilter
          showMobileFilter={showMobileFilter}
          selectedCategories={selectedCategories}
          onToggleMobileFilter={() => setShowMobileFilter(!showMobileFilter)}
        />

        {viewMode === 'discover' && !searchTerm ? (
          <DiscoverPage providers={providers} />
        ) : (
          <div className={styles.mainLayout}>
            <CategoryFilter
              categories={getCategories()}
              selectedCategories={selectedCategories}
              totalProviders={providers.length}
              showMobileFilter={showMobileFilter}
              onToggleCategory={toggleCategory}
              onClearFilters={clearCategoryFilters}
            />

            <div className={styles.mainContent}>
              <div className={styles.categoryTitle}>
                <h2>
                  {selectedCategories.length === 0 
                    ? 'All Providers' 
                    : selectedCategories.length === 1 
                    ? selectedCategories[0] 
                    : `${selectedCategories.length} Categories`
                  } ({filteredProviders.length})
                </h2>
              </div>

              <ProvidersGrid
                providers={filteredProviders}
                loading={loading}
                searchTerm={searchTerm}
                selectedCategories={selectedCategories}
              />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
