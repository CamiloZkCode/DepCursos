<template>
  <nav class="navbar" aria-label="Barra de navegación principal">
    <!-- Mobile: Botón hamburguesa -->
    <button class="icon-btn hamburger" @click="toggleMenu" v-if="isMobile" aria-label="Abrir menú">
      <img src="@/assets/icons/Menu.png" alt="" class="icon" />
    </button>

    <!-- Logo -->
    <RouterLink to="/" class="logo">
      <!-- Solo mostrar logo de letras en mobile -->
      <img v-if="isMobile" src="/src/assets/icons/LogoLetras.png" alt="Logo SportCampus Letras" class="logo-text" />
      <!-- Mostrar ambos logos en desktop -->
      <template v-else>
        <img src="@/assets/icons/SportCampus.png" alt="Logo SportCampus" class="logo-img" />
        <img src="/src/assets/icons/LogoLetras.png" alt="Logo SportCampus Letras" class="logo-text" />
      </template>
    </RouterLink>

    <!-- Menú central (solo desktop) -->
    <div class="center-menu" v-if="!isMobile">
      <RouterLink to="/cursos" class="courses-btn">
        Cursos
      </RouterLink>
      
      <div class="search-bar">
        <img src="@/assets/icons/Search.png" alt="" class="search-icon" />
        <input type="text" placeholder="Búsqueda de cursos, artículos y..." class="search-input" />
      </div>
      
      <!-- Mis Cursos solo para estudiantes logueados -->
      <RouterLink to="/mis-cursos" class="my-courses-btn" v-if="isAuthenticated && isStudent">
        Mis Cursos
      </RouterLink>
    </div>

    <!-- Lado derecho -->
    <div class="right-section">
      <!-- Idioma (solo desktop) -->
      <div class="dropdown-lang" v-if="!isMobile">
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

      <!-- Ayuda (solo desktop) -->
      <RouterLink to="/about" class="icon-btn help" v-if="!isMobile">
        <img src="@/assets/icons/about.png" alt="Ayuda" class="icon small" />
      </RouterLink>

      <span class="separator" v-if="!isMobile && isAuthenticated"></span>

      <!-- Notificaciones (solo desktop y logueado) -->
      <div class="dropdown-notification" v-if="!isMobile && isAuthenticated">
        <button class="icon-btn notification" @click.prevent="toggleNotificationDropdown">
          <img src="@/assets/icons/Notify.png" alt="Notificaciones" class="icon small" />
          <span class="notification-dot" v-if="hasNotifications"></span>
        </button>
        <div class="notification-dropdown" v-if="notificationDropdown">
          <div class="notification-header">
            <h3>Notificaciones</h3>
            <button class="mark-all-read" @click="markAllAsRead">Marcar todas como leídas</button>
          </div>
          <div class="notification-list">
            <div class="notification-item" v-for="(notification, index) in notifications" :key="index" 
                 :class="{ unread: !notification.read }">
              <div class="notification-icon">
                <img :src="getNotificationIcon(notification.type)" :alt="notification.type" />
              </div>
              <div class="notification-content">
                <p class="notification-title">{{ notification.title }}</p>
                <p class="notification-message">{{ notification.message }}</p>
                <span class="notification-time">{{ notification.time }}</span>
              </div>
            </div>
            <div class="no-notifications" v-if="notifications.length === 0">
              No tienes notificaciones nuevas
            </div>
          </div>
          <RouterLink to="/notificaciones" class="view-all-link" @click="notificationDropdown = false">
            Ver todas las notificaciones
          </RouterLink>
        </div>
      </div>

      <span class="separator" v-if="!isMobile && isAuthenticated"></span>

      <!-- Perfil (solo si está logueado) -->
      <div class="dropdown-profile" v-if="isAuthenticated">
        <button class="profile-btn" @click.prevent="toggleProfileDropdown">
          <img :src="userAvatar" alt="Avatar" class="avatar" />
          <div class="user-info" v-if="!isMobile">
            <span class="username">{{ formattedName }}</span>
            <span class="user-role">{{ formattedRole }}</span>
          </div>
        </button>
        <div class="profile-dropdown" v-if="profileDropdown">
          <!-- Ruta dinámica según rol -->
          <RouterLink :to="profileRoute" class="profile-option" @click="profileDropdown = false">
            {{ isAdmin ? 'Perfil' : 'Mi Perfil' }}
          </RouterLink>
          <!-- Gestionar Cursos solo para admin -->
          <RouterLink to="/admin/gestionar-cursos" class="profile-option" 
                     v-if="isAdmin" @click="profileDropdown = false">
            Gestionar Cursos
          </RouterLink>
          <button class="profile-option logout" @click="handleLogout">
            Cerrar Sesión
          </button>
        </div>
      </div>

      <!-- Botón Iniciar Sesión (solo si NO está logueado) -->
      <RouterLink v-if="!isAuthenticated" to="/login" 
                class="login-btn" 
                :class="{ 'mobile-login': isMobile }">
        Iniciar sesión
      </RouterLink>

      <!-- En mobile, botón de ayuda si está logueado -->
      <RouterLink v-if="isMobile && isAuthenticated" to="/about" class="icon-btn help">
        <img src="@/assets/icons/about.png" alt="Ayuda" class="icon small" />
      </RouterLink>

      <!-- En mobile, botón de notificaciones si está logueado -->
      <button v-if="isMobile && isAuthenticated" class="icon-btn notification" @click="toggleNotificationDropdown">
        <img src="@/assets/icons/Notify.png" alt="Notificaciones" class="icon small" />
        <span class="notification-dot" v-if="hasNotifications"></span>
      </button>
    </div>
  </nav>

  <!-- SIDEBAR MÓVIL -->
  <transition name="slide">
    <aside v-if="isMobile && menuOpen" class="sidebar">
      <div class="sidebar-header">
        <button class="icon-btn close" @click="toggleMenu">
          <img src="@/assets/icons/Close.png" alt="Cerrar menú" class="icon" />
        </button>
      </div>
      
      <!-- Perfil en móvil (si está logueado) -->
      <div class="mobile-profile" v-if="isAuthenticated">
        <div class="mobile-avatar">
          <img :src="userAvatar" alt="Avatar" />
        </div>
        <div class="mobile-user-info">
          <span class="mobile-username">{{ formattedName }}</span>
          <span class="mobile-user-role">{{ formattedRole }}</span>
        </div>
      </div>
      
      <!-- No mostrar buscador en móvil -->
      
      <ul class="side-links">
        <li><RouterLink to="/" class="side-link" @click="closeMenu">Inicio</RouterLink></li>
        <li><RouterLink to="/cursos" class="side-link" @click="closeMenu">Cursos</RouterLink></li>
        <li><RouterLink to="/about" class="side-link" @click="closeMenu">Contacto / Soporte</RouterLink></li>
        <li><RouterLink to="/mis-cursos" class="side-link" @click="closeMenu" 
               v-if="isAuthenticated && isStudent">Mis Cursos</RouterLink></li>
        <li><RouterLink to="/admin/gestionar-cursos" class="side-link" @click="closeMenu" 
               v-if="isAuthenticated && isAdmin">Gestionar Cursos</RouterLink></li>
      </ul>
      
      <!-- Idioma en móvil -->
      <div class="mobile-language">
        <h4 class="language-title">Idioma</h4>
        <div class="language-options">
          <button class="language-option" :class="{ active: currentLang === 'ES' }" @click="changeLang('ES')">
            Español
          </button>
          <button class="language-option" :class="{ active: currentLang === 'EN' }" @click="changeLang('EN')">
            English
          </button>
        </div>
      </div>
      
      <!-- Botones de autenticación en móvil -->
      <div class="mobile-auth" v-if="!isAuthenticated">
        <RouterLink to="/login" class="mobile-login-btn" @click="closeMenu">
          Iniciar sesión
        </RouterLink>
        <RouterLink to="/register" class="mobile-register-btn" @click="closeMenu">
          Registrarse
        </RouterLink>
      </div>
      
      <!-- Botón de cerrar sesión en móvil -->
      <button class="mobile-logout" v-if="isAuthenticated" @click="handleLogout">
        Cerrar Sesión
      </button>
    </aside>
  </transition>
  
  <!-- Overlay para cerrar sidebar -->
  <div v-if="isMobile && menuOpen" class="sidebar-overlay" @click="closeMenu"></div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useAuthStore } from "@/store/auth";
