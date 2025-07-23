import { DateTime, Str } from "chanfana";
import type { Context } from "hono";
import { z } from "zod";


// export const Task = z.object({
// 	name: Str({ example: "lorem" }),
// 	slug: Str(),
// 	description: Str({ required: false }),
// 	completed: z.boolean().default(false),
// 	due_date: DateTime(),
// });

// Base schemas for common fields
const idSchema = z.number().int().positive();
const timestampSchema = z.date();
const optionalStringSchema = z.string().optional();
const statusSchema = z.string().default("active");

// Restaurant schemas
export const createRestaurantSchema = z.object({
  name: z.string().min(1, "Restaurant name is required").max(255),
  location: z.string().min(1, "Location is required").max(255),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  password: z.string(),
  opening_hours: z.string().optional(),
  status: statusSchema.optional(),
});

export const updateRestaurantSchema = createRestaurantSchema.partial();

export const restaurantSchema = createRestaurantSchema.extend({
  id: idSchema,
  createdAt: timestampSchema,
  updatedAt: timestampSchema,
});

// User schemas
export const createUserSchema = z.object({
  restaurantId: idSchema,
  role: z.enum(['superadmin', 'admin', 'waiter', 'chef', 'manager']),
  name: z.string().min(1, "Name is required").max(255),
  email: z.string().email("Invalid email format"),
  // passwordHash: z.string().min(1, "Password hash is required"),
  phone: z.string().optional(),
  status: statusSchema.optional(),
});

export const updateUserSchema = createUserSchema.partial()

export const userSchema = createUserSchema.extend({
  id: idSchema,
  createdAt: timestampSchema,
  updatedAt: timestampSchema,
});

// Password update schema
export const updateUserPasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
});

// Category schemas
export const createCategorySchema = z.object({
  restaurantId: idSchema,
  name: z.string().min(1, "Category name is required").max(255),
  description: z.string().optional(),
  displayOrder: z.number().int().min(0).optional(),
});

export const updateCategorySchema = createCategorySchema.partial().omit({ restaurantId: true });

export const categorySchema = createCategorySchema.extend({
  id: idSchema,
  createdAt: timestampSchema,
  updatedAt: timestampSchema,
});

// MenuItem schemas
export const createMenuItemSchema = z.object({
  restaurantId: idSchema,
  categoryId: idSchema,
  name: z.string().min(1, "Item name is required").max(255),
  description: z.string().optional(),
  price: z.number().positive("Price must be positive").multipleOf(0.01),
  imageUrl: z.string().url().optional().or(z.literal("")),
  isAvailable: z.boolean().default(true).optional(),
});

export const updateMenuItemSchema = createMenuItemSchema.partial().omit({ restaurantId: true });

export const menuItemSchema = createMenuItemSchema.extend({
  id: idSchema,
  createdAt: timestampSchema,
  updatedAt: timestampSchema,
});

// Table schemas
export const createTableSchema = z.object({
  restaurantId: idSchema,
  tableNumber: z.string().min(1, "Table number is required").max(50),
  capacity: z.number().int().positive("Capacity must be positive"),
  location: z.string().optional(),
  status: z.enum(['available', 'occupied', 'reserved', 'maintenance']).default("available").optional(),
});

export const updateTableSchema = createTableSchema.partial().omit({ restaurantId: true });

export const tableSchema = createTableSchema.extend({
  id: idSchema,
  createdAt: timestampSchema,
  updatedAt: timestampSchema,
});

// Reservation schemas
export const createReservationSchema = z.object({
  restaurantId: idSchema,
  tableId: idSchema,
  customerName: z.string().min(1, "Customer name is required").max(255),
  customerPhone: z.string().min(1, "Customer phone is required").max(20),
  reservationTime: z.date().min(new Date(), "Reservation time must be in the future"),
  guestCount: z.number().int().positive("Guest count must be positive"),
  status: z.enum(['pending', 'confirmed', 'cancelled', 'completed', 'no-show']).default("pending").optional(),
});

