import Bun from "bun";

/**
 * Password utility functions using Bun's built-in password hashing
 */
export class PasswordUtils {
    /**
     * Hash a password
     */
    static async hashPassword(password: string): Promise<string> {
        return await Bun.password.hash(password);
    }

    /**
     * Verify a password against a hash
     */
    static async verifyPassword(password: string, hash: string): Promise<boolean> {
        return await Bun.password.verify(password, hash);
    }
}
