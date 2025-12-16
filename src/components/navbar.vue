<template>
  <nav class="navbar" aria-label="Barra de navegación principal">
    <!-- Mobile: Botón hamburguesa -->
    <button class="icon-btn hamburger" @click="toggleMenu" v-if="isMobile" aria-label="Abrir menú">
      <img src="@/assets/icons/Menu.png" alt="" class="icon" />
    </button>

    <!-- Logo -->
    <RouterLink to="/" class="logo">
      <img src="@/assets/icons/SportCampus.png" alt="Logo SportCampus" class="logo-img" />
      <img src="/src/assets/icons/LogoLetras.png" alt="Logo SportCampus Letras" class="logo-text" />
    </RouterLink>

    <!-- Menú central -->
    <div class="center-menu" v-if="!isMobile">
      <button class="courses-btn" @click="showCoursesModal = true">
        Cursos <span class="arrow">▼</span>
      </button>

      <div class="search-bar">
        <img src="@/assets/icons/Search.png" alt="" class="search-icon" />
        <input type="text" placeholder="Búsqueda de cursos, artículos y..." class="search-input" />
      </div>

      <RouterLink to="/mis-cursos" class="my-courses-btn">
        Mis Cursos
      </RouterLink>
    </div>

    <!-- Lado derecho -->
    <div class="right-section">
      <!-- Idioma -->
      <div class="dropdown-lang">
        <button class="icon-btn lang" @click.prevent="toggleLangDropdown">
          <span class="lang-text">{{ currentLang }}</span>
        </button>

        <div class="lang-dropdown" v-if="langDropdown">
          <button @click="changeLang('ES')" class="lang-option" :class="{ active: currentLang === 'ES' }">
            Español
          </button>
          <button @click="changeLang('EN')" class="lang-option" :class="{ active: currentLang === 'EN' }">
            English
          </button>
        </div>
      </div>

      <span class="separator" v-if="!isMobile"></span>

      <!-- Ayuda -->
      <RouterLink to="/about" class="icon-btn help" v-if="!isMobile">
        <img src="@/assets/icons/about.png" alt="Ayuda" class="icon small" />
      </RouterLink>

      <span class="separator" v-if="!isMobile"></span>

      <!-- Notificaciones -->
      <button class="icon-btn notification" v-if="!isMobile && isLoggedIn">
        <img src="@/assets/icons/Notify.png" alt="" class="icon small" />
        <span class="notification-dot" v-if="hasNotifications"></span>
      </button>

      <span class="separator" v-if="!isMobile && isLoggedIn"></span>

      <!-- Perfil -->
      <div class="dropdown-profile" v-if="isLoggedIn">
        <button class="profile-btn" @click.prevent="toggleProfileDropdown">
          <img src="@/assets/icons/user.png" alt="Avatar" class="avatar" />
          <div class="user-info" v-if="!isMobile">
            <span class="username">Juan Carlos</span>
            <span class="user-role">Estudiante</span>
          </div>
        </button>

        <div class="profile-dropdown" v-if="profileDropdown">
          <RouterLink to="/perfil" class="profile-option" @click="profileDropdown = false">
            Mi Perfil
          </RouterLink>

          <button class="profile-option logout" @click="logout">
            Cerrar Sesión
          </button>
        </div>
      </div>

      <!-- Login -->
      <RouterLink to="/login" class="login-btn courses-btn" v-if="!isLoggedIn">
        Iniciar sesión
      </RouterLink>
    </div>
  </nav>

  <!-- MODAL CURSOS -->
  <teleport to="body">
    <transition name="modal-fade">
      <div v-if="showCoursesModal" class="modal-overlay" @click.self="showCoursesModal = false">
        <div class="courses-modal" @click.stop>
          <button class="modal-close" @click="showCoursesModal = false">✕</button>

          <h2 class="modal-title">Catálogo de cursos</h2>

          <div class="modal-content-grid">
            <!-- IZQUIERDA -->
            <div class="left-column">
              <section>
                <h3 class="section-title">Nivel de dificultad</h3>
                <ul class="list-links">
                  <li>
                    <RouterLink to="/cursos?nivel=principiante" class="modal-link" @click="showCoursesModal = false">
                      Principiante ></RouterLink>
                  </li>
                  <li>
                    <RouterLink to="/cursos?nivel=intermedio" class="modal-link" @click="showCoursesModal = false">
                      Intermedio ></RouterLink>
                  </li>
                  <li>
                    <RouterLink to="/cursos?nivel=avanzado" class="modal-link" @click="showCoursesModal = false">Avanzado
                      ></RouterLink>
                  </li>
                </ul>
              </section>

              <section>
                <h3 class="section-title">Categorías</h3>
                <ul class="list-links">
                  <li>
                    <RouterLink to="/cursos?tematica=fitness" class="modal-link" @click="showCoursesModal = false">Fitness
                      ></RouterLink>
                  </li>
                  <li>
                    <RouterLink to="/cursos?tematica=yoga" class="modal-link" @click="showCoursesModal = false">Yoga >
                    </RouterLink>
                  </li>
                  <li>
                    <RouterLink to="/cursos?tematica=natacion" class="modal-link" @click="showCoursesModal = false">
                      Natación ></RouterLink>
                  </li>
                  <li>
                    <RouterLink to="/cursos?tematica=boxeo" class="modal-link" @click="showCoursesModal = false">Boxeo >
                    </RouterLink>
                  </li>
                  <li>
                    <RouterLink to="/cursos?tematica=running" class="modal-link" @click="showCoursesModal = false">Running
                      ></RouterLink>
                  </li>
                  <li>
                    <RouterLink to="/cursos?tematica=ciclismo" class="modal-link" @click="showCoursesModal = false">
                      Ciclismo ></RouterLink>
                  </li>
                </ul>
              </section>

              <RouterLink to="/cursos" class="explore-btn" @click="showCoursesModal = false">
                Explorar catálogo completo
              </RouterLink>
            </div>

            <!-- DERECHA -->
            <div class="right-column">
              <section>
                <h3 class="section-title">¿Primera vez aquí?</h3>
                <ul class="list-links">
                  <li>
                    <RouterLink to="/about" class="modal-link" @click="showCoursesModal = false">Cómo crear una cuenta >
                    </RouterLink>
                  </li>
                  <li>
                    <RouterLink to="/about" class="modal-link" @click="showCoursesModal = false">Cómo inscribirse a un
                      curso ></RouterLink>
                  </li>
                  <li>
                    <RouterLink to="/about" class="modal-link" @click="showCoursesModal = false">Cómo publicar un curso >
                    </RouterLink>
                  </li>
                  <li>
                    <RouterLink to="/about" class="modal-link" @click="showCoursesModal = false">Preguntas frecuentes >
                    </RouterLink>
                  </li>
                  <li>
                    <RouterLink to="/about" class="modal-link" @click="showCoursesModal = false">Contacto y soporte
                      técnico ></RouterLink>
                  </li>
                </ul>
              </section>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </teleport>

  <!-- SIDEBAR MÓVIL -->
  <transition name="slide">
    <aside v-if="isMobile && menuOpen" class="sidebar">
      <div class="sidebar-header">
        <button class="icon-btn close" @click="toggleMenu">
          <img src="@/assets/icons/Close.png" alt="" class="icon" />
        </button>
      </div>

      <div class="mobile-search">
        <img src="@/assets/icons/Search.png" alt="" class="search-icon" />
        <input type="text" placeholder="Búsqueda de cursos..." class="search-input" />
      </div>

      <ul class="side-links">
        <li>
          <RouterLink to="/" class="side-link" @click="closeMenu">Inicio</RouterLink>
        </li>
        <li>
          <button class="side-link courses-toggle" @click.prevent="openCoursesModal">
            Cursos <span class="submenu-arrow">›</span>
          </button>
        </li>
        <li>
          <RouterLink to="/mis-cursos" class="side-link" @click="closeMenu">Mis Cursos</RouterLink>
        </li>
        <li>
          <RouterLink to="/about" class="side-link" @click="closeMenu">Contacto</RouterLink>
        </li>
      </ul>
    </aside>
  </transition>
