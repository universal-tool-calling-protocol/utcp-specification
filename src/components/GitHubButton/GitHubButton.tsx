import React, { useState, useEffect } from 'react';
import './GitHubButton.css';

interface GitHubStats {
  followers: number;
  public_repos: number;
}

const GitHubButton: React.FC = () => {
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGitHubStats = async () => {
      try {
        const response = await fetch('https://api.github.com/orgs/universal-tool-calling-protocol');
        if (response.ok) {
          const data = await response.json();
          setStats({
            followers: data.followers || 0,
            public_repos: data.public_repos || 0,
          });
        }
      } catch (error) {
        console.error('Failed to fetch GitHub stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGitHubStats();
  }, []);

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  return (
    <a
      href="https://github.com/universal-tool-calling-protocol"
      target="_blank"
      rel="noopener noreferrer"
      className="github-button-custom"
      title={`${stats?.followers || 0} followers • ${stats?.public_repos || 0} repositories`}
    >
      <div className="github-icon" />
      <div className="github-stats">
        {loading ? (
          <span className="loading-dots">...</span>
        ) : (
          <>
            <span className="followers-count">{formatNumber(stats?.followers || 0)}</span>
            <span className="followers-label">followers</span>
          </>
        )}
      </div>
    </a>
  );
};

export default GitHubButton;