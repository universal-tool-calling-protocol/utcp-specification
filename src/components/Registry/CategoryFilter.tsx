import React from 'react';
import type { CategoryCount } from '../../types/provider';
import styles from '../../pages/registry.module.css';

interface CategoryFilterProps {
  categories: CategoryCount[];
  selectedCategories: string[];
  totalProviders: number;
  showMobileFilter: boolean;
  onToggleCategory: (category: string) => void;
  onClearFilters: () => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategories,
  totalProviders,
  showMobileFilter,
  onToggleCategory,
  onClearFilters
}) => {
  return (
    <div className={`${styles.sidebar} ${showMobileFilter ? styles.sidebarVisible : ''}`}>
      <div className={styles.sidebarHeader}>
        <h2>Filter by Category</h2>
        {selectedCategories.length > 0 && (
          <button
            className={styles.clearButton}
            onClick={onClearFilters}
          >
            Clear All
          </button>
        )}
      </div>
      
      <div className={styles.categoryList}>
        <label className={styles.categoryCheckbox}>
          <input
            type="checkbox"
            checked={selectedCategories.length === 0}
            onChange={onClearFilters}
          />
          <span className={styles.checkboxLabel}>
            All Providers ({totalProviders})
          </span>
        </label>
        
        {categories.map(({ category, count }) => (
          <label key={category} className={styles.categoryCheckbox}>
            <input
              type="checkbox"
              checked={selectedCategories.includes(category)}
              onChange={() => onToggleCategory(category)}
            />
            <span className={styles.checkboxLabel}>
              {category} ({count})
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};