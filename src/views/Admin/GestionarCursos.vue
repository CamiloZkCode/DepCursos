<template>
  <main class="profile" aria-describedby="profile-intro">
    <ProfileHeader 
      :user="user" 
      :avatar-src="avatarSrc" 
      @change-avatar="handleAvatarChange"
      :is-admin="true"
      :is-estudiante="false"
    />

    <section class="profile__content">
      <header class="section-header">
        <h2>Gestionar Cursos</h2>
        <p>Crea y organiza cursos, módulos, lecciones y quizzes.</p>
      </header>

      <!-- Botón Crear Curso más separado -->
      <section class="actions actions--spaced">
        <div class="actions__buttons">
          <button class="btn btn--primary" @click="openCreateCourseModal">Crear Curso</button>
        </div>
      </section>

      <section class="results" aria-live="polite">
        <ul class="course-accordions" v-if="courses.length">
          <li v-for="course in courses" :key="course.id" class="accordion-item">
            <article class="course-card" :class="{ 'is-expanded': expandedCourse === course.id }">
              <header class="card__head" @click="toggleCourse(course.id)">
                <h3 class="card__title">{{ course.title }}</h3>
                <span class="toggle-icon">{{ expandedCourse === course.id ? '▲' : '▼' }}</span>
              </header>
              <div v-show="expandedCourse === course.id" class="card__expanded-content">
                <div class="course-info-column">
                  <div class="cover-container">
                    <p><strong>Portada:</strong></p>
                    <img v-if="course.coverImage" :src="course.coverImage" alt="Portada" class="cover-preview" />
                  </div>
                  <div class="course-details">
                    <dl class="course-info-list">
                      <dt>Descripción:</dt>
                      <dd>{{ course.description || 'Sin descripción' }}</dd>
                      <dt>Precio:</dt>
                      <dd>${{ course.price || 0 }}</dd>
                      <dt>Categoría:</dt>
                      <dd>{{ course.category }}</dd>
                      <dt>Dificultad:</dt>
                      <dd>{{ course.difficulty }}</dd>
                      <dt>Instructor:</dt>
                      <dd>{{ course.instructor }}</dd>
                      <dt>Estatus:</dt>
                      <dd>{{ course.status }}</dd>
                    </dl>
                  </div>
                  <div class="course-actions mt-4">
                    <button class="btn btn--primary btn--small" @click="openEditCourseModal(course)">Editar Curso</button>
                    <button class="btn btn--primary btn--small" @click="openCreateModuleModal(course.id)">+ Módulo</button>
                    <button class="btn btn--primary btn--small" @click="openCreateLessonModal(course.id)">+ Lección</button>
                  </div>
                </div>
                <div class="modules-column">
                  <div class="modules-section">
                    <h4>Módulos</h4>
                    <ul v-if="getModulesForCourse(course.id).length">
                      <li v-for="module in getModulesForCourse(course.id)" :key="module.id" class="module-item" :class="{ 'is-expanded': expandedModule === module.id }">
                        <div class="module-header" @click="toggleModule(module.id)">
                          <span>{{ module.order }}. {{ module.title }}</span>
                          <button class="btn btn--primary btn--small" @click.stop="openEditModuleModal(module)">Editar Módulo</button>
                          <span class="toggle-icon">{{ expandedModule === module.id ? '▲' : '▼' }}</span>
                        </div>
                        <div v-show="expandedModule === module.id" class="module-lessons">
                          <ul v-if="getLessonsForModule(module.id).length">
                            <li v-for="lesson in getLessonsForModule(module.id)" :key="lesson.id" class="lesson-item">
                              <span>{{ lesson.order }}. {{ lesson.title }} ({{ lesson.type }})</span>
                              <span v-if="lesson.duration"> - {{ lesson.duration }} min</span>
                              <button class="btn btn--primary btn--small lesson-edit-btn" @click="openEditLessonModal(lesson)">Editar Lección</button>
                            </li>
                          </ul>
                          <p v-else class="empty-mini">Sin lecciones</p>
                        </div>
                      </li>
                    </ul>
                    <p v-else class="empty-mini">Este curso no tiene módulos aún.</p>
                  </div>
                </div>
              </div>
            </article>
          </li>
        </ul>
        <p v-else class="empty">No hay cursos registrados.</p>
      </section>
    </section>

    <teleport to="body">
      <!-- Modal Curso (con subida de imagen) -->
      <div v-if="showCourseModal" class="modal-backdrop" @click.self="closeCourseModal">
        <div class="modal" role="dialog" aria-modal="true" aria-labelledby="course-modal-title">
          <header class="modal__header">
            <h3 id="course-modal-title">{{ courseModalTitle }}</h3>
            <button class="modal__close" @click="closeCourseModal" aria-label="Cerrar">✕</button>
          </header>
          <div class="modal__body">
            <form class="form" @submit.prevent="saveCourse">
              <div class="grid">
                <div class="field">
                  <label for="course-title">Título del Curso *</label>
                  <div class="input-wrapper">
                    <input id="course-title" v-model="formCourse.title" type="text" required />
                    <span class="material-symbols-outlined icon-static">title</span>
                  </div>
                </div>
                <div class="field field--full">
                  <label for="course-description">Descripción</label>
                  <div class="input-wrapper">
                    <textarea id="course-description" v-model="formCourse.description" rows="4"></textarea>
                    <span class="material-symbols-outlined icon-static">description</span>
                  </div>
                </div>
                <div class="field">
                  <label for="course-price">Precio (USD) *</label>
                  <div class="input-wrapper">
                    <input id="course-price" v-model.number="formCourse.price" type="number" min="0" required />
                    <span class="material-symbols-outlined icon-static">attach_money</span>
                  </div>
                </div>

                <!-- Subida de portada en lugar de URL -->
                <div class="field field--full">
                  <label for="course-cover-file">Portada del curso *</label>
                  <input 
                    id="course-cover-file" 
                    type="file" 
                    accept="image/*" 
                    @change="handleCoverChange" 
                  />
                  <div v-if="coverPreview" class="image-preview">
                    <img :src="coverPreview" alt="Vista previa de portada" />
                    <p><small>Nueva portada seleccionada</small></p>
                  </div>
                  <div v-else-if="formCourse.coverImage && formCourse.id" class="image-preview">
                    <img :src="formCourse.coverImage" alt="Portada actual" />
                    <p><small>Portada actual (se mantendrá si no subes una nueva)</small></p>
                  </div>
                </div>

                <div class="field">
                  <label for="course-category">Categoría *</label>
                  <div class="input-wrapper">
                    <select id="course-category" v-model="formCourse.category" required>
                      <option v-for="cat in categories" :key="cat.id" :value="cat.name">{{ cat.name }}</option>
                    </select>
                    <span class="material-symbols-outlined icon-static">category</span>
                  </div>
                </div>
                <div class="field">
                  <label for="course-difficulty">Dificultad *</label>
                  <div class="input-wrapper">
                    <select id="course-difficulty" v-model="formCourse.difficulty" required>
                      <option value="Principiante">Principiante</option>
                      <option value="Intermedio">Intermedio</option>
                      <option value="Avanzado">Avanzado</option>
                    </select>
                    <span class="material-symbols-outlined icon-static">school</span>
                  </div>
                </div>
                <div class="field">
                  <label for="course-instructor">Instructor *</label>
                  <div class="input-wrapper">
                    <select id="course-instructor" v-model="formCourse.instructor" required>
                      <option v-for="inst in instructorsList" :key="inst.id" :value="inst.name">{{ inst.name }}</option>
                    </select>
                    <span class="material-symbols-outlined icon-static">person</span>
                  </div>
                </div>
                <div class="field">
                  <label for="course-status">Estatus *</label>
                  <div class="input-wrapper">
                    <select id="course-status" v-model="formCourse.status" required>
                      <option value="Borrador">Borrador</option>
                      <option value="Publicado">Publicado</option>
                    </select>
                    <span class="material-symbols-outlined icon-static">visibility</span>
                  </div>
                </div>
              </div>
              <div class="modal__actions">
                <button type="button" class="btn btn--ghost" @click="closeCourseModal">Cancelar</button>
                <button type="submit" class="btn btn--primary">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Modal Módulo (mismo estilo) -->
      <div v-if="showModuleModal" class="modal-backdrop" @click.self="closeModuleModal">
        <div class="modal" role="dialog" aria-modal="true" aria-labelledby="module-modal-title">
          <header class="modal__header">
            <h3 id="module-modal-title">{{ moduleModalTitle }}</h3>
            <button class="modal__close" @click="closeModuleModal" aria-label="Cerrar">✕</button>
          </header>
          <div class="modal__body">
            <form class="form" @submit.prevent="saveModule">
              <div class="grid">
                <div class="field">
                  <label for="module-course">Curso *</label>
                  <div class="input-wrapper">
                    <select id="module-course" v-model="formModule.courseId" required>
                      <option v-for="c in courses" :key="c.id" :value="c.id">{{ c.title }}</option>
                    </select>
                    <span class="material-symbols-outlined icon-static">school</span>
                  </div>
                </div>
                <div class="field">
                  <label for="module-title">Título del Módulo *</label>
                  <div class="input-wrapper">
                    <input id="module-title" v-model="formModule.title" type="text" required />
                    <span class="material-symbols-outlined icon-static">folder</span>
                  </div>
                </div>
                <div class="field">
                  <label for="module-order">Número / Orden *</label>
                  <div class="input-wrapper">
                    <input id="module-order" v-model.number="formModule.order" type="number" min="1" required />
                    <span class="material-symbols-outlined icon-static">format_list_numbered</span>
                  </div>
                </div>
              </div>
              <div class="modal__actions">
                <button type="button" class="btn btn--ghost" @click="closeModuleModal">Cancelar</button>
                <button type="submit" class="btn btn--primary">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Modal Lección (mantiene las mejoras anteriores) -->
      <div v-if="showLessonModal" class="modal-backdrop" @click.self="closeLessonModal">
        <div class="modal" role="dialog" aria-modal="true" aria-labelledby="lesson-modal-title">
          <header class="modal__header">
            <h3 id="lesson-modal-title">{{ lessonModalTitle }}</h3>
            <button class="modal__close" @click="closeLessonModal" aria-label="Cerrar">✕</button>
          </header>
          <div class="modal__body">
            <form class="form" @submit.prevent="saveLesson">
              <div class="grid">
                <!-- (todo el contenido del modal lección que ya tenías, sin cambios) -->
                <div class="field">
                  <label for="lesson-course">Curso *</label>
                  <div class="input-wrapper">
                    <select id="lesson-course" v-model="formLesson.courseId" required @change="formLesson.moduleId = null">
                      <option v-for="c in courses" :key="c.id" :value="c.id">{{ c.title }}</option>
                    </select>
                    <span class="material-symbols-outlined icon-static">school</span>
                  </div>
                </div>
                <div class="field">
                  <label for="lesson-module">Módulo *</label>
                  <div class="input-wrapper">
                    <select id="lesson-module" v-model="formLesson.moduleId" required>
                      <option v-for="m in availableModulesForLesson" :key="m.id" :value="m.id">
                        {{ m.title }} ({{ m.order }})
                      </option>
                    </select>
                    <span class="material-symbols-outlined icon-static">folder</span>
                  </div>
                </div>
                <div class="field">
                  <label for="lesson-title">Título de la Lección *</label>
                  <div class="input-wrapper">
                    <input id="lesson-title" v-model="formLesson.title" type="text" required />
                    <span class="material-symbols-outlined icon-static">title</span>
                  </div>
                </div>
                <div class="field">
                  <label for="lesson-type">Tipo *</label>
                  <div class="input-wrapper">
                    <select id="lesson-type" v-model="formLesson.type" required>
                      <option value="video">Video</option>
                      <option value="texto">Texto</option>
                      <option value="archivo">Archivo</option>
                      <option value="quiz">Quiz</option>
                    </select>
                    <span class="material-symbols-outlined icon-static">category</span>
                  </div>
                </div>

                <div class="field field--full" v-if="formLesson.type === 'video' || formLesson.type === 'archivo'">
                  <label for="lesson-file">
                    {{ formLesson.type === 'video' ? 'Subir Video *' : 'Subir Archivo (PDF, Word, Excel, etc.) *' }}
                  </label>
                  <input 
                    id="lesson-file" 
                    type="file" 
                    :accept="formLesson.type === 'video' ? 'video/*' : '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt'" 
                    @change="handleFileChange" 
                  />
                  <div v-if="selectedFileName" class="file-preview">
                    <p><strong>Archivo seleccionado:</strong> {{ selectedFileName }}</p>
                    <video v-if="formLesson.type === 'video' && filePreviewUrl" controls class="video-preview">
                      <source :src="filePreviewUrl" />
                      Tu navegador no soporta video.
                    </video>
                  </div>
                </div>

                <div class="field" v-if="formLesson.type !== 'quiz'">
                  <label for="lesson-duration">Duración (minutos)</label>
                  <div class="input-wrapper">
                    <input id="lesson-duration" v-model.number="formLesson.duration" type="number" min="0" />
                    <span class="material-symbols-outlined icon-static">schedule</span>
                  </div>
                </div>

                <div class="field">
                  <label for="lesson-order">Orden *</label>
                  <div class="input-wrapper">
                    <input id="lesson-order" v-model.number="formLesson.order" type="number" min="1" required />
                    <span class="material-symbols-outlined icon-static">format_list_numbered</span>
                  </div>
                </div>

                <div class="field field--full" v-if="formLesson.type === 'texto'">
                  <label for="lesson-content">Contenido de texto</label>
                  <div class="input-wrapper">
                    <textarea id="lesson-content" v-model="formLesson.contentText" rows="8"></textarea>
                    <span class="material-symbols-outlined icon-static">text_fields</span>
                  </div>
                </div>

                <div v-if="formLesson.type === 'quiz'" class="field field--full quiz-builder">
                  <h4 class="quiz-section-title">Configuración del Quiz</h4>
                  <div class="field">
                    <label for="quiz-title">Título del Quiz *</label>
                    <div class="input-wrapper">
                      <input id="quiz-title" v-model="formLesson.quiz.title" type="text" required />
                      <span class="material-symbols-outlined icon-static">quiz</span>
                    </div>
                  </div>
                  <div v-for="(question, qIndex) in formLesson.quiz.questions" :key="qIndex" class="question-block">
                    <div class="question-header">
                      <label>Pregunta {{ qIndex + 1 }} *</label>
                      <button type="button" class="btn btn--small btn--ghost" @click="removeQuestion(qIndex)">Eliminar</button>
                    </div>
                    <div class="input-wrapper">
                      <input v-model="question.text" type="text" placeholder="Escribe la pregunta..." required />
                      <span class="material-symbols-outlined icon-static">help_outline</span>
                    </div>
                    <div class="options-list">
                      <div v-for="(option, oIndex) in question.options" :key="oIndex" class="option-row">
                        <div class="input-wrapper">
                          <input v-model="option.text" type="text" placeholder="Opción..." required />
                          <span class="material-symbols-outlined icon-static">radio_button_checked</span>
                        </div>
                        <label class="radio-label">
                          <input type="radio" :name="'correct-' + qIndex" v-model="question.correctOption" :value="oIndex" />
                          Respuesta correcta
                        </label>
                        <button type="button" class="btn btn--small btn--ghost" @click="removeOption(qIndex, oIndex)">✕</button>
                      </div>
                    </div>
                    <button type="button" class="btn btn--small btn--primary" @click="addOption(qIndex)">+ Añadir opción</button>
                  </div>
                  <button type="button" class="btn btn--primary" @click="addQuestion">+ Añadir pregunta</button>
                </div>
              </div>
              <div class="modal__actions">
                <button type="button" class="btn btn--ghost" @click="closeLessonModal">Cancelar</button>
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
    price: 79.99,
    coverImage: '',
    category: 'Yoga',
    difficulty: 'Avanzado',
    instructor: 'Instructor 2',
    status: 'Borrador'
  }
])