import { RouterLink, useRouter } from "vue-router";
import { obtenerDatosPerfil } from "@/services/usuario.services";

const authStore = useAuthStore();
const router = useRouter();

// Estado
const menuOpen = ref(false);
const isMobile = ref(false);
const notificationDropdown = ref(false);
const profileDropdown = ref(false);
const langDropdown = ref(false);
const currentLang = ref('ES');
const hasNotifications = ref(true);
const userProfileData = ref(null);

// Notificaciones de ejemplo
const notifications = ref([
  { id: 1, type: 'course', title: 'Nuevo curso disponible', message: 'Fitness Avanzado ha sido publicado', time: 'Hace 2 horas', read: false },
  { id: 2, type: 'message', title: 'Mensaje del instructor', message: 'Tienes una nueva pregunta en tu curso', time: 'Hace 1 día', read: true },
  { id: 3, type: 'system', title: 'Actualización del sistema', message: 'Nuevas funciones disponibles', time: 'Hace 3 días', read: false }
]);

// Computed
const isAuthenticated = computed(() => authStore.isAuthenticated);
const user = computed(() => authStore.user);
const isAdmin = computed(() => authStore.isAdmin);
const isStudent = computed(() => {
  const role = user.value?.rol?.toLowerCase();
  return role === 'usuario' || role === 'estudiante' || role === 'user';
});

