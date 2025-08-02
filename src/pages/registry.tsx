import React, { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import Layout from '@theme/Layout';
import styles from './registry.module.css';

interface Provider {
  name: string;
  provider_type: string;
  metadata?: {
    description?: string;
    category?: string;
    last_updated?: string;
    maintainer?: string;
    documentation_url?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

function ProviderCard({ provider }: { provider: Provider }) {
  const [copySuccess, setCopySuccess] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const copyToClipboard = async () => {
    try {
      const { metadata, ...providerWithoutMetadata } = provider;
      await navigator.clipboard.writeText(JSON.stringify(providerWithoutMetadata, null, 2));
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };



  const getProviderIcon = (type: string) => {
    const iconMap = {
      'http': '🌐',
      'websocket': '🔌',
      'grpc': '⚡',
      'tcp': '🔗',
      'udp': '📡',
      'text': '📄',
      'cli': '💻',
      'graphql': '🎯',
      'sse': '📈',
      'webrtc': '📹'
    };
    return iconMap[type.toLowerCase()] || '🔧';
  };

  const getCategoryColor = (category: string) => {
    const colorMap = {
      'Books & Literature': '#8B5CF6',
      'News & Media': '#EF4444',
      'AI & ML': '#06B6D4',
      'Finance': '#10B981',
      'Social': '#F59E0B',
      'Entertainment': '#EC4899',
      'Development': '#3B82F6'
    };
    return colorMap[category] || '#6B7280';
  };

  const formatPropertyName = (key: string): string => {
    return key
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const renderPropertyValue = (key: string, value: any): ReactNode => {
    if (value === null || value === undefined) return null;
    
    if (typeof value === 'boolean') {
      return <span>{value ? 'Yes' : 'No'}</span>;
    }
    
    if (typeof value === 'object') {
      if (Array.isArray(value)) {
        return <span>{value.join(', ')}</span>;
      }
      return <span>{JSON.stringify(value, null, 2)}</span>;
    }
    
    if (typeof value === 'string' && (value.startsWith('http://') || value.startsWith('https://'))) {
      return <a href={value} target="_blank" rel="noopener noreferrer">{value}</a>;
    }
    
    return <span>{value.toString()}</span>;
  };

  const renderTechnicalDetails = () => {
    const excludedKeys = ['name', 'provider_type', 'metadata'];
    
    return Object.entries(provider)
      .filter(([key]) => !excludedKeys.includes(key))
      .map(([key, value]) => {
        if (value === null || value === undefined) return null;
        
        return (
          <div key={key} className={styles.techDetail}>
            <span className={styles.techLabel}>{formatPropertyName(key)}:</span>
            <span className={styles.techValue}>{renderPropertyValue(key, value)}</span>
          </div>
        );
      })
      .filter(Boolean);
  };

  const description = provider.metadata?.description || 'No description available';
  const category = provider.metadata?.category || 'Other';
  const maintainer = provider.metadata?.maintainer;
  const documentationUrl = provider.metadata?.documentation_url;

  return (
    <div className={styles.providerCard}>
      {/* Header */}
      <div className={styles.cardHeader}>
        <div className={styles.providerIcon}>
          {getProviderIcon(provider.provider_type)}
        </div>
        <div className={styles.headerContent}>
          <h3 className={styles.providerName}>{provider.name}</h3>
          <div className={styles.badges}>
            <span 
              className={styles.categoryBadge}
              style={{ backgroundColor: getCategoryColor(category) }}
            >
              {category}
            </span>
            <span className={styles.typeBadge}>
              {provider.provider_type.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className={styles.description}>{description}</p>

      {/* Maintainer (if available) */}
      {maintainer && (
        <div className={styles.maintainerInfo}>
          <span className={styles.maintainerLabel}>by</span>
          <span className={styles.maintainerName}>{maintainer}</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className={styles.actionButtons}>
        <button 
          className={styles.copyButton}
          onClick={copyToClipboard}
          title="Copy JSON to clipboard"
        >
          {copySuccess ? '✓ Copied' : '📋 Copy'}
        </button>
        
        {documentationUrl && (
          <a 
            href={documentationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.docsButton}
            title="View documentation"
          >
            📖 Docs
          </a>
        )}
        
        <button 
          className={styles.expandButton}
          onClick={() => setExpanded(!expanded)}
          title={expanded ? 'Hide details' : 'Show technical details'}
        >
          {expanded ? '🔼 Less' : '🔽 More'}
        </button>
      </div>

      {/* Expanded Technical Details */}
      {expanded && (
        <div className={styles.expandedContent}>
          <h4 className={styles.techTitle}>Technical Details</h4>
          <div className={styles.techGrid}>
            {renderTechnicalDetails()}
          </div>
          {provider.metadata && (
            <>
              <h4 className={styles.techTitle}>Metadata</h4>
              <div className={styles.techGrid}>
                {Object.entries(provider.metadata)
                  .filter(([key]) => !['description', 'category'].includes(key))
                  .map(([key, value]) => (
                    <div key={key} className={styles.techDetail}>
                      <span className={styles.techLabel}>{formatPropertyName(key)}:</span>
                      <span className={styles.techValue}>{renderPropertyValue(key, value)}</span>
                    </div>
                  ))
                }
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default function Registry(): ReactNode {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [filteredProviders, setFilteredProviders] = useState<Provider[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/providers.json')
      .then(response => response.json())
      .then((data: Provider[]) => {
        setProviders(data);
        setFilteredProviders(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading providers:', error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const filtered = providers.filter(provider =>
      provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.provider_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (provider.metadata?.description?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (provider.metadata?.category?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (provider.metadata?.maintainer?.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredProviders(filtered);
  }, [searchTerm, providers]);

  return (
    <Layout
      title="Provider Registry"
      description="Browse available UTCP providers">
      <div className={styles.registryContainer}>
        <div className="container">
          <div className={styles.header}>
            <h1>Provider Registry</h1>
            <p>Discover and explore available UTCP providers</p>
          </div>
          
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search providers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          {loading ? (
            <div className={styles.loading}>Loading providers...</div>
          ) : (
            <div className={styles.providersGrid}>
              {filteredProviders.length > 0 ? (
                filteredProviders.map((provider, index) => (
                  <ProviderCard key={provider.name} provider={provider} />
                ))
              ) : (
                <div className={styles.noResults}>
                  No providers found matching "{searchTerm}"
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
