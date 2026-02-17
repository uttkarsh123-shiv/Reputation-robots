require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Product = require('../models/Product');

// Sample products data
const products = [
  {
    title: 'Wireless Bluetooth Headphones',
    description: 'Premium noise-cancelling headphones with 30-hour battery life. Crystal clear sound quality with deep bass and comfortable ear cushions.',
    price: 99.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
    category: 'Electronics',
    stock: 50,
  },
  {
    title: 'Smart Watch Pro',
    description: 'Advanced fitness tracking smartwatch with heart rate monitor, GPS, and water resistance. Compatible with iOS and Android.',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
    category: 'Electronics',
    stock: 30,
  },
  {
    title: 'Ergonomic Laptop Stand',
    description: 'Adjustable aluminum laptop stand for better posture and cooling. Compatible with all laptop sizes from 10 to 17 inches.',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500',
    category: 'Electronics',
    stock: 100,
  },
  {
    title: 'Designer Leather Backpack',
    description: 'Premium leather backpack with laptop compartment. Perfect for work or travel with multiple pockets and water-resistant coating.',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
    category: 'Fashion',
    stock: 45,
  },
  {
    title: 'Stainless Steel Coffee Maker',
    description: 'Programmable coffee maker with thermal carafe. Brews 12 cups and keeps coffee hot for hours. Easy to clean and maintain.',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500',
    category: 'Home',
    stock: 25,
  },
  {
    title: 'LED Desk Lamp with USB Port',
    description: 'Modern LED desk lamp with adjustable brightness and color temperature. Built-in USB charging port for your devices.',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500',
    category: 'Home',
    stock: 60,
  },
  {
    title: 'Premium Yoga Mat',
    description: 'Extra thick non-slip yoga mat with carrying strap. Eco-friendly material, perfect for yoga, pilates, and floor exercises.',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500',
    category: 'Sports',
    stock: 80,
  },
  {
    title: 'Portable Bluetooth Speaker',
    description: 'Waterproof portable speaker with 360-degree sound. 20-hour battery life and built-in microphone for hands-free calls.',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500',
    category: 'Electronics',
    stock: 70,
  },
  {
    title: 'Minimalist Phone Case',
    description: 'Slim protective case with shock absorption. Available in multiple colors with precise cutouts for all buttons and ports.',
    price: 19.99,
    image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500',
    category: 'Electronics',
    stock: 200,
  },
  {
    title: 'Insulated Water Bottle',
    description: 'Double-wall vacuum insulated bottle keeps drinks cold for 24 hours or hot for 12 hours. BPA-free stainless steel.',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500',
    category: 'Sports',
    stock: 150,
  },
];

// Sample users data
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

// Seed function
const seedData = async () => {
  try {
    // Connect to database
    await connectDB();

    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany();
    await Product.deleteMany();

    // Insert users
    console.log('Creating users...');
    const createdUsers = await User.create(users);
    console.log(`✓ Created ${createdUsers.length} users`);

    // Insert products
    console.log('Creating products...');
    const createdProducts = await Product.create(products);
    console.log(`✓ Created ${createdProducts.length} products`);

    // Add some favorites to first user
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

// Run seed function
seedData();