</template>


<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";

const menuOpen = ref(false);
const isMobile = ref(false);
const isLoggedIn = ref(true);
const hasNotifications = ref(true);
const showCoursesModal = ref(false);

// Dropdowns
const currentLang = ref('ES');
const langDropdown = ref(false);
const profileDropdown = ref(false);

const toggleLangDropdown = () => {
  langDropdown.value = !langDropdown.value;
  if (profileDropdown.value) profileDropdown.value = false;
};

const toggleProfileDropdown = () => {
  profileDropdown.value = !profileDropdown.value;
  if (langDropdown.value) langDropdown.value = false;
};

const changeLang = (lang) => {
  currentLang.value = lang;
  langDropdown.value = false;
};

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
};

const closeMenu = () => {
  menuOpen.value = false;
};

const openCoursesModal = () => {
  showCoursesModal.value = true;
};

const logout = () => {
  isLoggedIn.value = false;
  profileDropdown.value = false;
  closeMenu();
};

watch(showCoursesModal, (isOpen) => {
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

const checkScreen = () => {
  isMobile.value = window.innerWidth <= 900;
};

onMounted(() => {
  checkScreen();
  window.addEventListener("resize", checkScreen);
});

onUnmounted(() => {
  window.removeEventListener("resize", checkScreen);
});
</script>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 64px;
  background: var(--color-blanco);
  padding: 0 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  font-family: system-ui, sans-serif;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  text-decoration: none;
  color: var(--color-oscuro);
}

.logo-img {
  height: 65px;
  width: auto;
}

.logo-text {
  height: 220px;
  width: auto;
}

.center-menu {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex: 1;
  justify-content: center;
}

.courses-btn {
  background: white;
  border: 2px solid #000;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 1.4rem;
  transition: all 0.3s ease;
  color: #000;
}

.courses-btn:hover {
  border-color: #8831FF;
  color: #8831FF;
  background: white;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(136, 49, 255, 0.15);
}

.courses-btn:hover .arrow {
  color: #8831FF;
}

.arrow {
  font-size: 0.8rem;
  transition: color 0.3s ease;
}

.my-courses-btn {
  font-size: 1.1rem;
  font-weight: 600;
  color: #000;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.my-courses-btn:hover {
  background: rgba(136, 49, 255, 0.1);
  color: #8831FF;
}

.icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  position: relative;
  padding: 8px;
  border-radius: 4px;
  transition: background 0.2s ease;
}

