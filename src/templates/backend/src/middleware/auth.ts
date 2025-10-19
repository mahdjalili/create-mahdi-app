import type { MiddlewareHandler } from "hono";
import { JWTUtils, type JWTPayload } from "@utils/jwt";

export interface AuthContext {
    user: JWTPayload;
}

/**
 * Authentication middleware that requires a valid JWT token
 */
export function requireAuth(): MiddlewareHandler {
    return async (c, next) => {
        try {
            const authHeader = c.req.header("Authorization");
            const token = JWTUtils.extractTokenFromHeader(authHeader);

            if (!token) {
                return c.json({ error: "Authorization token required" }, 401);
            }

            const payload = await JWTUtils.verifyToken(token);
            
            // Add user info to context
            c.set("user", payload);
            
            await next();
        } catch (error: any) {
            return c.json({ error: "Invalid or expired token" }, 401);
        }
    };
}

/**
 * Admin-only authentication middleware
 */
export function requireAdmin(): MiddlewareHandler {
    return async (c, next) => {
        try {
            const authHeader = c.req.header("Authorization");
            const token = JWTUtils.extractTokenFromHeader(authHeader);

            if (!token) {
                return c.json({ error: "Authorization token required" }, 401);
            }

            const payload = await JWTUtils.verifyToken(token);
            
            if (payload.role !== "admin") {
                return c.json({ error: "Admin access required" }, 403);
            }
            
            // Add user info to context
            c.set("user", payload);
            
            await next();
        } catch (error: any) {
            return c.json({ error: "Invalid or expired token" }, 401);
        }
    };
}
