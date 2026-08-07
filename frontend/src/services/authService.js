import api from './api'

export const authService = {

  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password })
    return response.data
    // returns: { token, user: { id, name, email, role } }
  },

  register: async (name, email, password) => {
    const response = await api.post('/auth/register', { name, email, password })
    return response.data
    // returns: { token, user: { id, name, email, role } }
  },

  logout: async () => {
    // Optional: call backend to invalidate token
    // await api.post('/auth/logout')
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },

}