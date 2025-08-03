#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const yaml = require('js-yaml');

// Configuration
const APIS_GURU_REPO = 'https://github.com/APIs-guru/openapi-directory.git';
const TEMP_DIR = path.join(__dirname, '../temp');
const REPO_DIR = path.join(TEMP_DIR, 'openapi-directory');
const PROVIDERS_PATH = path.join(__dirname, '../static/providers.json');

// Popular API providers (for priority scoring)
const POPULAR_PROVIDERS = [
  'github.com', 'stripe.com', 'twilio.com', 'slack.com', 'dropbox.com',
  'spotify.com', 'twitter.com', 'instagram.com', 'linkedin.com', 'reddit.com',
  'googleapis.com', 'microsoft.com', 'amazonaws.com', 'atlassian.com',
  'paypal.com', 'shopify.com', 'salesforce.com', 'hubspot.com', 'zoom.us',
  'pokeapi.co', 'jsonplaceholder.typicode.com', 'weatherapi.com'
];

// Category mapping and detection
const CATEGORY_KEYWORDS = {
  'AI & Machine Learning': ['ai', 'ml', 'machine learning', 'openai', 'artificial intelligence', 'nlp'],
  'Finance & Payments': ['payment', 'stripe', 'paypal', 'financial', 'billing', 'invoice', 'money'],
  'Development Tools': ['github', 'gitlab', 'developer', 'api', 'webhook', 'ci/cd', 'deployment'],
  'Social Media': ['twitter', 'facebook', 'instagram', 'linkedin', 'social', 'reddit'],
  'Communication': ['twilio', 'slack', 'zoom', 'sms', 'email', 'messaging', 'chat'],
  'Music & Media': ['spotify', 'youtube', 'music', 'audio', 'video', 'streaming'],
  'Gaming & Entertainment': ['game', 'pokemon', 'entertainment', 'fun', 'gaming'],
  'Weather & Climate': ['weather', 'climate', 'forecast', 'temperature'],
  'Geography & Location': ['geo', 'location', 'map', 'country', 'postal', 'address'],
  'E-commerce': ['shop', 'store', 'commerce', 'product', 'inventory', 'retail'],
  'Cloud Services': ['aws', 'azure', 'google cloud', 'cloud', 'storage'],
  'Security': ['security', 'auth', 'authentication', 'authorization', 'oauth'],
  'Analytics': ['analytics', 'tracking', 'metrics', 'statistics'],
  'News & Media': ['news', 'media', 'journalism', 'article', 'press'],
  'Transportation': ['transport', 'travel', 'flight', 'uber', 'taxi'],
  'Health': ['health', 'medical', 'doctor', 'hospital', 'medicine'],
  'Education': ['education', 'learning', 'course', 'university', 'school']
};

// Ensure directory exists
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Clone or update repository
function setupRepository() {
  console.log('Setting up APIs.guru repository...');
  ensureDir(TEMP_DIR);

  if (fs.existsSync(REPO_DIR)) {
    console.log('Repository exists, pulling latest changes...');
    try {
      execSync('git pull', { cwd: REPO_DIR, stdio: 'pipe' });
    } catch (error) {
      console.warn('Failed to pull updates, using existing repository');
    }
  } else {
    console.log('Cloning repository...');
    execSync(`git clone ${APIS_GURU_REPO}`, { cwd: TEMP_DIR, stdio: 'pipe' });
  }
}

// Parse YAML or JSON file safely
function parseSpecFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    if (filePath.endsWith('.yaml') || filePath.endsWith('.yml')) {
      return yaml.load(content);
    } else {
      return JSON.parse(content);
    }
  } catch (error) {
    return null;
  }
}

// Determine category from API information
function determineCategory(spec, providerName) {
  const title = (spec.info?.title || '').toLowerCase();
  const description = (spec.info?.description || '').toLowerCase();
  const combined = `${title} ${description} ${providerName}`.toLowerCase();

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some(keyword => combined.includes(keyword))) {
      return category;
    }
  }
  
  return 'General';
}