.icon-btn:hover {
  background: rgba(136, 49, 255, 0.1);
}

.icon-btn:hover .icon {
  filter: brightness(0) saturate(100%) invert(23%) sepia(92%) saturate(7478%) hue-rotate(265deg) brightness(95%) contrast(101%);
}

.lang-text {
  font-size: 1rem;
  font-weight: 600;
}

.dropdown-lang {
  position: relative;
}

.lang-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  padding: 0.5rem 0;
  min-width: 140px;
  z-index: 1000;
  margin-top: 0.5rem;
}

.lang-option {
  display: block;
  width: 100%;
  background: none;
  border: none;
  padding: 0.6rem 1rem;
  text-align: left;
  cursor: pointer;
  font-size: 0.95rem;
  color: #333;
  transition: background 0.2s ease;
}

.lang-option:hover {
  background: rgba(136, 49, 255, 0.1);
}

.lang-option.active {
  font-weight: 600;
  color: #8831FF;
}

.search-bar {
  position: relative;
  width: 380px;
  max-width: 100%;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  opacity: 0.6;
}

.search-input {
  width: 100%;
  height: 40px;
  padding: 0 12px 0 40px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  background: #f9f9f9;
}

.search-input:focus {
  outline: none;
  border-color: var(--color-azul-1);
  background: white;
}

.right-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.separator {
  width: 1px;
  height: 28px;
  background: #ddd;
  opacity: 0.6;
}

.icon {
  width: 28px;
  height: 28px;
  transition: filter 0.2s ease;
}

.icon.small {
  width: 24px;
  height: 24px;
}

.notification-dot {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 10px;
  height: 10px;
  background: #4caf50;
  border-radius: 50%;
  border: 2px solid white;
}


/* Dropdown de perfil */
.dropdown-profile {
  position: relative;
}

.profile-btn {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: background 0.2s ease;
}

.profile-btn:hover {
  background: rgba(136, 49, 255, 0.1);
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
}

.user-info {
  display: flex;
  flex-direction: column;
  text-align: left;
  line-height: 1.2;
}

.username {
  font-weight: 600;
  font-size: 0.95rem;
  color: #1c1c1c;
}

.user-role {
  font-size: 0.85rem;
  color: #666;
}

