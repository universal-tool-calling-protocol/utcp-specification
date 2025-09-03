#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const ORG_NAME = 'universal-tool-calling-protocol';
const OUTPUT_FILE = path.join(__dirname, '../src/data/contributors.json');

const githubApi = async (endpoint) => {
  const headers = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'UTCP-Spec-Site'
  };
  
  if (GITHUB_TOKEN) {
    headers['Authorization'] = `token ${GITHUB_TOKEN}`;
  }
  
  const response = await fetch(`https://api.github.com${endpoint}`, { headers });
  
  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
};

const fetchAllRepositories = async () => {
  try {
    console.log(`Fetching repositories for ${ORG_NAME}...`);
    const repos = await githubApi(`/orgs/${ORG_NAME}/repos?type=all&per_page=100`);
    return repos.filter(repo => !repo.archived && !repo.disabled);
  } catch (error) {
    console.error('Error fetching repositories:', error);
    return [];
  }
};

const fetchContributorsForRepo = async (repoName) => {
  try {
    const contributors = await githubApi(`/repos/${ORG_NAME}/${repoName}/contributors?per_page=100`);
    return contributors.map(contributor => ({
      ...contributor,
      repo: repoName
    }));
  } catch (error) {
    console.warn(`Could not fetch contributors for ${repoName}:`, error.message);
    return [];
  }
};

const fetchUserPRsAndActivity = async (username, repoName) => {
  try {
    // Get PRs for this user in this repo
    const prs = await githubApi(`/repos/${ORG_NAME}/${repoName}/pulls?state=all&creator=${username}&per_page=100`);
    
    // Get recent commits (last 6 months) for recency calculation
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const commits = await githubApi(`/repos/${ORG_NAME}/${repoName}/commits?author=${username}&since=${sixMonthsAgo.toISOString()}&per_page=100`);
    
    // Get PR reviews by this user
    const reviews = await githubApi(`/repos/${ORG_NAME}/${repoName}/pulls/comments?per_page=100`);
    const userReviews = reviews.filter(review => review.user.login === username);
    
    return {
      prs: prs.length,
      mergedPrs: prs.filter(pr => pr.merged_at).length,
      recentCommits: commits.length,
      reviews: userReviews.length,
      lastActivity: commits.length > 0 ? commits[0].commit.author.date : null
    };
  } catch (error) {
    console.warn(`Could not fetch detailed activity for ${username} in ${repoName}:`, error.message);
    return {
      prs: 0,
      mergedPrs: 0,
      recentCommits: 0,
      reviews: 0,
      lastActivity: null
    };
  }
};

const fetchUserDetails = async (username) => {
  try {
    return await githubApi(`/users/${username}`);
  } catch (error) {
    console.warn(`Could not fetch details for user ${username}:`, error.message);
    return null;
  }
};

const aggregateContributors = (contributorsByRepo) => {
  const contributorMap = new Map();
  
  contributorsByRepo.flat().forEach(contributor => {
    if (contributor.type === 'Bot') return; // Skip bots
    
    const existing = contributorMap.get(contributor.login);
    if (existing) {
      existing.contributions += contributor.contributions;
      existing.repositories.add(contributor.repo);
      // Aggregate activity data
      if (contributor.activityData) {
        existing.totalPrs += contributor.activityData.prs;
        existing.totalMergedPrs += contributor.activityData.mergedPrs;
        existing.totalRecentCommits += contributor.activityData.recentCommits;
        existing.totalReviews += contributor.activityData.reviews;
        // Keep the most recent activity date
        if (contributor.activityData.lastActivity) {
          const activityDate = new Date(contributor.activityData.lastActivity);
          if (!existing.lastActivity || activityDate > new Date(existing.lastActivity)) {
            existing.lastActivity = contributor.activityData.lastActivity;
          }
        }
      }
    } else {
      contributorMap.set(contributor.login, {
        login: contributor.login,
        id: contributor.id,
        avatar_url: contributor.avatar_url,
        html_url: contributor.html_url,
        contributions: contributor.contributions,
        repositories: new Set([contributor.repo]),
        totalPrs: contributor.activityData?.prs || 0,
        totalMergedPrs: contributor.activityData?.mergedPrs || 0,
        totalRecentCommits: contributor.activityData?.recentCommits || 0,
        totalReviews: contributor.activityData?.reviews || 0,
        lastActivity: contributor.activityData?.lastActivity || null
      });
    }
  });
  
  return Array.from(contributorMap.values()).map(contributor => ({
    ...contributor,
    repositories: Array.from(contributor.repositories)
  }));
};

