import React from 'react';
import type { Provider } from '../../types/provider';
import { ProviderCard } from '../ProviderCard';
import styles from '../../pages/registry.module.css';

interface ProvidersGridProps {
  providers: Provider[];
  loading: boolean;
  searchTerm: string;
  selectedCategories: string[];
}

export const ProvidersGrid: React.FC<ProvidersGridProps> = ({
  providers,
  loading,
  searchTerm,
  selectedCategories
}) => {
  if (loading) {
    return <div className={styles.loading}>Loading providers...</div>;
  }

  if (providers.length === 0) {
    return (
      <div className={styles.noResults}>
        No providers found{searchTerm ? ` matching "${searchTerm}"` : 
          selectedCategories.length > 0 ? ` in selected categories` : ''}
      </div>
    );
  }

  return (
    <div className={styles.providersGrid}>
      {providers.map((provider, index) => (
        <ProviderCard 
          key={`${provider.name}-${index}-${provider.metadata?.category || 'other'}`} 
          provider={provider} 
        />
      ))}
    </div>
  );
};