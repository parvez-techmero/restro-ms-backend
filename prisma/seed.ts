import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { globalConfig } from '../src/config/globalConfig'

  const prisma = new PrismaClient({
    datasourceUrl: globalConfig.DATABASE_URL,
  }).$extends(withAccelerate())

async function main() {
  // Create one Restaurant
  const restaurant = await prisma.restaurant.create({
    data: {
      name: "Demo Resto",
      location: "123 Main St, Your City",
      phone: "1234567890",
      email: "info@demoresto.com",
      password: "1234",
      opening_hours: "10:00-22:00",
    }
  });

  // Create Categories
  const categoriesData = [
    { name: 'Pizza', description: 'Delicious pizzas', restaurantId: restaurant.id },
    { name: 'Burger', description: 'Juicy burgers', restaurantId: restaurant.id },
    { name: 'Pasta', description: 'Tasty pastas', restaurantId: restaurant.id },
    { name: 'Salad', description: 'Healthy salads', restaurantId: restaurant.id },
    { name: 'Dessert', description: 'Sweet treats', restaurantId: restaurant.id },
    { name: 'Beverage', description: 'Refreshing drinks', restaurantId: restaurant.id },
  ];
  const categories = {};
  for (const catData of categoriesData) {
    const cat = await prisma.category.create({ data: catData });
    categories[cat.name] = cat.id;
  }

  // Insert Menu Items
  const menuItemsData = [
    {
      name: 'Margherita Pizza',
      categoryId: categories['Pizza'],
      price: 12.99,
      description: 'Classic pizza with tomato sauce, mozzarella cheese, and fresh basil',
      ingredients: 'Tomato sauce, mozzarella cheese, fresh basil, olive oil',
      servesPeople: '2',
      spiceLevel: 'Mild',
      allergens: 'Dairy, Gluten',
      isAvailable: true,
      similarItems: 'Cheese Pizza,Vegetarian Pizza',
      createdAt: new Date('2025-07-14T06:24:16'),
      restaurantId: restaurant.id
    },
    {
      name: 'Pepperoni Pizza',
      categoryId: categories['Pizza'],
      price: 15.99,
      description: 'Traditional pepperoni pizza with mozzarella cheese',
      ingredients: 'Tomato sauce, mozzarella cheese, pepperoni, oregano',
      servesPeople: '2',
      spiceLevel: 'Mild',
      allergens: 'Dairy, Gluten, Pork',
      isAvailable: true,
      similarItems: 'Margherita Pizza,Meat Lovers Pizza',
      createdAt: new Date('2025-07-14T06:24:16'),
      restaurantId: restaurant.id
    },
    {
      name: 'Meat Lovers Pizza',
      categoryId: categories['Pizza'],
      price: 18.99,
      description: 'Loaded with pepperoni, sausage, ham, and bacon',
      ingredients: 'Tomato sauce, mozzarella, pepperoni, sausage, ham, bacon',
      servesPeople: '3',
      spiceLevel: 'Medium',
      allergens: 'Dairy, Gluten, Pork',
      isAvailable: true,
      similarItems: 'Pepperoni Pizza,BBQ Chicken Pizza',
      createdAt: new Date('2025-07-14T06:24:16'),
      restaurantId: restaurant.id
    },
    {
      name: 'Vegetarian Supreme',
      categoryId: categories['Pizza'],
      price: 16.99,
      description: 'Fresh vegetables with mozzarella cheese',
      ingredients: 'Tomato sauce, mozzarella, bell peppers, mushrooms, onions, olives',
      servesPeople: '2',
      spiceLevel: 'Mild',
      allergens: 'Dairy, Gluten',
      isAvailable: true,
      similarItems: 'Margherita Pizza,Mediterranean Pizza',
      createdAt: new Date('2025-07-14T06:24:16'),
      restaurantId: restaurant.id
    },
    {
      name: 'Classic Cheeseburger',
      categoryId: categories['Burger'],
      price: 10.99,
      description: 'Beef patty with cheese, lettuce, tomato, and pickles',
      ingredients: 'Beef patty, cheese, lettuce, tomato, pickles, mayo',
      servesPeople: '1',
      spiceLevel: 'Mild',
      allergens: 'Dairy, Gluten',
      isAvailable: true,
      similarItems: 'Bacon Cheeseburger,BBQ Burger',
      createdAt: new Date('2025-07-14T06:24:16'),
      restaurantId: restaurant.id
    },
    {
      name: 'Bacon Cheeseburger',
      categoryId: categories['Burger'],
      price: 12.99,
      description: 'Cheeseburger with crispy bacon',
      ingredients: 'Beef patty, cheese, bacon, lettuce, tomato, pickles',
      servesPeople: '1',
      spiceLevel: 'Mild',
      allergens: 'Dairy, Gluten, Pork',
      isAvailable: true,
      similarItems: 'Classic Cheeseburger,Double Burger',
      createdAt: new Date('2025-07-14T06:24:16'),
      restaurantId: restaurant.id
    },
    {
      name: 'Chicken Burger',
      categoryId: categories['Burger'],
      price: 11.99,
      description: 'Grilled chicken breast with mayo and lettuce',
      ingredients: 'Chicken breast, mayo, lettuce, tomato, onion',
      servesPeople: '1',
      spiceLevel: 'Mild',
      allergens: 'Dairy, Gluten',
      isAvailable: true,
      similarItems: 'Turkey Burger,Fish Burger',
      createdAt: new Date('2025-07-14T06:24:16'),
      restaurantId: restaurant.id
    },
    {
      name: 'Spaghetti Carbonara',
      categoryId: categories['Pasta'],
      price: 14.99,
      description: 'Creamy pasta with bacon and parmesan',
      ingredients: 'Spaghetti, eggs, bacon, parmesan cheese, black pepper',
      servesPeople: '1',
      spiceLevel: 'Mild',
      allergens: 'Dairy, Gluten, Eggs, Pork',
      isAvailable: true,
      similarItems: 'Fettuccine Alfredo,Pasta Bolognese',
      createdAt: new Date('2025-07-14T06:24:16'),
      restaurantId: restaurant.id
    },
    {
      name: 'Fettuccine Alfredo',
      categoryId: categories['Pasta'],
      price: 13.99,
      description: 'Rich and creamy fettuccine pasta',
      ingredients: 'Fettuccine, butter, cream, parmesan cheese, garlic',
      servesPeople: '1',
      spiceLevel: 'Mild',
      allergens: 'Dairy, Gluten',
      isAvailable: true,
      similarItems: 'Spaghetti Carbonara,Chicken Alfredo',
      createdAt: new Date('2025-07-14T06:24:16'),
      restaurantId: restaurant.id
    },
    {
      name: 'Pasta Bolognese',
      categoryId: categories['Pasta'],
      price: 15.99,
      description: 'Traditional meat sauce with spaghetti',
      ingredients: 'Spaghetti, ground beef, tomato sauce, onions, herbs',
      servesPeople: '1',
      spiceLevel: 'Medium',
      allergens: 'Gluten',
      isAvailable: true,
      similarItems: 'Spaghetti Carbonara,Meat Lasagna',
      createdAt: new Date('2025-07-14T06:24:16'),
      restaurantId: restaurant.id
    },
    {
      name: 'Caesar Salad',
      categoryId: categories['Salad'],
      price: 8.99,
      description: 'Fresh romaine lettuce with caesar dressing',
      ingredients: 'Romaine lettuce, caesar dressing, croutons, parmesan',
      servesPeople: '1',
      spiceLevel: 'Mild',
      allergens: 'Dairy, Gluten',
      isAvailable: true,
      similarItems: 'Garden Salad,Greek Salad',
      createdAt: new Date('2025-07-14T06:24:16'),
      restaurantId: restaurant.id
    },
    {
      name: 'Greek Salad',
      categoryId: categories['Salad'],
      price: 9.99,
      description: 'Mediterranean salad with feta cheese',
      ingredients: 'Mixed greens, feta cheese, olives, tomatoes, cucumber',
      servesPeople: '1',
      spiceLevel: 'Mild',
      allergens: 'Dairy',
      isAvailable: true,
      similarItems: 'Caesar Salad,Mediterranean Bowl',
      createdAt: new Date('2025-07-14T06:24:16'),
      restaurantId: restaurant.id
    },
    {
      name: 'Chocolate Cake',
      categoryId: categories['Dessert'],
      price: 6.99,
      description: 'Rich chocolate layer cake',
      ingredients: 'Chocolate, flour, eggs, butter, sugar',
      servesPeople: '2',
      spiceLevel: 'Sweet',
      allergens: 'Dairy, Gluten, Eggs',
      isAvailable: true,
      similarItems: 'Cheesecake,Tiramisu',
      createdAt: new Date('2025-07-14T06:24:16'),
      restaurantId: restaurant.id
    },
    {
      name: 'Cheesecake',
      categoryId: categories['Dessert'],
      price: 7.99,
      description: 'New York style cheesecake',
      ingredients: 'Cream cheese, graham crackers, eggs, sugar',
      servesPeople: '2',
      spiceLevel: 'Sweet',
      allergens: 'Dairy, Gluten, Eggs',
      isAvailable: true,
      similarItems: 'Chocolate Cake,Apple Pie',
      createdAt: new Date('2025-07-14T06:24:16'),
      restaurantId: restaurant.id
    },
    {
      name: 'Coca Cola',
      categoryId: categories['Beverage'],
      price: 2.99,
      description: 'Classic cola drink',
      ingredients: 'Carbonated water, sugar, caffeine',
      servesPeople: '1',
      spiceLevel: 'None',
      allergens: 'None',
      isAvailable: true,
      similarItems: 'Pepsi,Sprite',
      createdAt: new Date('2025-07-14T06:24:16'),
      restaurantId: restaurant.id
    },
    {
      name: 'Fresh Orange Juice',
      categoryId: categories['Beverage'],
      price: 3.99,
      description: 'Freshly squeezed orange juice',
      ingredients: 'Fresh oranges',
      servesPeople: '1',
      spiceLevel: 'None',
      allergens: 'None',
      isAvailable: true,
      similarItems: 'Apple Juice,Lemonade',
      createdAt: new Date('2025-07-14T06:24:16'),
      restaurantId: restaurant.id
    },
  ]
  await prisma.menuItem.createMany({ data: menuItemsData });
//   for (const item of menuItemsData) {
//     await prisma.menuItem.create({
//       data: {
//         name: item.name,
//         price: item.price,
//         description: item.description,
//         ingredients: item.ingredients,
//         servesPeople: item.servesPeople,
//         spiceLevel: item.spiceLevel,
//         allergens: item.allergens,
//         similarItems: item.similarItems,
//         restaurantId: restaurant.id,
//         categoryId: item.categoryId,
//         createdAt: new Date('2025-07-14T06:24:16'),
//       },
//     });
//   }
  console.log('Dummy data seeded successfully!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect() })
