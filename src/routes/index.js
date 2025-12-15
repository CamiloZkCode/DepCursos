import { createRouter, createWebHistory } from "vue-router";

// Layouts
import LayoutConFooter from "@/layouts/LayoutConFooter.vue";
import LayoutSinFooter from "@/layouts/LayoutSinFooter.vue";

// Vistas generales
import Home from "@/views/Home.vue";

// Cliente


// Administrador

const routes = [
  // Rutas públicas
  {
    path: "/",
    component: LayoutConFooter,
    children: [
      { path: "", name: "Home", component: Home }
    ],
  },

  // Fallback
  { path: "/:pathMatch(.*)*", redirect: "/" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});


export default router
