import React from 'react';
import type { Provider } from '../../types/provider';
import styles from '../../pages/registry.module.css';

interface ProviderActionsProps {
  provider: Provider;
  copySuccess: boolean;
  downloadLoading: boolean;
  expanded: boolean;
  onCopy: () => void;
  onDownload: () => void;
  onToggleExpanded: () => void;
}

export const ProviderActions: React.FC<ProviderActionsProps> = ({
  provider,
  copySuccess,
  downloadLoading,
  expanded,
  onCopy,
  onDownload,
  onToggleExpanded
}) => {
  const documentationUrl = provider.metadata?.documentation_url;

  return (
    <div className={styles.cardRight}>
      <button 
        className={styles.copyButton}
        onClick={onCopy}
        title="Copy provider configuration (JSON) to clipboard for use in your UTCP tool list"
      >
        {copySuccess ? '✓' : 'Copy'}
      </button>
      
      <div className={styles.secondaryActions}>
        {provider.provider_type === 'text' && provider.file_path && (
          <button 
            className={styles.docsButton}
            onClick={onDownload}
            disabled={downloadLoading}
            title="Download manual JSON file"
          >
            {downloadLoading ? 'Loading...' : 'Download Manual'}
          </button>
        )}
        
        {documentationUrl && (
          <a 
            href={documentationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.docsButton}
            title="View documentation"
          >
            Docs
          </a>
        )}
        
        <button 
          className={styles.expandButton}
          onClick={onToggleExpanded}
          title={expanded ? 'Hide details' : 'Show technical details'}
        >
          {expanded ? '▲' : '▼'}
        </button>
      </div>
    </div>
  );
};