.profile-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  padding: 0.5rem 0;
  min-width: 160px;
  z-index: 1000;
  margin-top: 0.5rem;
}

.profile-option {
  display: block;
  width: 100%;
  background: none;
  border: none;
  padding: 0.6rem 1rem;
  text-align: left;
  cursor: pointer;
  font-size: 0.95rem;
  color: #333;
  text-decoration: none;
  transition: background 0.2s ease;
}

.profile-option:hover {
  background: rgba(136, 49, 255, 0.1);
}

.profile-option.logout {
  color: var(--color-morado);
  font-weight: 600;
}

.profile-option.logout:hover {
  background: rgba(211, 47, 47, 0.1);
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 1.5rem;
}

.courses-modal {
  position: relative;
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 1300px;
  max-height: 95vh;
  overflow-y: auto;
  padding: 2.5rem 4rem;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.2);
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.courses-modal::-webkit-scrollbar {
  display: none;
}

.modal-close {
  position: absolute;
  top: 1.5rem;
  right: 2rem;
  background: none;
  border: none;
  font-size: 1.8rem;
  cursor: pointer;
  color: #999;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background: #f0f0f0;
  color: #000;
}

.modal-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 2rem;
  text-align: left;
}

.modal-content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: start;
}

.left-column,
.right-column {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #222;
  margin-bottom: 1rem;
}

.list-links {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.modal-link {
  color: #333;
  text-decoration: none;
  font-size: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.4rem 0;
  transition: color 0.2s ease;
}

.modal-link:hover {
  color: var(--color-morado);
}

.explore-btn {
  background: var(--color-morado);
  color: var(--color-blanco);
  padding: 0.9rem 1.4rem;
  border-radius: 8px;
  border: 2px solid var(--color-morado);
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  text-align: center;
  transition: all 0.3s ease;
  align-self: flex-start;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.4s ease;
}

.modal-fade-enter-active .courses-modal {
  transition: all 0.4s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-from .courses-modal {
  transform: scale(0.9) translateY(20px);
}

.modal-fade-leave-to .courses-modal {
  transform: scale(0.95);
}

/* Sidebar móvil */
.sidebar {
  position: fixed;
  inset: 0 0 0 0;
  background: var(--color-blanco);
  padding: 1rem;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.2);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  max-width: 320px;
}

.sidebar-header {
  display: flex;
  justify-content: flex-end;
  padding: 0.5rem 0;
}

.side-links {
  list-style: none;
  padding: 0;
  margin: 1rem 0;
  flex: 1;
}

.side-link {
  display: block;
  width: 100%;
  padding: 1rem;
  text-decoration: none;
  color: var(--color-oscuro);
  font-weight: 500;
  border-bottom: 1px solid #eee;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
}

.courses-toggle {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.submenu-arrow {
  font-size: 1.4rem;
  font-weight: 300;
  color: #666;
}

.side-login {
  display: block;
  width: 100%;
  padding: 1rem;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-azul-1);
  font-weight: 600;
  border-bottom: 1px solid #eee;
}

.mobile-search {
  position: relative;
  margin: 1rem 0;
}

.mobile-search .search-input {
  width: 100%;
  padding-left: 40px;
}

/* Media queries */
@media (max-width: 900px) {
  .navbar {
    padding: 0 1rem;
    height: 56px;
  }

  .center-menu {
    display: none;
  }

  .right-section {
    gap: 0.8rem;
  }

  .separator {
    display: none;
  }

  .logo-text {
    height: 180px;
  }

  /* Ocultar elementos solo desktop */
  .logo-img,
  .help,
  .notification {
    display: none;
  }

  .login-btn {
    font-size: 0.7rem;
    padding: 0.7rem;
  }

  /* En móvil: ocultar nombre y rol del botón principal */
  .profile-btn .user-info {
    display: none;
  }

  .profile-btn .avatar {
    width: 32px;
    height: 32px;
  }

  .modal-content-grid {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }

  .modal-overlay {
    align-items: flex-start;
    padding-top: 2.5rem;
    padding-bottom: 1.rem;
  }

  .courses-modal {
    max-height: calc(100vh - 8rem);
    border-radius: 14px;
    padding: 1.5rem 1.5rem 2rem;
  }

  .explore-btn {
    align-self: stretch;
  }
}
</style>