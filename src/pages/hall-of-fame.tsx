import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Layout from '@theme/Layout';
import styles from './hall-of-fame.module.css';
import { ContributorsData, GitHubContributor, DisplayContributor } from '../types/contributors';

// Constants for better maintainability
const CONTRIBUTOR_STATUS_THRESHOLDS = {
  CORE_CONTRIBUTOR: 100,
  ACTIVE_CONTRIBUTOR: 50,
  REGULAR_CONTRIBUTOR: 20,
  INACTIVITY_DAYS: 90,
} as const;

const SPECIAL_CONTRIBUTORS = {
  FOUNDING: ['h3xxit', 'AndreiGS', 'edujuan', 'aliraza1006', 'ulughbeck'] as readonly string[],
  ADMINS: ['h3xxit', 'aliraza1006', 'edujuan', 'ulughbeck', 'AndreiGS'] as readonly string[],
  LEAD_DEVELOPER: 'Raezil',
} as const;

// Simple tooltip component with dynamic positioning to prevent edge cutoff
const Tooltip: React.FC<{ children: React.ReactNode; text: string }> = ({ children, text }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState<'center' | 'left' | 'right'>('center');
  const containerRef = useCallback((node: HTMLDivElement | null) => {
    if (node && isVisible) {
      const rect = node.getBoundingClientRect();
      const tooltipWidth = text.length * 8 + 16; // Approximate tooltip width
      const viewportWidth = window.innerWidth;
      
      // Check if tooltip would overflow on the right
      if (rect.left + rect.width / 2 + tooltipWidth / 2 > viewportWidth - 10) {
        setPosition('right');
      }
      // Check if tooltip would overflow on the left
      else if (rect.left + rect.width / 2 - tooltipWidth / 2 < 10) {
        setPosition('left');
      }
      else {
        setPosition('center');
      }
    }
  }, [isVisible, text]);

  const handleMouseEnter = useCallback(() => setIsVisible(true), []);
  const handleMouseLeave = useCallback(() => setIsVisible(false), []);

  // Get the appropriate CSS classes based on position
  const getTooltipClasses = () => {
    switch (position) {
      case 'left':
        return { content: styles.tooltipContentLeft, arrow: styles.tooltipArrowLeft };
      case 'right':
        return { content: styles.tooltipContentRight, arrow: styles.tooltipArrowRight };
      default:
        return { content: styles.tooltipContent, arrow: styles.tooltipArrow };
    }
  };

  const tooltipClasses = getTooltipClasses();

  return (
    <div
      ref={containerRef}
      className={styles.tooltipContainer}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {isVisible && (
        <div className={tooltipClasses.content}>
          {text}
          <div className={tooltipClasses.arrow} />
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
  if (SPECIAL_CONTRIBUTORS.FOUNDING.includes(username)) {
    return 'Founding Contributor';
  }
  
  if (username === SPECIAL_CONTRIBUTORS.LEAD_DEVELOPER) {
    return 'Lead Developer';
  }
  
  const now = new Date();
  const lastActivityDate = lastActivity ? new Date(lastActivity) : null;
  const daysSinceLastActivity = lastActivityDate ? 
    (now.getTime() - lastActivityDate.getTime()) / (1000 * 60 * 60 * 24) : Infinity;
  
  // Factor in recency for status determination
  if (contributionScore >= CONTRIBUTOR_STATUS_THRESHOLDS.CORE_CONTRIBUTOR) {
    return daysSinceLastActivity <= CONTRIBUTOR_STATUS_THRESHOLDS.INACTIVITY_DAYS ? 'Core contributor' : 'Core contributor (inactive)';
  }
  if (contributionScore >= CONTRIBUTOR_STATUS_THRESHOLDS.ACTIVE_CONTRIBUTOR) {
    return daysSinceLastActivity <= CONTRIBUTOR_STATUS_THRESHOLDS.INACTIVITY_DAYS ? 'Active contributor' : 'Regular contributor';
  }
  if (contributionScore >= CONTRIBUTOR_STATUS_THRESHOLDS.REGULAR_CONTRIBUTOR) return 'Regular contributor';
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
  if (!repositories || repositories.length === 0) return 'Contributor';
  
  // Special roles for UTCP admins
  if (SPECIAL_CONTRIBUTORS.ADMINS.includes(username)) {
    return 'UTCP Admin';
  }
  
  // Special role for lead developer
  if (username === SPECIAL_CONTRIBUTORS.LEAD_DEVELOPER) {
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
  // Add null safety checks for all operations
  const impact_score = ghContributor?.impact_score || 0;
  const repositories = ghContributor?.repositories || [];
  const login = ghContributor?.login || 'unknown';
  
  const status = getContributorStatus(impact_score, ghContributor?.last_activity || null, login);
  const role = getPrimaryRole(repositories, impact_score, login);
  const avatar = ghContributor?.avatar_url || generateFallbackAvatar(login);
  const joinDate = formatDate(ghContributor?.created_at || null);
  
  // Determine top contribution based on repositories
  const repo_count = ghContributor?.repo_count || 0;
  const topContribution = repo_count > 1 
    ? `Cross-project development (${repo_count} repos)` 
    : repositories[0] || 'Code contributions';
  
  // Format line changes summary
  const formatLineChanges = (additions: number, deletions: number, total: number) => {
    if (total === 0) return 'No code changes tracked';
    
    const additionsStr = additions.toLocaleString();
    const deletionsStr = deletions.toLocaleString();
    const totalStr = total.toLocaleString();
    
    return `+${additionsStr} -${deletionsStr} (${totalStr} total)`;
  };
  
  // Format recent activity (now showing line changes instead of just commit count)
  const total_changes = ghContributor?.total_changes || 0;
  const total_additions = ghContributor?.total_additions || 0;
  const total_deletions = ghContributor?.total_deletions || 0;
  const total_recent_commits = ghContributor?.total_recent_commits || 0;
  
  const recentActivity = total_changes > 0
    ? formatLineChanges(total_additions, total_deletions, total_changes)
    : total_recent_commits > 0 
    ? `${total_recent_commits} recent commits`
    : 'No recent activity';
  
  // Format quality metrics with enhanced commit info
  const total_prs = ghContributor?.total_prs || 0;
  const total_reviews = ghContributor?.total_reviews || 0;
  const total_commits = ghContributor?.total_commits || 0;
  const pr_success_rate = ghContributor?.pr_success_rate || 0;
  
  const qualityMetrics = [
    total_prs > 0 ? `${total_prs} PRs (${pr_success_rate}% merged)` : null,
    total_reviews > 0 ? `${total_reviews} reviews` : null,
    total_commits > 0 ? `${total_commits} total commits` : null
  ].filter(Boolean).join(' • ') || 'Building great code';
  
  // Add star badge for high contributors
  const badges: Array<{ icon: string; tooltip: string }> = [];
  if (impact_score >= CONTRIBUTOR_STATUS_THRESHOLDS.CORE_CONTRIBUTOR) {
    badges.push({ icon: "⭐", tooltip: "High Contributor" });
  }

  const generateHash = (string) => {
    let hash = 0;
    for (const char of string) {
      hash = (hash << 5) - hash + char.charCodeAt(0);
      hash |= 0; // Constrain to 32bit integer
    }
    return hash;
  };
  
  return {
    id: ghContributor?.id || generateHash(login),
    name: ghContributor?.name || login,
    username: login,
    githubUsername: login,
    role,
    status,
    contributions: ghContributor?.contributions || 0,
    impact_score,
    avatar,
    joinDate,
    topContribution,
    recentActivity,
    qualityMetrics,
    lookingForJob: ghContributor?.hireable || false,
    repositories,
    total_recent_commits,
    // Enhanced line change statistics
    total_additions,
    total_deletions,
    total_changes,
    total_commits: total_commits || total_recent_commits,
    commits_analyzed: ghContributor?.commits_analyzed || 0,
    // PR and review statistics for tooltips
    total_prs,
    total_merged_prs: ghContributor?.total_merged_prs || 0,
    total_reviews,
    pr_success_rate,
    lineChangeSummary: recentActivity,
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
    total_additions: 0,
    total_deletions: 0,
    total_changes: 0,
    total_commits: 0,
    commits_analyzed: 0,
    total_prs: 0,
    total_merged_prs: 0,
    total_reviews: 0,
    pr_success_rate: 0,
    lineChangeSummary: "Loading...",
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
        if (autoContributorsData?.contributors && Array.isArray(autoContributorsData.contributors)) {
          allContributors = [...allContributors, ...autoContributorsData.contributors];
        } else {
          console.warn('Auto-generated contributors data has invalid format');
        }
      } catch (error) {
        console.warn('Could not load auto-generated contributors data from GitHub:', error instanceof Error ? error.message : 'Unknown error');
      }
      
      // Load manually added contributors (temporarily disabled)
      // try {
      //   const manualModule = await import('../data/contributors-manual.json');
      //   const manualContributorsData = manualModule.default as ContributorsData;
      //   if (manualContributorsData?.contributors && Array.isArray(manualContributorsData.contributors)) {
      //     allContributors = [...allContributors, ...manualContributorsData.contributors];
      //   } else {
      //     console.warn('Manual contributors data has invalid format');
      //   }
      // } catch (error) {
      //   console.warn('Could not load manual contributors data:', error instanceof Error ? error.message : 'Unknown error');
      // }
      
      // If we have any contributors, transform and sort them
      if (allContributors.length > 0) {
        const transformedContributors = allContributors
          .map(transformContributor)
          .sort((a, b) => {
            // Sort by total changes first (if available), then by impact score as fallback
            const aChanges = a.total_changes || 0;
            const bChanges = b.total_changes || 0;
            
            if (aChanges !== bChanges) {
              return bChanges - aChanges; // Sort by lines changed descending
            }
            
            return b.impact_score - a.impact_score; // Fallback to impact score
          });
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
          total_additions: 0,
          total_deletions: 0,
          total_changes: 0,
          total_commits: 0,
          commits_analyzed: 0,
          total_prs: 0,
          total_merged_prs: 0,
          total_reviews: 0,
          pr_success_rate: 0,
          repositories: [],
          lineChangeSummary: "N/A",
          lookingForJob: false
        }]);
      }
    };
    
    loadContributors();
  }, []);
  
  return contributors;
};

