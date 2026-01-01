<template>
  <main class="profile" aria-describedby="profile-intro">
    <!-- Header -->
    <ProfileHeader 
      :user="user" 
      :avatar-src="avatarSrc" 
      @change-avatar="handleAvatarChange"
      :is-admin="true"
      :is-estudiante="false"
    />

    <!-- Navegación de Tabs -->
    <nav class="profile__tabs" role="tablist" aria-label="Gestión de cursos">
      <button 
        class="profile__tab"
        :class="{ 'is-active': activeTab === 'cursos' }"
        @click="activeTab = 'cursos'"
        role="tab"
        aria-selected="activeTab === 'cursos'"
      >
        <span class="profile__tab-icon">📚</span>
        <span class="profile__tab-label">Gestionar Cursos</span>
      </button>
    </nav>

    <section class="profile__content">
      <!-- Header con estadísticas -->
      <header class="section-header">
        <div class="header-content">
          <div>
            <h2>Gestión de Cursos</h2>
            <p>Crea y organiza cursos, módulos, lecciones y quizzes.</p>
          </div>
          <div class="header-stats">
            <div class="stat-card">
              <div class="stat-card__icon">📚</div>
              <div class="stat-card__content">
                <div class="stat-card__value">{{ courses.length }}</div>
                <div class="stat-card__label">Cursos Totales</div>
              </div>
            </div>
            <div class="stat-card" v-if="loading.courses">
              <div class="stat-card__icon">🔄</div>
              <div class="stat-card__content">
                <div class="stat-card__label">Cargando...</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Acciones principales -->
      <div class="management-header">
        <div class="view-controls">
          <button 
            class="view-toggle" 
            :class="{ 'active': viewMode === 'grid' }" 
            @click="viewMode = 'grid'"
          >
            <span>▦</span> Vista Cuadrícula
          </button>
          <button 
            class="view-toggle" 
            :class="{ 'active': viewMode === 'list' }" 
            @click="viewMode = 'list'"
          >
            <span>☰</span> Vista Tabla
          </button>
        </div>
        
        <div class="management-actions">
          <button 
            class="btn btn--outline btn--with-icon" 
            @click="refreshCourses"
            :disabled="loading.courses"
          >
            <span class="btn-icon" v-if="!loading.courses">🔄</span>
            <span class="spinner" v-else></span>
            Actualizar
          </button>
          <button class="btn btn--primary btn--with-icon" @click="openCreateCourseModal">
            <span class="btn-icon">➕</span>
            Crear Nuevo Curso
          </button>
        </div>
      </div>

      <!-- Mensaje de error -->
      <div v-if="error" class="error-message">
        <span class="error-icon">⚠️</span>
        <p>{{ error }}</p>
        <button class="btn btn--outline btn--small" @click="refreshCourses">
          Reintentar
        </button>
      </div>

      <!-- Vista de Cursos - Grid -->
      <div v-if="viewMode === 'grid' && courses.length" class="courses-grid">
        <div 
          v-for="course in courses" 
          :key="course.id_curso" 
          class="course-card"
        >
          <div class="course-card__image" :style="{ backgroundImage: `url(${course.img_portada || defaultCover})` }">
            <div class="course-card__badge" :class="`status-badge--${course.estatus === 'Publicado' ? 'active' : 'inactive'}`">
              {{ course.estatus }}
            </div>
            <div class="course-card__category">{{ getCategoryName(course.id_categoria) }}</div>
          </div>
          
          <div class="course-card__content">
            <div class="course-card__header">
              <h3 class="course-card__title">{{ course.titulo_curso }}</h3>
              <div class="course-card__meta">
                <div class="meta-item">
                  <span class="meta-icon">👨‍🏫</span>
                  <span>ID Instructor: {{ course.id_instructor }}</span>
                </div>
                <div class="meta-item">
                  <span>${{ course.precio }}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-icon">📊</span>
                  <span>{{ getDifficultyName(course.id_dificultad) }}</span>
                </div>
              </div>
            </div>
            
            <p class="course-card__description">{{ truncateText(course.descripcion, 120) }}</p>
            
            <div class="course-stats">
              <div class="stat-item">
                <span class="stat-value">{{ getModulesForCourse(course.id_curso).length }}</span>
                <span class="stat-label">Módulos</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">{{ getLessonsForCourse(course.id_curso).length }}</span>
                <span class="stat-label">Lecciones</span>
              </div>
            </div>
            
            <div class="course-card__actions">
              <div class="action-buttons">
                <button 
                  class="btn btn--outline btn--small" 
                  @click="openCourseDetail(course)"
                >
                  <span class="btn-icon">👁️</span>
                  Ver Detalles
                </button>
                <button 
                  class="btn btn--ghost btn--small" 
                  @click="openEditCourseModal(course)"
                >
                  <span class="btn-icon">✏️</span>
                  Editar
                </button>
              </div>
              
              <button 
                class="btn btn--primary btn--small btn--with-icon" 
                @click="openCreateModuleModal(course)"
              >
                <span class="btn-icon">➕</span>
                Agregar Módulo
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Vista de Cursos - List -->
      <div v-else-if="viewMode === 'list' && courses.length" class="table-container">
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Curso</th>
                <th>Categoría</th>
                <th>Instructor</th>
                <th>Estado</th>
                <th>Dificultad</th>
                <th>Precio</th>
                <th>Módulos</th>
                <th>Lecciones</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="course in courses" :key="course.id_curso">
                <td>
                  <div class="course-cell">
                    <div 
                      class="course-avatar" 
                      :style="{ backgroundImage: `url(${course.img_portada || defaultCover})` }"
                    ></div>
                    <div class="course-info">
                      <strong>{{ course.titulo_curso }}</strong>
                      <span class="course-description">{{ truncateText(course.descripcion, 50) }}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="category-badge">{{ getCategoryName(course.id_categoria) }}</span>
                </td>
                <td>
                  <span class="instructor-name">ID: {{ course.id_instructor }}</span>
                </td>
                <td>
                  <span class="status-badge" :class="`status-badge--${course.estatus === 'Publicado' ? 'active' : 'inactive'}`">
                    {{ course.estatus }}
                  </span>
                </td>
                <td>
                  <span class="difficulty-badge">{{ getDifficultyName(course.id_dificultad) }}</span>
                </td>
                <td>
                  <span class="course-price">${{ course.precio }}</span>
                </td>
                <td>
                  <span class="count-badge">{{ getModulesForCourse(course.id_curso).length }}</span>
                </td>
                <td>
                  <span class="count-badge">{{ getLessonsForCourse(course.id_curso).length }}</span>
                </td>
                <td>
                  <div class="action-buttons">
                    <button 
                      class="btn btn--outline btn--xs" 
                      @click="openCourseDetail(course)"
                      title="Ver detalles"
                    >
                      <span class="btn-icon">👁️</span>
                    </button>
                    <button 
                      class="btn btn--ghost btn--xs" 
                      @click="openEditCourseModal(course)"
                      title="Editar curso"
                    >
                      <span class="btn-icon">✏️</span>
                    </button>
                    <button 
                      class="btn btn--primary btn--xs" 
                      @click="openCreateModuleModal(course)"
                      title="Agregar módulo"
                    >
                      <span class="btn-icon">➕</span>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Estado de carga -->
      <div v-else-if="loading.courses" class="loading-state">
        <div class="spinner-large"></div>
        <p>Cargando cursos...</p>
      </div>

      <!-- Estado vacío -->
      <div v-else class="empty-state">
        <div class="empty-state__icon">📚</div>
        <h3 class="empty-state__title">No hay cursos creados</h3>
        <p class="empty-state__description">
          Comienza creando tu primer curso para compartir conocimiento
        </p>
        <button class="btn btn--primary" @click="openCreateCourseModal">
          <span class="btn-icon">➕</span>
          Crear Primer Curso
        </button>
      </div>
    </section>

    <!-- ===== COMPONENTE ÚNICO DE MODALES ===== -->
    <CourseModals
      ref="courseModalsRef"
      :show-course-detail-modal="showCourseDetailModal"
      :selected-course="selectedCourse"
      :course-modules="courseModules"
      :expanded-module="expandedModule"
      :lessons="lessons"
      :show-course-modal="showCourseModal"
      :course-modal-title="courseModalTitle"
      :form-course="formCourse"
      :instructors-list="instructorsList"
      :cover-preview="coverPreview"
      :show-module-modal="showModuleModal"
      :module-modal-title="moduleModalTitle"
      :form-module="formModule"
      :courses="courses"
      :show-lesson-modal="showLessonModal"
      :lesson-modal-title="lessonModalTitle"
      :form-lesson="formLesson"
      :available-modules-for-lesson="availableModulesForLesson"
      :selected-file-name="selectedFileName"
      :file-preview-url="filePreviewUrl"
      @close-course-detail="closeCourseDetailModal"
      @edit-course="openEditCourseModal"
      @create-module="openCreateModuleModal"
      @toggle-module="toggleModuleExpansion"
      @edit-module="openEditModuleModal"
      @create-lesson="openCreateLessonModal"
      @edit-lesson="openEditLessonModal"
      @close-course-modal="closeCourseModal"
      @save-course="handleSaveCourse"
      @cover-change="handleCoverChange"
      @clear-cover="clearCoverPreview"
      @close-module-modal="closeModuleModal"
      @save-module="saveModule"
      @close-lesson-modal="closeLessonModal"
      @save-lesson="saveLesson"
      @lesson-course-change="handleLessonCourseChange"
      @file-change="handleFileChange"
      @add-question="addQuestion"
      @remove-question="removeQuestion"
      @add-option="addOption"
      @remove-option="removeOption"
    />
  </main>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import Swal from 'sweetalert2'
