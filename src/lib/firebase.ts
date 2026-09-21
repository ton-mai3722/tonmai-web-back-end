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

  // 1. ตรวจสอบจาก Environment Variables แบบแยกตัวแปร (แนะนำสำหรับ Production)
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (projectId && clientEmail && privateKey) {
    try {
      // แปลง escaped \n กลับเป็น newline จริง
      privateKey = privateKey.replace(/\\n/g, "\n");
      app = initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
      console.log("🔥 Firebase Admin initialized successfully via individual ENV variables");
      db = getFirestore(app);
      return db;
    } catch (err) {
      console.error("❌ Failed to initialize Firebase from individual ENV variables:", err);
    }
  }

  // 2. ตรวจสอบจาก Environment Variable แบบ JSON String ทั้งก้อน
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    try {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      app = initializeApp({
        credential: cert(serviceAccount),
      });
      console.log("🔥 Firebase Admin initialized successfully via FIREBASE_SERVICE_ACCOUNT_KEY env");
      db = getFirestore(app);
      return db;
    } catch (err) {
      console.error("❌ Failed to initialize Firebase from FIREBASE_SERVICE_ACCOUNT_KEY:", err);
    }
  }

  // 3. ตรวจสอบจากไฟล์ serviceAccountKey.json ในโปรเจกต์ (Fallback)
  const serviceAccountPath = resolve(process.cwd(), "serviceAccountKey.json");
  if (existsSync(serviceAccountPath)) {
    try {
      const fileContent = readFileSync(serviceAccountPath, "utf-8");
      const serviceAccount = JSON.parse(fileContent);

      app = initializeApp({
        credential: cert(serviceAccount),
      });

      console.log("🔥 Firebase Admin initialized successfully via serviceAccountKey.json file");
      db = getFirestore(app);
      return db;
    } catch (err) {
      console.error("❌ Failed to initialize Firebase from serviceAccountKey.json:", err);
    }
  }

  return null;
}
