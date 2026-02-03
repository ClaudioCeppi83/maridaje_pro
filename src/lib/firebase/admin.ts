import admin from 'firebase-admin';

// Ensure project ID is set in environment for internal SDK discovery
if (!process.env.GOOGLE_CLOUD_PROJECT) {
  process.env.GOOGLE_CLOUD_PROJECT = 'maridaje-pro-app-v1';
}

const APP_NAME = 'maridaje-app';
const projectId = process.env.GOOGLE_CLOUD_PROJECT || process.env.FIREBASE_PROJECT_ID || 'maridaje-pro-app-v1';

function getApp() {
  const existingApp = admin.apps.find(app => app?.name === APP_NAME);
  if (existingApp) return existingApp;

  try {
    const rawServiceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;
    const serviceAccount = rawServiceAccount ? JSON.parse(rawServiceAccount) : undefined;

    if (serviceAccount) {
      return admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: projectId,
      }, APP_NAME);
    } else {
      // Fallback for environments with ADC (Application Default Credentials)
      return admin.initializeApp({
        projectId: projectId,
      }, APP_NAME);
    }
  } catch (error) {
    console.error('[Firebase Admin] Initialization error:', error);
    // Final fallback to default app if named init fails
    return admin.apps.length > 0 ? admin.app() : admin.initializeApp({ projectId });
  }
}

const app = getApp();
export const db = admin.firestore(app);
export { admin };
