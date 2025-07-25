import { Bool, OpenAPIRoute } from "chanfana";
import { z } from "zod";
import { type AppContext } from "../../middleware/prisma-client";
import { createMenuItemSchema } from "../../types";
import bcrypt from "bcryptjs";

export class MenuItemCreate extends OpenAPIRoute {
    schema = {
        tags: ["MenuItem"],
        summary: "Create a new MenuItem",
        security: [{ bearerAuth: [] }],
        request: {
            body: {
                content: {
                    "application/json": {
                        schema: createMenuItemSchema,
                    },
                },
                // required: true,
            },
        },
        responses: {
            "200": {
                description: "Returns the created MenuItem",
                content: {
                    "application/json": {
                        schema: z.object({
                            success: Bool(),
                            restaurant: createMenuItemSchema,
                        }),
                    },
                },
            },
        },
    };

    async handle(c: AppContext) {
        // Get validated data
        const { body } = await this.getValidatedData<typeof this.schema>();
        // const data = await c.req.json();
        const prisma = c.get('prisma')

        try {

            // return the new task
            return c.json({
                success: true,
                body
            });
        } catch (error: unknown) {
            if (
                error &&
                typeof error === 'object' &&
                'code' in error &&
                'meta' in error &&
                error.code === 'P2002'
            ) {
                const prismaError = error as {
                    code: string;
                    meta?: {
                        target?: string[];
                    };
                };

                if (prismaError.meta?.target?.includes('email')) {
                    return c.json(
                        { error: "Restaurant with this email already exists" },
                        409
                    );
                }
            }

            console.error("Create restaurant error:", error);
            return c.json({ error: "Internal server error" }, 500);
        }
    }
}
