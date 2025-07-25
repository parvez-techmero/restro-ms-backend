import { fromHono } from "chanfana";
import { Hono } from "hono";
import { RestaurantList } from "./routes/restaurant-endpoints/restaurantList";
import { RestaurantCreate } from "./routes/restaurant-endpoints/restaurantCreate";
import { globalConfig } from "./config/globalConfig";
import { RestaurantUpdate } from "./routes/restaurant-endpoints/restaurantUpdate";
import { RestaurantFetch } from "./routes/restaurant-endpoints/restaurantFetch";
import { RestaurantDelete } from "./routes/restaurant-endpoints/restaurantDelete";
import { LoginRoute } from "./routes/auth-endpoints/login";
import { authMiddleware } from "./middleware/auth";
import { MenuItemList } from "./routes/menu-items-endpoints/menuList";


export function setUpOpenAPI(app) {
    // Setup OpenAPI registry
    const openapi = fromHono(app, {
        docs_url: "/",
        // base: globalConfig.baseURL,
        // redoc_url: "/docs",
        schema: {
            info: {
                title: "Restaurant Management API",
                version: "1.0.0",
                description: "API for restaurant management system",
            },

            // security: [
            //     {
            //         bearerAuth: [],

            //     },
            // ],

        }

    });
    openapi.registry.registerComponent('securitySchemes', 'bearerAuth', {
        type: 'http',
        scheme: 'bearer',
    })

    // Auth 
    openapi.post(`${globalConfig.baseURL}/login`, LoginRoute);

    // Menu Item OpenAPI endpoints
    openapi.get(`${globalConfig.baseURL}/menu-items`, MenuItemList);

    openapi.use(`/api/*`, authMiddleware)

    // Register OpenAPI endpoints
    openapi.get(`${globalConfig.baseURL}/restaurant`, RestaurantList);
    openapi.get(`${globalConfig.baseURL}/fetch-restaurant/:id`, RestaurantFetch);
    openapi.post(`${globalConfig.baseURL}/create-restaurant`, RestaurantCreate);
    openapi.put(`${globalConfig.baseURL}/update-restaurant/:id`, RestaurantUpdate);
    openapi.delete(`${globalConfig.baseURL}/delete-restaurant/:id`, RestaurantDelete);



    return openapi;
}

