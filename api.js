import axios from 'axios';
import { API_URL } from '@env';
import * as SecureStore from 'expo-secure-store'; // Importa SecureStore

const api = axios.create({
  baseURL: API_URL, // URL base de tu backend
  timeout: 10000, // Tiempo de espera
});

// Interceptor para agregar el token JWT
api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('token'); // Recupera el token almacenado
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