import ProfileHeader from '@/components/ProfileHeader.vue'
import CourseModals from '@/components/CourseModals.vue'
import { cursoService } from '@/services/cursos.services'
import { categoriasService } from '@/services/categorias.services'
import { DificultadServices } from '@/services/dificultad.services'

// Referencia al componente de modales
const courseModalsRef = ref(null)

// Estado principal
const activeTab = ref('cursos')
const viewMode = ref('grid')
const expandedCourse = ref(null)
const expandedModule = ref(null)
const error = ref(null)

// Modales
const showCourseDetailModal = ref(false)
const selectedCourse = ref(null)
const showCourseModal = ref(false)
const showModuleModal = ref(false)
const showLessonModal = ref(false)

// Datos del usuario
const user = reactive({
  firstName: 'Admin',
  lastName: 'Ejemplo',
  fullName: computed(() => `${user.firstName} ${user.lastName}`),
  role: 'Administrador - Academia Deportiva'
})

const avatarSrc = ref('/src/assets/icons/LogoFondo.jpeg')
const defaultCover = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=200&fit=crop'

// Datos reales desde API
const courses = ref([])
const categories = ref([])
const difficulties = ref([])

// Datos de ejemplo para módulos y lecciones (hasta que tengas los endpoints)
const modules = ref([
  { id: 1, courseId: 1, title: 'Introducción al Yoga', order: 1 },
  { id: 2, courseId: 1, title: 'Posturas Básicas', order: 2 },
  { id: 3, courseId: 2, title: 'Fundamentos del Entrenamiento', order: 1 }
])

