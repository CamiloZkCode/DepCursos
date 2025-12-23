import { defineStore } from "pinia";
import API from "@/services/axios";
import router from "@/routes/index";
import Swal from "sweetalert2";
import { obtenerDatosPerfil } from "@/services/usuario.services"; // Lo usamos solo aquí

export const useAuthStore = defineStore("auth", {
  state: () => ({
    isAuthenticated: localStorage.getItem("token") !== null,
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("token") || null,
  }),

  actions: {
    async login(correo, password) {
      try {
        const response = await API.post("/auth/login", {
          correo,
          contraseña: password,
        });

        const { token, user: userFromLogin } = response.data;

        // Guardamos lo básico
        this.token = token;
        this.isAuthenticated = true;
        this.user = userFromLogin;

        // Persistimos temporalmente
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(this.user));

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

    async logout() {
      this.isAuthenticated = false;
      this.user = null;
      this.token = null;

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      await Swal.fire({
        icon: "success",
        title: "Sesión cerrada",
        text: "Has cerrado sesión correctamente",
        timer: 2000,
        showConfirmButton: false,
      });

      router.push("/login");
    },
  },

  getters: {
    isAdmin: (state) =>
      state.user?.rol?.toLowerCase() === "admin" ||
      state.user?.rol?.toLowerCase() === "administrador",
    isInstructor: (state) => state.user?.rol?.toLowerCase() === "instructor",
    isEstudiante: (state) => state.user?.rol?.toLowerCase() === "usuario",
  },
});
