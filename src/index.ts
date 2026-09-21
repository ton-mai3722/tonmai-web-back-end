import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { testRouter } from "./routes/test";
import { profileRouter } from "./routes/profile";

const PORT = Number(process.env.PORT) || 5001;
const app = new Hono();

// Global Middlewares
app.use("*", logger());
app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
  })
);

// Health check / Root
app.get("/", (c) => {
  return c.json({
    service: "tonmai-web-back-end",
    status: "healthy",
    port: PORT,
    endpoints: {
      root: "/",
      test: "/api/test",
      profile: "/api/profile",
    },
  });
});

// Routes
app.route("/api/test", testRouter);
app.route("/api/profile", profileRouter);

console.log(`🚀 Tonmai Backend is running at http://localhost:${PORT}`);
console.log(`📡 Test route: http://localhost:${PORT}/api/test`);
console.log(`👤 Profile route: http://localhost:${PORT}/api/profile`);

export { app };

export default {
  port: PORT,
  fetch: app.fetch,
};

