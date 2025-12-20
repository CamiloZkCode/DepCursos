<template>
  <main class="profile" aria-describedby="profile-intro">
    <!-- Componente reutilizable de header -->
    <ProfileHeader 
      :user="user" 
      :avatar-src="avatarSrc" 
      @change-avatar="handleAvatarChange"
      :is-admin="true"
      :is-estudiante="false"
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

      <!-- TAB: GESTIONAR CATEGORÍAS -->
      <div v-if="activeTab === 'categorias'" id="categorias" role="tabpanel">
        <header class="section-header">
          <h2>Gestionar Categorías</h2>
          <p>Crea y gestiona categorías para tus cursos.</p>
        </header>
        <section class="actions" aria-label="Gestión de categorías">
          <div class="actions__buttons">
            <button class="btn btn--primary" @click="openCreateCategoryModal">
              Crear Categoría
            </button>
          </div>
        </section>
        <section class="results" aria-live="polite">
          <ul class="cards" v-if="categories.length">
            <li v-for="category in categories" :key="category.id" class="card">
              <article :style="{ '--img': `url(${category.image_url || '/src/assets/icons/LogoFondo.jpeg'})` }">
                <div class="card__media"></div>
                <div class="card__content">
                  <header class="card__head">
                    <h3 class="card__title">{{ category.name }}</h3>
                  </header>
                  <dl class="card__info">
                    <div class="row">
                      <dt>Descripción:</dt>
                      <dd>{{ category.description || 'Sin descripción' }}</dd>
                    </div>
                  </dl>
                  <footer class="card__actions">
                    <button class="btn btn--primary btn--small" @click="openEditCategoryModal(category)">Editar</button>
                  </footer>
                </div>
              </article>
            </li>
          </ul>
          <p v-else class="empty">No hay categorías registradas.</p>
        </section>
      </div>

      <!-- TAB: GESTIONAR INSTRUCTORES -->
      <div v-if="activeTab === 'instructores'" id="instructores" role="tabpanel">
        <header class="section-header">
          <h2>Gestionar Instructores</h2>
          <p>Visualiza y gestiona los instructores.</p>
        </header>
        <section class="actions" aria-label="Gestión de instructores">
          <div class="actions__buttons">
            <button class="btn btn--primary" @click="openCreateInstructorModal">
              Crear Instructor
            </button>
          </div>
        </section>
        <div class="profile__management">
          <div class="instructors__table-wrapper">
            <table class="instructors__table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Teléfono</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="instructor in instructorsList" :key="instructor.id">
                  <td>{{ instructor.name }}</td>
                  <td>{{ instructor.email }}</td>
                  <td>{{ instructor.phone }}</td>
                  <td>
                    <button class="btn" :class="instructor.active ? 'btn--ghost' : 'btn--primary'" @click="toggleInstructorAccess(instructor.id)">
                      {{ instructor.active ? 'Desactivar' : 'Activar' }}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- TAB: ESTADÍSTICAS -->
      <div v-if="activeTab === 'estadisticas'" id="estadisticas" role="tabpanel">
        <header class="section-header">
          <h2>Estadísticas</h2>
          <p>Visualiza diferentes métricas de tu academia</p>
        </header>
        <div class="stats-selector">
          <label for="stats-type">Ver estadísticas de:</label>
          <select id="stats-type" v-model="selectedStatsType">
            <option value="total">Cantidad de inscritos total</option>
            <option value="per-course">Cantidad de inscritos por curso</option>
            <option value="registered-users">Cantidad de registrados en la página</option>
          </select>
        </div>
        <div class="profile__stats-section">
          <div v-if="selectedStatsType === 'total'" class="stats__card stats__card--large">
            <h3>Total de inscritos</h3>
            <div class="stats__value">{{ totalEnrolled }}</div>
            <p>en todos los cursos</p>
          </div>
          <div v-else-if="selectedStatsType === 'per-course'">
            <div v-for="course in courses" :key="course.id" class="stats__item">
              <h3>{{ course.title }}</h3>
              <div class="stats__gauge">
                <div class="stats__gauge-bar" :style="{ width: (course.enrolled / course.maxEnrolled * 100) + '%' }"></div>
              </div>
              <p>{{ course.enrolled }} / {{ course.maxEnrolled }} inscritos</p>
            </div>
          </div>
          <div v-else-if="selectedStatsType === 'registered-users'" class="stats__card stats__card--large">
            <h3>Usuarios registrados</h3>
            <div class="stats__value">{{ totalRegisteredUsers }}</div>
            <p>en la plataforma</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== MODALES (teleport) ===== -->
    <teleport to="body">
      <!-- Modal Cambio de Contraseña -->
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

      <!-- Modal Categorías -->
      <div v-if="showCategoryModal" class="modal-backdrop" @click.self="closeCategoryModal">
        <div class="modal" role="dialog" aria-modal="true" aria-labelledby="category-title">
          <header class="modal__header">
            <h3 id="category-title">{{ categoryModalTitle }}</h3>
            <button class="modal__close" @click="closeCategoryModal" aria-label="Cerrar">✕</button>
          </header>
          <div class="modal__body">
            <form class="form" @submit.prevent="saveCategory">
              <div class="grid">
                <div class="field">
                  <label for="category-name">Nombre *</label>
                  <div class="input-wrapper">
                    <input id="category-name" v-model="formCategory.name" type="text" required />
                    <span class="material-symbols-outlined icon-static">category</span>
                  </div>
                </div>
                <div class="field">
                  <label for="category-badge">Insignia de la categoría *</label>
                  <div class="input-wrapper">
                    <input id="category-badge" v-model="formCategory.badge" type="text" required />
                    <span class="material-symbols-outlined icon-static">badge</span>
                  </div>
                </div>
                <div class="field field--full">
                  <label for="category-description">Descripción</label>
                  <div class="input-wrapper">
                    <textarea id="category-description" v-model="formCategory.description"></textarea>
                    <span class="material-symbols-outlined icon-static">description</span>
                  </div>
                </div>

                <!-- CAMBIO: Subida de imagen en lugar de URL -->
                <div class="field field--full">
                  <label for="category-image-upload">Imagen de la categoría *</label>
                  <input 
                    id="category-image-upload" 
                    type="file" 
                    accept="image/*" 
                    @change="handleCategoryImageChange" 
                    required 
                  />
                  <!-- Vista previa de la nueva imagen seleccionada -->
                  <div v-if="categoryImagePreview" class="image-preview">
                    <img :src="categoryImagePreview" alt="Vista previa de la imagen seleccionada" />
                    <p><small>Nueva imagen seleccionada</small></p>
                  </div>
                  <!-- Mostrar imagen actual si estamos editando y no hay nueva -->
                  <div v-else-if="formCategory.image_url && formCategory.id" class="image-preview">
                    <img :src="formCategory.image_url" alt="Imagen actual de la categoría" />
                    <p><small>Imagen actual (se mantendrá si no subes una nueva)</small></p>
                  </div>
                </div>
              </div>
              <div class="modal__actions">
                <button type="button" class="btn btn--ghost" @click="closeCategoryModal">Cancelar</button>
                <button type="submit" class="btn btn--primary">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Modal Instructor -->
      <div v-if="showInstructorModal" class="modal-backdrop" @click.self="closeInstructorModal">
        <div class="modal" role="dialog" aria-modal="true" aria-labelledby="instructor-title">
          <header class="modal__header">
            <h3 id="instructor-title">Crear Nuevo Instructor</h3>
            <button class="modal__close" @click="closeInstructorModal" aria-label="Cerrar">✕</button>
          </header>
          <div class="modal__body">
            <form class="form" @submit.prevent="createInstructor">
              <div class="grid">
                <div class="field">
                  <label for="instructor-name">Nombre *</label>
                  <div class="input-wrapper">
                    <input id="instructor-name" v-model="newInstructor.name" type="text" required />
                    <span class="material-symbols-outlined icon-static">person</span>
                  </div>
                </div>
                <div class="field">
                  <label for="instructor-email">Correo *</label>
                  <div class="input-wrapper">
                    <input id="instructor-email" v-model="newInstructor.email" type="email" required />
                    <span class="material-symbols-outlined icon-static">mail</span>
                  </div>
                </div>
                <div class="field">
                  <label for="instructor-phone">Teléfono</label>
                  <div class="input-wrapper">
                    <input id="instructor-phone" v-model="newInstructor.phone" type="tel" />
                    <span class="material-symbols-outlined icon-static">call</span>
                  </div>
                </div>
                <div class="field">
                  <label for="instructor-password">Contraseña *</label>
                  <div class="input-wrapper">
                    <input id="instructor-password" :type="showInstructorPassword ? 'text' : 'password'" v-model="newInstructor.password" required />
                    <span class="material-symbols-outlined toggle-password" @click="toggleInstructorPassword"
                      :aria-label="showInstructorPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'">
                      {{ showInstructorPassword ? 'lock_open' : 'lock' }}
                    </span>
                  </div>
                </div>
                <div class="field">
                  <label for="instructor-confirm-password">Confirmar Contraseña *</label>
                  <div class="input-wrapper">
                    <input id="instructor-confirm-password" :type="showConfirmInstructorPassword ? 'text' : 'password'" v-model="newInstructor.confirmPassword" required />
                    <span class="material-symbols-outlined toggle-password" @click="toggleConfirmInstructorPassword"
                      :aria-label="showConfirmInstructorPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'">
                      {{ showConfirmInstructorPassword ? 'lock_open' : 'lock' }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="modal__actions">
                <button type="button" class="btn btn--ghost" @click="closeInstructorModal">Cancelar</button>
                <button type="submit" class="btn btn--primary">Guardar</button>
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

const courses = reactive([
  {
    id: 1,
    title: 'Curso Ejemplo 1',
    description: 'Descripción 1',
    enrolled: 50,
    maxEnrolled: 100,
    price: 49.99,
    coverImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48',
    category: 'Fitness',
    difficulty: 'Principiante',
    instructor: 'Instructor 1',
    status: 'Publicado'
  },
  {
    id: 2,
    title: 'Curso Ejemplo 2',
    description: 'Descripción 2',
    enrolled: 30,
    maxEnrolled: 80,
    price: 79.99,
    coverImage: '',
    category: 'Yoga',
    difficulty: 'Avanzado',
    instructor: 'Instructor 2',
    status: 'Borrador'
  }
])

const instructorsList = reactive([
  { id: 1, name: 'Instructor 1', email: 'inst1@example.com', phone: '+57 111 222 333', active: true },
  { id: 2, name: 'Instructor 2', email: 'inst2@example.com', phone: '+57 444 555 666', active: false }
])

const categories = reactive([
  {
    id: 1,
    name: 'Fitness',
    description: 'Categoría de fitness intensivo',
    image_url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 2,
    name: 'Yoga',
    description: 'Categoría de yoga y mindfulness',
    image_url: 'https://images.unsplash.com/photo-1545201019-6e2e1a9e3f2a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
  }
])

const user = reactive({
  firstName: 'Admin',
  lastName: 'Ejemplo',
  phone: '+57 123 456 789',
  email: 'admin@example.com',
  language: 'Español (Spanish)',
  country: 'Colombia',
  state: 'Tolima',
  fullName: computed(() => `${user.firstName} ${user.lastName}`),
  role: 'Administrador - Academia Deportiva',
  createdCourses: computed(() => courses.length),
  instructors: computed(() => instructorsList.length)
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
  { id: 'categorias', label: 'Gestionar Categorías', icon: '📂' },
  { id: 'instructores', label: 'Gestionar Instructores', icon: '👥' },
  { id: 'estadisticas', label: 'Estadísticas', icon: '📊' }
]

const activeTab = ref('perfil')

// Categorías
const showCategoryModal = ref(false)
const categoryModalTitle = ref('Nueva Categoría')
const formCategory = ref({ id: null, name: '', badge: '', description: '', image_url: '' })

// Nuevas variables para subida de imagen
const selectedCategoryImage = ref(null)
const categoryImagePreview = ref('')

const handleCategoryImageChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    selectedCategoryImage.value = file
    categoryImagePreview.value = URL.createObjectURL(file)
  }
}

