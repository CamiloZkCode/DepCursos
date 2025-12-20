import { defineStore } from 'pinia'
import API from '@/services/axios'
import router from '@/routes/index'
import Swal from 'sweetalert2'


export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: localStorage.getItem('token') !== null,
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
  }),
  
  actions: {
    async login(correo, password) {
      try {
        const response = await API.post('/auth/login', {
          correo,
          contraseña: password
        })

        const { token, user } = response.data

        this.isAuthenticated = true
        this.user = user
        this.token = token

        
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))


        return true
      } catch (error) {
        console.error('Error en login:', error.response?.data || error.message)
        throw error
      }
    },
    
    
     async logout() {
      // Limpiar estado
      this.isAuthenticated = false
      this.user = null
      this.token = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')

      //alerta cerrar sesión
      await Swal.fire({
        icon: 'success',
        title: 'Sesión cerrada',
        text: 'Has cerrado sesión correctamente',
        timer: 2000,
        showConfirmButton: false
      }).then(() => {
      router.push('/login')
    })},
  },
  getters: {
    isAdmin: (state) => state.user?.rol?.toLowerCase() === 'admin',
    isInstructor: (state) => state.user?.rol?.toLowerCase() === 'instructor',
    isEstudiante: (state) => state.user?.rol?.toLowerCase() === 'usuario',
  }
})