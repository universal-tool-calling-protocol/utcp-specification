import React from 'react';
import type { ReactNode } from 'react';
import { isUrl } from '../../utils/formatting';

interface PropertyValueProps {
  value: any;
}

export const PropertyValue: React.FC<PropertyValueProps> = ({ value }): ReactNode => {
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
  
  if (typeof value === 'string' && isUrl(value)) {
    return <a href={value} target="_blank" rel="noopener noreferrer">{value}</a>;
  }
  
  return <span>{value.toString()}</span>;
};