const openCreateCategoryModal = () => {
  formCategory.value = { id: null, name: '', badge: '', description: '', image_url: '' }
  selectedCategoryImage.value = null
  categoryImagePreview.value = ''
  categoryModalTitle.value = 'Nueva Categoría'
  showCategoryModal.value = true
}

const openEditCategoryModal = (category) => {
  formCategory.value = { ...category }
  selectedCategoryImage.value = null
  categoryImagePreview.value = ''
  categoryModalTitle.value = 'Editar Categoría'
  showCategoryModal.value = true
}

const closeCategoryModal = () => {
  showCategoryModal.value = false
  selectedCategoryImage.value = null
  categoryImagePreview.value = ''
}

const saveCategory = () => {
  if (formCategory.value.name && formCategory.value.badge) {
    if (formCategory.value.id) {
      const index = categories.findIndex(c => c.id === formCategory.value.id)
      if (index !== -1) {
        categories[index] = { 
          ...formCategory.value,
          image_url: selectedCategoryImage.value ? 'URL_SIMULADA_NUEVA_IMAGEN.jpg' : categories[index].image_url
        }
      }
    } else {
      categories.push({
        id: categories.length + 1,
        name: formCategory.value.name,
        badge: formCategory.value.badge,
        description: formCategory.value.description || '',
        image_url: selectedCategoryImage.value ? 'URL_SIMULADA_NUEVA_IMAGEN.jpg' : '/src/assets/icons/LogoFondo.jpeg'
      })
    }
    alert('Categoría guardada exitosamente (simulado).')
    closeCategoryModal()
  }
}