// Avatar del usuario
const userAvatar = computed(() => {
  return authStore.user?.img_usuario || "/src/assets/icons/user.png";
});

// Formato del nombre: primeras letras mayúsculas y solo primeros 2 nombres
const formattedName = computed(() => {
  if (!user.value?.nombre) return "Usuario";

  const words = user.value.nombre.trim().split(/\s+/);
  const capitalized = words.map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  );

  // Tomar solo los primeros 2 nombres
  return capitalized.slice(0, 2).join(' ');
});

// Rol con inicial mayúscula
const formattedRole = computed(() => {
  if (!user.value?.rol) return "";
  const role = user.value.rol.toLowerCase();
  if (role === 'admin' || role === 'administrador') return 'Administrador';
  if (role === 'usuario' || role === 'estudiante' || role === 'user') return 'Estudiante';
  if (role === 'instructor') return 'Instructor';
  return user.value.rol.charAt(0).toUpperCase() + user.value.rol.slice(1).toLowerCase();
});

// Ruta dinámica del perfil
const profileRoute = computed(() => {
  if (authStore.isAdmin) return '/admin-perfil';
  return '/perfil';
});

// Métodos
const toggleLangDropdown = () => {
  langDropdown.value = !langDropdown.value;
  if (profileDropdown.value) profileDropdown.value = false;
  if (notificationDropdown.value) notificationDropdown.value = false;
};

const toggleNotificationDropdown = () => {
  notificationDropdown.value = !notificationDropdown.value;
  if (profileDropdown.value) profileDropdown.value = false;
  if (langDropdown.value) langDropdown.value = false;
};

const toggleProfileDropdown = () => {
  profileDropdown.value = !profileDropdown.value;
  if (notificationDropdown.value) notificationDropdown.value = false;
  if (langDropdown.value) langDropdown.value = false;
};

const changeLang = (lang) => {
  currentLang.value = lang;
  langDropdown.value = false;
  closeMenu();
};

const toggleMenu = () => (menuOpen.value = !menuOpen.value);
const closeMenu = () => (menuOpen.value = false);

const handleLogout = () => {
  authStore.logout();
  profileDropdown.value = false;
  notificationDropdown.value = false;
  closeMenu();
  router.push('/');
};