const modules = reactive([])
const lessons = reactive([])

const categories = reactive([
  { id: 1, name: 'Fitness' },
  { id: 2, name: 'Yoga' }
])

const instructorsList = reactive([
  { id: 1, name: 'Instructor 1' },
  { id: 2, name: 'Instructor 2' }
])

const user = reactive({
  firstName: 'Admin',
  lastName: 'Ejemplo',
  fullName: computed(() => `${user.firstName} ${user.lastName}`),
  role: 'Administrador - Academia Deportiva'
})

const avatarSrc = ref('/src/assets/icons/LogoFondo.jpeg')

const handleAvatarChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    avatarSrc.value = URL.createObjectURL(file)
    alert('Imagen de perfil actualizada (simulado).')
  }
}

const expandedCourse = ref(null)
const expandedModule = ref(null)

const toggleCourse = (id) => {
  expandedCourse.value = expandedCourse.value === id ? null : id
}

const toggleModule = (id) => {
  expandedModule.value = expandedModule.value === id ? null : id
}

const getModulesForCourse = (courseId) => modules.filter(m => m.courseId === courseId)
const getLessonsForModule = (moduleId) => lessons.filter(l => l.moduleId === moduleId)

const availableModulesForLesson = computed(() => {
  if (!formLesson.courseId) return []
  return modules.filter(m => m.courseId === formLesson.courseId)
})

