import { Hono } from "hono";
import { usersService } from "@services/users.service";
import { JWTUtils } from "@utils/jwt";
import { logger } from "@utils/logger";

const app = new Hono();

/**
 * User registration
 * POST /api/auth/register
 */
app.post("/register", async (c) => {
    try {
        const body = await c.req.json();
        const { name, email, password, role } = body;

        if (!name || !email || !password) {
            return c.json({ error: "Name, email, and password are required" }, 400);
        }

        const newUser = await usersService.createUser({
            name,
            email,
            password,
            role: role || "user"
        });

        // Generate JWT token
        const token = await JWTUtils.generateToken({
            userId: newUser.id,
            email: newUser.email,
            role: newUser.role
        });

        return c.json({
            success: true,
            message: "User registered successfully",
            user: newUser,
            token
        }, 201);
    } catch (error: any) {
        logger.error("Registration error:", error.message);
        return c.json({ error: error.message }, 400);
    }
});

/**
 * User login
 * POST /api/auth/login
 */
app.post("/login", async (c) => {
    try {
        const body = await c.req.json();
        const { email, password } = body;

        if (!email || !password) {
            return c.json({ error: "Email and password are required" }, 400);
        }

        const user = await usersService.login({ email, password });

        // Generate JWT token
        const token = await JWTUtils.generateToken({
            userId: user.id,
            email: user.email,
            role: user.role
        });

        return c.json({
            success: true,
            message: "Login successful",
            user,
            token
        });
    } catch (error: any) {
        logger.error("Login error:", error.message);
        return c.json({ error: error.message }, 401);
    }
});

/**
 * Get current user profile
 * GET /api/auth/me
 */
app.get("/me", async (c) => {
    try {
        const authHeader = c.req.header("Authorization");
        const token = JWTUtils.extractTokenFromHeader(authHeader);

        if (!token) {
            return c.json({ error: "Authorization token required" }, 401);
        }

        const payload = await JWTUtils.verifyToken(token);
        const user = await usersService.getUserById(payload.userId);

        return c.json({
            success: true,
            user
        });
    } catch (error: any) {
        logger.error("Get profile error:", error.message);
        return c.json({ error: "Invalid or expired token" }, 401);
    }
});

export default app;
