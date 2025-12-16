import { createRouter, createWebHistory } from "vue-router";

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

      // Curso individual (dinámico)
      {
        path: "cursos/:id",
        name: "VerCursos",
        component: VerCursos,
        props: true,
      },

      { path: "mis-cursos", name: "MisCursos", component: MisCursos },
      { path: "perfil", name: "PerfilCliente", component: PerfilCliente },
    ],
  },

  /* =========================
     LAYOUT SIN FOOTER
  ========================= */
  {
    path: "/",
    component: LayoutSinFooter,
    children: [
      { path: "login", name: "Login", component: Login },

      // Admin
      {
        path: "admin/gestionar-cursos",
        name: "GestionarCursos",
        component: GestionarCursos,
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

export default router;
