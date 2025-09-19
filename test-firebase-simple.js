// test-firebase-simple.js
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env.local') });

const admin = require('firebase-admin');

const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
const serviceAccount = JSON.parse(Buffer.from(serviceAccountKey, 'base64').toString('utf-8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: serviceAccount.project_id,
});

const db = admin.firestore();

async function testConnection() {
  try {
    console.log('Testing basic write...');
    await db.collection('test').doc('hello').set({ message: 'Hello World', timestamp: new Date() });
    console.log('✅ Write successful!');
    
    console.log('Testing basic read...');
    const doc = await db.collection('test').doc('hello').get();
    console.log('✅ Read successful:', doc.data());
    
    await db.collection('test').doc('hello').delete();
    console.log('✅ Delete successful!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  process.exit(0);
}

testConnection();