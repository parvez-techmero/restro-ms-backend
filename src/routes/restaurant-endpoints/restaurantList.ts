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
							// series: z.object({
								success: Bool(),
								// result: z.object({
									data: restaurantSchema.array(),
								// }),
							}),
						// }),
					},
				},
			},
		},
	};

	async handle(c: AppContext) {
		// Get validated data
		// const data = await this.getValidatedData<typeof this.schema>();
		const prisma = c.get('prisma')
		try {
			const restaurant = await prisma.restaurant.findMany()

			return {
				success: true,
				data: restaurant
			};
		} catch (err) {
			console.error("Error fetching orders:", err)

			return c.json(
				{
					error: 'Failed to fetch orders',
					detail: err instanceof Error ? err.message : String(err),
				},
				500
			)
		}
	}
}
