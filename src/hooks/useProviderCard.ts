import { useState } from 'react';
import type { Provider } from '../types/provider';
import { UI_CONSTANTS } from '../constants/ui';

interface UseProviderCardReturn {
  copySuccess: boolean;
  expanded: boolean;
  downloadLoading: boolean;
  showFullDescription: boolean;
  copyToClipboard: () => Promise<void>;
  downloadManual: () => Promise<void>;
  setExpanded: (expanded: boolean) => void;
  setShowFullDescription: (show: boolean) => void;
}

export const useProviderCard = (provider: Provider): UseProviderCardReturn => {
  const [copySuccess, setCopySuccess] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const copyToClipboard = async () => {
    try {
      const { metadata, ...providerWithoutMetadata } = provider;
      await navigator.clipboard.writeText(JSON.stringify(providerWithoutMetadata, null, 2));
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), UI_CONSTANTS.COPY_SUCCESS_TIMEOUT);
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

  return {
    copySuccess,
    expanded,
    downloadLoading,
    showFullDescription,
    copyToClipboard,
    downloadManual,
    setExpanded,
    setShowFullDescription
  };
};