const showCourseModal = ref(false)
const showModuleModal = ref(false)
const showLessonModal = ref(false)
const courseModalTitle = ref('Nuevo Curso')
const moduleModalTitle = ref('Nuevo Módulo')
const lessonModalTitle = ref('Nueva Lección')

const formCourse = reactive({
  id: null,
  title: '',
  description: '',
  price: 0,
  coverImage: '',
  category: '',
  difficulty: '',
  instructor: '',
  status: 'Borrador'
})

const formModule = reactive({
  id: null,
  courseId: null,
  title: '',
  order: 1
})

const formLesson = reactive({
  id: null,
  courseId: null,
  moduleId: null,
  title: '',
  type: 'video',
  duration: 0,
  order: 1,
  contentText: '',
  file: null,
  quiz: { title: '', questions: [] }
})

const selectedFileName = ref('')
const filePreviewUrl = ref('')

// Nueva variable para portada del curso
const selectedCoverFile = ref(null)
const coverPreview = ref('')

const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    formLesson.file = file
    selectedFileName.value = file.name
    if (formLesson.type === 'video') {
      filePreviewUrl.value = URL.createObjectURL(file)
    } else {
      filePreviewUrl.value = ''
    }
  }
}

const handleCoverChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    selectedCoverFile.value = file
    coverPreview.value = URL.createObjectURL(file)
  }
}

