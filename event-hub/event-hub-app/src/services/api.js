import axios from 'axios';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL || Constants.expoConfig?.extra?.BASE_URL || '';
const AUTH_URL = process.env.EXPO_PUBLIC_AUTH_URL || Constants.expoConfig?.extra?.AUTH_URL || BASE_URL;

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const authApi = axios.create({
  baseURL: AUTH_URL,
  headers: { 'Content-Type': 'application/json' },
});

async function attachAuth(config) {
  try {
    const token = await AsyncStorage.getItem('auth_token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
      config.withCredentials = true;
    }
  } catch {}
  return config;
}

api.interceptors.request.use(attachAuth);
authApi.interceptors.request.use(attachAuth);

const onError = (err) => Promise.reject(err);
api.interceptors.response.use((res) => res, onError);
authApi.interceptors.response.use((res) => res, onError);

export default api;
