import { Hono } from "hono";
import { usersService } from "@services/users.service";
import { requireAdmin } from "@/middleware/auth";

const app = new Hono();

// Protect all user management routes with admin auth
app.use("*", requireAdmin());

// Get all users
app.get("/", async (c) => {
    try {
        const allUsers = await usersService.getAllUsers();
        return c.json(allUsers);
    } catch (error: any) {
        return c.json({ error: error.message }, 500);
    }
});

// Get user by id
app.get("/:id", async (c) => {
    try {
        const id = parseInt(c.req.param("id"));
        const user = await usersService.getUserById(id);
        return c.json(user);
    } catch (error: any) {
        return c.json({ error: error.message }, 404);
    }
});

// Create user
app.post("/", async (c) => {
    try {
        const body = await c.req.json();
        const newUser = await usersService.createUser(body);
        return c.json(newUser, 201);
    } catch (error: any) {
        return c.json({ error: error.message }, 400);
    }
});

// Update user
app.put("/:id", async (c) => {
    try {
        const id = parseInt(c.req.param("id"));
        const body = await c.req.json();
        const updatedUser = await usersService.updateUser(id, body);
        return c.json(updatedUser);
    } catch (error: any) {
        return c.json({ error: error.message }, 404);
    }
});

// Delete user
app.delete("/:id", async (c) => {
    try {
        const id = parseInt(c.req.param("id"));
        const result = await usersService.deleteUser(id);
        return c.json(result);
    } catch (error: any) {
        return c.json({ error: error.message }, 404);
    }
});

export default app;