const markAllAsRead = () => {
  notifications.value.forEach(notification => notification.read = true);
  hasNotifications.value = false;
};

const getNotificationIcon = (type) => {
  const icons = {
    course: '@/assets/icons/course-notification.png',
    message: '@/assets/icons/message-notification.png',
    system: '@/assets/icons/system-notification.png'
  };
  return icons[type] || '@/assets/icons/Notify.png';
};

// Cargar datos del perfil del usuario
const loadUserProfile = async () => {
  if (isAuthenticated.value && user.value?.id) {
    try {
      const response = await obtenerDatosPerfil(user.value.id);
      if (response) {
        userProfileData.value = response;
      }
    } catch (error) {
      console.error('Error al cargar datos del perfil:', error);
    }
  }
};

// Detección de móvil
const checkScreen = () => {
  isMobile.value = window.innerWidth <= 900;
};

// Observar cambios en autenticación
watch(isAuthenticated, (newValue) => {
  if (newValue) {
    loadUserProfile();
  } else {
    userProfileData.value = null;
  }
}, { immediate: true });

onMounted(() => {
  checkScreen();
  window.addEventListener("resize", checkScreen);
  
  // Cargar datos del perfil si está autenticado
  if (isAuthenticated.value) {
    loadUserProfile();
  }
  
  // Cerrar dropdowns al hacer clic fuera
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  window.removeEventListener("resize", checkScreen);
  document.removeEventListener('click', handleClickOutside);
});

const handleClickOutside = (event) => {
  const target = event.target;
  
  // Solo para desktop
  if (!isMobile.value) {
    const profileDropdownEl = document.querySelector('.dropdown-profile');
    const notificationDropdownEl = document.querySelector('.dropdown-notification');
    const langDropdownEl = document.querySelector('.dropdown-lang');
    
    if (profileDropdown.value && profileDropdownEl && !profileDropdownEl.contains(target)) {
      profileDropdown.value = false;
    }
    
    if (notificationDropdown.value && notificationDropdownEl && !notificationDropdownEl.contains(target)) {
      notificationDropdown.value = false;
    }
    
    if (langDropdown.value && langDropdownEl && !langDropdownEl.contains(target)) {
      langDropdown.value = false;
    }
  }
};
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

/* Eliminar efectos de tap en navegadores móviles */
.navbar * {
  -webkit-tap-highlight-color: rgba(136, 49, 255, 0.1);
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
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.65rem 1.4rem;
  transition: all 0.3s ease;
  color: #000;
  text-decoration: none;
}

