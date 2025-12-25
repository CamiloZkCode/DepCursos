import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/store/auth.js";

// Layouts
import LayoutConFooter from "@/layouts/LayoutConFooter.vue";
import LayoutSinFooter from "@/layouts/LayoutSinFooter.vue";

// Vistas públicas
import Home from "@/views/Home.vue";
import About from "@/views/About.vue";
import Cursos from "@/views/Cursos.vue";
import VerCursos from "@/views/VerCursos.vue";

// Auth
import Login from "@/views/Login.vue";

// Cliente
import MisCursos from "@/views/Cliente/MisCursos.vue";
import PerfilCliente from "@/views/Cliente/PerfilCliente.vue";

// Admin
import GestionarCursos from "@/views/Admin/GestionarCursos.vue";
import PerfilAdmin from "@/views/Admin/PerfilAdmin.vue";

const routes = [
  /* =========================
     LAYOUT CON FOOTER
  ========================= */
  {
    path: "/",
    component: LayoutConFooter,
    children: [
      { path: "", name: "Home", component: Home },
      { path: "about", name: "About", component: About },
      { path: "cursos", name: "Cursos", component: Cursos },

      {
        path: "cursos/:id",
        name: "VerCursos",
        component: VerCursos,
        props: true,
      },

      // Cliente
      {
        path: "mis-cursos",
        name: "MisCursos",
        component: MisCursos,
        meta: { requiresAuth: true, role: "usuario" },
      },
      {
        path: "perfil",
        name: "PerfilCliente",
        component: PerfilCliente,
        meta: { requiresAuth: true, role: "usuario" },
      },

      // Admin
      {
        path: "admin-perfil",
        name: "PerfilAdmin",
        component: PerfilAdmin,
        meta: { requiresAuth: true, role: "admin" },
      },
      {
        path: "admin/gestionar-cursos",
        name: "GestionarCursos",
        component: GestionarCursos,
        meta: { requiresAuth: true, role: "admin" },
      },
    ],
  },

  /* =========================
     LAYOUT SIN FOOTER
  ========================= */
  {
    path: "/",
    component: LayoutSinFooter,
    children: [
      {
        path: "login",
        name: "Login",
        component: Login,
        meta: { guestOnly: true },
      },
    ],
  },

  /* =========================
     404
  ========================= */
  { path: "/:pathMatch(.*)*", redirect: "/" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

/* =========================
   GUARD GLOBAL (AUTH + ROLES)
========================= */
router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore();

  // Login
  if (to.meta.guestOnly && auth.isAuthenticated) {
    return next({ name: "Home" });
  }

  // Protegidas
  if (to.meta.requiresAuth) {
    if (!auth.initialized) {
      await auth.initializeAuth();
    }

    if (!auth.isAuthenticated) {
      return next({
        name: "Login",
        query: { redirect: to.fullPath }
      });
    }

    if (to.meta.role && auth.user?.rol !== to.meta.role) {
      return next({ name: "Home" });
    }
  }

  next();
});


export default router;