const openCreateCourseModal = () => {
  Object.assign(formCourse, { id: null, title: '', description: '', price: 0, coverImage: '', category: '', difficulty: '', instructor: '', status: 'Borrador' })
  selectedCoverFile.value = null
  coverPreview.value = ''
  courseModalTitle.value = 'Nuevo Curso'
  showCourseModal.value = true
}

const openEditCourseModal = (course) => {
  Object.assign(formCourse, { ...course })
  selectedCoverFile.value = null
  coverPreview.value = ''
  courseModalTitle.value = 'Editar Curso'
  showCourseModal.value = true
}

const saveCourse = () => {
  if (formCourse.title && formCourse.price >= 0) {
    if (formCourse.id) {
      const index = courses.findIndex(c => c.id === formCourse.id)
      if (index !== -1) {
        courses[index] = { 
          ...formCourse,
          coverImage: selectedCoverFile.value ? 'URL_SIMULADA_' + selectedCoverFile.value.name : courses[index].coverImage
        }
      }
    } else {
      courses.push({ 
        id: courses.length + 1, 
        ...formCourse,
        coverImage: selectedCoverFile.value ? 'URL_SIMULADA_' + selectedCoverFile.value.name : ''
      })
    }
    alert('Curso guardado (simulado).')
    closeCourseModal()
  }
}

