import React from 'react';
import type { Provider } from '../../types/provider';
import { useProviderCard } from '../../hooks/useProviderCard';
import { getCategoryIcon } from '../../utils/icons';
import { UI_CONSTANTS } from '../../constants/ui';
import { ProviderDescription } from './ProviderDescription';
import { ProviderActions } from './ProviderActions';
import { TechnicalDetails } from './TechnicalDetails';
import styles from '../../pages/registry.module.css';

interface ProviderCardProps {
  provider: Provider;
}

export const ProviderCard: React.FC<ProviderCardProps> = ({ provider }) => {
  const {
    copySuccess,
    expanded,
    downloadLoading,
    showFullDescription,
    copyToClipboard,
    downloadManual,
    setExpanded,
    setShowFullDescription
  } = useProviderCard(provider);

  const category = provider.metadata?.category || UI_CONSTANTS.DEFAULT_CATEGORY;
  const maintainer = provider.metadata?.maintainer;
  const lastUpdated = provider.metadata?.last_updated;
  const description = provider.metadata?.description || UI_CONSTANTS.NO_DESCRIPTION_TEXT;

  return (
    <div className={styles.providerCard}>
      <div className={styles.cardLayout}>
        {/* Left side - Icon and basic info */}
        <div className={styles.cardLeft}>
          <div className={styles.providerIcon}>
            {getCategoryIcon(category)}
          </div>
          <div className={styles.cardInfo}>
            <h3 className={styles.providerName}>{provider.name}</h3>
            {maintainer && (
              <p className={styles.maintainerName}>@ {maintainer}</p>
            )}
            
            <ProviderDescription
              description={description}
              showFullDescription={showFullDescription}
              onToggleDescription={() => setShowFullDescription(!showFullDescription)}
            />
            
            <div className={styles.cardFooter}>
              <span className={styles.typeBadge}>{provider.provider_type}</span>
              {lastUpdated && (
                <span className={styles.lastUpdated}>{lastUpdated}</span>
              )}
            </div>
          </div>
        </div>

        {/* Right side - Actions */}
        <ProviderActions
          provider={provider}
          copySuccess={copySuccess}
          downloadLoading={downloadLoading}
          expanded={expanded}
          onCopy={copyToClipboard}
          onDownload={downloadManual}
          onToggleExpanded={() => setExpanded(!expanded)}
        />
      </div>

      {/* Expanded Technical Details */}
      {expanded && <TechnicalDetails provider={provider} />}
    </div>
  );
};