// Calculate quality score for an API
function calculateQualityScore(spec, metadata) {
  let score = 0;
  
  // OpenAPI version (higher is better)
  const version = spec.openapi || spec.swagger;
  if (version && version.startsWith('3.1')) score += 40;
  else if (version && version.startsWith('3.0')) score += 35;
  else if (version && version.startsWith('2.')) score += 25;
  
  // Documentation quality
  if (spec.info?.description && spec.info.description.length > 100) score += 25;
  else if (spec.info?.description && spec.info.description.length > 50) score += 15;
  else if (spec.info?.description) score += 10;
  
  if (spec.info?.title) score += 10;
  if (spec.info?.contact) score += 10;
  if (spec.info?.license) score += 5;
  
  // API completeness
  const pathCount = Object.keys(spec.paths || {}).length;
  if (pathCount > 50) score += 20;
  else if (pathCount > 20) score += 15;
  else if (pathCount > 10) score += 10;
  else if (pathCount > 5) score += 5;
  
  // Schema definitions
  const schemaCount = Object.keys(spec.components?.schemas || spec.definitions || {}).length;
  if (schemaCount > 20) score += 15;
  else if (schemaCount > 10) score += 10;
  else if (schemaCount > 5) score += 5;
  
  // Examples and documentation
  if (spec.externalDocs) score += 5;
  if (spec.info?.termsOfService) score += 5;
  
  // Popularity bonus
  if (metadata.isPopular) score += 25;
  
  return Math.min(score, 100); // Cap at 100
}

// Normalize provider name
function normalizeProviderName(host, apiName) {
  let name = apiName || host.split('.')[0];
  return name.toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
}

// Scan repository for API specifications
function scanAPIs() {
  console.log('Scanning repository for API specifications...');
  const apisDir = path.join(REPO_DIR, 'APIs');
  const apis = [];
  
  if (!fs.existsSync(apisDir)) {
    throw new Error('APIs directory not found in repository');
  }
  
  const providers = fs.readdirSync(apisDir);
  
  for (const provider of providers) {
    const providerDir = path.join(apisDir, provider);
    if (!fs.statSync(providerDir).isDirectory()) continue;
    
    try {
      const versions = fs.readdirSync(providerDir);
      
      // Process each version, prioritize latest
      for (const version of versions.sort().reverse()) {
        const versionDir = path.join(providerDir, version);
        if (!fs.statSync(versionDir).isDirectory()) continue;
        
        // Look for OpenAPI spec files
        const files = fs.readdirSync(versionDir);
        const specFile = files.find(f => 
          f === 'openapi.yaml' || f === 'openapi.json' || 
          f === 'swagger.yaml' || f === 'swagger.json' ||
          f.endsWith('.yaml') || f.endsWith('.json')
        );
        
        if (specFile) {
          const specPath = path.join(versionDir, specFile);
          const spec = parseSpecFile(specPath);
          
          if (spec && spec.info) {
            const isPopular = POPULAR_PROVIDERS.some(p => provider.includes(p));
            const quality = calculateQualityScore(spec, { isPopular });
            
            apis.push({
              provider,
              version,
              specPath,
              spec,
              quality,
              isPopular,
              specFile
            });
            
            break; // Only take the first (latest) version
          }
        }
      }
    } catch (error) {
      console.warn(`Error processing ${provider}:`, error.message);
    }
  }
  
  return apis.sort((a, b) => b.quality - a.quality);
}

// Convert API to provider format
function convertToProvider(apiData, existingNames = new Set()) {
  const { provider, version, spec, quality, isPopular, specFile } = apiData;
  
  const baseName = normalizeProviderName(provider, spec.info.title);
  
  // Ensure unique name
  let name = baseName;
  let counter = 1;
  while (existingNames.has(name)) {
    name = `${baseName}_${counter}`;
    counter++;
  }
  existingNames.add(name);
  
  // Determine URLs - prefer GitHub raw URLs for reliability
  const githubBaseUrl = `https://raw.githubusercontent.com/APIs-guru/openapi-directory/main/APIs/${provider}/${version}`;
  const specUrl = `${githubBaseUrl}/${specFile}`;
  
  const contentType = specFile.endsWith('.yaml') || specFile.endsWith('.yml') 
    ? 'application/x-yaml' 
    : 'application/json';
  
  const category = determineCategory(spec, provider);
  
  return {
    name,
    provider_type: 'http',
    http_method: 'GET',
    url: specUrl,
    content_type: contentType,
    metadata: {
      description: spec.info.description || `${spec.info.title || name} API`,
      category,
      last_updated: new Date().toISOString().split('T')[0],
      maintainer: spec.info.contact?.name || provider,
      documentation_url: spec.externalDocs?.url || spec.info.contact?.url || `https://${provider}`,
      version: version,
      openapi_version: spec.openapi || spec.swagger,
      quality_score: quality,
      is_popular: isPopular,
      title: spec.info.title,
      paths_count: Object.keys(spec.paths || {}).length,
      schemas_count: Object.keys(spec.components?.schemas || spec.definitions || {}).length
    }
  };
}

