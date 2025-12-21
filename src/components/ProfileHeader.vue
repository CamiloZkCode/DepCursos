<template>
  <header class="profile__header">
    <!-- Avatar -->
    <div class="profile__avatar-container">
      <div class="profile__avatar">
        <img :src="avatarSrc" alt="Avatar del usuario" class="profile__avatar-img" />
      </div>
      <label for="avatar-upload" class="profile__avatar-edit" aria-label="Cambiar foto de perfil">
        <input 
          id="avatar-upload" 
          type="file" 
          accept="image/*" 
          @change="handleAvatarChange" 
          class="hidden-input" 
        />
        <span class="icon">📷</span>
      </label>
    </div>

    <!-- Nombre y rol -->
    <div class="profile__info">
      <h1 class="profile__name">{{ authStore.user?.nombre || 'Usuario' }}</h1>
      <p class="profile__role">{{ rolDisplay }}</p>
    </div>

    <!-- Estadísticas según rol -->
    <div class="profile__stats">
      <!-- Para Estudiante -->
      <template v-if="authStore.isEstudiante">
        <div class="profile__stat">
          <span class="profile__stat-icon">🏆</span>
          <span class="profile__stat-value">{{ userStats.badges }}</span>
          <span class="profile__stat-label">Insignias obtenidas</span>
        </div>
        <div class="profile__stat">
          <span class="profile__stat-icon">📚</span>
          <span class="profile__stat-value">{{ userStats.completedCourses }}</span>
          <span class="profile__stat-label">Cursos completados</span>
        </div>
      </template>

      <!-- Para Administrador -->
      <template v-else-if="authStore.isAdmin">
        <div class="profile__stat">
          <span class="profile__stat-icon">📚</span>
          <span class="profile__stat-value">{{ userStats.createdCourses }}</span>
          <span class="profile__stat-label">Cursos Creados</span>
        </div>
        <div class="profile__stat">
          <span class="profile__stat-icon">👥</span>
          <span class="profile__stat-value">{{ userStats.instructors }}</span>
          <span class="profile__stat-label">Instructores</span>
        </div>
      </template>
    </div>
  </header>
</template>

<script setup>
import { useAuthStore } from '@/store/auth' // Ajusta la ruta si es necesario
import { ref, computed, onMounted } from 'vue'
import { actualizarAvatarUsuario,obtenerDatosPerfil } from '../services/usuario.services'


const authStore = useAuthStore()

// Avatar local (preview al cambiar)
const avatarSrc = ref('/src/assets/icons/LogoFondo.jpeg')

// Estadísticas (valores que vienen del backend en authStore.user)
const userStats = computed(() => ({
  badges: authStore.user?.badges || 0,
  completedCourses: authStore.user?.completedCourses || 0,
  createdCourses: authStore.user?.createdCourses || 0,
  instructors: authStore.user?.instructors || 0
}))

// Texto bonito del rol (sin tocar el store)
const rolDisplay = computed(() => {
  if (!authStore.user?.rol) return ''
  const rol = authStore.user.rol.toLowerCase()
  if (rol === 'admin') return 'Administrador' 
  if (rol === 'usuario') return 'Estudiante'
  if (rol === 'instructor') return 'Instructor'
  return 'Usuario'
})

// Cambio de avatar (solo preview local por ahora)
const handleAvatarChange = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // Preview inmediato
  avatarSrc.value = URL.createObjectURL(file);

  try {
    const data = await actualizarAvatarUsuario(
      authStore.user.id,
      file
    );


    if (data?.img_usuario) {
      authStore.user.img_usuario = data.img_usuario;
      avatarSrc.value = data.img_usuario;
    } else {
    }

  } catch (error) {
    console.error(error);
    alert("Error al subir la imagen");
  }
};


// Si el usuario ya tiene un avatar guardado, cargarlo

onMounted(async () => {
  try {
    const res = await obtenerDatosPerfil(authStore.user.id);
    if (res && res.img_usuario) {
      avatarSrc.value = res.img_usuario;
    } else {
    }

  } catch (error) {

  }
});


</script>

<style scoped>
/* ===== Header del Perfil ===== */
.profile__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  background: linear-gradient(135deg, var(--color-morado), #ff6b35, #ffa62e);
  color: var(--color-blanco);
  padding: 2rem;
  border-radius: var(--card-border-radius);
  box-shadow: var(--box-shadow);
}

.profile__avatar-container {
  position: relative;
  flex-shrink: 0;
}

.profile__avatar {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  overflow: hidden;
  border: 5px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.profile__avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile__avatar-edit {
  position: absolute;
  bottom: 7px;
  right: 7px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: var(--color-blanco);
  color: var(--color-oscuro);
  border: 3px solid var(--color-morado);
  cursor: pointer;
  display: grid;
  place-items: center;
  font-size: 1rem;
}

.profile__info {
  flex: 1;
  min-width: 0;
}

.profile__name {
  margin: 0;
  font-size: 2.2rem;
  font-weight: 700;
}

.profile__role {
  margin: 0.4rem 0 0;
  opacity: 0.95;
  font-size: 1.1rem;
}

.profile__stats {
  display: flex;
  gap: 2.5rem;
  flex-shrink: 0;
}

.profile__stat {
  text-align: center;
}

.profile__stat-icon {
  font-size: 1.8rem;
}

.profile__stat-value {
  display: block;
  font-size: 2rem;
  font-weight: 700;
}

.profile__stat-label {
  display: block;
  font-size: 0.95rem;
  opacity: 0.9;
}

.hidden-input {
  display: none;
}

/* Responsive */
@media (max-width: 768px) {
  .profile__header {
    flex-direction: column;
    text-align: center;
    padding: 1.5rem;
    gap: 1.5rem;
  }
  .profile__info { order: 1; }
  .profile__avatar-container { order: 2; }
  .profile__stats { order: 3; flex-direction: row; justify-content: center; gap: 2.5rem; }
  .profile__avatar { width: 120px; height: 120px; }
  .profile__name { font-size: 1.9rem; }
}
</style>