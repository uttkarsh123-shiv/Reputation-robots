# Micro Marketplace App - System Design

## 1. High-Level Architecture

```
┌─────────────────┐         ┌─────────────────┐
│   Web Client    │         │  Mobile Client  │
│   (React)       │         │ (React Native)  │
└────────┬────────┘         └────────┬────────┘
         │                           │
         └───────────┬───────────────┘
                     │ HTTPS/REST
         ┌───────────▼───────────┐
         │   Backend API Server  │
         │  (Node.js + Express)  │
         └───────────┬───────────┘
                     │
         ┌───────────▼───────────┐
         │      Database         │
         │   (MongoDB/SQLite)    │
         └───────────────────────┘
```

## 2. Technology Stack Decisions

### Backend
- **Runtime**: Node.js (v18+)
- **Framework**: Express.js (lightweight, fast setup)
- **Database**: MongoDB with Mongoose (flexible schema, easy to start)
- **Authentication**: JWT (jsonwebtoken + bcryptjs)
- **Validation**: express-validator or Joi
- **Environment**: dotenv for config

### Web Frontend
- **Framework**: React 18 with Vite (fast dev experience)
- **Routing**: React Router v6
- **State Management**: Context API + useState/useReducer (simple enough)
- **HTTP Client**: Axios
- **UI/Styling**: Tailwind CSS + Framer Motion (for animations)
- **Form Handling**: React Hook Form

### Mobile
- **Framework**: React Native with Expo (faster development)
- **Navigation**: React Navigation
- **HTTP Client**: Axios
- **State Management**: Context API
- **UI Components**: React Native Paper or Native Base

## 3. Database Schema Design

### Users Collection
```javascript
{
  _id: ObjectId,
  email: String (unique, required),
  password: String (hashed, required),
  name: String (required),
  favorites: [ObjectId] (ref: Product),
  createdAt: Date,
  updatedAt: Date
}
```

### Products Collection
```javascript
{
  _id: ObjectId,
  title: String (required),
  price: Number (required),
  description: String (required),
  image: String (URL, required),
  category: String,
  stock: Number,
  createdAt: Date,
  updatedAt: Date
}
```

## 4. API Design

### Authentication Endpoints
```
POST /api/auth/register
Body: { email, password, name }
Response: { token, user: { id, email, name } }

POST /api/auth/login
Body: { email, password }
Response: { token, user: { id, email, name } }

GET /api/auth/me (Protected)
Headers: Authorization: Bearer <token>
Response: { user: { id, email, name, favorites } }
```

### Product Endpoints
```
GET /api/products
Query: ?search=<term>&page=<num>&limit=<num>&category=<cat>
Response: { products: [], total, page, totalPages }

GET /api/products/:id
Response: { product: {...} }

POST /api/products (Protected - Admin only, optional)
Body: { title, price, description, image, category }
Response: { product: {...} }

PUT /api/products/:id (Protected - Admin only, optional)
Body: { title, price, description, image, category }
Response: { product: {...} }

DELETE /api/products/:id (Protected - Admin only, optional)
Response: { message: "Product deleted" }
```

### Favorites Endpoints
```
POST /api/favorites/:productId (Protected)
Response: { message: "Added to favorites", favorites: [] }

DELETE /api/favorites/:productId (Protected)
Response: { message: "Removed from favorites", favorites: [] }

GET /api/favorites (Protected)
Response: { favorites: [products...] }
```

## 5. Security Considerations

1. **Password Security**
   - Use bcryptjs with salt rounds (10+)
   - Never store plain text passwords

2. **JWT Security**
   - Use strong secret key (env variable)
   - Set reasonable expiration (24h)
   - Include user ID in payload

3. **Input Validation**
   - Validate all inputs server-side
   - Sanitize data to prevent injection
   - Use express-validator middleware

4. **CORS**
   - Configure CORS for web/mobile origins
   - Restrict in production

5. **Rate Limiting**
   - Optional: Add express-rate-limit for auth endpoints

## 6. Project Structure

### Backend Structure
```
backend/
├── src/
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   ├── User.js
│   │   └── Product.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── products.js
│   │   └── favorites.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── validation.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   └── favoriteController.js
│   ├── utils/
│   │   └── seedData.js
│   └── server.js
├── .env
├── .env.example
├── package.json
└── README.md
```

