#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const ORG_NAME = 'universal-tool-calling-protocol';
const OUTPUT_FILE = path.join(__dirname, '../src/data/contributors.json');

// Configuration for efficient API batching
const BATCH_CONFIG = {
  COMMIT_DETAILS_BATCH_SIZE: 20, // Process commits in batches of 20
  CONCURRENT_REQUESTS: 5, // Max concurrent API requests
  RETRY_ATTEMPTS: 3, // Number of retry attempts for failed requests
  RATE_LIMIT_DELAY: 100, // Base delay between requests (ms)
  COMMIT_ANALYSIS_LIMIT: 1000, // Max commits to analyze (0 = no limit)
};

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

const fetchCommitDetails = async (repoName, commitSha) => {
  try {
    const commit = await githubApi(`/repos/${ORG_NAME}/${repoName}/commits/${commitSha}`);
    return {
      additions: commit.stats?.additions || 0,
      deletions: commit.stats?.deletions || 0,
      total: commit.stats?.total || 0
    };
  } catch (error) {
    console.warn(`Could not fetch commit details for ${commitSha}:`, error.message);
    return { additions: 0, deletions: 0, total: 0 };
  }
};

// Helper function for batched API calls with retry logic
const batchedApiCall = async (items, apiCallFn, batchSize = BATCH_CONFIG.COMMIT_DETAILS_BATCH_SIZE) => {
  const results = [];
  const batches = [];
  
  // Split items into batches
  for (let i = 0; i < items.length; i += batchSize) {
    batches.push(items.slice(i, i + batchSize));
  }
  
  console.log(`    📦 Processing ${items.length} items in ${batches.length} batches...`);
  
  for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
    const batch = batches[batchIndex];
    console.log(`    ⚡ Processing batch ${batchIndex + 1}/${batches.length} (${batch.length} items)...`);
    
    // Process items in current batch concurrently
    const batchPromises = batch.map(async (item) => {
      let retryCount = 0;
      while (retryCount < BATCH_CONFIG.RETRY_ATTEMPTS) {
        try {
          const result = await apiCallFn(item);
          return result;
        } catch (error) {
          retryCount++;
          if (retryCount === BATCH_CONFIG.RETRY_ATTEMPTS) {
            console.warn(`    ⚠️ Failed after ${BATCH_CONFIG.RETRY_ATTEMPTS} attempts:`, error.message);
            return null;
          }
          // Exponential backoff for retries
          await new Promise(resolve => setTimeout(resolve, BATCH_CONFIG.RATE_LIMIT_DELAY * Math.pow(2, retryCount)));
        }
      }
    });
    
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults.filter(Boolean)); // Filter out null results from failures
    
    // Rate limiting between batches
    if (batchIndex < batches.length - 1) {
      await new Promise(resolve => setTimeout(resolve, BATCH_CONFIG.RATE_LIMIT_DELAY));
    }
  }
  
  return results;
};

// Helper function to create progress reporting
const createProgressReporter = (total, operation) => {
  let processed = 0;
  return {
    update: () => {
      processed++;
      const percentage = Math.round((processed / total) * 100);
      console.log(`    📊 ${operation}: ${processed}/${total} (${percentage}%)`);
    },
    finish: () => {
      console.log(`    ✅ ${operation}: Completed all ${total} items`);
    }
  };
};