const lessons = ref([
  { 
    id: 1, 
    moduleId: 1, 
    title: '¿Qué es el Yoga?', 
    type: 'video', 
    order: 1, 
    duration: 15 
  },
  { 
    id: 2, 
    moduleId: 1, 
    title: 'Beneficios del Yoga', 
    type: 'texto', 
    order: 2, 
    duration: 10,
    contentText: 'El yoga ofrece numerosos beneficios...' 
  }
])

// Instructores (puedes cambiarlo por un endpoint si lo tienes)
const instructorsList = ref([
  { id: 1, name: 'Carlos Rodríguez' },
  { id: 2, name: 'Ana Martínez' },
  { id: 3, name: 'Luis Gómez' }
])

// Estados de carga
const loading = reactive({
  courses: false,
  categories: false,
  difficulties: false,
  save: false
})

// Computed properties
const totalModules = computed(() => modules.value.length)
const totalLessons = computed(() => lessons.value.length)
const totalQuizzes = computed(() => lessons.value.filter(l => l.type === 'quiz').length)

const courseModules = computed(() => {
  if (!selectedCourse.value) return []
  return getModulesForCourse(selectedCourse.value.id_curso)
})

// Cargar datos iniciales
onMounted(() => {
  loadInitialData()
})

// Métodos para cargar datos
const loadInitialData = async () => {
  await Promise.all([
    loadCourses(),
    loadCategories(),
    loadDifficulties()
  ])
}

const loadCourses = async () => {
  loading.courses = true
  error.value = null
  try {
    const response = await cursoService.obtenerCursos()
    if (response.success && response.data) {
      courses.value = response.data.map(course => ({
        ...course,
        // Asegurar que los nombres de los campos sean consistentes
        titulo_curso: course.titulo_curso || '',
        descripcion: course.descripcion || '',
        precio: course.precio || 0,
        img_portada: course.img_portada || defaultCover,
        estatus: course.estatus || 'Borrador'
      }))
    } else {
      courses.value = []
    }
  } catch (err) {
    console.error('Error al cargar cursos:', err)
    error.value = err.message || 'Error al cargar los cursos'
    courses.value = []
  } finally {
    loading.courses = false
  }
}

