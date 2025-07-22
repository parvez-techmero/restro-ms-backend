import { Bool, Num, OpenAPIRoute } from "chanfana";
import { z } from "zod";
import { type AppContext } from "../../middleware/prisma-client";
import { restaurantSchema } from "../../types";

export class RestaurantList extends OpenAPIRoute {
	schema = {
		tags: ["Restaurant"],
		summary: "List Restaurant",
		responses: {
			"200": {
				description: "Returns a list of Restaurant",
				content: {
					"application/json": {
						schema: z.object({
							series: z.object({
								success: Bool(),
								result: z.object({
									tasks: restaurantSchema.array(),
								}),
							}),
						}),
					},
				},
			},
		},
	};

	async handle(c: AppContext) {
		// Get validated data
		// const data = await this.getValidatedData<typeof this.schema>();
        const prisma = c.get('prisma')
        const restaurant = await prisma.restaurant.findMany()

		// Implement your own object list here

		return {
			success: true,
            data: restaurant
		};
	}
}
