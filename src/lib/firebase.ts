import { initializeApp, cert, getApps, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { existsSync, readFileSync } from "fs";
import { resolve } from "path";

let db: Firestore | null = null;
let app: App | null = null;

export function getFirestoreDb(): Firestore | null {
  if (db) return db;

  const existingApps = getApps();
  if (existingApps.length > 0 && existingApps[0]) {
    app = existingApps[0];
    db = getFirestore(app);
    return db;
  }

  // 1. ตรวจสอบไฟล์ serviceAccountKey.json ในโปรเจกต์
  const serviceAccountPath = resolve(process.cwd(), "serviceAccountKey.json");

  if (existsSync(serviceAccountPath)) {
    try {
      const fileContent = readFileSync(serviceAccountPath, "utf-8");
      const serviceAccount = JSON.parse(fileContent);

      app = initializeApp({
        credential: cert(serviceAccount),
      });

      console.log("🔥 Firebase Admin initialized successfully via serviceAccountKey.json");
      db = getFirestore(app);
      return db;
    } catch (err) {
      console.error("❌ Failed to initialize Firebase from serviceAccountKey.json:", err);
    }
  }

  // 2. ตรวจสอบจาก Environment Variable (JSON String)
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    try {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      app = initializeApp({
        credential: cert(serviceAccount),
      });
      console.log("🔥 Firebase Admin initialized successfully via env variable");
      db = getFirestore(app);
      return db;
    } catch (err) {
      console.error("❌ Failed to initialize Firebase from FIREBASE_SERVICE_ACCOUNT_KEY:", err);
    }
  }

  return null;
}
