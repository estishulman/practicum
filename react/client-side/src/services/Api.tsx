// src/services/api.ts
import axios from 'axios'

const api = axios.create({
  //baseURL: 'http://localhost:5047/api', // כתובת בסיס
  baseURL:'https://practicum-server7.onrender.com'
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)
export default api
