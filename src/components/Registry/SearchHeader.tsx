import React from 'react';
import styles from '../../pages/registry.module.css';

interface SearchHeaderProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export const SearchHeader: React.FC<SearchHeaderProps> = ({
  searchTerm,
  onSearchChange
}) => {
  return (
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
            onChange={(e) => onSearchChange(e.target.value)}
            className={styles.searchInput}
          />
          <a
            href="https://github.com/universal-tool-calling-protocol/utcp-specification/blob/main/static/providers.json"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.addProviderButton}
            title="Add new providers via GitHub Pull Request"
          >
            <span className={styles.addIcon}>+</span>
            <span className={styles.addText}>Add Provider</span>
            <div className={styles.addProviderTooltip}>
              Add a new provider via GitHub Pull Request
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};