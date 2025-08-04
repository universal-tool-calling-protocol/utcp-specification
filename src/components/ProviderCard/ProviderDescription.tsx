import React from 'react';
import { cleanMarkdown } from '../../utils/markdown';
import { UI_CONSTANTS } from '../../constants/ui';
import styles from '../../pages/registry.module.css';

interface ProviderDescriptionProps {
  description: string;
  showFullDescription: boolean;
  onToggleDescription: () => void;
}

export const ProviderDescription: React.FC<ProviderDescriptionProps> = ({
  description,
  showFullDescription,
  onToggleDescription
}) => {
  const cleanedDescription = cleanMarkdown(description || UI_CONSTANTS.NO_DESCRIPTION_TEXT);
  const isLongDescription = cleanedDescription.length > UI_CONSTANTS.DESCRIPTION_LIMIT;
  
  const displayedDescription = showFullDescription || !isLongDescription
    ? cleanedDescription
    : cleanedDescription.substring(0, UI_CONSTANTS.DESCRIPTION_LIMIT) + '...';

  return (
    <div className={styles.descriptionContainer}>
      <p className={styles.description}>{displayedDescription}</p>
      {isLongDescription && (
        <button 
          className={styles.showMoreButton}
          onClick={onToggleDescription}
        >
          {showFullDescription ? 'Show less' : 'Show more'}
        </button>
      )}
    </div>
  );
};