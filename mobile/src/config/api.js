import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// IMPORTANT: Change this to your machine's IP address (not localhost)
// Find your IP: Windows (ipconfig), Mac/Linux (ifconfig)
const API_URL = 'http://192.168.1.100:5000/api'; // Update with your IP

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