const closeCourseModal = () => {
  showCourseModal.value = false
  selectedCoverFile.value = null
  coverPreview.value = ''
}

// (el resto de tus funciones de módulo y lección permanecen iguales)
const openCreateModuleModal = (preselectCourseId = null) => {
  const nextOrder = getModulesForCourse(preselectCourseId).length + 1 || 1
  Object.assign(formModule, { id: null, courseId: preselectCourseId, title: '', order: nextOrder })
  moduleModalTitle.value = 'Nuevo Módulo'
  showModuleModal.value = true
}

const openEditModuleModal = (module) => {
  Object.assign(formModule, { ...module })
  moduleModalTitle.value = 'Editar Módulo'
  showModuleModal.value = true
}

const saveModule = () => {
  if (formModule.courseId && formModule.title && formModule.order) {
    if (formModule.id) {
      const index = modules.findIndex(m => m.id === formModule.id)
      if (index !== -1) modules[index] = { ...formModule }
    } else {
      modules.push({ id: modules.length + 1, ...formModule })
    }
    alert('Módulo guardado (simulado).')
    closeModuleModal()
  }
}

const closeModuleModal = () => showModuleModal.value = false

const resetLessonForm = (courseId = null) => {
  Object.assign(formLesson, {
    id: null,
    courseId,
    moduleId: null,
    title: '',
    type: 'video',
    duration: 0,
    order: 1,
    contentText: '',
    file: null,
    quiz: { title: '', questions: [] }
  })
  selectedFileName.value = ''
  filePreviewUrl.value = ''
}

