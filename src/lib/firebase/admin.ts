import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';
import { getStorage, Storage } from 'firebase-admin/storage';
import { serverEnv } from '@/lib/env';

// Service account interface
interface ServiceAccount {
  type: string;
  project_id: string;
  private_key_id: string;
  private_key: string;
  client_email: string;
  client_id: string;
  auth_uri: string;
  token_uri: string;
  auth_provider_x509_cert_url: string;
  client_x509_cert_url: string;
}

/**
 * Parse and validate the Firebase service account key from environment variable
 */
function getServiceAccount(): ServiceAccount {
  const serviceAccountKey = serverEnv.FIREBASE_SERVICE_ACCOUNT_KEY;
  
  if (!serviceAccountKey) {
    throw new Error(
      'FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set. ' +
      'This should contain the base64-encoded Firebase service account JSON.'
    );
  }

  try {
    // Decode base64 and parse JSON
    const decodedKey = Buffer.from(serviceAccountKey, 'base64').toString('utf-8');
    const serviceAccount = JSON.parse(decodedKey) as ServiceAccount;
    
    // Validate required fields
    const requiredFields: (keyof ServiceAccount)[] = [
      'type',
      'project_id',
      'private_key_id',
      'private_key',
      'client_email',
      'client_id',
    ];
    
    const missingFields = requiredFields.filter((field) => !serviceAccount[field]);
    
    if (missingFields.length > 0) {
      throw new Error(
        `Invalid service account: missing required fields: ${missingFields.join(', ')}`
      );
    }
    
    // Ensure private key is properly formatted
    if (!serviceAccount.private_key.includes('-----BEGIN PRIVATE KEY-----')) {
      throw new Error('Invalid private key format in service account');
    }
    
    return serviceAccount;
    
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(
        'Invalid FIREBASE_SERVICE_ACCOUNT_KEY: not valid base64-encoded JSON'
      );
    }
    throw error;
  }
}

/**
 * Initialize Firebase Admin app with singleton pattern
 */
function initializeFirebaseAdmin(): App {
  // Check if admin app already exists
  const existingApps = getApps();
  if (existingApps.length > 0) {
    return existingApps[0];
  }

  try {
    const serviceAccount = getServiceAccount();
    
    // Initialize admin app with service account
    const app = initializeApp({
      credential: cert(serviceAccount as any),
      projectId: serviceAccount.project_id,
      storageBucket: `${serviceAccount.project_id}.appspot.com`,
    });
    
    return app;
    
  } catch (error) {
    console.error('Failed to initialize Firebase Admin:', error);
    throw new Error(
      `Firebase Admin initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

// Initialize the admin app
let adminApp: App;

try {
  adminApp = initializeFirebaseAdmin();
} catch (error) {
  console.error('Firebase Admin setup error:', error);
  // Re-throw to prevent the app from starting with invalid config
  throw error;
}

// Export Firebase Admin services
export const adminDb: Firestore = getFirestore(adminApp);
export const adminAuth: Auth = getAuth(adminApp);
export const adminStorage: Storage = getStorage(adminApp);

// Export the admin app instance
export default adminApp;

/**
 * Utility function to verify admin initialization (for debugging)
 */
export const verifyAdminInit = (): boolean => {
  try {
    const apps = getApps();
    return apps.length > 0;
  } catch {
    return false;
  }
};

/**
 * Get project ID from the initialized admin app
 */
export const getProjectId = (): string => {
  const serviceAccount = getServiceAccount();
  return serviceAccount.project_id;
};