import axios from 'axios'

const API = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor de respuesta optimizado
API.interceptors.response.use(
  res => res,
  err => Promise.reject(err)
);

export default API;