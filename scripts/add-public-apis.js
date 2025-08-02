#!/usr/bin/env node

const fs = require('fs');
const https = require('https');

// Categories to prioritize (exact matches from public-apis)
const PRIORITY_CATEGORIES = [
  'Animals', 'Anime', 'Anti-Malware', 'Art & Design', 'Authentication & Authorization',
  'Blockchain', 'Books', 'Business', 'Calendar', 'Cloud Storage & File Sharing',
  'Continuous Integration', 'Cryptocurrency', 'Currency Exchange', 'Data Validation',
  'Development', 'Dictionaries', 'Documents & Productivity', 'Email', 'Environment',
  'Events', 'Finance', 'Food & Drink', 'Games & Comics', 'Geocoding', 'Government',
  'Health', 'Jobs', 'Machine Learning', 'Music', 'News', 'Open Data', 'Open Source Projects',
  'Patent', 'Personality', 'Phone', 'Photography', 'Programming', 'Science & Math',
  'Security', 'Shopping', 'Social', 'Sports & Fitness', 'Test Data', 'Text Analysis',
  'Tracking', 'Transportation', 'URL Shorteners', 'Vehicle', 'Video', 'Weather'
];

// Function to fetch data from URL
function fetchData(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve(data); // Return as string if not JSON
        }
      });
    }).on('error', reject);
  });
}

// Function to convert public-apis entry to our provider format
function convertToProvider(apiEntry, category, existingNames = new Set()) {
  let baseName = apiEntry.API.toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');

  // Make name unique by appending suffix if it already exists
  let name = baseName;
  let counter = 1;
  while (existingNames.has(name)) {
    name = `${baseName}_${counter}`;
    counter++;
  }
  existingNames.add(name);

  const provider = {
    name: name,
    provider_type: "http",
    http_method: "GET",
    url: apiEntry.Link || `https://${name}.com/api`,
    content_type: "application/json",
    metadata: {
      description: apiEntry.Description || `${apiEntry.API} API`,
      category: category,
      last_updated: new Date().toISOString().split('T')[0],
      maintainer: apiEntry.API,
      documentation_url: apiEntry.Link || `https://${name}.com/docs`,
      auth_required: apiEntry.Auth !== 'No',
      auth_type: apiEntry.Auth === 'No' ? null : apiEntry.Auth,
      https_support: apiEntry.HTTPS === 'Yes',
      cors_support: apiEntry.CORS === 'Yes' ? 'Yes' : apiEntry.CORS === 'No' ? 'No' : 'Unknown'
    }
  };

  return provider;
}

// Function to parse markdown table and extract API data
function parseMarkdownTable(markdown, category) {
  const lines = markdown.split('\n');
  const apis = [];
  let inTable = false;
  let headerFound = false;

  for (const line of lines) {
    const trimmed = line.trim();
    
    // Look for table headers - handle both formats (with and without trailing pipe)
    if (trimmed === 'API | Description | Auth | HTTPS | CORS' || 
        trimmed === 'API | Description | Auth | HTTPS | CORS |') {
      inTable = true;
      headerFound = false;
      continue;
    }
    
    // Skip separator line
    if (inTable && !headerFound && trimmed.startsWith('|:---')) {
      headerFound = true;
      continue;
    }
    
    // Parse table rows
    if (inTable && headerFound && trimmed.startsWith('|') && trimmed.endsWith('|')) {
      const parts = trimmed.split('|').map(p => p.trim()).filter(p => p);
      
      if (parts.length >= 5) {
        // Extract API name from markdown link format [API Name](URL)
        const apiMatch = parts[0].match(/\[([^\]]+)\]\(([^)]+)\)/);
        const apiName = apiMatch ? apiMatch[1] : parts[0];
        const apiUrl = apiMatch ? apiMatch[2] : '';
        
        apis.push({
          API: apiName,
          Description: parts[1],
          Auth: parts[2],
          HTTPS: parts[3],
          CORS: parts[4],
          Link: apiUrl
        });
      }
    }
    
    // Stop when we hit a new section
    if (inTable && trimmed.startsWith('###')) {
      break;
    }
  }
  
  return apis;
}

async function main() {
  try {
    console.log('Fetching public-apis data...');
    
    // Fetch the README from public-apis repository
    const readmeUrl = 'https://raw.githubusercontent.com/public-apis/public-apis/master/README.md';
    const readme = await fetchData(readmeUrl);
    
    console.log('Parsing API data...');
    
    // Extract APIs from different categories
    const allProviders = [];
    const existingNames = new Set();
    const sections = readme.split(/### /);
    
    for (const section of sections) {
      const lines = section.split('\n');
      const categoryLine = lines[0].trim();
      
      // Check if this is a category we want (exact match)
      if (PRIORITY_CATEGORIES.includes(categoryLine)) {
        console.log(`Processing category: ${categoryLine}`);
        const apis = parseMarkdownTable(section, categoryLine);
        
        console.log(`  Found ${apis.length} APIs in ${categoryLine}`);
        
        for (const api of apis.slice(0, 3)) { // Limit to 3 per category for variety
          try {
            const provider = convertToProvider(api, categoryLine, existingNames);
            allProviders.push(provider);
          } catch (e) {
            console.warn(`  Skipping ${api.API}: ${e.message}`);
          }
        }
      }
    }
    
    // Limit to 100 providers
    const selectedProviders = allProviders.slice(0, 100);
    
    console.log(`Selected ${selectedProviders.length} providers`);
    
    // Read existing providers
    const existingProvidersPath = 'static/providers.json';
    let existingProviders = [];
    
    if (fs.existsSync(existingProvidersPath)) {
      const existingData = fs.readFileSync(existingProvidersPath, 'utf8');
      existingProviders = JSON.parse(existingData);
    }
    
    // Filter out duplicates (by name)
    const existingProviderNames = new Set(existingProviders.map(p => p.name));
    const newProviders = selectedProviders.filter(p => !existingProviderNames.has(p.name));
    
    console.log(`Adding ${newProviders.length} new providers (${selectedProviders.length - newProviders.length} duplicates skipped)`);
    
    // Merge and save
    const allProvidersData = [...existingProviders, ...newProviders];
    
    fs.writeFileSync(existingProvidersPath, JSON.stringify(allProvidersData, null, 2));
    
    console.log(`✅ Successfully added ${newProviders.length} providers to ${existingProvidersPath}`);
    console.log(`Total providers: ${allProvidersData.length}`);
    
    // Show sample of added providers
    console.log('\nSample of added providers:');
    newProviders.slice(0, 5).forEach(p => {
      console.log(`- ${p.name} (${p.metadata.category}): ${p.metadata.description}`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { convertToProvider, parseMarkdownTable };