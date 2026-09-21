import { Hono } from "hono";
import { getFirestoreDb } from "../lib/firebase";

export const profileRouter = new Hono();

// ข้อมูลส่วนตัวเริ่มต้น (สำหรับ Seed หรือ Fallback)
const defaultProfile = {
  name: "Ekgaparp Janchuaina",
  nickname: "Tonmai",
  role: "Flutter Developer",
  location: "Bangkok, Thailand",
  avatar: "/profile/profile.jpg",
  introduction:
    "I'm Ekgaparp Janchuaina, a Flutter Developer specializing in scalable Clean Architecture. Proven track record in Media Streaming, E-commerce, and Enterprise sectors. Strong advocate for code quality (Unit, Widget, Golden). Currently leveraging Next.js skills to deliver unified mobile and web cross-platform experiences.",
  approach:
    "I believe in Clean Architecture and predictable state management. My goal is to bridge the gap between complex backend logic and elegant user interaction through robust automated testing and modular design.",
  stats: {
    experience_start_date: "2022-05-23",
    internship_start_date: "2022-05-23",
    work_start_date: "2023-05-02",
    projects_done: "6+",
  },
  contact: {
    email: "ekgaparp.dev@gmail.com",
    phone: "080-107-8401",
    github: "ton-mai3722",
    linkedin: "#",
  },
};

// GET /api/profile - ดึงข้อมูลโปรไฟล์
profileRouter.get("/", async (c) => {
  const db = getFirestoreDb();

  // หากยังไม่ได้ใส่ serviceAccountKey ให้ใช้ mock data ชั่วคราว
  if (!db) {
    return c.json({
      status: "success",
      source: "local_mock (ยังไม่พบ credentials ของ Firebase)",
      data: defaultProfile,
    });
  }

  try {
    const docRef = db.collection("profile").doc("me");
    const doc = await docRef.get();

    if (!doc.exists) {
      // บันทึกข้อมูลเริ่มต้นให้ทันทีถ้ายังไม่มีใน Firestore
      await docRef.set(defaultProfile);
      return c.json({
        status: "success",
        source: "firestore (seeded initial data)",
        data: defaultProfile,
      });
    }

    return c.json({
      status: "success",
      source: "firestore",
      data: doc.data(),
    });
  } catch (error: any) {
    console.error("Firestore read error:", error);
    return c.json(
      {
        status: "error",
        message: error.message || "Failed to fetch from Firestore",
        fallbackData: defaultProfile,
      },
      500
    );
  }
});

// PUT /api/profile - อัปเดตข้อมูลโปรไฟล์ลง Firestore
profileRouter.put("/", async (c) => {
  const db = getFirestoreDb();
  if (!db) {
    return c.json(
      {
        status: "error",
        message: "Firebase ยังไม่ได้เชื่อมต่อ (ไม่พบ serviceAccountKey.json)",
      },
      500
    );
  }

  try {
    const body = await c.req.json();
    const docRef = db.collection("profile").doc("me");
    await docRef.set(body, { merge: true });

    return c.json({
      status: "success",
      message: "อัปเดตข้อมูลใน Firestore สำเร็จเรียบร้อย",
    });
  } catch (error: any) {
    console.error("Firestore update error:", error);
    return c.json(
      {
        status: "error",
        message: error.message || "Failed to update Firestore",
      },
      500
    );
  }
});
