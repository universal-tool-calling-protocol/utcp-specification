export interface GitHubContributor {
  id: number;
  login: string;
  name: string;
  avatar_url: string;
  html_url: string;
  bio: string | null;
  company: string | null;
  location: string | null;
  blog: string | null;
  hireable: boolean;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string | null;
  contributions: number;
  repositories: string[];
  repo_count: number;
  // Simplified scoring fields
  impact_score: number;
  total_prs: number;
  total_merged_prs: number;
  total_recent_commits: number;
  total_reviews: number;
  last_activity: string | null;
  pr_success_rate: number;
}

export interface ContributorsData {
  generated_at: string;
  total_contributors: number;
  total_contributions: number;
  total_impact_score: number;
  total_recent_activity: number;
  scoring_method: string;
  contributors: GitHubContributor[];
}

export interface DisplayContributor {
  id: number;
  name: string;
  username: string;
  githubUsername: string;
  role: string;
  status: string;
  contributions: number;
  impact_score: number;
  avatar: string; // GitHub avatar URL or fallback emoji
  joinDate: string;
  topContribution: string;
  lookingForJob: boolean;
  // Additional scoring display data
  recentActivity?: string;
  qualityMetrics?: string;
  total_recent_commits: number;
  badges?: Array<{
    icon: string;
    tooltip: string;
  }>;
}