const loadCategories = async () => {
  loading.categories = true
  try {
    const response = await categoriasService.obtenerCategorias()
    if (response.success && response.data) {
      categories.value = response.data
    }
  } catch (err) {
    console.error('Error al cargar categorías:', err)
    categories.value = []
  } finally {
    loading.categories = false
  }
}

const loadDifficulties = async () => {
  loading.difficulties = true
  try {
    const response = await DificultadServices.obtenerDificultades()
    if (response.success && response.data) {
      difficulties.value = response.data
    }
  } catch (err) {
    console.error('Error al cargar dificultades:', err)
    difficulties.value = []
  } finally {
    loading.difficulties = false
  }
}

const refreshCourses = () => {
  loadCourses()
}

// Métodos auxiliares para obtener nombres
const getCategoryName = (categoryId) => {
  if (!categoryId || !categories.value.length) return 'No asignada'
  const category = categories.value.find(c => c.id_categoria === categoryId)
  return category ? category.nombre_categoria : 'No asignada'
}

const getDifficultyName = (difficultyId) => {
  if (!difficultyId || !difficulties.value.length) return 'No asignada'
  const difficulty = difficulties.value.find(d => d.id_dificultad === difficultyId)
  return difficulty ? difficulty.dificultad : 'No asignada'
}

const getModulesForCourse = (courseId) => {
  return modules.value.filter(m => m.courseId === courseId).sort((a, b) => a.order - b.order)
}

const getLessonsForCourse = (courseId) => {
  const courseModulesIds = modules.value.filter(m => m.courseId === courseId).map(m => m.id)
  return lessons.value.filter(l => courseModulesIds.includes(l.moduleId))
}

// Funciones de utilidad
const truncateText = (text, length) => {
  if (!text) return ''
  return text.length > length ? text.substring(0, length) + '...' : text
}

// Funciones para abrir modales de curso
const openCourseDetail = (course) => {
  selectedCourse.value = { ...course }
  showCourseDetailModal.value = true
}

const closeCourseDetailModal = () => {
  showCourseDetailModal.value = false
  selectedCourse.value = null
  expandedModule.value = null
}

const toggleModuleExpansion = (moduleId) => {
  expandedModule.value = expandedModule.value === moduleId ? null : moduleId
}

// Avatar
const handleAvatarChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    avatarSrc.value = URL.createObjectURL(file)
    alert('Imagen de perfil actualizada (simulado).')
  }
}

// Modal Curso - Variables y funciones
const courseModalTitle = ref('Nuevo Curso')
const formCourse = reactive({
  id_curso: null,
  titulo_curso: '',
  descripcion: '',
  precio: 0,
  img_portada: '',
  id_categoria: '',
  id_dificultad: '',
  id_instructor: '',
  estatus: 'Borrador'
})
const coverPreview = ref('')
const selectedCoverFile = ref(null)

const openCreateCourseModal = () => {
  // Cargar categorías y dificultades si no están cargadas
  if (categories.value.length === 0) loadCategories()
  if (difficulties.value.length === 0) loadDifficulties()
  
  Object.assign(formCourse, { 
    id_curso: null, 
    titulo_curso: '', 
    descripcion: '', 
    precio: 0, 
    img_portada: '', 
    id_categoria: '', 
    id_dificultad: '', 
    id_instructor: '', 
    estatus: 'Borrador' 
  })
  selectedCoverFile.value = null
  coverPreview.value = ''
  courseModalTitle.value = 'Nuevo Curso'
  showCourseModal.value = true
}

const openEditCourseModal = (course) => {
  // Cargar categorías y dificultades si no están cargadas
  if (categories.value.length === 0) loadCategories()
  if (difficulties.value.length === 0) loadDifficulties()
  
  Object.assign(formCourse, { 
    id_curso: course.id_curso,
    titulo_curso: course.titulo_curso,
    descripcion: course.descripcion,
    precio: course.precio,
    img_portada: course.img_portada,
    id_categoria: course.id_categoria,
    id_dificultad: course.id_dificultad,
    id_instructor: course.id_instructor,
    estatus: course.estatus
  })
  selectedCoverFile.value = null
  coverPreview.value = ''
  courseModalTitle.value = 'Editar Curso'
  showCourseModal.value = true
}

const handleCoverChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    selectedCoverFile.value = file
    coverPreview.value = URL.createObjectURL(file)
  }
}

