#!/usr/bin/env node

const fs = require('fs');

function cleanupDuplicates() {
  try {
    const providersPath = 'static/providers.json';
    const data = JSON.parse(fs.readFileSync(providersPath, 'utf8'));
    
    console.log(`Original providers: ${data.length}`);
    
    const uniqueProviders = [];
    const seen = new Map();
    
    for (const provider of data) {
      const key = `${provider.name}-${provider.metadata?.category || 'other'}`;
      
      if (!seen.has(key)) {
        seen.set(key, true);
        uniqueProviders.push(provider);
      } else {
        // If duplicate, rename it with a suffix
        let counter = 2;
        let newName = `${provider.name}_${counter}`;
        let newKey = `${newName}-${provider.metadata?.category || 'other'}`;
        
        while (seen.has(newKey)) {
          counter++;
          newName = `${provider.name}_${counter}`;
          newKey = `${newName}-${provider.metadata?.category || 'other'}`;
        }
        
        provider.name = newName;
        seen.set(newKey, true);
        uniqueProviders.push(provider);
        console.log(`Renamed duplicate: ${provider.name} in ${provider.metadata?.category}`);
      }
    }
    
    console.log(`Cleaned providers: ${uniqueProviders.length}`);
    console.log(`Duplicates handled: ${data.length - uniqueProviders.length}`);
    
    // Write back the cleaned data
    fs.writeFileSync(providersPath, JSON.stringify(uniqueProviders, null, 2));
    
    console.log('✅ Cleanup complete!');
    
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  cleanupDuplicates();
}

module.exports = { cleanupDuplicates };