export const updateReservationSchema = createReservationSchema.partial().omit({ restaurantId: true });

export const reservationSchema = createReservationSchema.extend({
  id: idSchema,
  createdAt: timestampSchema,
  updatedAt: timestampSchema,
});

// Order schemas
export const createOrderSchema = z.object({
  restaurantId: idSchema,
  tableId: idSchema.optional(),
  userId: idSchema,
  customerName: z.string().optional(),
  orderType: z.enum(['dine-in', 'takeaway', 'delivery']),
  status: z.enum(['pending', 'confirmed', 'preparing', 'ready', 'served', 'completed', 'cancelled']).default("pending").optional(),
  totalAmount: z.number().nonnegative("Total amount cannot be negative").multipleOf(0.01),
});

export const updateOrderSchema = createOrderSchema.partial().omit({ restaurantId: true, userId: true });

export const orderSchema = createOrderSchema.extend({
  id: idSchema,
  createdAt: timestampSchema,
  updatedAt: timestampSchema,
});

// OrderItem schemas
export const createOrderItemSchema = z.object({
  orderId: idSchema,
  menuItemId: idSchema,
  quantity: z.number().int().positive("Quantity must be positive"),
  price: z.number().positive("Price must be positive").multipleOf(0.01),
  notes: z.string().optional(),
});

export const updateOrderItemSchema = createOrderItemSchema.partial();

export const orderItemSchema = createOrderItemSchema.extend({
  id: idSchema,
  createdAt: timestampSchema,
  updatedAt: timestampSchema,
});

// ActivityLog schemas
export const createActivityLogSchema = z.object({
  userId: idSchema,
  restaurantId: idSchema,
  actionType: z.string().min(1, "Action type is required").max(100),
  actionData: z.string().optional(),
});

export const activityLogSchema = createActivityLogSchema.extend({
  id: idSchema,
  timestamp: timestampSchema,
});

// Query parameter schemas
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

export const restaurantQuerySchema = z.object({
  status: z.enum(['active', 'inactive']).optional(),
  search: z.string().optional(),
}).merge(paginationSchema);

export const userQuerySchema = z.object({
  role: z.enum(['superadmin', 'admin', 'waiter', 'chef', 'manager']).optional(),
  status: z.enum(['active', 'inactive']).optional(),
  restaurantId: idSchema.optional(),
  search: z.string().optional(),
}).merge(paginationSchema);

export const menuItemQuerySchema = z.object({
  categoryId: idSchema.optional(),
  isAvailable: z.coerce.boolean().optional(),
  restaurantId: idSchema.optional(),
  search: z.string().optional(),
  minPrice: z.coerce.number().positive().optional(),
  maxPrice: z.coerce.number().positive().optional(),
}).merge(paginationSchema);

export const tableQuerySchema = z.object({
  status: z.enum(['available', 'occupied', 'reserved', 'maintenance']).optional(),
  restaurantId: idSchema.optional(),
  capacity: z.coerce.number().int().positive().optional(),
}).merge(paginationSchema);

export const reservationQuerySchema = z.object({
  status: z.enum(['pending', 'confirmed', 'cancelled', 'completed', 'no-show']).optional(),
  restaurantId: idSchema.optional(),
  tableId: idSchema.optional(),
  date: z.coerce.date().optional(),
  customerPhone: z.string().optional(),
}).merge(paginationSchema);

export const orderQuerySchema = z.object({
  status: z.enum(['pending', 'confirmed', 'preparing', 'ready', 'served', 'completed', 'cancelled']).optional(),
  orderType: z.enum(['dine-in', 'takeaway', 'delivery']).optional(),
  restaurantId: idSchema.optional(),
  tableId: idSchema.optional(),
  userId: idSchema.optional(),
  date: z.coerce.date().optional(),
}).merge(paginationSchema);

export const activityLogQuerySchema = z.object({
  userId: idSchema.optional(),
  restaurantId: idSchema.optional(),
  actionType: z.string().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
}).merge(paginationSchema);

