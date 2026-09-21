import { Hono } from "hono";

export const testRouter = new Hono();

testRouter.get("/", (c) => {
  const host = c.req.header("host") || "localhost:5001";
  return c.json({
    status: "success",
    message: "Bun + TypeScript backend test route is working!",
    host,
    runtime: `Bun v${Bun.version}`,
    timestamp: new Date().toISOString(),
  });
});
