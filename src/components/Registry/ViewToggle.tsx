import React from 'react';
import styles from './ViewToggle.module.css';

interface ViewToggleProps {
  viewMode: 'discover' | 'categories';
  onToggle: (mode: 'discover' | 'categories') => void;
  className?: string;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({ viewMode, onToggle, className }) => {
  return (
    <div className={`${styles.viewToggle} ${className || ''}`}>
      <div className={styles.toggleContainer}>
        <button
          className={`${styles.toggleButton} ${viewMode === 'discover' ? styles.active : ''}`}
          onClick={() => onToggle('discover')}
        >
          <span className={styles.icon}>✨</span>
          <span className={styles.label}>Discover</span>
        </button>
        <button
          className={`${styles.toggleButton} ${viewMode === 'categories' ? styles.active : ''}`}
          onClick={() => onToggle('categories')}
        >
          <span className={styles.icon}>📋</span>
          <span className={styles.label}>Categories</span>
        </button>
        <div 
          className={styles.slider}
          style={{
            transform: `translateX(${viewMode === 'discover' ? '0%' : '100%'})`
          }}
        />
      </div>
    </div>
  );
};