const openCreateLessonModal = (preselectCourseId = null) => {
  resetLessonForm(preselectCourseId)
  lessonModalTitle.value = 'Nueva Lección'
  showLessonModal.value = true
}

const openEditLessonModal = (lesson) => {
  resetLessonForm(modules.find(m => m.id === lesson.moduleId)?.courseId)
  Object.assign(formLesson, {
    id: lesson.id,
    moduleId: lesson.moduleId,
    title: lesson.title,
    type: lesson.type,
    duration: lesson.duration || 0,
    order: lesson.order,
    contentText: lesson.contentText || '',
    quiz: lesson.quiz ? { ...lesson.quiz } : { title: '', questions: [] }
  })
  if (lesson.quiz) {
    formLesson.quiz.questions.forEach(q => {
      q.correctOption = q.options.findIndex(o => o.correct === true)
    })
  }
  lessonModalTitle.value = 'Editar Lección'
  showLessonModal.value = true
}

const saveLesson = () => {
  if (!formLesson.moduleId || !formLesson.title || !formLesson.order) return

  if (formLesson.type === 'quiz') {
    const valid = formLesson.quiz.title && formLesson.quiz.questions.every(q => 
      q.text && q.options.length >= 2 && q.options.every(o => o.text) && q.correctOption !== undefined
    )
    if (!valid) {
      alert('Completa todas las preguntas y marca una respuesta correcta.')
      return
    }
    formLesson.quiz.questions.forEach(q => {
      q.options.forEach((o, i) => o.correct = i === q.correctOption)
      delete q.correctOption
    })
  }

  const lessonData = {
    moduleId: formLesson.moduleId,
    title: formLesson.title,
    type: formLesson.type,
    order: formLesson.order,
    duration: formLesson.duration || undefined,
    contentText: formLesson.contentText || undefined
  }

  if (formLesson.type === 'quiz') lessonData.quiz = { ...formLesson.quiz }
  if (formLesson.file) lessonData.fileName = formLesson.file.name

  if (formLesson.id) {
    const index = lessons.findIndex(l => l.id === formLesson.id)
    if (index !== -1) lessons[index] = { id: formLesson.id, ...lessonData }
  } else {
    lessons.push({ id: lessons.length + 1, ...lessonData })
  }

  alert('Lección guardada (simulado).')
  closeLessonModal()
}

const closeLessonModal = () => {
  showLessonModal.value = false
  resetLessonForm()
}

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
  formLesson.quiz.questions.splice(qIndex, 1)
}