const ContributorRow = ({ contributor, rank }: { contributor: DisplayContributor; rank: number }) => {
  const [imageError, setImageError] = useState(false);
  
  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  const isHttpAvatar = contributor.avatar?.startsWith('http') ?? false;
  const shouldShowImage = isHttpAvatar && !imageError;

  return (
    <div className={styles.contributorRow}>
      <div className={styles.rowLeft}>
        <div className={styles.avatar}>
          {shouldShowImage ? (
            <img 
              src={contributor.avatar} 
              alt={`${contributor.name} avatar`}
              onError={handleImageError}
              className={styles.avatarImage}
            />
          ) : (
            <span className={styles.avatarEmoji}>
              {imageError ? generateFallbackAvatar(contributor.username) : contributor.avatar}
            </span>
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
          <Tooltip text={
            contributor.total_changes > 0 
              ? `${contributor.lineChangeSummary || 'No line changes'} • ${contributor.total_commits || 0} total commits • ${contributor.total_prs || 0} PRs (${contributor.pr_success_rate || 0}% merged)`
              : `${contributor.total_recent_commits || 0} commits in last 6 months • ${contributor.total_prs || 0} PRs • ${contributor.total_reviews || 0} reviews`
          }>
            {contributor.total_changes > 0 ? (
              <div className={styles.lineChangesDisplay}>
                <span className={styles.linesChangedNumber}>
                  {contributor.total_changes >= 1000 
                    ? `${Math.round(contributor.total_changes / 1000)}k`
                    : contributor.total_changes.toLocaleString()
                  }
                </span>
                <span className={styles.linesChangedLabel}>lines changed</span>
              </div>
            ) : (
              <div className={styles.lineChangesDisplay}>
                <span className={styles.linesChangedNumber}>
                  {contributor.total_recent_commits}
                </span>
                <span className={styles.linesChangedLabel}>commits</span>
              </div>
            )}
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default function Contributors(): React.ReactNode {
  const contributors = useContributors();
  const [otherContributors, setOtherContributors] = useState<Array<{ avatar?: string; role: string; thanks: string; username: string }>>([]);

  useEffect(() => {
    const loadOtherContributors = async () => {
      try {
        const manualModule = await import('../data/contributors-manual.json');
        const manualData = manualModule.default as { contributors?: Array<any> };
        const mapped = (manualData?.contributors || []).map((c: any) => {
          const username: string = c?.login || c?.name || 'friend';
          const name: string = c?.name || username;
          const bio: string | null = c?.bio || null;
          const avatar: string | undefined = c?.avatar_url || undefined;
          return {
            avatar,
            role: name,
            thanks: bio || 'Thank you for supporting UTCP.',
            username
          };
        });
        setOtherContributors(mapped);
      } catch (err) {
        // Fallback to a small static list when manual file is unavailable
        setOtherContributors([
          { avatar: undefined, role: 'Maintainer', thanks: 'Guiding the project and ensuring high quality.', username: 'maintainer' },
          { avatar: undefined, role: 'Designer', thanks: 'Improving UX and visual language.', username: 'designer' },
          { avatar: undefined, role: 'Researcher', thanks: 'Exploring the landscape and informing decisions.', username: 'researcher' }
        ]);
      }
    };
    loadOtherContributors();
  }, []);

  const OtherContributorCard = ({ avatar, role, thanks, username }: { avatar?: string; role: string; thanks: string; username: string }) => {
    const [imageError, setImageError] = useState(false);
    const showImage = Boolean(avatar) && !imageError;
    return (
      <div className={styles.otherContributorCard}>
        <div className={styles.otherContributorIcon}>
          {showImage ? (
            <img
              src={avatar as string}
              alt={`${role} avatar`}
              className={styles.otherContributorImage}
              onError={() => setImageError(true)}
            />
          ) : (
            <span className={styles.avatarEmoji}>{generateFallbackAvatar(username)}</span>
          )}
        </div>
        <div className={styles.otherContributorRole}>{role}</div>
        <div className={styles.otherContributorThanks}>{thanks}</div>
      </div>
    );
  };

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
              Ranked by total lines changed across all repositories
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

          <div className={styles.otherContributorsSection}>
            <div className={styles.otherContributorsHeader}>
              <h2 className={styles.otherContributorsTitle}>Special Thanks</h2>
              <p className={styles.otherContributorsSubtitle}>Beyond code, here are some of our champions</p>
            </div>
            <div className={styles.otherContributorsGrid}>
              {otherContributors.map((oc, i) => (
                <OtherContributorCard key={i} avatar={oc.avatar} role={oc.role} thanks={oc.thanks} username={oc.username} />
              ))}
            </div>
          </div>
          
          {contributors.length > 1 && contributors[0]?.total_changes > 0 && (
            <div className={styles.statsFooter}>
              <h3>📊 Community Impact</h3>
              <div className={styles.communityStats}>
                <div className={styles.statItem}>
                  <span className={styles.statNumber}>
                    {contributors.reduce((sum, c) => sum + (c?.total_changes || 0), 0).toLocaleString()}
                  </span>
                  <span className={styles.statLabel}>Total Lines Changed</span>
                </div>

                <div className={styles.statItem}>
                  <span className={styles.statNumber}>
                    {contributors.reduce((sum, c) => sum + (c?.total_commits || 0), 0).toLocaleString()}
                  </span>
                  <span className={styles.statLabel}>Total Commits</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statNumber}>
                    {new Set(contributors.flatMap(c => c?.repositories || [])).size}
                  </span>
                  <span className={styles.statLabel}>Active Repositories</span>
                </div>
              </div>
            </div>
          )}
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