const clearCoverPreview = () => {
  coverPreview.value = ''
  selectedCoverFile.value = null
}

// Función para guardar curso (integrando con API)
const handleSaveCourse = async (courseData) => {
  loading.save = true
  try {
    // Crear FormData
    const formData = new FormData()
    formData.append('titulo_curso', courseData.titulo_curso)
    formData.append('descripcion', courseData.descripcion)
    formData.append('precio', courseData.precio)
    formData.append('id_categoria', courseData.id_categoria)
    formData.append('id_dificultad', courseData.id_dificultad)
    formData.append('id_instructor', courseData.id_instructor)
    formData.append('estatus', courseData.estatus)
    
    // Agregar imagen si hay una nueva
    if (selectedCoverFile.value) {
      formData.append('img_portada', selectedCoverFile.value)
    }

    let response
    if (courseData.id_curso) {
      // Actualizar curso existente
      response = await cursoService.actualizarCurso(courseData.id_curso, formData)
    } else {
      // Crear nuevo curso
      response = await cursoService.crearCurso(formData)
    }

    if (response.success) {
      // Recargar cursos
      await loadCourses()
      
      // ✅ SweetAlert para éxito
      Swal.fire({
        icon: 'success',
        title: '¡Éxito!',
        text: response.message || 'Curso guardado exitosamente',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#7c3aed',
        timer: 3000,
        timerProgressBar: true,
        showClass: {
          popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp'
        }
      })
      
      closeCourseModal()
    } else {
      // ✅ SweetAlert para error del servidor
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: response.message || 'Error al guardar el curso',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#ef4444'
      })
    }
  } catch (err) {
    console.error('Error al guardar curso:', err)
    
    // ✅ SweetAlert para error de conexión/excepción
    Swal.fire({
      icon: 'error',
      title: 'Error del sistema',
      text: err.message || 'Error al guardar el curso. Por favor, intenta de nuevo.',
      confirmButtonText: 'Entendido',
      confirmButtonColor: '#ef4444'
    })
  } finally {
    loading.save = false
  }
}

const closeCourseModal = () => {
  showCourseModal.value = false
  selectedCoverFile.value = null
  coverPreview.value = ''
}

// Modal Módulo
const moduleModalTitle = ref('Nuevo Módulo')
const formModule = reactive({
  id: null,
  courseId: null,
  title: '',
  order: 1
})

const openCreateModuleModal = (course) => {
  const nextOrder = getModulesForCourse(course.id_curso).length + 1
  Object.assign(formModule, { 
    id: null, 
    courseId: course.id_curso, 
    title: '', 
    order: nextOrder 
  })
  moduleModalTitle.value = 'Nuevo Módulo'
  showModuleModal.value = true
}

const openEditModuleModal = (module) => {
  Object.assign(formModule, { ...module })
  moduleModalTitle.value = 'Editar Módulo'
  showModuleModal.value = true
}

const saveModule = (moduleData) => {
  if (moduleData.courseId && moduleData.title && moduleData.order) {
    if (moduleData.id) {
      const index = modules.value.findIndex(m => m.id === moduleData.id)
      if (index !== -1) {
        modules.value[index] = { ...moduleData }
      }
    } else {
      modules.value.push({ 
        id: modules.value.length + 1, 
        ...moduleData 
      })
    }
    alert('Módulo guardado exitosamente')
    closeModuleModal()
  }
}

const closeModuleModal = () => {
  showModuleModal.value = false
}

// Modal Lección
const lessonModalTitle = ref('Nueva Lección')
const formLesson = reactive({
  id: null,
  courseId: null,
  moduleId: null,
  title: '',
  type: 'video',
  duration: 0,
  order: 1,
  contentText: '',
  quiz: { title: '', questions: [] }
})
const selectedFileName = ref('')
const filePreviewUrl = ref('')

const availableModulesForLesson = computed(() => {
  if (!formLesson.courseId) return []
  return getModulesForCourse(formLesson.courseId)
})

const openCreateLessonModal = (courseId, moduleId = null) => {
  resetLessonForm()
  formLesson.courseId = courseId
  if (moduleId) {
    formLesson.moduleId = moduleId
  }
  lessonModalTitle.value = 'Nueva Lección'
  showLessonModal.value = true
}

