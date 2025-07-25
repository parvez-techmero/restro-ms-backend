import { Hono } from "hono";
import { getPrisma, Env } from "./middleware/prisma-client";
import { setUpOpenAPI } from "./openapi";
import { globalConfig } from "./config/globalConfig";
// import { seeders } from '../prisma/seed'
import { cors } from 'hono/cors'

// Start a Hono app
const app = new Hono<Env>();

app.use("*", getPrisma);
// Routes with /api prefix (using route grouping)
const openapi = setUpOpenAPI(app);

// app.route(globalConfig.baseURL, openapi);

app.use('*', async (c, next) => {
  const middleware = cors({
    origin: "*",
  })
  return middleware(c, next)
})


// You may also register routes for non OpenAPI directly on Hono
app.get('/seed', async (c) => {
	const prisma = c.get('prisma')
	try {
		// console.log(Object.keys(prisma), "Prisma instance")


		return c.json({
			message: 'Hello, world!',
		})
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
})


// Export the Hono app
export default app;
