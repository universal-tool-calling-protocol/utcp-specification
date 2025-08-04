#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const yaml = require('js-yaml');
const https = require('https');

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

// Description length limits (matching UI constants)
const DESCRIPTION_LIMITS = {
  COMPACT: 150,  // When "Show more" button appears
  FULL: 300,     // Maximum length even when expanded
  MIN_FOR_SUMMARY: 200  // Minimum length before we consider summarizing
};

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

// Clean markdown syntax from text, converting it to plain text
function cleanMarkdown(text) {
  if (!text || typeof text !== 'string') return '';
  
  return text
    // Remove markdown headers
    .replace(/^#+\s*/gm, '')
    // Remove bold/italic formatting
    .replace(/\*\*\*(.*?)\*\*\*/g, '$1')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    // Remove markdown links but keep text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove HTML tags
    .replace(/<[^>]*>/g, '')
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`([^`]+)`/g, '$1')
    // Remove special markdown characters at start of lines
    .replace(/^>\s*/gm, '')
    // Clean up multiple newlines and spaces
    .replace(/\n\s*\n/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\r/g, '')
    .trim();
}

// Normalize provider name
function normalizeProviderName(host, apiName) {
  let name = apiName || host.split('.')[0];
  return name.toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
}

// LLM summarization using OpenAI API
async function summarizeDescription(description, targetLength = DESCRIPTION_LIMITS.COMPACT, apiKey = null) {
  // Skip if description is already short enough
  if (!description || description.length <= targetLength) {
    return description;
  }

  // Skip if no API key provided
  if (!apiKey) {
    console.warn('No OpenAI API key provided, skipping summarization for long description');
    return cleanMarkdown(description).substring(0, targetLength) + '...';
  }

  // Clean markdown from input description
  const cleanedDescription = cleanMarkdown(description);
  
  // If cleaning markdown made it short enough, use it directly
  if (cleanedDescription.length <= targetLength) {
    return cleanedDescription;
  }

  const prompt = `Create a concise API description under ${targetLength} characters that explains what this API actually does and what functionality it provides.

REQUIREMENTS:
- Explain the specific functionality and capabilities, not who it's for
- Start with action verbs (e.g., "Manages", "Provides", "Enables", "Retrieves")
- Avoid generic phrases like "for users of this service" or "allows users to"
- Focus on concrete features and data types
- Use plain text only - no markdown, bold, italics, or special formatting
- Be specific about what developers can accomplish with this API

Original description:
"${cleanedDescription}"

