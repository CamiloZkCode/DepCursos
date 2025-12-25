import { defineStore } from "pinia";
import API from "@/services/axios";
import router from "@/routes/index";
import Swal from "sweetalert2";
import { obtenerDatosPerfil } from "@/services/usuario.services"; // Lo usamos solo aquí

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: JSON.parse(localStorage.getItem("user")),
    isAuthenticated: !!localStorage.getItem("user"),
    initialized: false,
    loading: false,
  }),

  actions: {
    async initializeAuth() {
      if (this.initialized) return;

      this.loading = true;
      try {
        const { data } = await API.get("/auth/verify");

        if (data.success) {
          this.user = data.user;
          this.isAuthenticated = true;
          localStorage.setItem("user", JSON.stringify(data.user));
        }
      } catch (_) {

        this.user = null;
        this.isAuthenticated = false;
      } finally {
        this.initialized = true;
        this.loading = false;
      }
    },

    async checkAuth() {
      if (!this.initialized) {
        await this.initializeAuth();
      }
      return this.isAuthenticated;
    },

    async login(correo, password) {
      try {
        const { data } = await API.post("/auth/login", {
        correo,
        contraseña: password
      });

        // Guardamos lo básico
       this.user = data.user;
       this.isAuthenticated = true;
       this.initialized = true;
       localStorage.setItem("user", JSON.stringify(data.user));
    
        // ¡Importante! Traemos datos frescos del perfil (incluye img_usuario actualizada)
        if (this.user?.id) {
          try {
            const perfilData = await obtenerDatosPerfil(this.user.id);
            if (perfilData) {
              // Mergeamos los datos frescos (especialmente img_usuario)
              this.user = { ...this.user, ...perfilData };
              localStorage.setItem("user", JSON.stringify(this.user));
            }
          } catch (err) {
            console.warn(
              "No se pudo cargar datos frescos del perfil tras login"
            );
          }
        }

        return true;
      } catch (error) {
        console.error("Error en login:", error.response?.data || error.message);
        throw error;
      }
    },

    // Nueva acción: actualizar avatar (la usará ProfileHeader)
    actualizarAvatar(nuevaUrl) {
      if (this.user) {
        this.user.img_usuario = nuevaUrl;
        localStorage.setItem("user", JSON.stringify(this.user));
      }
    },

    actualizarNombre(nuevoNombre) {
    if (this.user) {
      this.user.nombre = nuevoNombre;
      localStorage.setItem("user", JSON.stringify(this.user));
    }
    },

    async logout() {

      await API.post("/auth/logout");
      this.cleanLocalAuth();

      await Swal.fire({
        icon: "success",
        title: "Sesión cerrada",
        text: "Has cerrado sesión correctamente",
        timer: 2000,
        showConfirmButton: false,
      });

      router.push("/login");
    },

    cleanLocalAuth() {
      this.user = null;
      this.isAuthenticated = false;
      this.initialized = false;
      localStorage.removeItem("user");
    },
    actualizarDatosUsuario(datos) {
      if (this.user) {
        this.user = { ...this.user, ...datos };
        localStorage.setItem("user", JSON.stringify(this.user));
      }
    }
  },

  getters: {
    isAdmin: (state) =>
      state.user?.rol?.toLowerCase() === "admin" ||
      state.user?.rol?.toLowerCase() === "administrador",
    isInstructor: (state) => state.user?.rol?.toLowerCase() === "instructor",
    isEstudiante: (state) => state.user?.rol?.toLowerCase() === "usuario",
    isLoading: (state) => state.loadingSession,
    nombreCompleto: (state) => state.user?.nombre || 'Usuario',
    avatarUrl: (state) => state.user?.img_usuario || '/avatar-default.png'
  },
});
