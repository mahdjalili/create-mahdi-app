import { sign, verify, decode } from "hono/jwt";

export interface JWTPayload {
    userId: number;
    email: string;
    role: "admin" | "user";
    iat?: number;
    exp?: number;
}

export class JWTUtils {
    private static readonly SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
    private static readonly EXPIRES_IN = 7 * 24 * 60 * 60; // 7 days in seconds

    /**
     * Generate JWT token
     */
    static async generateToken(payload: Omit<JWTPayload, "iat" | "exp">): Promise<string> {
        const now = Math.floor(Date.now() / 1000);
        const tokenPayload = {
            ...payload,
            iat: now,
            exp: now + this.EXPIRES_IN,
        };
        
        return await sign(tokenPayload, this.SECRET);
    }

    /**
     * Verify JWT token
     */
    static async verifyToken(token: string): Promise<JWTPayload> {
        try {
            const payload = await verify(token, this.SECRET) as unknown as JWTPayload;
            return payload;
        } catch (error) {
            throw new Error("Invalid or expired token");
        }
    }

    /**
     * Decode JWT token without verification (for debugging)
     */
    static decodeToken(token: string): { header: any; payload: any } {
        return decode(token);
    }

    /**
     * Extract token from Authorization header
     */
    static extractTokenFromHeader(authHeader: string | undefined): string | null {
        if (!authHeader) return null;
        
        const parts = authHeader.split(" ");
        if (parts.length !== 2 || parts[0] !== "Bearer") {
            return null;
        }
        
        return parts[1] || null;
    }
}
