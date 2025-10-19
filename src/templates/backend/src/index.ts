import { Hono } from "hono";
import { logger as honoLogger } from "hono/logger";
import { cors } from "hono/cors";
import usersRoute from "@/routes/users";
import authRoute from "@/routes/auth";
import { logger } from "@utils/logger";

// Environment variables are loaded automatically by Bun

const app = new Hono();

// Middleware
app.use("*", honoLogger());
app.use("*", cors());

// Routes
app.get("/", (c) => {
    return c.json({
        message: "Backend API Template",
        version: "1.0.0",
    });
});

app.get("/health", (c) => {
    return c.json({ ok: true });
});

app.route("/api/auth", authRoute);
app.route("/api/users", usersRoute);

const port = Number(process.env.PORT) || 3000;

logger.success(`Server is running on http://localhost:${port}`);

export default {
    port,
    fetch: app.fetch,
};
