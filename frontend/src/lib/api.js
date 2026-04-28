import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

export const api = axios.create({
  baseURL: API_BASE_URL
})

export function setApiAuthToken(token) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`
    return
  }

  delete api.defaults.headers.common.Authorization
}

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    const nextConfig = {
      ...config,
      headers: {
        ...config.headers
      }
    }

    if (token && !nextConfig.headers.Authorization) {
      nextConfig.headers.Authorization = `Bearer ${token}`
    }

    console.log('[api] request', {
      method: nextConfig.method?.toUpperCase(),
      url: `${nextConfig.baseURL || ''}${nextConfig.url || ''}`,
      data: nextConfig.data
    })

    return nextConfig
  },
  (error) => {
    console.error('[api] request setup failed', error)
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => {
    console.log('[api] response', {
      status: response.status,
      url: `${response.config.baseURL || ''}${response.config.url || ''}`,
      data: response.data
    })

    return response
  },
  (error) => {
    console.error('[api] response failed', {
      status: error.response?.status,
      url: `${error.config?.baseURL || ''}${error.config?.url || ''}`,
      data: error.response?.data,
      message: error.message
    })

    return Promise.reject(error)
  }
)
