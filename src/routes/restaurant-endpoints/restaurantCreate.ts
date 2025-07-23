import { Bool, OpenAPIRoute } from "chanfana";
import { z } from "zod";
import { type AppContext } from "../../middleware/prisma-client";
import { createRestaurantSchema } from "../../types";

export class RestaurantCreate extends OpenAPIRoute {
    schema = {
        tags: ["Restaurant"],
        summary: "Create a new Restaurant",
        request: {
            body: {
                content: {
                    "application/json": {
                        schema: createRestaurantSchema,
                    },
                },
                // required: true,
            },
        },
        responses: {
            "200": {
                description: "Returns the created Restaurant",
                content: {
                    "application/json": {
                        schema: z.object({
                            series: z.object({
                                success: Bool(),
                                // result: z.object({
                                    restaurant: createRestaurantSchema,
                                // }),
                            }),
                        }),
                    },
                },
            },
        },
    };

    async handle(c: AppContext) {
        // Get validated data
        const { body } = await this.getValidatedData<typeof this.schema>();
        //  const data = await c.req.valid(schema);
          // Helper function to ensure proper typing

        // const data = await c.req.json();
        const prisma = c.get('prisma')
        const restaurant = await prisma.restaurant.create({
            data:body
        })


        // Implement your own object insertion here

        // return the new task
        return {
            success: true,
            restaurant
        };
    }
}
