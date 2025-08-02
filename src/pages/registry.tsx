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

  const getCategoryIcon = (category: string) => {
    const iconMap = {
      'Animals': '🐾',
      'Anime': '🎌',
      'Anti-Malware': '🛡️',
      'Art & Design': '🎨',
      'Authentication & Authorization': '🔐',
      'Blockchain': '⛓️',
      'Books': '📚',
      'Books & Literature': '📚',
      'Business': '💼',
      'Calendar': '📅',
      'Cloud Storage & File Sharing': '☁️',
      'Continuous Integration': '🔄',
      'Cryptocurrency': '₿',
      'Currency Exchange': '💱',
      'Data Validation': '✅',
      'Development': '⚙️',
      'Dictionaries': '📖',
      'Documents & Productivity': '📄',
      'Email': '📧',
      'Entertainment': '🎭',
      'Environment': '🌍',
      'Events': '📌',
      'Finance': '💰',
      'Food & Drink': '🍕',
      'Games & Comics': '🎮',
      'Geocoding': '🗺️',
      'Government': '🏛️',
      'Health': '🏥',
      'Jobs': '💼',
      'Machine Learning': '🤖',
      'Music': '🎵',
      'News': '📰',
      'News & Media': '📰',
      'Open Data': '📊',
      'Open Source Projects': '🔓',
      'Patent': '📋',
      'Personality': '👤',
      'Phone': '📞',
      'Photography': '📸',
      'Programming': '💻',
      'Science & Math': '🔬',
      'Security': '🔒',
      'Shopping': '🛒',
      'Social': '👥',
      'Sports & Fitness': '⚽',
      'Test Data': '🧪',
      'Text Analysis': '📝',
      'Tracking': '📍',
      'Transportation': '🚗',
      'URL Shorteners': '🔗',
      'Vehicle': '🚙',
      'Video': '🎬',
      'Weather': '🌤️',
      'AI & ML': '🤖',
      'AI & Machine Learning': '🤖'
    };
    return iconMap[category] || '📦';
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
  const lastUpdated = provider.metadata?.last_updated;

  // Truncate description for compact view
  const shortDescription = description.length > 100 ? 
    description.substring(0, 100) + '...' : description;

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
            <p className={styles.description}>{shortDescription}</p>
            
            <div className={styles.cardFooter}>
              <span className={styles.typeBadge}>{provider.provider_type}</span>
              {lastUpdated && (
                <span className={styles.lastUpdated}>{lastUpdated}</span>
              )}
            </div>
          </div>
        </div>

        {/* Right side - Actions */}
        <div className={styles.cardRight}>
          <button 
            className={styles.copyButton}
            onClick={copyToClipboard}
            title="Copy provider configuration to clipboard"
          >
            {copySuccess ? '✓' : 'Copy'}
          </button>
          
          <div className={styles.secondaryActions}>
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
              onClick={() => setExpanded(!expanded)}
              title={expanded ? 'Hide details' : 'Show technical details'}
            >
              {expanded ? '▲' : '▼'}
            </button>
          </div>
        </div>
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
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

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
    let filtered = providers;
    
    // Filter by categories if selected
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(provider => 
        selectedCategories.includes(provider.metadata?.category || 'Other')
      );
    }
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(provider =>
        provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        provider.provider_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (provider.metadata?.description?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (provider.metadata?.category?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (provider.metadata?.maintainer?.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    setFilteredProviders(filtered);
  }, [searchTerm, selectedCategories, providers]);

  // Get categories with counts, sorted by popularity
  const getCategories = () => {
    const categoryMap = new Map<string, number>();
    providers.forEach(provider => {
      const category = provider.metadata?.category || 'Other';
      categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
    });
    
    return Array.from(categoryMap.entries())
      .sort(([,a], [,b]) => b - a) // Sort by count descending
      .map(([category, count]) => ({ category, count }));
  };

  // Toggle category selection
  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  // Clear all category filters
  const clearCategoryFilters = () => {
    setSelectedCategories([]);
  };

  return (
    <Layout
      title="Provider Registry"
      description="Browse available UTCP providers"> 
      <div className={styles.registryContainer}>
        {/* Header Section */}
        <div className={styles.header}>
          <div className="container">
            <div className={styles.headerTitle}>
              <h1>Providers Registry</h1>
              <div className={styles.infoTooltip}>
                <span className={styles.infoIcon}>i</span>
                <div className={styles.tooltipContent}>
                  <strong>How to use:</strong>
                  <br />
                  1. Find a provider you want to use
                  <br />
                  2. Click "Copy" to copy its configuration
                  <br />
                  3. Paste it into your UTCP tool list
                  <br />
                  4. Check the provider's documentation for setup details
                </div>
              </div>
            </div>
            <p className={styles.subtitle}>What are you looking for?</p>
            
            <div className={styles.searchContainer}>
              <input
                type="text"
                placeholder="Search with keywords"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
            </div>
          </div>
        </div>

        {/* Mobile Filter Toggle */}
        <div className={styles.mobileFilterToggle}>
          <button
            className={styles.mobileFilterButton}
            onClick={() => setShowMobileFilter(!showMobileFilter)}
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
            onClick={() => setShowMobileFilter(false)}
          />
        )}

        {/* Main Layout with Sidebar */}
        <div className={styles.mainLayout}>
          {/* Left Sidebar Filter */}
          <div className={`${styles.sidebar} ${showMobileFilter ? styles.sidebarVisible : ''}`}>
            <div className={styles.sidebarHeader}>
              <h2>Filter by Category</h2>
              {selectedCategories.length > 0 && (
                <button
                  className={styles.clearButton}
                  onClick={clearCategoryFilters}
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
                  onChange={() => clearCategoryFilters()}
                />
                <span className={styles.checkboxLabel}>
                  All Providers ({providers.length})
                </span>
              </label>
              
              {getCategories().map(({ category, count }) => (
                <label key={category} className={styles.categoryCheckbox}>
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={() => toggleCategory(category)}
                  />
                  <span className={styles.checkboxLabel}>
                    {category} ({count})
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className={styles.mainContent}>
            {/* Category Title */}
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

            {/* Providers Grid */}
            {loading ? (
              <div className={styles.loading}>Loading providers...</div>
            ) : (
              <div className={styles.providersGrid}>
                {filteredProviders.length > 0 ? (
                  filteredProviders.map((provider, index) => (
                    <ProviderCard key={`${provider.name}-${index}-${provider.metadata?.category || 'other'}`} provider={provider} />
                  ))
                ) : (
                  <div className={styles.noResults}>
                    No providers found{searchTerm ? ` matching "${searchTerm}"` : 
                      selectedCategories.length > 0 ? ` in selected categories` : ''}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