// Response schemas with relations
export const restaurantWithRelationsSchema = restaurantSchema.extend({
  users: z.array(userSchema).optional(),
  categories: z.array(categorySchema).optional(),
  menuItems: z.array(menuItemSchema).optional(),
  tables: z.array(tableSchema).optional(),
  reservations: z.array(reservationSchema).optional(),
  orders: z.array(orderSchema).optional(),
  _count: z.object({
    users: z.number(),
    categories: z.number(),
    menuItems: z.number(),
    tables: z.number(),
    reservations: z.number(),
    orders: z.number(),
  }).optional(),
});

export const orderWithItemsSchema = orderSchema.extend({
  orderItems: z.array(orderItemSchema.extend({
    menuItem: menuItemSchema.optional(),
  })).optional(),
  table: tableSchema.optional(),
  user: userSchema.optional(),
});

export const menuItemWithCategorySchema = menuItemSchema.extend({
  category: categorySchema.optional(),
});

export const reservationWithDetailsSchema = reservationSchema.extend({
  table: tableSchema.optional(),
  restaurant: restaurantSchema.pick({ name: true, phone: true }).optional(),
});

// Validation helper functions
export const validateId = (id: unknown) => idSchema.parse(id);

export const validateEmail = (email: string) => z.string().email().parse(email);

export const validatePhone = (phone: string) => 
  z.string().regex(/^[\+]?[\d\s\-\(\)]{7,15}$/, "Invalid phone number format").parse(phone);

export const validatePrice = (price: number) => 
  z.number().positive().multipleOf(0.01).parse(price);

// Type exports
export type Restaurant = z.infer<typeof restaurantSchema>;
export type CreateRestaurant = z.infer<typeof createRestaurantSchema>;
export type UpdateRestaurant = z.infer<typeof updateRestaurantSchema>;

export type User = z.infer<typeof userSchema>;
export type CreateUser = z.infer<typeof createUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;

export type Category = z.infer<typeof categorySchema>;
export type CreateCategory = z.infer<typeof createCategorySchema>;
export type UpdateCategory = z.infer<typeof updateCategorySchema>;

export type MenuItem = z.infer<typeof menuItemSchema>;
export type CreateMenuItem = z.infer<typeof createMenuItemSchema>;
export type UpdateMenuItem = z.infer<typeof updateMenuItemSchema>;

export type Table = z.infer<typeof tableSchema>;
export type CreateTable = z.infer<typeof createTableSchema>;
export type UpdateTable = z.infer<typeof updateTableSchema>;

export type Reservation = z.infer<typeof reservationSchema>;
export type CreateReservation = z.infer<typeof createReservationSchema>;
export type UpdateReservation = z.infer<typeof updateReservationSchema>;

export type Order = z.infer<typeof orderSchema>;
export type CreateOrder = z.infer<typeof createOrderSchema>;
export type UpdateOrder = z.infer<typeof updateOrderSchema>;

export type OrderItem = z.infer<typeof orderItemSchema>;
export type CreateOrderItem = z.infer<typeof createOrderItemSchema>;
export type UpdateOrderItem = z.infer<typeof updateOrderItemSchema>;

export type ActivityLog = z.infer<typeof activityLogSchema>;
export type CreateActivityLog = z.infer<typeof createActivityLogSchema>;

export type PaginationQuery = z.infer<typeof paginationSchema>;
export type RestaurantQuery = z.infer<typeof restaurantQuerySchema>;
export type UserQuery = z.infer<typeof userQuerySchema>;
export type MenuItemQuery = z.infer<typeof menuItemQuerySchema>;
export type TableQuery = z.infer<typeof tableQuerySchema>;
export type ReservationQuery = z.infer<typeof reservationQuerySchema>;
export type OrderQuery = z.infer<typeof orderQuerySchema>;
export type ActivityLogQuery = z.infer<typeof activityLogQuerySchema>;
