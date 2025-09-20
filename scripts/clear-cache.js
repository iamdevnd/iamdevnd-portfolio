// scripts/clear-cache.js
// Run this script to manually clear the cache and see fresh data

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

async function clearCache() {
  console.log('🧹 Clearing Next.js cache...');
  
  try {
    // Try to hit the revalidation endpoint
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    
    console.log(`Hitting revalidation endpoint: ${baseUrl}/api/revalidate`);
    
    const response = await fetch(`${baseUrl}/api/revalidate`, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache'
      }
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Cache cleared successfully!');
      console.log('Result:', result);
    } else {
      console.log('❌ Failed to clear cache via API');
      console.log('Response status:', response.status);
      console.log('Response text:', await response.text());
    }

  } catch (error) {
    console.log('❌ Error clearing cache:', error.message);
    console.log('\n💡 Alternative solutions:');
    console.log('1. Restart your dev server: npm run dev');
    console.log('2. Delete .next folder: rm -rf .next && npm run dev');
    console.log('3. Force refresh in browser: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)');
  }
}

clearCache();