// Instructores
const newInstructor = ref({ name: '', email: '', phone: '', password: '', confirmPassword: '' })
const showInstructorModal = ref(false)
const showInstructorPassword = ref(false)
const showConfirmInstructorPassword = ref(false)

const toggleInstructorPassword = () => showInstructorPassword.value = !showInstructorPassword.value
const toggleConfirmInstructorPassword = () => showConfirmInstructorPassword.value = !showConfirmInstructorPassword.value

const openCreateInstructorModal = () => {
  newInstructor.value = { name: '', email: '', phone: '', password: '', confirmPassword: '' }
  showInstructorModal.value = true
}

const closeInstructorModal = () => showInstructorModal.value = false

const createInstructor = () => {
  if (newInstructor.value.password !== newInstructor.value.confirmPassword) {
    alert('Las contraseñas no coinciden.')
    return
  }
  if (newInstructor.value.name && newInstructor.value.email && newInstructor.value.password) {
    instructorsList.push({
      id: instructorsList.length + 1,
      name: newInstructor.value.name,
      email: newInstructor.value.email,
      phone: newInstructor.value.phone || '',
      active: true
    })
    newInstructor.value = { name: '', email: '', phone: '', password: '', confirmPassword: '' }
    showInstructorModal.value = false
    alert('Instructor creado exitosamente (simulado).')
  }
}