const openEditLessonModal = (lesson) => {
  resetLessonForm()
  const module = modules.value.find(m => m.id === lesson.moduleId)
  if (module) {
    formLesson.courseId = module.courseId
    formLesson.moduleId = module.id
  }
  
  Object.assign(formLesson, {
    id: lesson.id,
    title: lesson.title,
    type: lesson.type,
    duration: lesson.duration || 0,
    order: lesson.order,
    contentText: lesson.contentText || '',
    quiz: lesson.quiz ? JSON.parse(JSON.stringify(lesson.quiz)) : { title: '', questions: [] }
  })
  
  if (lesson.type === 'quiz' && lesson.quiz && lesson.quiz.questions) {
    formLesson.quiz.questions.forEach((q, qIndex) => {
      if (q.options) {
        q.correctOption = q.options.findIndex(o => o.correct === true)
      }
    })
  }
  
  lessonModalTitle.value = 'Editar Lección'
  showLessonModal.value = true
}

const resetLessonForm = () => {
  Object.assign(formLesson, {
    id: null,
    courseId: null,
    moduleId: null,
    title: '',
    type: 'video',
    duration: 0,
    order: 1,
    contentText: '',
    quiz: { title: '', questions: [] }
  })
  selectedFileName.value = ''
  filePreviewUrl.value = ''
}

const handleLessonCourseChange = (courseId) => {
  formLesson.moduleId = null
}

const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    selectedFileName.value = file.name
    if (formLesson.type === 'video') {
      filePreviewUrl.value = URL.createObjectURL(file)
    } else {
      filePreviewUrl.value = ''
    }
  }
}

const saveLesson = (lessonData) => {
  if (!lessonData.moduleId || !lessonData.title || !lessonData.order) {
    alert('Completa todos los campos requeridos')
    return
  }

  if (lessonData.type === 'quiz') {
    if (!lessonData.quiz.title || lessonData.quiz.questions.length === 0) {
      alert('Completa la configuración del quiz')
      return
    }
    
    const invalidQuestion = lessonData.quiz.questions.find(q => 
      !q.text || q.options.length < 2 || q.correctOption === undefined
    )
    
    if (invalidQuestion) {
      alert('Completa todas las preguntas con al menos 2 opciones y marca la respuesta correcta')
      return
    }
    
    const quizData = { 
      title: lessonData.quiz.title,
      questions: lessonData.quiz.questions.map(q => ({
        text: q.text,
        options: q.options.map((o, index) => ({
          text: o.text,
          correct: index === q.correctOption
        }))
      }))
    }
    
    const lessonToSave = {
      id: lessonData.id || lessons.value.length + 1,
      moduleId: lessonData.moduleId,
      title: lessonData.title,
      type: 'quiz',
      order: lessonData.order,
      quiz: quizData
    }
    
    if (lessonData.id) {
      const index = lessons.value.findIndex(l => l.id === lessonData.id)
      if (index !== -1) {
        lessons.value[index] = lessonToSave
      }
    } else {
      lessons.value.push(lessonToSave)
    }
    
  } else {
    const lessonToSave = {
      id: lessonData.id || lessons.value.length + 1,
      moduleId: lessonData.moduleId,
      title: lessonData.title,
      type: lessonData.type,
      order: lessonData.order,
      duration: lessonData.duration || undefined,
      contentText: lessonData.contentText || undefined
    }
    
    if (selectedFileName.value) {
      lessonToSave.fileName = selectedFileName.value
    }
    
    if (lessonData.id) {
      const index = lessons.value.findIndex(l => l.id === lessonData.id)
      if (index !== -1) {
        lessons.value[index] = lessonToSave
      }
    } else {
      lessons.value.push(lessonToSave)
    }
  }
  
  alert('Lección guardada exitosamente')
  closeLessonModal()
}

const closeLessonModal = () => {
  showLessonModal.value = false
  resetLessonForm()
}

// Funciones para gestionar quiz
const addQuestion = () => {
  formLesson.quiz.questions.push({
    text: '',
    options: [{ text: '' }, { text: '' }],
    correctOption: 0
  })
}

const addOption = (qIndex) => {
  formLesson.quiz.questions[qIndex].options.push({ text: '' })
}

const removeQuestion = (qIndex) => {
  if (formLesson.quiz.questions.length > 1) {
    formLesson.quiz.questions.splice(qIndex, 1)
  }
}

const removeOption = (qIndex, oIndex) => {
  const question = formLesson.quiz.questions[qIndex]
  if (question.options.length > 2) {
    question.options.splice(oIndex, 1)
    if (question.correctOption === oIndex) {
      question.correctOption = 0
    } else if (question.correctOption > oIndex) {
      question.correctOption--
    }
  }
}
</script>

<style scoped>
/* ESTOS ESTILOS SON SOLO DE LA VISTA PRINCIPAL (no de los modales) */

