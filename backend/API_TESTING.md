# API Testing Guide

Quick guide to test all endpoints using curl or any API client (Postman, Thunder Client, etc.)

## Base URL
```
http://localhost:5000
```

## 1. Health Check

```bash
curl http://localhost:5000/
```

## 2. Register User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "Test123!"
  }'
```

## 3. Login User

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user1@test.com",
    "password": "Test123!"
  }'
```

**Save the token from response for authenticated requests!**

## 4. Get Current User

```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 5. Get All Products

```bash
# Basic
curl http://localhost:5000/api/products

# With search
curl "http://localhost:5000/api/products?search=headphones"

# With pagination
curl "http://localhost:5000/api/products?page=1&limit=5"

# With category filter
curl "http://localhost:5000/api/products?category=Electronics"

# Combined
curl "http://localhost:5000/api/products?search=watch&category=Electronics&page=1&limit=10"
```

## 6. Get Single Product

```bash
curl http://localhost:5000/api/products/PRODUCT_ID_HERE
```

## 7. Add to Favorites

```bash
curl -X POST http://localhost:5000/api/favorites/PRODUCT_ID_HERE \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 8. Get User Favorites

```bash
curl http://localhost:5000/api/favorites \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 9. Remove from Favorites

```bash
curl -X DELETE http://localhost:5000/api/favorites/PRODUCT_ID_HERE \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Testing Workflow

1. Start MongoDB (local or Atlas)
2. Run seed script: `npm run seed`
3. Start server: `npm run dev`
4. Login with test credentials
5. Copy the JWT token
6. Test protected endpoints with the token

## Test Credentials

```
User 1:
Email: user1@test.com
Password: Test123!

User 2:
Email: user2@test.com
Password: Test123!
```

## Expected Response Formats

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message"
}
```

## Status Codes

- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Server Error
