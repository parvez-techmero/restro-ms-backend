import { Num, OpenAPIRoute } from "chanfana";
import { z } from "zod";
import { type AppContext } from "../../middleware/prisma-client";
import { updateRestaurantSchema } from "../../types";

export class RestaurantUpdate extends OpenAPIRoute {
    schema = {
        tags: ["Restaurant"],
        summary: "Update Restaurant",
        request: {
            body: {
                content: {
                    "application/json": {
                        schema: updateRestaurantSchema,
                    },
                },
            },
            params: z.object({
				id: Num(),
			}),
        },

        responses: {
            "200": {
                description: "Returns the updated Restaurant",
                content: {
                    "application/json": {
                        schema: z.object({
                            series: z.object({
                                success: z.boolean(),
                                restaurant: updateRestaurantSchema,
                            }),
                        }),
                    },
                },
            },
        },
    };

    async handle(c: AppContext) {
        // Get validated data
        console.log("Here");
        
        const { body, params } = await this.getValidatedData<typeof this.schema>();

        const { id } = params;  // Get the ID from the path parameters

        const prisma = c.get("prisma");
        try {            
            // Try to find the restaurant first
            const restaurant = await prisma.restaurant.findUnique({
                where: { id },
            });
    
            // If restaurant doesn't exist, return an error
            if (!restaurant) {
                return {
                    success: false,
                    message: "Restaurant not found",
                };
            }
    
            // Update the restaurant with the new data
            const updatedRestaurant = await prisma.restaurant.update({
                where: { id },
                data: body,
            });
    
            // Return the updated restaurant
            return {
                success: true,
                restaurant: updatedRestaurant,
            };
        } catch (error) {
            console.error("Error updating restaurant:", error);
            return c.json(
                {
                    error: 'Failed to update restaurant',
                    detail: error instanceof Error ? error.message : String(error),
                },
                500
            );
        }

    }
}