/* Estilos base del perfil admin */
.profile {
  display: grid;
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem;
}

/* Tabs */
.profile__tabs {
  display: flex;
  gap: 0.25rem;
  overflow-x: auto;
  border-bottom: 1px solid var(--color-light);
  padding-bottom: 0.5rem;
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
  transition: all 0.2s ease;
  border-bottom: 3px solid transparent;
  white-space: nowrap;
  flex-shrink: 0;
  font-weight: 600;
}

.profile__tab:hover {
  color: var(--color-morado);
}

.profile__tab.is-active {
  color: var(--color-morado);
  border-bottom: 3px solid var(--color-morado);
}

.profile__tab-icon {
  font-size: 1.2rem;
}

.profile__tab-label {
  font-size: 0.95rem;
}

/* Contenido principal */
.profile__content {
  background: var(--color-blanco);
  border-radius: var(--border-radius-3);
  box-shadow: var(--box-shadow);
  overflow: hidden;
}

/* Header con estadísticas */
.header-content {
  padding: 2rem;
}

.header-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: var(--border-radius-2);
  border: 1px solid var(--color-light);
}

.stat-card__icon {
  font-size: 1.75rem;
  color: var(--color-morado);
}

.stat-card__content {
  flex: 1;
}

.stat-card__value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-morado);
  line-height: 1;
}

.stat-card__label {
  margin-top: 0.25rem;
  color: var(--color-oscuro-variante);
  font-size: 0.875rem;
}

/* Management header */
.management-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 2rem 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.management-actions {
  display: flex;
  gap: 1rem;
}

.view-controls {
  display: flex;
  gap: 0.5rem;
  background: #f8fafc;
  padding: 0.5rem;
  border-radius: var(--border-radius-2);
  border: 1px solid var(--color-light);
}

.view-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: transparent;
  border: none;
  border-radius: var(--border-radius-1);
  cursor: pointer;
  color: var(--color-oscuro-variante);
  transition: all 0.2s ease;
  font-size: 0.875rem;
}

.view-toggle:hover {
  background: #e2e8f0;
}

.view-toggle.active {
  background: var(--color-blanco);
  color: var(--color-morado);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Botones con el diseño morado consistente */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: var(--border-radius-2);
  border: 1px solid transparent;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  text-align: center;
  line-height: 1;
}

.btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

.btn--primary {
  background: linear-gradient(135deg, var(--color-morado), #6d28d9);
  color: var(--color-blanco);
  border: none;
}

.btn--primary:hover:not(:disabled) {
  filter: brightness(1.1);
  box-shadow: 0 6px 20px rgba(124, 58, 237, 0.3);
}

.btn--outline {
  background: transparent;
  border: 1px solid var(--color-morado);
  color: var(--color-morado);
}

.btn--outline:hover:not(:disabled) {
  background: rgba(124, 58, 237, 0.05);
  border-color: #6d28d9;
}

.btn--ghost {
  background: transparent;
  border: 1px solid #e2e8f0;
  color: var(--color-oscuro);
}

.btn--ghost:hover:not(:disabled) {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.btn--small {
  padding: 0.5rem 1rem;
  font-size: 0.85rem;
}

.btn--xs {
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  min-width: auto;
  min-height: 32px;
}

.btn-icon {
  font-size: 1rem;
  line-height: 1;
}

.btn--with-icon {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

/* Grid de cursos estilo tarjetas */
.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  padding: 0 2rem 2rem;
}

.course-card {
  background: var(--color-blanco);
  border-radius: var(--border-radius-2);
  border: 1px solid var(--color-light);
  overflow: hidden;
  transition: all 0.3s ease;
}

.course-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border-color: var(--color-morado);
}

.course-card__image {
  height: 150px;
  background-size: cover;
  background-position: center;
  position: relative;
}

.course-card__badge {
  position: absolute;
  top: 1rem;
  left: 1rem;
  padding: 0.25rem 0.75rem;
  border-radius: var(--border-radius-1);
  font-weight: 600;
  font-size: 0.75rem;
}

.status-badge--active {
  background: var(--color-morado);
  color: white;
}

.status-badge--inactive {
  background: rgba(124, 58, 237, 0.1);
  color: var(--color-morado);
  border: 1px solid var(--color-morado);
}

.course-card__category {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: var(--border-radius-1);
  font-size: 0.75rem;
}

.course-card__content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.course-card__header {
  margin-bottom: 0.5rem;
}

.course-card__title {
  margin: 0 0 0.5rem;
  color: var(--color-oscuro);
  font-size: 1.1rem;
  font-weight: 600;
}

.course-card__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  color: var(--color-oscuro-variante);
}

