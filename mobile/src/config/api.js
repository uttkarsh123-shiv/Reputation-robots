import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Production API URL
const API_URL = 'https://market-place-q2ss.onrender.com/api';

// For local development, uncomment below and comment above:
// const API_URL = 'http://192.168.1.6:5000/api';

console.log('API URL:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Add token to requests
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.log('API Error:', error.response.data);
    } else if (error.request) {
      console.log('Network Error:', error.message);
    } else {
      console.log('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
