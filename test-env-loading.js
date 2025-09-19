// test-env-loading.js
// Run: node test-env-loading.js

const path = require('path');
require('dotenv').config({ path: '.env.local' });

console.log('🔍 Environment Variable Test');
console.log('==============================');
console.log('Current working directory:', process.cwd());
console.log('Looking for .env.local at:', path.resolve('.env.local'));
console.log('');

// Test Firebase client vars
const clientVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', 
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID'
];

console.log('📱 Firebase Client Variables:');
clientVars.forEach(varName => {
  const value = process.env[varName];
  console.log(`${varName}: ${value ? '✅ Found' : '❌ Missing'}`);
  if (value) {
    console.log(`   Value: ${value.substring(0, 20)}...`);
  }
});

console.log('');
console.log('🔑 Admin Variables:');
console.log(`FIREBASE_SERVICE_ACCOUNT_KEY: ${process.env.FIREBASE_SERVICE_ACCOUNT_KEY ? '✅ Found' : '❌ Missing'}`);
console.log(`RESEND_API_KEY: ${process.env.RESEND_API_KEY ? '✅ Found' : '❌ Missing'}`);
console.log(`ADMIN_EMAIL: ${process.env.ADMIN_EMAIL || '❌ Missing'}`);

console.log('');
console.log('📂 File System Check:');
const fs = require('fs');
try {
  const envContent = fs.readFileSync('.env.local', 'utf8');
  console.log('✅ .env.local file exists and is readable');
  console.log(`   File size: ${envContent.length} characters`);
  console.log(`   First line: ${envContent.split('\n')[0]}`);
} catch (error) {
  console.log('❌ Cannot read .env.local:', error.message);
}