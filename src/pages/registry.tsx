import React, { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import Layout from '@theme/Layout';
import styles from './registry.module.css';

interface Provider {
  name: string;
  provider_type: string;
  [key: string]: any;
}

function ProviderCard({ provider }: { provider: Provider }) {
  const [copySuccess, setCopySuccess] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(provider, null, 2));
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const downloadManual = async () => {
    if (provider.provider_type !== 'text' || !provider.file_path) return;
    
    setDownloadLoading(true);
    try {
      // Extract filename from file_path properly handling any path format
      const filename = provider.file_path.split(/[\\\/]/).pop() || provider.file_path;
      const response = await fetch(`/manuals/${filename}`);
      
      if (!response.ok) {
        throw new Error(`Failed to download: ${response.statusText}`);
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Failed to download manual:', err);
      alert('Failed to download manual file');
    } finally {
      setDownloadLoading(false);
    }
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

  const renderProviderDetails = () => {
    const excludedKeys = ['name', 'provider_type'];
    
    return Object.entries(provider)
      .filter(([key]) => !excludedKeys.includes(key))
      .map(([key, value]) => {
        if (value === null || value === undefined) return null;
        
        return (
          <p key={key}>
            <strong>{formatPropertyName(key)}:</strong> {renderPropertyValue(key, value)}
          </p>
        );
      })
      .filter(Boolean);
  };

  return (
    <div className={styles.providerCard}>
      <div className={styles.cardHeader}>
        <div className={styles.cardHeaderLeft}>
          <h3 className={styles.providerName}>{provider.name}</h3>
          <span className={styles.providerType}>{provider.provider_type}</span>
        </div>
        <button 
          className={styles.copyButton}
          onClick={copyToClipboard}
          title="Copy JSON to clipboard"
        >
          {copySuccess ? '✓ Copied!' : '📋 Copy'}
        </button>
      </div>
      <div className={styles.cardContent}>
        {renderProviderDetails()}
      </div>
      {provider.provider_type === 'text' && provider.file_path && (
        <div className={styles.cardFooter}>
          <button 
            className={styles.downloadButton}
            onClick={downloadManual}
            disabled={downloadLoading}
            title="Download manual JSON file"
          >
            {downloadLoading ? '⏳ Loading...' : '📄 Download Manual'}
          </button>
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
      provider.provider_type.toLowerCase().includes(searchTerm.toLowerCase())
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
