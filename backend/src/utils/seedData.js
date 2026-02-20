require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Product = require('../models/Product');

const products = [
  {
    title: 'Wireless Bluetooth Headphones',
    description: 'Premium noise-cancelling headphones with 30-hour battery life. Crystal clear sound quality with deep bass and comfortable ear cushions.',
    price: 8299,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
    category: 'Electronics',
    stock: 50,
  },
  {
    title: 'Smart Watch Pro',
    description: 'Advanced fitness tracking smartwatch with heart rate monitor, GPS, and water resistance. Compatible with iOS and Android.',
    price: 16599,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
    category: 'Electronics',
    stock: 30,
  },
  {
    title: 'Ergonomic Laptop Stand',
    description: 'Adjustable aluminum laptop stand for better posture and cooling. Compatible with all laptop sizes from 10 to 17 inches.',
    price: 4149,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500',
    category: 'Electronics',
    stock: 100,
  },
  {
    title: 'Designer Leather Backpack',
    description: 'Premium leather backpack with laptop compartment. Perfect for work or travel with multiple pockets and water-resistant coating.',
    price: 6639,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
    category: 'Fashion',
    stock: 45,
  },
  {
    title: 'Stainless Steel Coffee Maker',
    description: 'Programmable coffee maker with thermal carafe. Brews 12 cups and keeps coffee hot for hours. Easy to clean and maintain.',
    price: 10789,
    image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500',
    category: 'Home',
    stock: 25,
  },
  {
    title: 'LED Desk Lamp with USB Port',
    description: 'Modern LED desk lamp with adjustable brightness and color temperature. Built-in USB charging port for your devices.',
    price: 3319,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500',
    category: 'Home',
    stock: 60,
  },
  {
    title: 'Premium Yoga Mat',
    description: 'Extra thick non-slip yoga mat with carrying strap. Eco-friendly material, perfect for yoga, pilates, and floor exercises.',
    price: 2489,
    image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500',
    category: 'Sports',
    stock: 80,
  },
  {
    title: 'Portable Bluetooth Speaker',
    description: 'Waterproof portable speaker with 360-degree sound. 20-hour battery life and built-in microphone for hands-free calls.',
    price: 4979,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500',
    category: 'Electronics',
    stock: 70,
  },
  {
    title: 'Minimalist Phone Case',
    description: 'Slim protective case with shock absorption. Available in multiple colors with precise cutouts for all buttons and ports.',
    price: 1659,
    image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500',
    category: 'Electronics',
    stock: 200,
  },
  {
    title: 'Insulated Water Bottle',
    description: 'Double-wall vacuum insulated bottle keeps drinks cold for 24 hours or hot for 12 hours. BPA-free stainless steel.',
    price: 2074,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500',
    category: 'Sports',
    stock: 150,
  },
  {
    title: 'Mechanical Gaming Keyboard',
    description: 'RGB backlit mechanical keyboard with customizable keys. Cherry MX switches for ultimate gaming performance and durability.',
    price: 12449,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500',
    category: 'Electronics',
    stock: 40,
  },
  {
    title: 'Wireless Gaming Mouse',
    description: 'High-precision wireless mouse with 16000 DPI sensor. Ergonomic design with programmable buttons and RGB lighting.',
    price: 6639,
    image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=500',
    category: 'Electronics',
    stock: 55,
  },
  {
    title: 'USB-C Hub Adapter',
    description: '7-in-1 USB-C hub with HDMI, USB 3.0, SD card reader, and power delivery. Perfect for laptops and tablets.',
    price: 2904,
    image: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=500',
    category: 'Electronics',
    stock: 90,
  },
  {
    title: 'Wireless Earbuds Pro',
    description: 'True wireless earbuds with active noise cancellation. 8-hour battery life with charging case. IPX7 waterproof rating.',
    price: 10789,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500',
    category: 'Electronics',
    stock: 65,
  },
  {
    title: 'Canvas Tote Bag',
    description: 'Eco-friendly canvas tote bag with leather handles. Spacious interior perfect for shopping, beach, or everyday use.',
    price: 2489,
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500',
    category: 'Fashion',
    stock: 120,
  },
  {
    title: 'Stainless Steel Cookware Set',
    description: '10-piece professional cookware set with non-stick coating. Oven-safe up to 500°F. Dishwasher safe.',
    price: 16599,
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500',
    category: 'Home',
    stock: 30,
  },
  {
    title: 'Memory Foam Pillow',
    description: 'Ergonomic memory foam pillow with cooling gel layer. Hypoallergenic cover, perfect for side and back sleepers.',
    price: 3734,
    image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=500',
    category: 'Home',
    stock: 75,
  },
  {
    title: 'Resistance Bands Set',
    description: '5-piece resistance bands set with different resistance levels. Includes door anchor and carrying bag for home workouts.',
    price: 2074,
    image: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=500',
    category: 'Sports',
    stock: 100,
  },
  {
    title: 'Digital Kitchen Scale',
    description: 'Precision digital scale with LCD display. Measures up to 11 lbs with 0.1 oz accuracy. Tare function included.',
    price: 1659,
    image: 'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=500',
    category: 'Home',
    stock: 85,
  },
  {
    title: 'Fitness Tracker Band',
    description: 'Activity tracker with heart rate monitor, sleep tracking, and step counter. 7-day battery life, water-resistant.',
    price: 4149,
    image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500',
    category: 'Sports',
    stock: 95,
  },
];

const users = [
  {
    name: 'John Doe',
    email: 'user1@test.com',
    password: 'Test123!',
  },
  {
    name: 'Jane Smith',
    email: 'user2@test.com',
    password: 'Test123!',
  },
];

const seedData = async () => {
  try {
    await connectDB();

    console.log('Clearing existing data...');
    await User.deleteMany();
    await Product.deleteMany();

    console.log('Creating users...');
    const createdUsers = await User.create(users);
    console.log(`✓ Created ${createdUsers.length} users`);

    console.log('Creating products...');
    const createdProducts = await Product.create(products);
    console.log(`✓ Created ${createdProducts.length} products`);

    const user1 = createdUsers[0];
    user1.favorites = [createdProducts[0]._id, createdProducts[1]._id, createdProducts[4]._id];
    await user1.save();
    console.log(`✓ Added favorites for ${user1.name}`);

    console.log('\nDatabase seeded successfully!');
    console.log('\nTest Credentials:');
    console.log('Email: user1@test.com | Password: Test123!');
    console.log('Email: user2@test.com | Password: Test123!');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