const toggleInstructorAccess = (id) => {
  const instructor = instructorsList.find(i => i.id === id)
  if (instructor) {
    instructor.active = !instructor.active
    alert(`Acceso ${instructor.active ? 'activado' : 'desactivado'} (simulado).`)
  }
}

// Avatar
const avatarSrc = ref('/src/assets/icons/LogoFondo.jpeg')

const handleAvatarChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    avatarSrc.value = URL.createObjectURL(file)
    alert('Imagen de perfil actualizada (simulado).')
  }
}

// Estadísticas
const selectedStatsType = ref('per-course')
const totalEnrolled = computed(() => courses.reduce((sum, course) => sum + course.enrolled, 0))
const totalRegisteredUsers = ref(245)
</script>

<style scoped>
/* ===== Base ===== */
.profile {
  display: grid;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

/* ===== Tabs ===== */
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

/* ===== Contenido ===== */
.profile__content {
  background: var(--color-blanco);
  border-radius: var(--border-radius-3);
  box-shadow: var(--box-shadow);
  padding: 1.5rem;
  overflow-x: hidden;
}

/* ===== Formulario ===== */
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
.profile__form-group select,
.profile__form-group textarea {
  padding: 0.75rem;
  border: 1px solid var(--color-light);
  border-radius: var(--border-radius-2);
  background: var(--color-blanco);
  color: var(--color-oscuro);
}

.profile__form-group textarea {
  min-height: 100px;
  resize: vertical;
}

.profile__form-actions {
  grid-column: 1 / -1;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

/* ===== Gestión ===== */
.profile__management {
  display: grid;
  gap: 2rem;
}

/* ===== Tabla de Instructores ===== */
.instructors__table-wrapper {
  overflow-x: auto;
  margin-bottom: 2rem;
}

.instructors__table {
  width: 100%;
  border-collapse: collapse;
  min-width: 600px;
}

.instructors__table th,
.instructors__table td {
  padding: 0.75rem;
  border: 1px solid var(--color-light);
  text-align: left;
}

.instructors__table th {
  background: var(--color-morado);
  color: var(--color-blanco);
}

/* ===== Estadísticas ===== */
.profile__stats-section {
  display: grid;
  gap: 1rem;
}

.stats__item {
  background: var(--color-blanco);
  border-radius: var(--border-radius-3);
  box-shadow: var(--box-shadow);
  padding: 2rem;
  border: 3px solid transparent;
  margin-bottom: 1rem;
  border-image: linear-gradient(135deg, var(--color-naranja), var(--color-morado)) 1;
}

.stats__gauge {
  background: var(--color-light);
  border-radius: 999px;
  height: 16px;
  overflow: hidden;
  margin: 1rem 0;
}

.stats__gauge-bar {
  background: linear-gradient(90deg, var(--color-naranja), var(--color-morado));
  height: 100%;
  transition: width 0.6s ease;
}

.stats-selector {
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.stats-selector label {
  font-weight: 600;
  color: var(--color-oscuro);
}

.stats-selector select {
  padding: 0.75rem 1rem;
  border: 1px solid var(--color-light);
  border-radius: var(--border-radius-2);
  background: var(--color-blanco);
  font-size: 1rem;
  min-width: 250px;
}

.stats__card.stats__card--large {
  background: var(--color-blanco);
  border-radius: var(--border-radius-3);
  box-shadow: var(--box-shadow);
  padding: 2rem;
  text-align: center;
  border: 3px solid transparent;
  border-image: linear-gradient(135deg, var(--color-naranja), var(--color-morado)) 1;
}

.stats__card--large h3 {
  margin: 0 0 1rem;
  font-size: 1.5rem;
  color: var(--color-morado);
}

.stats__card--large .stats__value {
  font-size: 3.5rem;
  font-weight: 800;
  color: var(--color-morado);
  margin: 0.5rem 0;
}

.stats__card--large p {
  color: var(--color-oscuro-variante);
  font-size: 1.1rem;
}

.stats__item h3 {
  margin: 0 0 1rem;
  color: var(--color-morado);
}

/* ===== Cards (estilo del código viejo) ===== */
.actions {
  padding: 1rem;
}

.actions__buttons {
  display: flex;
  gap: 0.6rem;
  margin-top: 0.5rem;
}

.results {
  max-width: 1200px;
  margin: 0 auto;
}

.cards {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(12, 1fr);
}

.card {
  grid-column: span 12;
}

.card > article {
  background: var(--color-blanco);
  box-shadow: var(--box-shadow, 0 2px 6px rgba(0, 0, 0, 0.08));
  overflow: hidden;
  display: grid;
  grid-template-columns: 160px 1fr;
  align-items: stretch;
  min-height: 160px;
  border: 2px solid transparent;
  border-image: linear-gradient(135deg, var(--color-naranja), var(--color-morado)) 1;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card > article:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.card__media {
  background-image: var(--img);
  background-size: cover;
  background-position: center;
  min-height: 100%;
}

.card__content {
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
}

.card__head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card__title {
  margin: 0;
  color: var(--color-oscuro);
  font-size: 1.2rem;
}

.card__info {
  font-size: 0.9rem;
  color: var(--color-oscuro-variante);
}

.card__actions {
  display: flex;
  justify-content: center;
  padding-top: 0.5rem;
}

/* Responsive para cards de categorías (igual que en el viejo) */
@media (min-width: 720px) {
  .card {
    grid-column: span 6;
  }
}

@media (min-width: 1100px) {
  .card {
    grid-column: span 4;
  }
}

/* ===== Botones ===== */
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

.btn--small {
  font-size: 0.9rem;
  padding: 0.4rem 0.8rem;
}

/* ===== Modal ===== */
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
  width: min(820px, 100%);
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

.modal__header h3 {
  margin: 0;
  color: var(--color-oscuro);
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
  display: grid;
  gap: 1rem;
}

.grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr;
}

.field {
  display: grid;
  gap: 0.25rem;
}

.field label {
  color: var(--color-oscuro);
  font-weight: 700;
}

.field input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--color-light);
  border-radius: var(--border-radius-2);
  background: var(--color-blanco);
}

.modal__actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.6rem;
  margin-top: 1rem;
}