const removeOption = (qIndex, oIndex) => {
  const q = formLesson.quiz.questions[qIndex]
  if (q.options.length <= 2) {
    alert('Mínimo 2 opciones.')
    return
  }
  q.options.splice(oIndex, 1)
  if (q.correctOption === oIndex) q.correctOption = 0
  else if (q.correctOption > oIndex) q.correctOption--
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

.profile__content {
  background: var(--color-blanco);
  border-radius: var(--border-radius-3);
  box-shadow: var(--box-shadow);
  padding: 1.5rem;
  overflow-x: hidden;
}

.section-header h2 {
  margin: 0 0 .25rem;
  color: var(--color-oscuro);
  font-size: clamp(1.6rem, 3vw, 2.1rem);
}

.section-header p {
  margin-bottom: 1rem;
  color: var(--color-oscuro-variante);
}


.actions--spaced {
  margin-bottom: 1rem;
}

/* Accordions y cards */
.course-accordions {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.course-card {
  border: 2px solid transparent;
  border-image: linear-gradient(135deg, var(--color-naranja), var(--color-morado)) 1;
  border-radius: 0.6rem;
  overflow: hidden;
  background: var(--color-blanco);
  box-shadow: var(--box-shadow);
  transition: all 0.3s ease;
}

.card__head {
  padding: 1.2rem 1.5rem;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, rgba(var(--color-morado-rgb), 0.08), rgba(var(--color-naranja-rgb), 0.08));
}

.toggle-icon {
  font-size: 1.4rem;
  font-weight: bold;
}

.card__expanded-content {
  padding: 1.5rem;
  border-top: 1px solid var(--color-light);
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.5s ease-in-out;
}

.course-card.is-expanded .card__expanded-content {
  max-height: 3000px;
}

.cover-preview {
  max-width: 200px;
  border-radius: 0.4rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.course-info-list {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.5rem 1rem;
}

.course-info-list dt {
  font-weight: bold;
  color: var(--color-morado);
  text-align: right;
}

.course-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.module-item {
  margin-bottom: 0.75rem;
  border: 1px solid var(--color-light);
  border-radius: 0.4rem;
  overflow: hidden;
}

.module-header {
  padding: 1rem 1.25rem;
  background: var(--color-light);
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  font-weight: 600;
}

.module-lessons {
  padding: 1.25rem;
  background: #f9f9f9;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.5s ease-in-out;
}

.module-item.is-expanded .module-lessons {
  max-height: 1000px;
}

.lesson-item {
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--color-light);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
}

.empty, .empty-mini {
  color: var(--color-oscuro-variante);
  font-style: italic;
  text-align: center;
  padding: 1rem;
}

/* Botones (igual que vistaCliente) */
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
  padding: 0.4rem 0.8rem;
  font-size: 0.9rem;
}

/* Modal (igual que vistaCliente) */
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
  width: min(600px, 100%);
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
  padding: 1.5rem;
}

.grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr;
}

.field {
  display: grid;
  gap: 0.5rem;
}

.field label {
  font-weight: 600;
  color: var(--color-oscuro);
}

.input-wrapper {
  position: relative;
}

.input-wrapper input,
.input-wrapper select,
.input-wrapper textarea {
  width: 100%;
  padding: 0.75rem 2.5rem 0.75rem 0.75rem;
  border: 1px solid #d1e3ff;
  border-radius: 0.4rem;
  background: var(--color-blanco);
  font: inherit;
}

.input-wrapper textarea {
  min-height: 120px;
  resize: vertical;
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

.modal__actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.6rem;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #d1e3ff;
}

/* Preview de portada */
.image-preview {
  margin-top: 1rem;
  text-align: center;
}

.image-preview img {
  max-width: 100%;
  max-height: 300px;
  border-radius: 0.4rem;
  box-shadow: var(--box-shadow);
}

/* Quiz y preview archivo */
.quiz-builder {
  background: #f8f9ff;
  padding: 1.5rem;
  border-radius: 0.6rem;
  border: 1px solid #d1e3ff;
}

.quiz-section-title {
  margin-bottom: 1rem;
  color: var(--color-morado);
}

.question-block {
  margin-top: 1.5rem;
  padding: 1rem;
  background: var(--color-blanco);
  border-radius: 0.4rem;
  box-shadow: 0 1px 4px rgba(0,0,0,0.05);
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.option-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.75rem;
  flex-wrap: wrap;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: var(--color-morado);
}

.file-preview {
  margin-top: 1rem;
  padding: 1rem;
  background: #f0f4ff;
  border-radius: 0.4rem;
}

.video-preview {
  max-width: 100%;
  max-height: 300px;
  border-radius: 0.4rem;
  margin-top: 0.5rem;
}

/* Responsive */
@media (min-width: 768px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .field--full {
    grid-column: 1 / -1;
  }
  .card__expanded-content {
    flex-direction: row;
  }
}
</style>