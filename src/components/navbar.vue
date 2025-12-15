<template>
  <nav class="navbar" aria-label="Barra de navegación">
    <!-- Botón hamburguesa (mobile) -->
    <button
      class="icon-btn hamburger"
      @click="toggleMenu"
      v-if="isMobile"
      aria-label="Abrir menú"
    >
      <img src="@/assets/icons/menu.png" alt="" class="icon" />
    </button>

    <!-- Logo -->
    <RouterLink to="/" class="logo">
      <img src="" alt="Cursos Deportivos" />
      <span class="brand">CursosDeportivos</span>
    </RouterLink>

    <!-- Desktop -->
    <ul class="nav-links" v-if="!isMobile">
      <li>
        <RouterLink to="/" class="nav-link" exact-active-class="is-active">
          Inicio
        </RouterLink>
      </li>
      <li>
        <RouterLink to="/cursos" class="nav-link" exact-active-class="is-active">
          Cursos
        </RouterLink>
      </li>
      <li>
        <RouterLink to="/contacto" class="nav-link" exact-active-class="is-active">
          Contacto
        </RouterLink>
      </li>
    </ul>

    <!-- Right -->
    <div class="right">
      <button
        class="icon-btn profile"
        aria-label="Perfil"
      >
        <img src="@/assets/icons/User.png" alt="" class="icon" />
      </button>
    </div>
  </nav>

  <!-- Sidebar móvil -->
  <transition name="slide">
    <aside v-if="isMobile && menuOpen" class="sidebar">
      <div class="sidebar-header">
        <button
          class="icon-btn close"
          @click="toggleMenu"
          aria-label="Cerrar menú"
        >
          <img src="@/assets/icons/close.png" alt="cerrar" class="icon" />
        </button>
      </div>

      <ul class="side-links">
        <li>
          <RouterLink
            to="/"
            class="side-link"
            exact-active-class="is-active"
            @click="closeMenu"
          >
            Inicio
          </RouterLink>
        </li>
        <li>
          <RouterLink
            to="/cursos"
            class="side-link"
            exact-active-class="is-active"
            @click="closeMenu"
          >
            Cursos
          </RouterLink>
        </li>
        <li>
          <RouterLink
            to="/contacto"
            class="side-link"
            exact-active-class="is-active"
            @click="closeMenu"
          >
            Contacto
          </RouterLink>
        </li>
      </ul>
    </aside>
  </transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

/* ===== Estado ===== */
const menuOpen = ref(false);
const isMobile = ref(false);

/* ===== Funciones ===== */
const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
};

const closeMenu = () => {
  menuOpen.value = false;
};

const checkScreen = () => {
  isMobile.value = window.innerWidth <= 900;
};

/* ===== Lifecycle ===== */
onMounted(() => {
  checkScreen();
  window.addEventListener("resize", checkScreen);
});

onUnmounted(() => {
  window.removeEventListener("resize", checkScreen);
});
</script>

<style scoped>
/* 🔴 CSS EXACTAMENTE IGUAL (SIN CAMBIOS) 🔴 */
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  background: var(--color-blanco);
  padding: 0.5rem 1.2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: var(--color-oscuro);
}

.logo img {
  width: 44px;
  height: 44px;
}

.brand {
  font-weight: 800;
  font-size: 1.4rem;
}

.nav-links {
  display: flex;
  gap: 1.8rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-link {
  text-decoration: none;
  color: var(--color-oscuro);
  font-weight: 600;
  font-size: 1.15rem;
  position: relative;
  padding: 0.4rem 0;
}

.nav-link.is-active::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: -6px;
  height: 3px;
  background: linear-gradient(
    135deg,
    var(--color-azul-1),
    var(--color-primary-variant)
  );
  border-radius: 999px;
}

.right {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  position: relative;
}

.icon-btn {
  background: transparent;
  border: none;
  cursor: pointer;
}

.icon {
  width: 40px;
  height: 40px;
}

/* Sidebar móvil */
@media (max-width: 900px) {
  .nav-links {
    display: none;
  }
}

.sidebar {
  position: fixed;
  inset: 0 40% 0 0;
  background: var(--color-blanco);
  padding: 1rem;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.2);
  z-index: 9999;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
}

.close {
  order: 1;
}

.side-links {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.side-link {
  text-decoration: none;
  color: var(--color-oscuro);
  font-size: 1.1rem;
  font-weight: 600;
  padding: 0.8rem 1rem;
}

.side-link.is-active {
  color: var(--color-azul-1);
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}
</style>
