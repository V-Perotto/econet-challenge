import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_SERVER,
  headers: {
    'Content-Type': 'application/json',
    'Accept-Language': navigator.language || 'pt-BR',
  },
})

export default apiClient;
