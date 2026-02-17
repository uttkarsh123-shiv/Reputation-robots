# Micro Marketplace - Backend API

RESTful API for the Micro Marketplace application built with Node.js, Express, and MongoDB.

## Features

- JWT Authentication
- Product CRUD operations
- Search & Pagination
- Favorites management
- Input validation
- Password hashing

## Tech Stack

- Node.js & Express
- MongoDB & Mongoose
- JWT for authentication
- bcryptjs for password hashing
- express-validator for input validation

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Seed the database:
```bash
npm run seed
```

4. Start the server:
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Server will run on `http://localhost:5000`

## API Endpoints

### Authentication

#### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123!"
}

Response: 201 Created
{
  "success": true,
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### Login User
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "Password123!"
}

Response: 200 OK
{
  "success": true,
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### Get Current User
```
GET /api/auth/me
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "user": {
    "id": "user-id",
    "name": "John Doe",
    "email": "john@example.com",
    "favorites": ["product-id-1", "product-id-2"]
  }
}
```

### Products

#### Get All Products
```
GET /api/products?search=laptop&page=1&limit=20

Response: 200 OK
{
  "success": true,
  "count": 10,
  "total": 50,
  "page": 1,
  "totalPages": 3,
  "products": [...]
}
```

#### Get Single Product
```
GET /api/products/:id

Response: 200 OK
{
  "success": true,
  "product": {
    "id": "product-id",
    "title": "Wireless Headphones",
    "price": 99.99,
    "description": "...",
    "image": "https://...",
    "category": "Electronics"
  }
}
```

### Favorites

#### Add to Favorites
```
POST /api/favorites/:productId
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "message": "Product added to favorites",
  "favorites": ["product-id-1", "product-id-2"]
}
```

#### Remove from Favorites
```
DELETE /api/favorites/:productId
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "message": "Product removed from favorites",
  "favorites": ["product-id-1"]
}
```

#### Get User Favorites
```
GET /api/favorites
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "count": 2,
  "favorites": [...]
}
```

## Test Credentials

After running the seed script, use these credentials:

```
User 1:
Email: user1@test.com
Password: Test123!

User 2:
Email: user2@test.com
Password: Test123!
```

## Error Handling

All errors follow this format:
```json
{
  "success": false,
  "error": "Error message here"
}
```

Common status codes:
- 200: Success
- 201: Created
- 400: Bad Request (validation error)
- 401: Unauthorized
- 404: Not Found
- 500: Server Error

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── db.js              # Database connection
│   ├── models/
│   │   ├── User.js            # User model
│   │   └── Product.js         # Product model
│   ├── routes/
│   │   ├── auth.js            # Auth routes
│   │   ├── products.js        # Product routes
│   │   └── favorites.js       # Favorites routes
│   ├── middleware/
│   │   ├── auth.js            # JWT authentication
│   │   └── errorHandler.js   # Error handling
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   └── favoriteController.js
│   ├── utils/
│   │   └── seedData.js        # Database seeding
│   └── server.js              # Entry point
├── .env                       # Environment variables
├── .env.example              # Example env file
├── package.json
└── README.md
```

## License

ISC