// Filter APIs based on options
function filterAPIs(apis, options = {}) {
  const {
    minQuality = 50,
    categories = [],
    popularOnly = false,
    maxResults = 50
  } = options;
  
  let filtered = apis.filter(api => {
    if (api.quality < minQuality) return false;
    if (popularOnly && !api.isPopular) return false;
    
    if (categories.length > 0) {
      const category = determineCategory(api.spec, api.provider);
      if (!categories.includes(category)) return false;
    }
    
    return true;
  });
  
  return filtered.slice(0, maxResults);
}

// Main function
async function main() {
  const args = process.argv.slice(2);
  const options = {};
  
  // Parse command line arguments
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--min-quality':
        options.minQuality = parseInt(args[++i]) || 50;
        break;
      case '--categories':
        options.categories = args[++i].split(',');
        break;
      case '--popular-only':
        options.popularOnly = true;
        break;
      case '--max-results':
        options.maxResults = parseInt(args[++i]) || 50;
        break;
      case '--dry-run':
        options.dryRun = true;
        break;
      case '--skip-clone':
        options.skipClone = true;
        break;
      case '--help':
        console.log(`
Usage: node add-providers-from-repo.js [options]

Options:
  --min-quality <score>     Minimum quality score (default: 50)
  --categories <list>       Comma-separated list of categories to include
  --popular-only           Only include popular providers
  --max-results <num>       Maximum number of providers to add (default: 50)
  --dry-run                Show what would be added without modifying files
  --skip-clone             Skip cloning/updating repository (use existing)
  --help                   Show this help message

Examples:
  node add-providers-from-repo.js --popular-only --min-quality 70
  node add-providers-from-repo.js --categories "Finance & Payments,AI & Machine Learning" --max-results 20
  node add-providers-from-repo.js --dry-run --min-quality 80
        `);
        return;
    }
  }
  
  try {
    // Setup repository
    if (!options.skipClone) {
      setupRepository();
    }
    
    // Scan for APIs
    const apis = scanAPIs();
    console.log(`Found ${apis.length} API specifications`);
    
    // Filter APIs
    const filteredAPIs = filterAPIs(apis, options);
    console.log(`Selected ${filteredAPIs.length} APIs after filtering`);
    
    if (filteredAPIs.length === 0) {
      console.log('No APIs match the specified criteria');
      return;
    }
    
    // Convert to providers
    const existingNames = new Set();
    const providers = filteredAPIs.map(api => convertToProvider(api, existingNames));
    
    if (options.dryRun) {
      console.log('\n=== DRY RUN - Would add these providers ===');
      providers.forEach((provider, index) => {
        console.log(`${index + 1}. ${provider.name} (${provider.metadata.category}) - Quality: ${provider.metadata.quality_score}, Paths: ${provider.metadata.paths_count}`);
      });
      return;
    }
    
    // Read existing providers
    let existingProviders = [];
    if (fs.existsSync(PROVIDERS_PATH)) {
      existingProviders = JSON.parse(fs.readFileSync(PROVIDERS_PATH, 'utf8'));
    }
    
    // Filter out duplicates
    const existingProviderNames = new Set(existingProviders.map(p => p.name));
    const newProviders = providers.filter(p => !existingProviderNames.has(p.name));
    
    if (newProviders.length === 0) {
      console.log('No new providers to add (all filtered providers already exist)');
      return;
    }
    
    // Combine and save
    const combinedProviders = [...existingProviders, ...newProviders];
    fs.writeFileSync(PROVIDERS_PATH, JSON.stringify(combinedProviders, null, 2));
    
    console.log(`\n✅ Successfully added ${newProviders.length} new providers!`);
    
    // Show summary
    console.log('\n=== Added Providers ===');
    newProviders.forEach((provider, index) => {
      console.log(`${index + 1}. ${provider.name} (${provider.metadata.category}) - Quality: ${provider.metadata.quality_score}`);
    });
    
    // Show category breakdown
    const categoryCount = {};
    newProviders.forEach(p => {
      categoryCount[p.metadata.category] = (categoryCount[p.metadata.category] || 0) + 1;
    });
    
    console.log('\n=== Category Breakdown ===');
    Object.entries(categoryCount).sort((a, b) => b[1] - a[1]).forEach(([category, count]) => {
      console.log(`${category}: ${count}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Install js-yaml if not present
try {
  require('js-yaml');
} catch (error) {
  console.log('Installing js-yaml...');
  execSync('npm install js-yaml', { stdio: 'inherit' });
}

if (require.main === module) {
  main();
}

module.exports = { scanAPIs, convertToProvider, calculateQualityScore };