const fetchUserPRsAndActivity = async (username, repoName) => {
  try {
    // Get PRs for this user in this repo
    const prs = await githubApi(`/repos/${ORG_NAME}/${repoName}/pulls?state=all&creator=${username}&per_page=100`);
    
    // Get recent commits (last 6 months) for recency calculation
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const commits = await githubApi(`/repos/${ORG_NAME}/${repoName}/commits?author=${username}&since=${sixMonthsAgo.toISOString()}&per_page=100`);
    
    // Get ALL commits by this user for line change statistics
    let allCommits = [];
    let page = 1;
    let hasMore = true;
    
    console.log(`    📊 Fetching all commits for line statistics...`);
    while (hasMore && allCommits.length < 500) { // Limit to prevent excessive API calls
      try {
        const commitPage = await githubApi(`/repos/${ORG_NAME}/${repoName}/commits?author=${username}&per_page=100&page=${page}`);
        
        if (commitPage.length === 0) {
          hasMore = false;
        } else {
          allCommits = allCommits.concat(commitPage);
          page++;
          
          // Rate limiting for commit fetching
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      } catch (error) {
        console.warn(`    Could not fetch commits page ${page} for ${username}:`, error.message);
        hasMore = false;
      }
    }
    
    // Analyze ALL commits with efficient batching (improved from 100 commit limit)
    let totalAdditions = 0;
    let totalDeletions = 0;
    let totalChanges = 0;
    
    // Apply configurable limit if set (0 = no limit)
    const commitsToAnalyze = BATCH_CONFIG.COMMIT_ANALYSIS_LIMIT > 0 
      ? allCommits.slice(0, BATCH_CONFIG.COMMIT_ANALYSIS_LIMIT)
      : allCommits;
    
    console.log(`    📈 Analyzing ${commitsToAnalyze.length} commits for line changes (improved batching)...`);
    
    if (commitsToAnalyze.length > 0) {
      // Use efficient batching instead of sequential processing
      const commitDetails = await batchedApiCall(
        commitsToAnalyze, 
        async (commit) => await fetchCommitDetails(repoName, commit.sha),
        BATCH_CONFIG.COMMIT_DETAILS_BATCH_SIZE
      );
      
      // Aggregate the results
      for (const details of commitDetails) {
        totalAdditions += details.additions;
        totalDeletions += details.deletions;
        totalChanges += details.total;
      }
      
      console.log(`    ✅ Successfully analyzed ${commitDetails.length}/${commitsToAnalyze.length} commits`);
    }
    
    // Get PR reviews by this user
    const reviews = await githubApi(`/repos/${ORG_NAME}/${repoName}/pulls/comments?per_page=100`);
    const userReviews = reviews.filter(review => review.user.login === username);
    
    return {
      prs: prs.length,
      mergedPrs: prs.filter(pr => pr.merged_at).length,
      recentCommits: commits.length,
      totalCommits: allCommits.length,
      reviews: userReviews.length,
      lastActivity: commits.length > 0 ? commits[0].commit.author.date : null,
      // Enhanced line change statistics (now analyzes ALL commits up to limit)
      totalAdditions,
      totalDeletions,
      totalChanges,
      commitsAnalyzed: commitsToAnalyze.length, // Total commits we attempted to analyze
      commitsSuccessfullyAnalyzed: totalChanges > 0 ? commitsToAnalyze.filter(commit => commit).length : 0 // Successful analyses
    };
  } catch (error) {
    console.warn(`Could not fetch detailed activity for ${username} in ${repoName}:`, error.message);
    return {
      prs: 0,
      mergedPrs: 0,
      recentCommits: 0,
      totalCommits: 0,
      reviews: 0,
      lastActivity: null,
      totalAdditions: 0,
      totalDeletions: 0,
      totalChanges: 0,
      commitsAnalyzed: 0,
      commitsSuccessfullyAnalyzed: 0
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
        existing.totalCommits += contributor.activityData.totalCommits;
        existing.totalReviews += contributor.activityData.reviews;
        // Aggregate line change statistics
        existing.totalAdditions += contributor.activityData.totalAdditions;
        existing.totalDeletions += contributor.activityData.totalDeletions;
        existing.totalChanges += contributor.activityData.totalChanges;
        existing.commitsAnalyzed += contributor.activityData.commitsAnalyzed;
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
        totalCommits: contributor.activityData?.totalCommits || 0,
        totalReviews: contributor.activityData?.reviews || 0,
        lastActivity: contributor.activityData?.lastActivity || null,
        // New line change statistics
        totalAdditions: contributor.activityData?.totalAdditions || 0,
        totalDeletions: contributor.activityData?.totalDeletions || 0,
        totalChanges: contributor.activityData?.totalChanges || 0,
        commitsAnalyzed: contributor.activityData?.commitsAnalyzed || 0
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
      total_commits: contributor.totalCommits,
      total_reviews: contributor.totalReviews,
      last_activity: contributor.lastActivity,
      pr_success_rate: contributor.totalPrs > 0 ? 
        Math.round((contributor.totalMergedPrs / contributor.totalPrs) * 100) : 0,
      // New line change statistics
      total_additions: contributor.totalAdditions,
      total_deletions: contributor.totalDeletions,
      total_changes: contributor.totalChanges,
      commits_analyzed: contributor.commitsAnalyzed
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
    console.log('🚀 Starting contributor data fetch with enhanced batching and full commit analysis...');
    console.log(`📊 Configuration: Analyzing up to ${BATCH_CONFIG.COMMIT_ANALYSIS_LIMIT} commits per contributor (0 = no limit)`);
    console.log(`⚡ Batching: ${BATCH_CONFIG.COMMIT_DETAILS_BATCH_SIZE} commits per batch with ${BATCH_CONFIG.RETRY_ATTEMPTS} retry attempts`);
    console.log('✨ Improvements: Removed 100-commit limit, added efficient batching, retry logic, and better error handling\n');
    
    /* 
     * Process Flow:
     * 1. Fetch all repositories from the organization
     * 2. Fetch all contributors from all repositories  
     * 3. Calculate scores for all contributors (simplified recent activity scoring)
     * 4. Fetch detailed line change statistics for each contributor
     * 5. Enhance with detailed user information from GitHub
     * 6. Generate and save output file with comprehensive metrics
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
    const totalAdditions = enhancedContributors.reduce((sum, c) => sum + c.total_additions, 0);
    const totalDeletions = enhancedContributors.reduce((sum, c) => sum + c.total_deletions, 0);
    const totalChanges = enhancedContributors.reduce((sum, c) => sum + c.total_changes, 0);
    const totalCommitsAnalyzed = enhancedContributors.reduce((sum, c) => sum + c.commits_analyzed, 0);
    
    // Write to file
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify({
      generated_at: new Date().toISOString(),
      total_contributors: enhancedContributors.length,
      total_contributions: totalContributions,
      total_impact_score: totalImpactScore,
      total_recent_activity: totalRecentActivity,
      scoring_method: 'simplified_recent_activity',
      // New aggregated line change statistics
      total_additions: totalAdditions,
      total_deletions: totalDeletions,
      total_changes: totalChanges,
      total_commits_analyzed: totalCommitsAnalyzed,
      contributors: enhancedContributors
    }, null, 2));
    
    console.log(`✅ Successfully wrote contributor data to ${OUTPUT_FILE}`);
    console.log(`📊 Stats: ${enhancedContributors.length} contributors`);
    console.log(`   💫 Total impact score: ${totalImpactScore}`);
    console.log(`   📈 Total contributions: ${totalContributions}`);
    console.log(`   🔥 Recent activity: ${totalRecentActivity} commits (last 6 months)`);
    console.log(`   📊 Line changes: +${totalAdditions.toLocaleString()} -${totalDeletions.toLocaleString()} (${totalChanges.toLocaleString()} total)`);
    console.log(`   🔍 Commits analyzed: ${totalCommitsAnalyzed.toLocaleString()}`);
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
