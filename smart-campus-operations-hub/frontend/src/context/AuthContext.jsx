import { createContext, useContext, useEffect, useState } from 'react'
import { api, setApiAuthToken } from '../lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token') || '')

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token)
      setApiAuthToken(token)
      api.get('/auth/me').then((res) => setUser(res.data.data)).catch((error) => {
        console.error('[auth] failed to load current user', error)
        logout()
      })
      return
    }

    setApiAuthToken('')
  }, [token])

  const login = async (email, password) => {
    console.log('[auth] login requested', { email })
    const res = await api.post('/auth/login', { email, password })
    const data = res.data.data
    localStorage.setItem('token', data.token)
    setApiAuthToken(data.token)
    console.log('[auth] login succeeded', { email: data.email, role: data.role })
    setToken(data.token)
    setUser(data)
  }

  const logout = () => {
    console.log('[auth] logout')
    localStorage.removeItem('token')
    setApiAuthToken('')
    setToken('')
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, token, login, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
