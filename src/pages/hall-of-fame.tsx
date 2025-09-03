import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import styles from './hall-of-fame.module.css';
import { ContributorsData, GitHubContributor, DisplayContributor } from '../types/contributors';

// Simple tooltip component
const Tooltip: React.FC<{ children: React.ReactNode; text: string }> = ({ children, text }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          style={{
            position: 'absolute',
            bottom: '120%',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#333',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            whiteSpace: 'nowrap',
            zIndex: 1000,
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
          }}
        >
          {text}
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '4px solid transparent',
              borderRight: '4px solid transparent',
              borderTop: '4px solid #333'
            }}
          />
        </div>
      )}
    </div>
  );
};

// Utility function to format date
const formatDate = (dateString: string | null): string => {
  if (!dateString) return 'Unknown';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

// Function to determine contributor status based on contribution score
const getContributorStatus = (contributionScore: number, lastActivity: string | null, username: string): string => {
  // Special status for founding contributors
  const foundingContributors = ['h3xxit', 'AndreiGS', 'edujuan', 'aliraza1006', 'ulughbeck'];
  if (foundingContributors.includes(username)) {
    return 'Founding Contributor';
  }
  
  if (username === 'Raezil') {
    return 'Lead Developer';
  }
  
  const now = new Date();
  const lastActivityDate = lastActivity ? new Date(lastActivity) : null;
  const daysSinceLastActivity = lastActivityDate ? 
    (now.getTime() - lastActivityDate.getTime()) / (1000 * 60 * 60 * 24) : Infinity;
  
  // Factor in recency for status determination
  if (contributionScore >= 100) {
    return daysSinceLastActivity <= 90 ? 'Core contributor' : 'Core contributor (inactive)';
  }
  if (contributionScore >= 50) {
    return daysSinceLastActivity <= 90 ? 'Active contributor' : 'Regular contributor';
  }
  if (contributionScore >= 20) return 'Regular contributor';
  return 'New contributor';
};

// Function to generate fallback avatar emoji based on username (if image fails to load)
const generateFallbackAvatar = (username: string): string => {
  const avatars = ['🚀', '⚡', '🔒', '📝', '🎨', '🛠️', '☁️', '🌟', '🔥', '💎', '🌊', '🌙', '☀️', '🌈', '🦄'];
  const hash = username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return avatars[hash % avatars.length];
};

// Function to determine primary role based on repositories
const getPrimaryRole = (repositories: string[], contributionScore: number, username: string): string => {
  if (repositories.length === 0) return 'Contributor';
  
  // Special roles for UTCP admins
  const utcpAdmins = ['h3xxit', 'aliraza1006', 'edujuan', 'ulughbeck', 'AndreiGS'];
  if (utcpAdmins.includes(username)) {
    return 'UTCP Admin';
  }
  
  // Special role for Kamil
  if (username === 'Raezil') {
    return 'Lead Maintainer of Go Port';
  }
  
  
  // Map common repository patterns to roles
  const rolePatterns = [
    { pattern: /typescript|ts-sdk|js-sdk|javascript/i, role: 'TypeScript/JavaScript SDK' },
    { pattern: /python|py-sdk/i, role: 'Python SDK' },
    { pattern: /go-sdk|golang/i, role: 'Go SDK' },
    { pattern: /rust-sdk|rs-sdk/i, role: 'Rust SDK' },
    { pattern: /java-sdk/i, role: 'Java SDK' },
    { pattern: /csharp|cs-sdk|dotnet/i, role: 'C# SDK' },
    { pattern: /php-sdk/i, role: 'PHP SDK' },
    { pattern: /specification|spec|docs/i, role: 'Specification & Docs' },
    { pattern: /examples|samples/i, role: 'Examples & Samples' },
    { pattern: /tools|utilities/i, role: 'Tools & Utilities' }
  ];
  
  for (const { pattern, role } of rolePatterns) {
    if (repositories.some(repo => pattern.test(repo))) {
      return role;
    }
  }
  
  return repositories.length > 1 ? 'Multi-language SDK' : 'Contributor';
};

// Transform GitHub contributor data to display format
const transformContributor = (ghContributor: GitHubContributor): DisplayContributor => {
  const status = getContributorStatus(ghContributor.impact_score, ghContributor.last_activity, ghContributor.login);
  const role = getPrimaryRole(ghContributor.repositories, ghContributor.impact_score, ghContributor.login);
  const avatar = ghContributor.avatar_url || generateFallbackAvatar(ghContributor.login);
  const joinDate = formatDate(ghContributor.created_at);
  
  // Determine top contribution based on repositories
  const topContribution = ghContributor.repo_count > 1 
    ? `Cross-project development (${ghContributor.repo_count} repos)` 
    : ghContributor.repositories[0] || 'Code contributions';
  
  // Format recent activity
  const recentActivity = ghContributor.total_recent_commits > 0 
    ? `${ghContributor.total_recent_commits} recent commits`
    : 'No recent activity';
  
  // Format quality metrics
  const qualityMetrics = [
    ghContributor.total_prs > 0 ? `${ghContributor.total_prs} PRs (${ghContributor.pr_success_rate}% merged)` : null,
    ghContributor.total_reviews > 0 ? `${ghContributor.total_reviews} reviews` : null
  ].filter(Boolean).join(' • ') || 'Building great code';
  
  // Add star badge for high contributors
  const badges: Array<{ icon: string; tooltip: string }> = [];
  if (ghContributor.impact_score >= 100) {
    badges.push({ icon: "⭐", tooltip: "High Contributor" });
  }
  
  return {
    id: ghContributor.id,
    name: ghContributor.name || ghContributor.login,
    username: ghContributor.login,
    githubUsername: ghContributor.login,
    role,
    status,
    contributions: ghContributor.contributions,
    impact_score: ghContributor.impact_score,
    avatar,
    joinDate,
    topContribution,
    recentActivity,
    qualityMetrics,
    lookingForJob: ghContributor.hireable,
    total_recent_commits: ghContributor.total_recent_commits,
    badges: badges.length > 0 ? badges : undefined
  };
};

// Fallback data in case GitHub data isn't available
const fallbackContributors: DisplayContributor[] = [
  {
    id: 1,
    name: "Loading contributors...",
    username: "loading",
    githubUsername: "loading",
    role: "Fetching from GitHub",
    status: "Loading",
    contributions: 0,
    impact_score: 0,
    avatar: "⏳",
    joinDate: "Loading...",
    topContribution: "Loading...",
    recentActivity: "Loading...",
    qualityMetrics: "Loading...",
    total_recent_commits: 0,
    lookingForJob: false
  }
];

// Custom hook to load contributors data
const useContributors = (): DisplayContributor[] => {
  const [contributors, setContributors] = useState<DisplayContributor[]>(fallbackContributors);
  
  useEffect(() => {
    const loadContributors = async () => {
      let allContributors: GitHubContributor[] = [];
      
      // Load automatically generated contributors
      try {
        const autoModule = await import('../data/contributors.json');
        const autoContributorsData = autoModule.default as ContributorsData;
        allContributors = [...allContributors, ...autoContributorsData.contributors];
      } catch (error) {
        console.warn('Could not load auto-generated contributors data from GitHub.', error);
      }
      
      // Load manually added contributors
      try {
        const manualModule = await import('../data/contributors-manual.json');
        const manualContributorsData = manualModule.default as ContributorsData;
        allContributors = [...allContributors, ...manualContributorsData.contributors];
      } catch (error) {
        console.warn('Could not load manual contributors data.', error);
      }
      
      // If we have any contributors, transform and sort them
      if (allContributors.length > 0) {
        const transformedContributors = allContributors
          .map(transformContributor)
          .sort((a, b) => b.impact_score - a.impact_score); // Sort by impact score descending
        setContributors(transformedContributors);
      } else {
        // No contributors loaded, show fallback message
        setContributors([{
          id: 1,
          name: "Contributors data unavailable",
          username: "unavailable",
          githubUsername: "universal-tool-calling-protocol",
          role: "Run 'npm run fetch-contributors' to load data",
          status: "Data unavailable",
          contributions: 0,
          impact_score: 0,
          avatar: "⚠️",
          joinDate: "N/A",
          topContribution: "GitHub API data needed",
          recentActivity: "N/A",
          qualityMetrics: "N/A",
          total_recent_commits: 0,
          lookingForJob: false
        }]);
      }
    };
    
    loadContributors();
  }, []);
  
  return contributors;
};

const ContributorRow = ({ contributor, rank }: { contributor: DisplayContributor; rank: number }) => (
  <div className={styles.contributorRow}>
    <div className={styles.rowLeft}>
      <div className={styles.avatar}>
        {contributor.avatar.startsWith('http') ? (
          <img 
            src={contributor.avatar} 
            alt={`${contributor.name} avatar`}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.parentElement!.textContent = generateFallbackAvatar(contributor.username);
            }}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '8px',
              objectFit: 'cover'
            }}
          />
        ) : (
          contributor.avatar
        )}
      </div>
      <div className={styles.contributorInfo}>
        <h3 className={styles.contributorName}>
          <span className={styles.rankNumber}>{rank}.</span>
          <a 
            href={`https://github.com/${contributor.githubUsername}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.nameLink}
          >
            {contributor.name}
          </a>
        </h3>
        <p className={styles.contributorDescription}>
          {contributor.role}
        </p>
        <p className={styles.contributorStatus}>
          {contributor.status}
        </p>
      </div>
    </div>
    
    <div className={styles.rowRight}>
      {contributor.lookingForJob && (
        <button className={styles.jobButton}>
          Open to work
        </button>
      )}
      {contributor.badges && (
        <div className={styles.badges}>
          {contributor.badges.map((badge, index) => (
            <div key={index} className={styles.badge} title={badge.tooltip}>
              <span className={styles.badgeIcon}>{badge.icon}</span>
            </div>
          ))}
        </div>
      )}
      <div className={styles.contributionCount}>
        <Tooltip text={`${contributor.total_recent_commits} total commits in last 6 months`}>
          <span className={styles.countNumber}>{contributor.impact_score}</span>
        </Tooltip>
      </div>
    </div>
  </div>
);

export default function Contributors(): React.ReactNode {
  const contributors = useContributors();

  return (
    <Layout
      title="Contributors"
      description="Meet the amazing people building UTCP"
    >
      <div className={styles.contributorsContainer}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>Hall-of-Fame</h1>
            <p className={styles.subtitle}>
              Meet the amazing people building the Universal Tool Calling Protocol.
              We are extremely grateful for each and every one of you!
            </p>
            <p className={styles.leaderboardSubtitle}>
              Ranked by contribution score: recent activity across all repositories
            </p>
          </div>
        </div>
        
        <div className={styles.leaderboard}>
          <div className={styles.contributorsList}>
            {contributors.map((contributor, index) => (
              <ContributorRow 
                key={contributor.id} 
                contributor={contributor}
                rank={index + 1}
              />
            ))}
          </div>
        </div>
        
        <div className={styles.callToAction}>
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>Want to contribute?</h2>
            <p className={styles.ctaText}>
              Join our community of developers building the future of tool calling protocols.
            </p>
            <div className={styles.ctaButtons}>
              <a 
                href="https://github.com/utcp/utcp-specification" 
                className={styles.ctaButton}
                target="_blank"
                rel="noopener noreferrer"
              >
                View on GitHub
              </a>
              <a 
                href="/about/contributing" 
                className={styles.ctaButtonSecondary}
              >
                Contributing Guide
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}