.error-message {
  color: red;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  grid-column: 1 / -1;
}

/* Estilos específicos para los modales con input-wrapper */
.input-wrapper {
  position: relative;
  width: 100%;
}

.input-wrapper input,
.input-wrapper textarea {
  width: 100%;
  padding: 0.55rem 2.5rem 0.55rem 0.7rem;
  border: 1px solid #d1e3ff;
  border-radius: 0.4rem;
  font: inherit;
  background: var(--color-blanco);
}

.icon-static {
  position: absolute;
  top: 50%;
  right: 0.7rem;
  transform: translateY(-50%);
  color: var(--color-azul-1);
  font-size: 1.3rem;
  pointer-events: none;
}

.toggle-password {
  position: absolute;
  top: 50%;
  right: 0.7rem;
  transform: translateY(-50%);
  cursor: pointer;
  background: transparent;
  border: none;
  font-size: 1.3rem;
  color: var(--color-morado);
  padding: 0;
}

/* Responsive general */
@media (max-width: 768px) {
  .profile__form {
    grid-template-columns: 1fr;
  }

  .profile__content {
    padding: 1rem;
  }

  .instructors__table {
    font-size: 0.9rem;
  }

  .stats-selector {
    flex-direction: column;
    align-items: flex-start;
  }

  .stats__card--large .stats__value {
    font-size: 2.8rem;
  }
}

/* Estilos adicionales para vista previa de imagen en modal de categoría */
.image-preview {
  margin-top: 1rem;
  text-align: center;
}

.image-preview img {
  max-width: 100%;
  max-height: 300px;
  border-radius: var(--border-radius-2);
  box-shadow: var(--box-shadow);
  object-fit: contain;
}

.image-preview p {
  margin-top: 0.5rem;
  color: var(--color-oscuro-variante);
  font-size: 0.9rem;
}
</style>