# Mobile App - React Native

React Native mobile application for the marketplace.

## Features

- Product browsing with search
- User authentication (Login/Register)
- Product details view
- Favorites management
- Clean, minimal UI

## Setup

1. Install dependencies:
```bash
npm install
```

2. Update API URL in `src/config/api.js`:
```javascript
const API_URL = 'http://YOUR_IP:5000/api'; // Use your machine's IP, not localhost
```

3. Start the app:
```bash
npm start
```

4. Run on device:
- Scan QR code with Expo Go app (iOS/Android)
- Or press `a` for Android emulator
- Or press `i` for iOS simulator (macOS only)

## Test Credentials

- Email: user1@test.com
- Password: Test123!

## Tech Stack

- React Native (Expo)
- React Navigation
- Axios
- AsyncStorage
