import { Bool, OpenAPIRoute } from "chanfana";
import { z } from "zod";
import { type AppContext } from "../../middleware/prisma-client";
import { createOrderItemSchema } from "../../types";
import { Prisma } from '@prisma/client/edge';

export class OrderItemCreate extends OpenAPIRoute {
    schema = {
        tags: ["OrderItem"],
        summary: "Create a new OrderItem",
        security: [{ bearerAuth: [] }],
        request: {
            body: {
                content: {
                    "application/json": {
                        schema: createOrderItemSchema,
                    },
                },
                // required: true,
            },
        },
        responses: {
            "200": {
                description: "Returns the created OrderItem",
                content: {
                    "application/json": {
                        schema: z.object({
                            success: Bool(),
                            restaurant: createOrderItemSchema,
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

            // const restaurant = await prisma.restaurant.create({
                // data: {
                //     ...body,
                // }
            // })

            // return the new task
            return c.json({
                success: true,
                // restaurant
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
