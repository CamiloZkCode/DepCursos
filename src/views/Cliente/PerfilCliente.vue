<template>
  <main class="profile" aria-describedby="profile-intro">
    <ProfileHeader 
      :user="user" 
      :avatar-src="avatarSrc" 
      @change-avatar="handleAvatarChange"
      :is-estudiante="true"
      :is-admin="false"
    />

    <!-- ===== NAVEGACIÓN DE TABS ===== -->
    <nav class="profile__tabs" role="tablist" aria-label="Secciones del perfil">
      <button v-for="tab in tabs" :key="tab.id" class="profile__tab" :class="{ 'is-active': activeTab === tab.id }"
        @click="activeTab = tab.id" role="tab" :aria-selected="activeTab === tab.id" :aria-controls="tab.id">
        <span class="profile__tab-icon">{{ tab.icon }}</span>
        {{ tab.label }}
      </button>
    </nav>

    <!-- ===== CONTENIDO DE TABS ===== -->
    <section class="profile__content">
      <!-- TAB: PERFIL -->
      <div v-if="activeTab === 'perfil'" id="perfil" role="tabpanel">
        <header class="section-header">
          <h2>Información básica</h2>
          <p>Actualiza tus datos personales.</p>
        </header>
        <form class="profile__form" @submit.prevent="updateProfile">
          <div class="profile__form-group">
            <label for="nombre">Nombre *</label>
            <input id="nombre" v-model="editedUser.firstName" type="text" required @input="checkChanges" />
          </div>
          <div class="profile__form-group">
            <label for="apellido">Apellido *</label>
            <input id="apellido" v-model="editedUser.lastName" type="text" required @input="checkChanges" />
          </div>
          <div class="profile__form-group">
            <label for="telefono">Teléfono</label>
            <input id="telefono" v-model="editedUser.phone" type="tel" @input="checkChanges" />
          </div>
          <div class="profile__form-group">
            <label for="correo">Correo electrónico</label>
            <input id="correo" v-model="editedUser.email" type="email" @input="checkChanges" />
          </div>
          <div class="profile__form-group">
            <label for="idioma">Idioma predeterminado</label>
            <select id="idioma" v-model="editedUser.language" @change="checkChanges">
              <option value="Español (Spanish)">Español (Spanish)</option>
              <option value="English">English</option>
            </select>
          </div>
          <div class="profile__form-group">
            <label for="pais">País o región *</label>
            <select id="pais" v-model="editedUser.country" required @change="checkChanges">
              <option value="Colombia">Colombia</option>
            </select>
          </div>
          <div class="profile__form-group">
            <label for="estado">Estado o provincia *</label>
            <select id="estado" v-model="editedUser.state" required @change="checkChanges">
              <option value="Tolima">Tolima</option>
            </select>
          </div>
          <div class="profile__form-actions">
            <button type="button" class="btn btn--ghost" @click="showPasswordModal = true">
              Cambiar contraseña
            </button>
            <button type="submit" class="btn btn--primary" :disabled="!hasChanges">
              Actualizar
            </button>
          </div>
        </form>
      </div>

      <!-- TAB: INSIGNIAS Y CERTIFICADOS -->
      <div v-if="activeTab === 'insignias'" id="insignias" role="tabpanel">
        <header class="section-header">
          <h2>Mis Logros De Aprendizaje</h2>
          <p>Visualiza tus insignias y certificados obtenidos.</p>
        </header>
        <div class="profile__achievements">
          <input type="search" placeholder="Búsqueda por nombre, c." class="profile__search" />
          <nav class="profile__filters">
            <select><option>Ofrenda: Todas las ofertas</option></select>
            <select><option>Tipo: Todas</option></select>
            <select><option>Ordenar: Último</option></select>
          </nav>
          <ul class="profile__achievements-grid" role="list">
            <li v-for="achievement in achievements" :key="achievement.id" class="achievement">
              <article class="achievement__card">
                <div class="achievement__type">{{ achievement.type }}</div>
                <img :src="achievement.image" :alt="achievement.title" class="achievement__img" />
                <h3 class="achievement__title">{{ achievement.title }}</h3>
              </article>
            </li>
          </ul>
        </div>
      </div>

      <div v-if="activeTab === 'descuentos'" id="descuentos" role="tabpanel">
        <header class="section-header"><h2>Descuentos</h2><p>Aquí verás tus descuentos disponibles.</p></header>
      </div>
      <div v-if="activeTab === 'historia'" id="historia" role="tabpanel">
        <header class="section-header"><h2>Historia De Aprendizaje</h2><p>Revisa tu progreso en los cursos.</p></header>
      </div>
      <div v-if="activeTab === 'transcripcion'" id="transcripcion" role="tabpanel">
        <header class="section-header"><h2>Transcripción</h2><p>Descarga tu transcripción oficial.</p></header>
      </div>
    </section>

    <!-- Modal Cambio de Contraseña -->
    <teleport to="body">
      <div v-if="showPasswordModal" class="modal-backdrop" @click.self="showPasswordModal = false">
        <div class="modal" role="dialog" aria-modal="true" aria-labelledby="password-modal-title">
          <header class="modal__header">
            <h3 id="password-modal-title">Cambiar Contraseña</h3>
            <button class="modal__close" @click="showPasswordModal = false" aria-label="Cerrar">✕</button>
          </header>
          <div class="modal__body">
            <form @submit.prevent="submitChangePassword">
              <div class="grid">
                <div class="field">
                  <label for="current-password">Contraseña actual *</label>
                  <input id="current-password" v-model="passwordForm.current" type="password" required />
                </div>
                <div class="field">
                  <label for="new-password">Nueva contraseña *</label>
                  <input id="new-password" v-model="passwordForm.new" type="password" required />
                </div>
                <div class="field">
                  <label for="confirm-password">Confirmar nueva contraseña *</label>
                  <input id="confirm-password" v-model="passwordForm.confirm" type="password" required />
                </div>
              </div>
              <p v-if="passwordError" class="error-message">{{ passwordError }}</p>
              <div class="modal__actions">
                <button type="button" class="btn btn--ghost" @click="showPasswordModal = false">Cancelar</button>
                <button type="submit" class="btn btn--primary">Cambiar Contraseña</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </teleport>
  </main>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import ProfileHeader from '@/components/ProfileHeader.vue'

