import React from 'react';
import styles from '../../pages/registry.module.css';

interface MobileFilterProps {
  showMobileFilter: boolean;
  selectedCategories: string[];
  onToggleMobileFilter: () => void;
}

export const MobileFilter: React.FC<MobileFilterProps> = ({
  showMobileFilter,
  selectedCategories,
  onToggleMobileFilter
}) => {
  return (
    <>
      {/* Mobile Filter Toggle */}
      <div className={styles.mobileFilterToggle}>
        <button
          className={styles.mobileFilterButton}
          onClick={onToggleMobileFilter}
        >
          Filter by Category
          {selectedCategories.length > 0 && (
            <span className={styles.filterCount}>({selectedCategories.length})</span>
          )}
          <span className={styles.filterIcon}>{showMobileFilter ? '✕' : '☰'}</span>
        </button>
      </div>

      {/* Mobile Filter Overlay */}
      {showMobileFilter && (
        <div 
          className={styles.mobileOverlay}
          onClick={onToggleMobileFilter}
        />
      )}
    </>
  );
};