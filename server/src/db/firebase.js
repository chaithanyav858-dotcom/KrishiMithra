import admin from 'firebase-admin';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let firestore = null;
let isFirebaseConfigured = false;

try {
  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_KEY 
    ? path.resolve(process.cwd(), process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
    : path.resolve(__dirname, '../../serviceAccountKey.json');

  if (fs.existsSync(serviceAccountPath)) {
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
    }
    firestore = admin.firestore();
    isFirebaseConfigured = true;
    console.log(`[FIREBASE] 🔥 Connected to Cloud Firestore via service account file (${serviceAccount.project_id})`);
  } else if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey
        })
      });
    }
    firestore = admin.firestore();
    isFirebaseConfigured = true;
    console.log(`[FIREBASE] 🔥 Connected to Cloud Firestore via env credentials (${process.env.FIREBASE_PROJECT_ID})`);
  } else {
    console.log('[FIREBASE] ℹ️  Firebase credentials not detected in .env. Running in SQLite database mode.');
    console.log('[FIREBASE] 💡 To connect live Firestore: set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL & FIREBASE_PRIVATE_KEY in server/.env');
  }
} catch (error) {
  console.warn('[FIREBASE] ⚠️  Firebase initialization warning:', error.message);
  console.log('[FIREBASE] ℹ️  Falling back to local SQLite database mode.');
  isFirebaseConfigured = false;
  firestore = null;
}

export { admin, firestore, isFirebaseConfigured };