Functional API description:`;

  const payload = JSON.stringify({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: Math.ceil(targetLength / 1.5), // More generous token limit for better descriptions
    temperature: 0.2 // Lower temperature for more consistent, factual descriptions
  });

  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.openai.com',
      port: 443,
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          
          if (response.error) {
            console.warn(`OpenAI API error: ${response.error.message}`);
            resolve(cleanMarkdown(description).substring(0, targetLength) + '...');
            return;
          }

          let summary = response.choices?.[0]?.message?.content?.trim();
          
          if (summary) {
            // Clean any markdown that might have slipped through
            summary = cleanMarkdown(summary);
            
            if (summary.length <= targetLength) {
              resolve(summary);
            } else {
              // If summary is still too long, truncate it
              resolve(summary.substring(0, targetLength) + '...');
            }
          } else {
            resolve(cleanMarkdown(description).substring(0, targetLength) + '...');
          }
        } catch (error) {
          console.warn(`Failed to parse OpenAI response: ${error.message}`);
          resolve(cleanMarkdown(description).substring(0, targetLength) + '...');
        }
      });
    });

    req.on('error', (error) => {
      console.warn(`OpenAI API request failed: ${error.message}`);
      resolve(cleanMarkdown(description).substring(0, targetLength) + '...');
    });

    req.write(payload);
    req.end();
  });
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
async function convertToProvider(apiData, existingNames = new Set(), options = {}) {
  const { provider, version, spec, quality, isPopular, specFile } = apiData;
  const { openaiApiKey, summarizeDescriptions = false, targetLength = DESCRIPTION_LIMITS.COMPACT } = options;
  
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
  
  // Handle description with optional LLM summarization
  let description = spec.info.description || `${spec.info.title || name} API`;
  const originalDescription = description;
  
  if (summarizeDescriptions && description.length > DESCRIPTION_LIMITS.MIN_FOR_SUMMARY) {
    console.log(`Summarizing description for ${name} (${description.length} chars)`);
    try {
      description = await summarizeDescription(description, targetLength, openaiApiKey);
      console.log(`Summarized to ${description.length} chars`);
    } catch (error) {
      console.warn(`Failed to summarize description for ${name}: ${error.message}`);
      // Fallback to cleaned markdown version
      description = cleanMarkdown(description);
      if (description.length > targetLength) {
        description = description.substring(0, targetLength) + '...';
      }
    }
  } else {
    // Always clean markdown even if not summarizing
    description = cleanMarkdown(description);
  }
  
  return {
    name,
    provider_type: 'http',
    http_method: 'GET',
    url: specUrl,
    content_type: contentType,
    metadata: {
      description,
      category,
      last_updated: new Date().toISOString().split('T')[0],
      maintainer: spec.info.contact?.name || provider,
      documentation_url: spec.externalDocs?.url || spec.info.contact?.url || `https://${provider}`,
      version: version,
      openapi_version: spec.openapi || spec.swagger
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
      case '--summarize-descriptions':
        options.summarizeDescriptions = true;
        break;
      case '--openai-api-key':
        options.openaiApiKey = args[++i];
        break;
      case '--target-length':
        options.targetLength = parseInt(args[++i]) || DESCRIPTION_LIMITS.COMPACT;
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
  --summarize-descriptions  Enable LLM summarization for long descriptions
  --openai-api-key <key>    OpenAI API key for description summarization
  --target-length <chars>   Target length for summarized descriptions (default: 150)
  --help                   Show this help message

Description Processing:
  All descriptions are automatically cleaned of markdown formatting for consistency.
  
  When --summarize-descriptions is enabled, descriptions longer than 200 characters
  will be summarized using OpenAI's GPT-4o-mini to fit within the UI constraints:
  - Compact view: 150 characters (default target)
  - Full view: 300 characters maximum
  
  The LLM is optimized to explain specific API functionality using action verbs,
  avoiding generic phrases and focusing on concrete capabilities developers can use.

Examples:
  node add-providers-from-repo.js --popular-only --min-quality 70
  node add-providers-from-repo.js --categories "Finance & Payments,AI & Machine Learning" --max-results 20
  node add-providers-from-repo.js --dry-run --min-quality 80
  node add-providers-from-repo.js --summarize-descriptions --openai-api-key sk-... --target-length 150
        `);
        return;
    }
  }
  
  try {
    // Handle API key from environment variable if not provided via CLI
    if (options.summarizeDescriptions && !options.openaiApiKey) {
      options.openaiApiKey = process.env.OPENAI_API_KEY;
      if (!options.openaiApiKey) {
        console.warn('⚠️  LLM summarization enabled but no API key provided. Use --openai-api-key or set OPENAI_API_KEY environment variable.');
        console.warn('   Falling back to simple truncation for long descriptions.');
      }
    }

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
    
    // Convert to providers (now async)
    const existingNames = new Set();
    const providers = [];
    
    for (const api of filteredAPIs) {
      const provider = await convertToProvider(api, existingNames, options);
      providers.push(provider);
    }
    
    if (options.dryRun) {
      console.log('\n=== DRY RUN - Would add these providers ===');
      providers.forEach((provider, index) => {
        console.log(`${index + 1}. ${provider.name} (${provider.metadata.category}) - Version: ${provider.metadata.version}`);
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
      console.log(`${index + 1}. ${provider.name} (${provider.metadata.category}) - Version: ${provider.metadata.version}`);
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

module.exports = { 
  scanAPIs, 
  convertToProvider, 
  calculateQualityScore, // Keep for internal filtering
  cleanMarkdown, 
  summarizeDescription 
};