.courses-btn:hover {
  border-color: #8831FF;
  color: #8831FF;
  background: white;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(136, 49, 255, 0.15);
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

/* Botón de iniciar sesión mejorado */
.login-btn {
  background: linear-gradient(135deg, #8831FF, #6a1bbf);
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.65rem 1.8rem;
  transition: all 0.3s ease;
  color: white;
  text-decoration: none;
  box-shadow: 0 4px 12px rgba(136, 49, 255, 0.25);
}

.login-btn:hover {
  background: linear-gradient(135deg, #7a2ce6, #5c18a8);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(136, 49, 255, 0.35);
}

.login-btn.mobile-login {
  padding: 0.5rem 1.2rem;
  font-size: 0.9rem;
  margin-left: auto;
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

/* Dropdown de notificaciones */
.dropdown-notification {
  position: relative;
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

.notification-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  width: 380px;
  max-height: 500px;
  overflow: hidden;
  z-index: 1000;
  margin-top: 0.5rem;
}

.notification-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.notification-header h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #1a1a1a;
}

.mark-all-read {
  background: none;
  border: none;
  color: #8831FF;
  font-size: 0.85rem;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background 0.2s ease;
}

.mark-all-read:hover {
  background: rgba(136, 49, 255, 0.1);
}

.notification-list {
  max-height: 350px;
  overflow-y: auto;
  padding: 0.5rem 0;
}

.notification-item {
  display: flex;
  align-items: flex-start;
  padding: 1rem 1.5rem;
  gap: 1rem;
  transition: background 0.2s ease;
  cursor: pointer;
}

.notification-item:hover {
  background: #f9f9f9;
}

.notification-item.unread {
  background: rgba(136, 49, 255, 0.05);
}

.notification-item.unread:hover {
  background: rgba(136, 49, 255, 0.08);
}

.notification-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(136, 49, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.notification-icon img {
  width: 20px;
  height: 20px;
}

.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-title {
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 4px 0;
  font-size: 0.95rem;
}

.notification-message {
  color: #666;
  margin: 0 0 4px 0;
  font-size: 0.9rem;
  line-height: 1.3;
}

.notification-time {
  font-size: 0.8rem;
  color: #999;
}

.no-notifications {
  text-align: center;
  padding: 2rem 1.5rem;
  color: #999;
  font-size: 0.95rem;
}

.view-all-link {
  display: block;
  text-align: center;
  padding: 1rem 1.5rem;
  border-top: 1px solid #eee;
  color: #8831FF;
  text-decoration: none;
  font-weight: 600;
  transition: background 0.2s ease;
}

.view-all-link:hover {
  background: rgba(136, 49, 255, 0.05);
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
  border: 2px solid #f0f0f0;
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
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  padding: 0.5rem 0;
  min-width: 200px;
  z-index: 1000;
  margin-top: 0.5rem;
}

.profile-option {
  display: block;
  width: 100%;
  background: none;
  border: none;
  padding: 0.75rem 1.5rem;
  text-align: left;
  cursor: pointer;
  font-size: 0.95rem;
  color: #333;
  text-decoration: none;
  transition: background 0.2s ease;
}

.profile-option:hover {
  background: rgba(136, 49, 255, 0.1);
  color: #8831FF;
}

.profile-option.logout {
  color: #ff4444;
  border-top: 1px solid #eee;
  margin-top: 0.5rem;
  padding-top: 1rem;
}

.profile-option.logout:hover {
  background: rgba(255, 68, 68, 0.1);
}

/* Sidebar móvil */
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  max-width: 320px;
  height: 100vh;
  background: white;
  z-index: 10001;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 20px rgba(0, 0, 0, 0.15);
  transform: translateX(0);
  transition: transform 0.3s ease;
}

.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 10000;
}

.sidebar-header {
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: flex-end;
  border-bottom: 1px solid #eee;
}

.mobile-profile {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
}

.mobile-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #f0f0f0;
}

.mobile-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.mobile-user-info {
  flex: 1;
}

.mobile-username {
  display: block;
  font-weight: 600;
  font-size: 1.1rem;
  color: #1a1a1a;
  margin-bottom: 4px;
}

.mobile-user-role {
  display: block;
  font-size: 0.9rem;
  color: #666;
}

.side-links {
  list-style: none;
  padding: 0;
  margin: 0;
  flex: 1;
}

.side-link {
  display: block;
  padding: 1rem 1.5rem;
  color: #1a1a1a;
  text-decoration: none;
  font-size: 1rem;
  font-weight: 500;
  border-bottom: 1px solid #f5f5f5;
  transition: background 0.2s ease;
}

.side-link:hover {
  background: rgba(136, 49, 255, 0.05);
  color: #8831FF;
}

.mobile-language {
  padding: 1.5rem;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
}

.language-title {
  margin: 0 0 1rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: #1a1a1a;
}

.language-options {
  display: flex;
  gap: 0.5rem;
}

.language-option {
  flex: 1;
  padding: 0.75rem;
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.language-option.active {
  background: #8831FF;
  color: white;
  border-color: #8831FF;
}

.language-option:hover:not(.active) {
  background: #e9e9e9;
}

.mobile-auth {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.mobile-login-btn,
.mobile-register-btn {
  display: block;
  text-align: center;
  padding: 1rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.2s ease;
}

.mobile-login-btn {
  background: linear-gradient(135deg, #8831FF, #6a1bbf);
  color: white;
  border: 2px solid #8831FF;
}

.mobile-login-btn:hover {
  background: linear-gradient(135deg, #7a2ce6, #5c18a8);
  border-color: #7a2ce6;
}

.mobile-register-btn {
  background: white;
  color: #8831FF;
  border: 2px solid #8831FF;
}

.mobile-register-btn:hover {
  background: rgba(136, 49, 255, 0.05);
}

.mobile-logout {
  padding: 1.5rem;
  background: none;
  border: none;
  border-top: 1px solid #eee;
  color: #ff4444;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s ease;
  text-align: left;
}

.mobile-logout:hover {
  background: rgba(255, 68, 68, 0.05);
}

/* Transiciones */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
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

  /* Mostrar solo logo de letras en mobile */
  .logo-img {
    display: none;
  }

  .logo-text {
    height: 200px;
    max-height: 100px;
    width: auto;
  }

  /* Ocultar elementos que no deben aparecer en mobile */
  .dropdown-lang,
  .help:not(.mobile-help),
  .dropdown-notification:not(.mobile-notification) {
    display: none;
  }

  /* Mostrar botones de ayuda y notificaciones en mobile cuando esté logueado */
  .right-section .help,
  .right-section .notification {
    display: flex !important;
  }

  /* Ocultar nombre y rol en mobile */
  .profile-btn .user-info {
    display: none;
  }

  .profile-btn .avatar {
    width: 32px;
    height: 32px;
  }

  /* Botón de iniciar sesión en mobile */
  .login-btn.mobile-login {
    padding: 0.5rem 1rem;
    font-size: 0.85rem;
  }

  /* =========================================== */
  /* CORRECCIONES PARA EL EFECTO AZUL EN MÓVILES */
  /* =========================================== */
  
  /* Eliminar outline en focus para móviles */
  button:focus,
  a:focus,
  input:focus,
  textarea:focus,
  select:focus {
    outline: none;
    box-shadow: none;
  }
  
  /* Eliminar completamente el highlight azul en móviles */
  .navbar button,
  .navbar a,
  .navbar .icon-btn,
  .navbar .profile-btn,
  .navbar .login-btn {
    -webkit-tap-highlight-color: rgba(136, 49, 255, 0.1);
  }
  
  /* Botón hamburguesa específicamente */
  .hamburger {
    -webkit-tap-highlight-color: rgba(136, 49, 255, 0.1);
  }
  
  .hamburger:active {
    background-color: rgba(136, 49, 255, 0.1) !important;
  }
  
  /* Logo cuando se presiona */
  .logo:active {
    opacity: 0.8;
  }
  
  /* Icon buttons cuando se presionan */
  .icon-btn:active,
  .notification:active,
  .help:active {
    background-color: rgba(136, 49, 255, 0.1) !important;
  }
  
  /* Botón de perfil cuando se presiona */
  .profile-btn:active {
    background-color: rgba(136, 49, 255, 0.1) !important;
  }
  
  /* Botón de login cuando se presiona */
  .login-btn.mobile-login:active {
    background: linear-gradient(135deg, #7a2ce6, #5c18a8) !important;
    transform: scale(0.98);
  }
  
  /* Para la sidebar también */
  .side-link:active,
  .mobile-login-btn:active,
  .mobile-register-btn:active,
  .language-option:active,
  .mobile-logout:active {
    background-color: rgba(136, 49, 255, 0.1) !important;
  }
  
  .mobile-login-btn:active {
    background: linear-gradient(135deg, #7a2ce6, #5c18a8) !important;
  }
  
  .mobile-register-btn:active {
    background: rgba(136, 49, 255, 0.1) !important;
  }
  
  .mobile-logout:active {
    background: rgba(255, 68, 68, 0.1) !important;
  }
  
  /* Botón de cerrar sidebar */
  .close:active {
    background-color: rgba(136, 49, 255, 0.1) !important;
  }
}

@media (max-width: 480px) {
  .logo-text {
    height: 150px;
    max-height: 150px;
  }
  
  .login-btn.mobile-login {
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
  }
  
  .navbar {
    padding: 0 0.75rem;
  }
}
</style>