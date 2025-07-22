import { fromHono } from "chanfana";
import { Hono } from "hono";
import { TaskCreate } from "./endpoints/taskCreate";
import { TaskDelete } from "./endpoints/taskDelete";
import { TaskFetch } from "./endpoints/taskFetch";
import { TaskList } from "./endpoints/taskList";
import { getPrisma, Env } from "./middleware/prisma-client";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { RestaurantList } from "./routes/restaurant-endpoints/restaurantList";
import { RestaurantCreate } from "./routes/restaurant-endpoints/restaurantCreate";

// Start a Hono app
const app = new Hono<Env>();

app.use("*", getPrisma);

// Setup OpenAPI registry
const openapi = fromHono(app, {
	docs_url: "/",
});
// Routes with /api prefix (using route grouping)


// Register OpenAPI endpoints
openapi.get("/restaurant", RestaurantList);
openapi.post("/create-restaurant", RestaurantCreate);
// openapi.get("/api/tasks/:taskSlug", TaskFetch);
// openapi.delete("/api/tasks/:taskSlug", TaskDelete);
// openapi.route("/api", );

// You may also register routes for non OpenAPI directly on Hono
// app.get('/test', async (c) => {
//   const prisma = c.get('prisma')
//   try {
//     // console.log(Object.keys(prisma), "Prisma instance")
	
//     console.log(prisma.order.findMany, "Prisma instance")
//     const order = await prisma.order.findMany()
//     console.log(order, "Order result")

//     return c.json({
//       message: 'Hello, world!',
//       data: order,
//     })
//   } catch (err) {
//     console.error("Error fetching orders:", err)

//     return c.json(
//       {
//         error: 'Failed to fetch orders',
//         detail: err instanceof Error ? err.message : String(err),
//       },
//       500
//     )
//   }
// })


// Export the Hono app
export default app;