### Web Structure
```
web/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── ProductCard.jsx
│   │   ├── SearchBar.jsx
│   │   └── Pagination.jsx
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Home.jsx
│   │   ├── ProductDetail.jsx
│   │   └── Favorites.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── services/
│   │   └── api.js
│   ├── utils/
│   │   └── helpers.js
│   ├── App.jsx
│   └── main.jsx
├── package.json
└── README.md
```

### Mobile Structure
```
mobile/
├── src/
│   ├── screens/
│   │   ├── LoginScreen.js
│   │   ├── HomeScreen.js
│   │   ├── ProductDetailScreen.js
│   │   └── FavoritesScreen.js
│   ├── components/
│   │   ├── ProductCard.js
│   │   └── SearchBar.js
│   ├── navigation/
│   │   └── AppNavigator.js
│   ├── context/
│   │   └── AuthContext.js
│   ├── services/
│   │   └── api.js
│   └── App.js
├── package.json
└── README.md
```

## 7. Implementation Phases

### Phase 1: Backend Foundation (Day 1 - 6 hours)
- [ ] Setup Express server
- [ ] Configure MongoDB connection
- [ ] Create User & Product models
- [ ] Implement auth endpoints (register/login)
- [ ] Add JWT middleware
- [ ] Create seed script

### Phase 2: Backend CRUD (Day 1 - 4 hours)
- [ ] Implement product CRUD endpoints
- [ ] Add search & pagination
- [ ] Implement favorites endpoints
- [ ] Add validation middleware
- [ ] Test all endpoints

### Phase 3: Web App (Day 2 - 8 hours)
- [ ] Setup React + Vite project
- [ ] Create auth context & pages
- [ ] Build product listing with search
- [ ] Implement product detail page
- [ ] Add favorites functionality
- [ ] Style with Tailwind CSS
- [ ] Add creative animations

### Phase 4: Mobile App (Day 3 - 6 hours)
- [ ] Setup React Native with Expo
- [ ] Create navigation structure
- [ ] Implement auth screens
- [ ] Build product listing
- [ ] Add product detail screen
- [ ] Implement favorites

### Phase 5: Polish & Documentation (Day 3 - 2 hours)
- [ ] Write comprehensive README
- [ ] Add setup instructions
- [ ] Document API endpoints
- [ ] Record demo video
- [ ] Final testing

## 8. Creative UI Elements Ideas

1. **Smooth Page Transitions** (Framer Motion)
2. **Product Card Hover Effects** (scale, shadow)
3. **Favorite Button Animation** (heart beat effect)
4. **Skeleton Loading States**
5. **Toast Notifications** (react-hot-toast)
6. **Smooth Scroll Animations**
7. **Search Debouncing with Loading Indicator**

## 9. Testing Strategy

### Manual Testing Checklist
- [ ] User registration with validation
- [ ] User login with wrong/correct credentials
- [ ] JWT token persistence
- [ ] Product listing pagination
- [ ] Search functionality
- [ ] Add/remove favorites
- [ ] Protected routes redirect
- [ ] Responsive design on mobile/tablet/desktop

## 10. Deployment Options

### Backend
- Render.com (free tier)
- Railway.app
- Heroku

### Database
- MongoDB Atlas (free tier)
- Local SQLite (simpler for demo)

### Web Frontend
- Vercel
- Netlify
- GitHub Pages

### Mobile
- Expo Go app (for testing)
- APK build for Android

## 11. Seed Data Strategy

### 2 Test Users
```javascript
[
  { email: "user1@test.com", password: "Test123!", name: "John Doe" },
  { email: "user2@test.com", password: "Test123!", name: "Jane Smith" }
]
```

### 10 Products (Categories: Electronics, Fashion, Home)
- Wireless Headphones - $99.99
- Smart Watch - $199.99
- Laptop Stand - $49.99
- Designer Backpack - $79.99
- Coffee Maker - $129.99
- LED Desk Lamp - $39.99
- Yoga Mat - $29.99
- Bluetooth Speaker - $59.99
- Phone Case - $19.99
- Water Bottle - $24.99

## 12. Success Metrics

- All API endpoints working with proper status codes
- Authentication flow complete with JWT
- Search + pagination functional
- Favorites persist across sessions
- Responsive UI on all screen sizes
- Clean, readable code with comments
- Comprehensive README
- Demo video showcasing all features

---

**Estimated Total Time**: 20-24 hours
**Recommended Timeline**: 3 days with buffer for debugging
