import React from 'react';
import type { Provider } from '../../types/provider';
import { PropertyValue } from './PropertyValue';
import { formatPropertyName } from '../../utils/formatting';
import styles from '../../pages/registry.module.css';

interface TechnicalDetailsProps {
  provider: Provider;
}

export const TechnicalDetails: React.FC<TechnicalDetailsProps> = ({ provider }) => {
  const excludedKeys = ['name', 'provider_type', 'metadata'];
  
  const renderTechnicalDetails = () => {
    return Object.entries(provider)
      .filter(([key]) => !excludedKeys.includes(key))
      .map(([key, value]) => {
        if (value === null || value === undefined) return null;
        
        return (
          <div key={key} className={styles.techDetail}>
            <span className={styles.techLabel}>{formatPropertyName(key)}:</span>
            <span className={styles.techValue}>
              <PropertyValue value={value} />
            </span>
          </div>
        );
      })
      .filter(Boolean);
  };

  const renderMetadata = () => {
    if (!provider.metadata) return null;

    return Object.entries(provider.metadata)
      .filter(([key]) => !['description', 'category'].includes(key))
      .map(([key, value]) => (
        <div key={key} className={styles.techDetail}>
          <span className={styles.techLabel}>{formatPropertyName(key)}:</span>
          <span className={styles.techValue}>
            <PropertyValue value={value} />
          </span>
        </div>
      ));
  };

  return (
    <div className={styles.expandedContent}>
      <h4 className={styles.techTitle}>Technical Details</h4>
      <div className={styles.techGrid}>
        {renderTechnicalDetails()}
      </div>
      {provider.metadata && (
        <>
          <h4 className={styles.techTitle}>Metadata</h4>
          <div className={styles.techGrid}>
            {renderMetadata()}
          </div>
        </>
      )}
    </div>
  );
};