.meta-icon {
  font-size: 0.875rem;
}

.course-card__description {
  margin: 0;
  color: var(--color-oscuro-variante);
  font-size: 0.875rem;
  line-height: 1.5;
  flex-grow: 1;
}

.course-stats {
  display: flex;
  gap: 1.5rem;
  padding: 1rem 0;
  border-top: 1px solid var(--color-light);
  border-bottom: 1px solid var(--color-light);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.stat-icon {
  font-size: 1.25rem;
  margin-bottom: 0.25rem;
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-morado);
  line-height: 1;
}

.stat-label {
  font-size: 0.75rem;
  color: var(--color-oscuro-variante);
  margin-top: 0.25rem;
}

.course-card__actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.course-card__actions .action-buttons {
  display: flex;
  gap: 0.5rem;
}

/* Vista de tabla */
.table-container {
  padding: 0 2rem 2rem;
}

.table-responsive {
  overflow-x: auto;
  border: 1px solid var(--color-light);
  border-radius: var(--border-radius-2);
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;
}

.data-table th,
.data-table td {
  padding: 1rem;
  border-bottom: 1px solid var(--color-light);
  text-align: left;
}

.data-table th {
  background: #f8fafc;
  font-weight: 600;
  color: var(--color-oscuro);
}

.data-table tr:hover {
  background: #f8fafc;
}

.course-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.course-avatar {
  width: 50px;
  height: 50px;
  border-radius: var(--border-radius-2);
  background-size: cover;
  background-position: center;
  background-color: #f1f5f9;
}

.course-info {
  display: flex;
  flex-direction: column;
}

.course-description {
  font-size: 0.75rem;
  color: var(--color-oscuro-variante);
  margin-top: 0.25rem;
}

.course-price {
  font-size: 0.875rem;
  color: var(--color-morado);
  font-weight: 600;
}

.category-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: #e0e7ff;
  color: #3730a3;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.difficulty-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: #fef3c7;
  color: #92400e;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.instructor-name {
  font-size: 0.875rem;
  color: var(--color-oscuro);
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.status-badge--active {
  background: #d1fae5;
  color: #065f46;
}

.status-badge--inactive {
  background: #fee2e2;
  color: #991b1b;
}

.count-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: var(--color-morado);
  color: white;
  border-radius: 50%;
  font-weight: 600;
  font-size: 0.875rem;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

/* Mensajes de error */
.error-message {
  margin: 2rem;
  padding: 1.5rem;
  background: #fee2e2;
  border: 1px solid #fecaca;
  border-radius: var(--border-radius-2);
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.error-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.error-message p {
  margin: 0;
  color: #991b1b;
  flex: 1;
}

/* Estado de carga */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
}

.spinner-large {
  width: 48px;
  height: 48px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid var(--color-morado);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid var(--color-morado);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  display: inline-block;
  margin-right: 0.5rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Estado vacío */
.empty-state {
  text-align: center;
  padding: 3rem 2rem;
  background: #f8fafc;
  border-radius: var(--border-radius-2);
  border: 2px dashed var(--color-light);
  margin: 2rem;
}

.empty-state__icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-state__title {
  margin: 0 0 0.5rem;
  color: var(--color-oscuro);
  font-size: 1.25rem;
}

.empty-state__description {
  margin: 0 0 1.5rem;
  color: var(--color-oscuro-variante);
  max-width: 400px;
  margin: 0 auto 1.5rem;
}

/* Responsive */
@media (max-width: 768px) {
  .header-content {
    padding: 1.5rem;
  }
  
  .management-header {
    margin: 0 1.5rem 1.5rem;
    flex-direction: column;
    align-items: stretch;
  }
  
  .management-actions {
    flex-direction: column;
    width: 100%;
  }
  
  .management-actions .btn {
    width: 100%;
  }
  
  .view-controls {
    align-self: center;
  }
  
  .courses-grid {
    grid-template-columns: 1fr;
    padding: 0 1.5rem 1.5rem;
  }
  
  .header-stats {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .course-card__actions {
    flex-direction: column;
  }
  
  .course-card__actions .action-buttons {
    flex-direction: column;
  }
  
  .table-container {
    padding: 0 1.5rem 1.5rem;
  }
  
  .error-message {
    margin: 1.5rem;
    flex-direction: column;
    text-align: center;
  }
}
</style>