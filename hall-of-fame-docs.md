# Contributors Data

This project automatically fetches and displays real contributors from the entire `universal-tool-calling-protocol` GitHub organization.

## How it Works

1. **Data Fetching**: The `scripts/fetch-contributors.js` script queries the GitHub API to:
   - Get all repositories in the `universal-tool-calling-protocol` organization
   - Fetch contributors for each repository
   - **Collect detailed activity metrics**: PRs, reviews, recent commits, last activity dates
   - Aggregate contribution counts across all repositories
   - Enhance data with user profiles from GitHub
   - Calculate hybrid impact scores for each contributor

2. **Data Processing**: The script transforms GitHub API data into a format suitable for the contributors page, including:
   - Automatic role detection based on repository names (TypeScript SDK, Python SDK, etc.)
   - **Hybrid impact scoring** combining recent activity, overall contributions, code quality, and multi-project involvement
   - Status determination based on impact scores and activity recency
   - Real GitHub profile images with emoji fallbacks for errors
   - Badge assignment for notable contributors based on multiple metrics

3. **Automatic Updates**: GitHub Actions automatically updates the contributors data:
   - **Daily**: Runs at 6 AM UTC every day
   - **Manual**: Can be triggered via workflow_dispatch
   - **On Changes**: Runs when the fetch script is updated

## Setup

### Environment Variables

For local development, you can set a GitHub token to avoid rate limiting:

```bash
export GITHUB_TOKEN=your_github_token_here
npm run fetch-contributors
```

### Running Locally

```bash
# Fetch contributors data
npm run fetch-contributors

# Build site with fresh data
npm run build

# Build without fetching data (faster)
npm run build:fast
```

### Manual Setup

If you need to run the script manually:

```bash
node scripts/fetch-contributors.js
```

## Data Structure

The generated `src/data/contributors.json` file contains:

```json
{
  "generated_at": "2024-01-01T12:00:00.000Z",
  "total_contributors": 25,
  "total_contributions": 1500,
  "total_impact_score": 3250,
  "total_recent_activity": 145,
  "scoring_method": "simplified_recent_activity",
  "contributors": [
    {
      "id": 123456,
      "login": "username",
      "name": "Real Name",
      "avatar_url": "https://github.com/avatar",
      "html_url": "https://github.com/username",
      "bio": "Developer bio",
      "company": "Company Name",
      "location": "City, Country",
      "blog": "https://blog.com",
      "hireable": true,
      "public_repos": 50,
      "followers": 100,
      "following": 80,
      "created_at": "2020-01-01T00:00:00Z",
      "contributions": 150,
      "repositories": ["repo1", "repo2"],
      "repo_count": 2,
      "impact_score": 185,
      "total_prs": 15,
      "total_merged_prs": 12,
      "total_recent_commits": 23,
      "total_reviews": 8,
      "last_activity": "2024-01-15T14:30:00Z",
      "pr_success_rate": 80
    }
  ]
}
```

## Contributor Display Logic

### Simplified Impact Scoring System

Contributors are ranked using a **simplified impact score** based only on recent activity across all repositories:

#### Scoring Formula
```
Impact Score = Recent Activity × Recency Factor
```

Where Recent Activity is the sum of commits across all repositories in the last 6 months.

#### Recency Weighting
Recent activity receives higher weight to prioritize active contributors:
- **Last 30 days**: 100% weight (1.0x multiplier)
- **Last 3 months**: 80% weight (0.8x multiplier)  
- **Last 6 months**: 50% weight (0.5x multiplier)
- **Last year**: 30% weight (0.3x multiplier)
- **Older**: 10% weight (0.1x multiplier)

### Roles
Roles are automatically determined based on repository patterns:
- `typescript|js-sdk` → "TypeScript/JavaScript SDK"
- `python|py-sdk` → "Python SDK" 
- `go-sdk|golang` → "Go SDK"
- `rust-sdk` → "Rust SDK"
- `java-sdk` → "Java SDK"
- `csharp|dotnet` → "C# SDK"
- `specification|docs` → "Specification & Docs"
- Multiple repos → "Multi-language SDK"

### Status Levels (Impact Score Based)
- **Core contributor**: 100+ impact score + recent activity
- **Core contributor (inactive)**: 100+ impact score but no recent activity
- **Active contributor**: 50+ impact score + recent activity
- **Regular contributor**: 20+ impact score or inactive but previously active
- **New contributor**: <20 impact score

### Enhanced Badge System
- 🏆 **Top Impact Contributor**: 200+ impact score
- ⭐ **High Impact Contributor**: 100+ impact score
- 🔥 **Multi-project Contributor**: 3+ repositories
- 🚀 **Recently Active**: 10+ commits in last 6 months
- ✨ **Quality Contributor**: 80%+ PR merge rate with 5+ PRs

### Data Collection & Metrics
For each contributor, the system collects:
- **Pull Requests**: Total PRs created and merge success rate
- **Code Reviews**: Participation in reviewing others' code
- **Recent Activity**: Commits in the last 6 months
- **Cross-project Work**: Contributions across multiple repositories
- **Last Activity Date**: Most recent contribution timestamp

### Hiring Status
Contributors with `hireable: true` in their GitHub profile show an "Open to work" badge.

## Advantages of Simplified Scoring

The simplified impact scoring system provides several benefits:

1. **Recency Focus**: Active contributors rank higher than inactive ones
2. **Cross-project Aggregation**: Recent commits are summed across all repositories
3. **Simple and Fair**: Transparent calculation based purely on recent activity
4. **Prevents Gaming**: Cannot be inflated through historical contributions or metadata manipulation

## Troubleshooting

### Rate Limiting
The enhanced scoring system makes significantly more API calls (PRs, commits, reviews per contributor per repo). Without authentication, GitHub API limits to 60 requests/hour. The script includes delays to avoid hitting limits, but **using `GITHUB_TOKEN` is highly recommended** for reasonable execution times.

**Expected Runtime**: 
- Without token: 15-30+ minutes (depending on contributor count)
- With token: 2-5 minutes (much faster due to higher rate limits)

### Missing Data
If the contributors page shows "Contributors data unavailable":
1. Run `npm run fetch-contributors` locally
2. Check if `src/data/contributors.json` was created
3. Ensure the GitHub API is accessible
4. Check console for error messages

### Build Integration
The build process does not fetch data automatically; run `npm run fetch-contributors` before `npm run build`. `npm run build:fast` is equivalent to `npm run build`.
