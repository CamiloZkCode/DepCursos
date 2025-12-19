<template>
  <header class="profile__header">
    <!-- Avatar -->
    <div class="profile__avatar-container">
      <div class="profile__avatar">
        <img :src="avatarSrc" alt="Avatar del usuario" class="profile__avatar-img" />
      </div>
      <label for="avatar-upload" class="profile__avatar-edit" aria-label="Cambiar foto de perfil">
        <input id="avatar-upload" type="file" accept="image/*" @change="emit('change-avatar', $event)" class="hidden-input" />
        <span class="icon">📷</span>
      </label>
    </div>

    <!-- Nombre y rol -->
    <div class="profile__info">
      <h1 class="profile__name">{{ user.fullName }}</h1>
      <p class="profile__role">{{ user.role }}</p>
    </div>

    <!-- Estadísticas -->
    <div class="profile__stats">
      <!-- Estadísticas para Estudiante -->
      <template v-if="isEstudiante">
        <div class="profile__stat">
          <span class="profile__stat-icon">🏆</span>
          <span class="profile__stat-value">{{ user.badges }}</span>
          <span class="profile__stat-label">Insignias obtenidas</span>
        </div>
        <div class="profile__stat">
          <span class="profile__stat-icon">📚</span>
          <span class="profile__stat-value">{{ user.completedCourses }}</span>
          <span class="profile__stat-label">Cursos completados</span>
        </div>
      </template>

      <!-- Estadísticas para Administrador -->
      <template v-else-if="isAdmin">
        <div class="profile__stat">
          <span class="profile__stat-icon">📚</span>
          <span class="profile__stat-value">{{ user.createdCourses }}</span>
          <span class="profile__stat-label">Cursos Creados</span>
        </div>
        <div class="profile__stat">
          <span class="profile__stat-icon">👥</span>
          <span class="profile__stat-value">{{ user.instructors }}</span>
          <span class="profile__stat-label">Instructores</span>
        </div>
      </template>
    </div>
  </header>
</template>

<script setup>
defineProps({
  user: {
    type: Object,
    required: true
  },
  avatarSrc: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  isEstudiante: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['change-avatar'])
</script>

<style scoped>
/* ===== Header del Perfil ===== */
.profile__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  background: linear-gradient(135deg, var(--color-morado), var(--color-naranja));
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