const user = reactive({
  firstName: 'Juan Camilo',
  lastName: 'Pimiento Garcia',
  phone: '+57 123 456 789',
  email: 'juan@example.com',
  language: 'Español (Spanish)',
  country: 'Colombia',
  state: 'Tolima',
  fullName: computed(() => `${user.firstName} ${user.lastName}`),
  role: 'Estudiante - Academia Deportiva',
  badges: 1,
  completedCourses: 0
})

const editedUser = ref({ ...user })
const hasChanges = ref(false)
const showPasswordModal = ref(false)

const passwordForm = reactive({
  current: '',
  new: '',
  confirm: ''
})
const passwordError = ref('')

const checkChanges = () => {
  hasChanges.value = JSON.stringify(editedUser.value) !== JSON.stringify({
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone,
    email: user.email,
    language: user.language,
    country: user.country,
    state: user.state
  })
}

const updateProfile = () => {
  if (hasChanges.value) {
    Object.assign(user, editedUser.value)
    hasChanges.value = false
    alert('Perfil actualizado exitosamente.')
  }
}

const submitChangePassword = () => {
  passwordError.value = ''
  if (!passwordForm.current) {
    passwordError.value = 'Ingrese su contraseña actual'
    return
  }
  if (passwordForm.new.length < 8) {
    passwordError.value = 'La nueva contraseña debe tener al menos 8 caracteres'
    return
  }
  if (passwordForm.new !== passwordForm.confirm) {
    passwordError.value = 'Las contraseñas no coinciden'
    return
  }
  alert('Contraseña cambiada exitosamente.')
  passwordForm.current = ''
  passwordForm.new = ''
  passwordForm.confirm = ''
  showPasswordModal.value = false
}

const tabs = [
  { id: 'perfil', label: 'Perfil', icon: '👤' },
  { id: 'insignias', label: 'Insignias Y Certificados', icon: '🏆' },
  { id: 'descuentos', label: 'Descuentos', icon: '💸' },
  { id: 'historia', label: 'Historia De Aprendizaje', icon: '📜' },
  { id: 'transcripcion', label: 'Transcripción', icon: '📄' }
]

const activeTab = ref('perfil')

const achievements = reactive([
  { id: 1, type: 'Insignia', image: 'https://via.placeholder.com/150?text=Insignia+IoT', title: 'Introduction to IoT' },
  { id: 2, type: 'Certificado', image: 'https://via.placeholder.com/150?text=Cert+IoT', title: 'Introduction to IoT' },
  { id: 3, type: 'Certificado', image: 'https://via.placeholder.com/150?text=Cert+Packet+Tracer', title: 'Introduction to Packet Tracer' }
])

const avatarSrc = ref('/src/assets/icons/LogoFondo.jpeg')

const handleAvatarChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    avatarSrc.value = URL.createObjectURL(file)
    alert('Imagen de perfil actualizada (simulado).')
  }
}
</script>

<style scoped>
.profile {
  display: grid;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

.profile__tabs {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  border-bottom: 1px solid var(--color-light);
}

.profile__tab {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  background: transparent;
  border: none;
  cursor: pointer;
  color: var(--color-oscuro-variante);
  transition: color 0.2s ease, border-bottom 0.2s ease;
  border-bottom: 3px solid transparent;
  white-space: nowrap;
}

.profile__tab.is-active {
  color: var(--color-morado);
  border-bottom: 3px solid var(--color-morado);
}

.profile__tab-icon {
  font-size: 1.2rem;
}

.profile__content {
  background: var(--color-blanco);
  border-radius: var(--border-radius-3);
  box-shadow: var(--box-shadow);
  padding: 1.5rem;
  overflow-x: hidden;
}

.profile__form {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.profile__form-group {
  display: flex;
  flex-direction: column;
}

.profile__form-group label {
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--color-oscuro);
}

.profile__form-group input,
.profile__form-group select {
  padding: 0.75rem;
  border: 1px solid var(--color-light);
  border-radius: var(--border-radius-2);
  background: var(--color-blanco);
  color: var(--color-oscuro);
}

.profile__form-actions {
  grid-column: 1 / -1;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

.profile__achievements {
  display: grid;
  gap: 1rem;
}

.profile__search {
  padding: 0.75rem;
  border: 1px solid var(--color-light);
  border-radius: var(--border-radius-2);
  width: 100%;
}

.profile__filters {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.profile__filters select {
  flex: 1 1 100px;
  padding: 0.75rem;
  border: 1px solid var(--color-light);
  border-radius: var(--border-radius-2);
}

.profile__achievements-grid {
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
}

.achievement__card {
  background: var(--color-blanco);
  border-radius: var(--border-radius-3);
  box-shadow: var(--box-shadow);
  padding: 1rem;
  text-align: center;
}

.achievement__type {
  background: var(--color-morado);
  color: var(--color-blanco);
  padding: 0.25rem 0.5rem;
  border-radius: 999px;
  font-size: 0.8rem;
  margin-bottom: 0.5rem;
  display: inline-block;
}

.achievement__img {
  width: 100%;
  height: 120px;
  object-fit: contain;
  margin-bottom: 0.5rem;
}

.achievement__title {
  margin: 0;
  font-size: 1rem;
  color: var(--color-oscuro);
}

.btn {
  padding: 0.6rem 1rem;
  border-radius: var(--border-radius-2);
  border: 1px solid transparent;
  cursor: pointer;
  font-weight: 700;
  letter-spacing: .2px;
  transition: transform 120ms ease, filter 120ms ease;
}

.btn:hover {
  transform: translateY(-1px);
  filter: brightness(.98);
}

.btn--primary {
  background: var(--color-morado);
  color: var(--color-blanco);
}

.btn--ghost {
  background: transparent;
  border-color: var(--color-morado);
  color: var(--color-morado);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.section-header {
  text-align: left;
  margin: 0 0 1.25rem;
}

.section-header h2 {
  margin: 0 0 .25rem;
  color: var(--color-oscuro);
  font-size: clamp(1.6rem, 3vw, 2.1rem);
}

.section-header p {
  margin: 0;
  color: var(--color-oscuro-variante);
}

.error-message {
  color: red;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  grid-column: 1 / -1;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(5px);
  display: grid;
  place-items: center;
  padding: 1rem;
  z-index: 1000;
}

.modal {
  background: var(--color-blanco);
  width: min(500px, 100%);
  max-height: 90vh;
  overflow-y: auto;
  border-radius: 0.6rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.modal__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.9rem 1rem;
  border-bottom: 1px solid #d1e3ff;
}

.modal__close {
  background: transparent;
  border: 1px solid #d1e3ff;
  border-radius: 0.4rem;
  padding: 0.25rem 0.45rem;
  cursor: pointer;
}

.modal__body {
  padding: 1rem;
}

.grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr;
}

.field label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.field input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--color-light);
  border-radius: var(--border-radius-2);
}

.modal__actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.6rem;
  margin-top: 1rem;
}

@media (max-width: 768px) {
  .profile__form {
    grid-template-columns: 1fr;
  }

  .profile__achievements-grid {
    grid-template-columns: 1fr;
  }

  .profile__filters {
    flex-direction: column;
  }

  .profile__content {
    padding: 1rem;
  }
}
</style>