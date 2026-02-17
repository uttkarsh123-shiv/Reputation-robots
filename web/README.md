# Micro Marketplace - Web Frontend

Modern React web application for the Micro Marketplace built with Vite, Tailwind CSS, and Framer Motion.

## Features

✅ User authentication (Login/Register modals with React Portals)
✅ Product listing with search and pagination
✅ Category filtering
✅ Product detail page
✅ Favorites management
✅ Responsive design (mobile, tablet, desktop)
✅ Smooth animations with Framer Motion
✅ Toast notifications
✅ Loading states
✅ Protected routes

## Tech Stack

- **React 19** - UI library
- **Vite** - Build tool and dev server
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Axios** - HTTP client
- **React Hot Toast** - Toast notifications

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- Backend API running on http://localhost:5000

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment:
```bash
# .env file is already configured for local development
# VITE_API_URL=http://localhost:5000/api
```

3. Start development server:
```bash
npm run dev
```

App will run on `http://localhost:5173`

### Build for Production

```bash
npm run build
```

Build output will be in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
web/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx              # Navigation with auth modals
│   │   ├── ProductCard.jsx         # Product card with favorite button
│   │   ├── SearchBar.jsx           # Debounced search input
│   │   ├── Pagination.jsx          # Pagination component
│   │   ├── Loading.jsx             # Loading spinner
│   │   ├── Modal.jsx               # Reusable modal with portal
│   │   ├── LoginModal.jsx          # Login modal
│   │   └── RegisterModal.jsx       # Register modal
│   ├── pages/
│   │   ├── Home.jsx                # Product listing page
│   │   ├── ProductDetail.jsx       # Single product page
│   │   └── Favorites.jsx           # User favorites page
│   ├── context/
│   │   └── AuthContext.jsx         # Auth state management
│   ├── services/
│   │   └── api.js                  # API service layer
│   ├── App.jsx                     # Main app with routing
│   ├── main.jsx                    # Entry point
│   └── index.css                   # Global styles
├── public/
├── .env                            # Environment variables
├── tailwind.config.js              # Tailwind configuration
├── postcss.config.js               # PostCSS configuration
├── vite.config.js                  # Vite configuration
└── package.json
```

## Features Breakdown

### Authentication
- Modal-based login/register (React Portals)
- JWT token storage in localStorage
- Auto-redirect on 401 errors
- Protected routes
- User context with React Context API

### Product Listing
- Grid layout (responsive: 1-4 columns)
- Search with debouncing (500ms)
- Category filtering
- Pagination (12 products per page)
- Loading states
- Empty states

### Product Detail
- Full product information
- Large product image
- Add/remove favorites
- Back navigation
- Stock availability

### Favorites
- View all favorite products
- Remove from favorites
- Empty state with CTA
- Protected route (login required)

### UI/UX Features
- Smooth page transitions (Framer Motion)
- Hover effects on cards and buttons
- Scale animations on interactions
- Toast notifications for feedback
- Responsive navbar
- Sticky category filter
- Smooth scroll to top on page change

## Creative UI Elements

1. **Animated Modals** - Scale and fade animations using Framer Motion
2. **Heart Beat Effect** - Favorite button animates when clicked
3. **Hover Lift** - Product cards lift on hover
4. **Smooth Transitions** - Page transitions with fade/slide effects
5. **Loading Spinner** - Rotating gradient spinner
6. **Toast Notifications** - Slide-in notifications with icons
7. **Category Pills** - Animated category filter buttons
8. **Search Debouncing** - Real-time search with loading indicator

## API Integration

All API calls go through the `services/api.js` layer:

- Axios interceptors for auth tokens
- Automatic 401 handling
- Error handling with toast notifications
- Request/response transformations

## Responsive Design

- **Mobile** (< 640px): 1 column grid
- **Tablet** (640px - 1024px): 2 columns
- **Desktop** (1024px - 1280px): 3 columns
- **Large Desktop** (> 1280px): 4 columns

## Environment Variables

```env
VITE_API_URL=http://localhost:5000/api
```

## Scripts

```bash
# Development
npm run dev          # Start dev server

# Production
npm run build        # Build for production
npm run preview      # Preview production build

# Linting
npm run lint         # Run ESLint
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Optimizations

- Code splitting with React Router
- Lazy loading images
- Debounced search
- Optimized re-renders with React hooks
- Vite's fast HMR

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Netlify

```bash
# Build command
npm run build

# Publish directory
dist
```

### Environment Variables (Production)

Set `VITE_API_URL` to your production API URL.

## Test Credentials

```
Email: user1@test.com
Password: Test123!
```

## Known Issues

None currently.

## Future Enhancements

- Shopping cart functionality
- User profile page
- Product reviews and ratings
- Wishlist sharing
- Advanced filters (price range, sorting)
- Infinite scroll option
- Dark mode

## License

ISC
