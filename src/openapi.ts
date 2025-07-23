import { fromHono } from "chanfana";
import { Hono } from "hono";
import { RestaurantList } from "./routes/restaurant-endpoints/restaurantList";
import { RestaurantCreate } from "./routes/restaurant-endpoints/restaurantCreate";
import { globalConfig } from "./config/globalConfig";
import { RestaurantUpdate } from "./routes/restaurant-endpoints/restaurantUpdate";
import { RestaurantFetch } from "./routes/restaurant-endpoints/restaurantFetch";
import { RestaurantDelete } from "./routes/restaurant-endpoints/restaurantDelete";


export function setUpOpenAPI(app) {
    // Setup OpenAPI registry
    const openapi = fromHono(app, {
        docs_url: "/",
        // base: globalConfig.baseURL,
        // redoc_url: "/docs",
        
    });

    // Register OpenAPI endpoints
    openapi.get(`${globalConfig.baseURL}/restaurant`, RestaurantList);
    openapi.get(`${globalConfig.baseURL}/fetch-restaurant/:id`, RestaurantFetch);
    openapi.post(`${globalConfig.baseURL}/create-restaurant`, RestaurantCreate);
    openapi.put(`${globalConfig.baseURL}/update-restaurant/:id`, RestaurantUpdate);
    openapi.delete(`${globalConfig.baseURL}/delete-restaurant/:id`, RestaurantDelete);
    // openapi.delete("/tasks/:taskSlug", TaskDelete);

    return openapi;
}

