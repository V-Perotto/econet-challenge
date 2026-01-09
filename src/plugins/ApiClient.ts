import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept-Language': navigator.language || 'pt-BR',
    'X-API-KEY': import.meta.env.BYTOOLS_KEY
  },
  withCredentials: true,
})

export default apiClient;
