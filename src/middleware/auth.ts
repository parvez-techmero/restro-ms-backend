import { verifyJWT } from "../lib/jwt";
import { MiddlewareHandler } from "hono";

export const authMiddleware: MiddlewareHandler = async (c, next) => {
    const authHeader = c.req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return c.json({ error: "Unauthorized" }, 401);
    }

    const parts = authHeader.split(" ");
    const token = parts[1];


    if (!token) {
        return c.json({ error: "Token missing" }, 401);
    }
    const payload = await verifyJWT(token, c.env.JWT_SECRET);

    if (!payload) {
        return c.json({ error: "Invalid or expired token" }, 401);
    }

    c.set("user", payload); // Attach user info to context
    const prisma = c.get('prisma')

    if (prisma) {
        try {
            const restro = await prisma.restaurant.findUnique({
                where: { id: payload.restaurantId, status : "active" },
                select: {
                    id: true,
                    email: true,
                    name: true,
                },
            });

            if (!restro) {
                return c.json({ error: 'Restaurant not found' }, 401);
            }

        } catch (error) {
            console.error('Error fetching user from database:', error);
            return c.json({ error: 'Database error' }, 500);
        }
    }
    await next();
};
