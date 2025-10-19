/**
 * Users Service
 * Business logic for user operations
 */

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { logger } from "@utils/logger";
import { PasswordUtils } from "@utils/password";

export interface UserData {
    name: string;
    email: string;
    role: "admin" | "user";
}

export interface CreateUserData {
    name: string;
    email: string;
    password: string;
    role?: "admin" | "user";
}

export interface UpdateUserData {
    name?: string;
    email?: string;
    password?: string;
    role?: "admin" | "user";
}

export interface LoginData {
    email: string;
    password: string;
}

class UsersService {
    /**
     * Get all users
     */
    async getAllUsers() {
        try {
            const allUsers = await db.select().from(users);
            // Remove passwords from returned users
            const usersWithoutPasswords = allUsers.map(({ password, ...user }) => user);
            logger.info(`Retrieved ${allUsers.length} users`);
            return usersWithoutPasswords;
        } catch (error: any) {
            logger.error("Error getting all users:", error.message);
            throw new Error(`Failed to get users: ${error.message}`);
        }
    }

    /**
     * Get user by ID
     */
    async getUserById(id: number) {
        try {
            const user = await db.select().from(users).where(eq(users.id, id));

            if (user.length === 0) {
                throw new Error("User not found");
            }

            // Remove password from returned user
            const { password, ...userWithoutPassword } = user[0];
            logger.info(`Retrieved user ${id}`);
            return userWithoutPassword;
        } catch (error: any) {
            logger.error(`Error getting user ${id}:`, error.message);
            throw error;
        }
    }

    /**
     * Create new user
     */
    async createUser(userData: CreateUserData) {
        try {
            // Validate required fields
            if (!userData.name || !userData.email || !userData.password) {
                throw new Error("Name, email, and password are required");
            }

            // Check if email already exists
            const existingUser = await db.select().from(users).where(eq(users.email, userData.email));
            if (existingUser.length > 0) {
                throw new Error("User with this email already exists");
            }

            // Hash password
            const hashedPassword = await PasswordUtils.hashPassword(userData.password);

            const newUser = await db.insert(users).values({
                name: userData.name,
                email: userData.email,
                password: hashedPassword,
                role: "user"
            }).returning();

            // Remove password from returned user
            const { password, ...userWithoutPassword } = newUser[0];
            logger.success(`Created user ${newUser[0].id} with email ${userData.email}`);
            return userWithoutPassword;
        } catch (error: any) {
            logger.error("Error creating user:", error.message);
            throw error;
        }
    }

    /**
     * Update user
     */
    async updateUser(id: number, userData: UpdateUserData) {
        try {
            // Check if user exists
            const existingUser = await db.select().from(users).where(eq(users.id, id));
            if (existingUser.length === 0) {
                throw new Error("User not found");
            }

            // If email is being updated, check if new email already exists
            if (userData.email && userData.email !== existingUser[0].email) {
                const emailExists = await db.select().from(users).where(eq(users.email, userData.email));
                if (emailExists.length > 0) {
                    throw new Error("User with this email already exists");
                }
            }

            // Prepare update data
            const updateData: any = { ...userData };
            
            // Hash password if provided
            if (userData.password) {
                updateData.password = await PasswordUtils.hashPassword(userData.password);
            }

            const updatedUser = await db.update(users).set(updateData).where(eq(users.id, id)).returning();

            // Remove password from returned user
            const { password, ...userWithoutPassword } = updatedUser[0];
            logger.success(`Updated user ${id}`);
            return userWithoutPassword;
        } catch (error: any) {
            logger.error(`Error updating user ${id}:`, error.message);
            throw error;
        }
    }

    /**
     * Delete user
     */
    async deleteUser(id: number) {
        try {
            const deletedUser = await db.delete(users).where(eq(users.id, id)).returning();

            if (deletedUser.length === 0) {
                throw new Error("User not found");
            }

            logger.success(`Deleted user ${id}`);
            return { message: "User deleted successfully" };
        } catch (error: any) {
            logger.error(`Error deleting user ${id}:`, error.message);
            throw error;
        }
    }

    /**
     * Get user by email
     */
    async getUserByEmail(email: string) {
        try {
            const user = await db.select().from(users).where(eq(users.email, email));

            if (user.length === 0) {
                throw new Error("User not found");
            }

            logger.info(`Retrieved user by email ${email}`);
            return user[0];
        } catch (error: any) {
            logger.error(`Error getting user by email ${email}:`, error.message);
            throw error;
        }
    }

    /**
     * Check if email exists
     */
    async emailExists(email: string): Promise<boolean> {
        try {
            const user = await db.select().from(users).where(eq(users.email, email));
            return user.length > 0;
        } catch (error: any) {
            logger.error(`Error checking email existence ${email}:`, error.message);
            throw error;
        }
    }

    /**
     * Authenticate user login
     */
    async login(loginData: LoginData) {
        try {
            // Get user by email (including password)
            const user = await db.select().from(users).where(eq(users.email, loginData.email));

            if (user.length === 0) {
                throw new Error("Invalid email or password");
            }

            const foundUser = user[0];

            // Verify password
            const isValidPassword = await PasswordUtils.verifyPassword(loginData.password, foundUser.password);
            
            if (!isValidPassword) {
                throw new Error("Invalid email or password");
            }

            // Remove password from returned user
            const { password, ...userWithoutPassword } = foundUser;
            logger.success(`User ${foundUser.email} logged in successfully`);
            return userWithoutPassword;
        } catch (error: any) {
            logger.error(`Error logging in user ${loginData.email}:`, error.message);
            throw error;
        }
    }
}

// Export singleton instance
export const usersService = new UsersService();