// Calculate simplified score based on recent activity only
const calculateContributorScore = (contributor) => {
  const now = new Date();
  const lastActivityDate = contributor.lastActivity ? new Date(contributor.lastActivity) : null;
  
  // Calculate recency factor (days since last activity)
  let recencyFactor = 0.1; // Default for very old or no activity
  if (lastActivityDate) {
    const daysSinceLastActivity = (now - lastActivityDate) / (1000 * 60 * 60 * 24);
    if (daysSinceLastActivity <= 30) recencyFactor = 1.0;      // Last 30 days: full points
    else if (daysSinceLastActivity <= 90) recencyFactor = 0.8; // Last 3 months: 80%
    else if (daysSinceLastActivity <= 180) recencyFactor = 0.5; // Last 6 months: 50%
    else if (daysSinceLastActivity <= 365) recencyFactor = 0.3; // Last year: 30%
    else recencyFactor = 0.1; // Older: 10%
  }
  
  // Simplified score: only recent activity weighted by recency
  const score = Math.round(contributor.totalRecentCommits * recencyFactor);
  
  return Math.max(score, 1); // Minimum score of 1
};

const enhanceWithUserData = async (contributors) => {
  const enhanced = [];
  
  for (const contributor of contributors) {
    console.log(`Fetching details for ${contributor.login}...`);
    const userDetails = await fetchUserDetails(contributor.login);
    
    // Calculate the simplified impact score
    const impactScore = calculateContributorScore(contributor);
    
    enhanced.push({
      id: contributor.id,
      login: contributor.login,
      name: userDetails?.name || contributor.login,
      avatar_url: contributor.avatar_url,
      html_url: contributor.html_url,
      bio: userDetails?.bio || null,
      company: userDetails?.company || null,
      location: userDetails?.location || null,
      blog: userDetails?.blog || null,
      hireable: userDetails?.hireable || false,
      public_repos: userDetails?.public_repos || 0,
      followers: userDetails?.followers || 0,
      following: userDetails?.following || 0,
      created_at: userDetails?.created_at || null,
      contributions: contributor.contributions,
      repositories: contributor.repositories,
      repo_count: contributor.repositories.length,
      // Simplified scoring metrics
      impact_score: impactScore,
      total_prs: contributor.totalPrs,
      total_merged_prs: contributor.totalMergedPrs,
      total_recent_commits: contributor.totalRecentCommits,
      total_reviews: contributor.totalReviews,
      last_activity: contributor.lastActivity,
      pr_success_rate: contributor.totalPrs > 0 ? 
        Math.round((contributor.totalMergedPrs / contributor.totalPrs) * 100) : 0
    });
    
    // Rate limiting: delay between requests
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  // Sort by impact score instead of raw contributions
  return enhanced.sort((a, b) => b.impact_score - a.impact_score);
};

// Fetch all contributors from all repositories
const fetchAllContributors = async (repositories) => {
  console.log('📊 Fetching basic contributor data...');
  const contributorPromises = repositories.map(repo => 
    fetchContributorsForRepo(repo.name)
  );
  const contributorsByRepo = await Promise.all(contributorPromises);
  
  // Get unique contributors to fetch detailed activity data
  const uniqueContributors = new Map();
  contributorsByRepo.flat().forEach(contributor => {
    if (contributor.type !== 'Bot') {
      uniqueContributors.set(contributor.login, contributor);
    }
  });
  
  console.log(`Found ${uniqueContributors.size} unique contributors across all repositories`);
  return contributorsByRepo;
};

// Calculate scores for all contributors
const calculateAllScores = async (contributorsByRepo, repositories) => {
  console.log(`📈 Fetching detailed activity data and calculating scores...`);
  
  // Fetch detailed activity data for each contributor in each repo they contribute to
  const contributorsWithActivity = [];
  let processedCount = 0;
  
  // Group contributors by repo for processing
  const contributorsByRepoMap = contributorsByRepo.reduce((acc, repoContributors, idx) => {
    acc[repositories[idx].name] = repoContributors.filter(c => c.type !== 'Bot');
    return acc;
  }, {});
  
  // Calculate total operations for progress tracking
  const totalOperations = Object.values(contributorsByRepoMap).flat().length;
  
  for (const [repoName, contributors] of Object.entries(contributorsByRepoMap)) {
    for (const contributor of contributors) {
      console.log(`  📊 ${++processedCount}/${totalOperations} - Fetching activity for ${contributor.login} in ${repoName}...`);
      
      const activityData = await fetchUserPRsAndActivity(contributor.login, repoName);
      contributorsWithActivity.push({
        ...contributor,
        activityData
      });
      
      // Rate limiting: delay between requests
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }
  
  // Aggregate contributors across all repos with activity data
  const aggregatedContributors = aggregateContributors(contributorsWithActivity);
  console.log(`Calculated scores for ${aggregatedContributors.length} unique contributors`);
  
  return aggregatedContributors;
};

const main = async () => {
  try {
    console.log('🚀 Starting contributor data fetch with simplified scoring...');
    
    /* 
     * Process Flow:
     * 1. Fetch all repositories from the organization
     * 2. Fetch all contributors from all repositories  
     * 3. Calculate scores for all contributors (simplified recent activity scoring)
     * 4. Enhance with detailed user information from GitHub
     * 5. Generate and save output file
     */
    
    // Step 1: Fetch all repositories
    const repositories = await fetchAllRepositories();
    console.log(`Found ${repositories.length} active repositories`);
    
    // Step 2: Fetch all contributors from all repositories
    console.log('📊 Fetching all contributors from all repositories...');
    const contributorsByRepo = await fetchAllContributors(repositories);
    
    // Step 3: Calculate scores for all contributors
    console.log('🔢 Calculating contributor scores...');
    const scoredContributors = await calculateAllScores(contributorsByRepo, repositories);
    
    // Step 4: Enhance with detailed user information
    const enhancedContributors = await enhanceWithUserData(scoredContributors);
    
    // Step 5: Generate output file
    console.log('📁 Generating output file...');
    
    // Create output directory if it doesn't exist
    const outputDir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Calculate summary statistics
    const totalImpactScore = enhancedContributors.reduce((sum, c) => sum + c.impact_score, 0);
    const totalContributions = enhancedContributors.reduce((sum, c) => sum + c.contributions, 0);
    const totalRecentActivity = enhancedContributors.reduce((sum, c) => sum + c.total_recent_commits, 0);
    
    // Write to file
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify({
      generated_at: new Date().toISOString(),
      total_contributors: enhancedContributors.length,
      total_contributions: totalContributions,
      total_impact_score: totalImpactScore,
      total_recent_activity: totalRecentActivity,
      scoring_method: 'simplified_recent_activity',
      contributors: enhancedContributors
    }, null, 2));
    
    console.log(`✅ Successfully wrote contributor data to ${OUTPUT_FILE}`);
    console.log(`📊 Stats: ${enhancedContributors.length} contributors`);
    console.log(`   💫 Total impact score: ${totalImpactScore}`);
    console.log(`   📈 Total contributions: ${totalContributions}`);
    console.log(`   🔥 Recent activity: ${totalRecentActivity} commits (last 6 months)`);
    console.log(`   🏆 Top contributor: ${enhancedContributors[0]?.name} (${enhancedContributors[0]?.impact_score} impact score)`);
    
  } catch (error) {
    console.error('❌ Error fetching contributors:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  main();
}

module.exports = { main };
