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
      <section class="actions mb-6">
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
                    <button class="btn btn--primary btn--small ml-2" @click="openCreateModuleModal(course.id)">+ Módulo</button>
                    <button class="btn btn--primary btn--small ml-2" @click="openCreateLessonModal(course.id)">+ Lección</button>
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
      <!-- Modal Curso -->
      <div v-if="showCourseModal" class="modal-backdrop" @click.self="closeCourseModal">
        <div class="modal" role="dialog" aria-modal="true">
          <header class="modal__header">
            <h3>{{ courseModalTitle }}</h3>
            <button class="modal__close" @click="closeCourseModal">✕</button>
          </header>
          <div class="modal__body">
            <form class="form" @submit.prevent="saveCourse">
              <div class="grid">
                <div class="field">
                  <label for="course-title">Título del Curso *</label>
                  <input id="course-title" v-model="formCourse.title" type="text" required />
                </div>
                <div class="field field--full">
                  <label for="course-description">Descripción</label>
                  <textarea id="course-description" v-model="formCourse.description"></textarea>
                </div>
                <div class="field">
                  <label for="course-price">Precio (USD) *</label>
                  <input id="course-price" v-model.number="formCourse.price" type="number" min="0" required />
                </div>
                <div class="field">
                  <label for="course-cover">URL Portada</label>
                  <input id="course-cover" v-model="formCourse.coverImage" type="url" placeholder="https://..." />
                </div>
                <div class="field">
                  <label for="course-category">Categoría *</label>
                  <select id="course-category" v-model="formCourse.category" required>
                    <option v-for="cat in categories" :key="cat.id" :value="cat.name">{{ cat.name }}</option>
                  </select>
                </div>
                <div class="field">
                  <label for="course-difficulty">Dificultad *</label>
                  <select id="course-difficulty" v-model="formCourse.difficulty" required>
                    <option value="Principiante">Principiante</option>
                    <option value="Intermedio">Intermedio</option>
                    <option value="Avanzado">Avanzado</option>
                  </select>
                </div>
                <div class="field">
                  <label for="course-instructor">Instructor *</label>
                  <select id="course-instructor" v-model="formCourse.instructor" required>
                    <option v-for="inst in instructorsList" :key="inst.id" :value="inst.name">{{ inst.name }}</option>
                  </select>
                </div>
                <div class="field">
                  <label for="course-status">Estatus *</label>
                  <select id="course-status" v-model="formCourse.status" required>
                    <option value="Borrador">Borrador</option>
                    <option value="Publicado">Publicado</option>
                  </select>
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

      <!-- Modal Módulo -->
      <div v-if="showModuleModal" class="modal-backdrop" @click.self="closeModuleModal">
        <div class="modal" role="dialog" aria-modal="true">
          <header class="modal__header">
            <h3>{{ moduleModalTitle }}</h3>
            <button class="modal__close" @click="closeModuleModal">✕</button>
          </header>
          <div class="modal__body">
            <form class="form" @submit.prevent="saveModule">
              <div class="grid">
                <div class="field">
                  <label for="module-course">Curso *</label>
                  <select id="module-course" v-model="formModule.courseId" required>
                    <option v-for="c in courses" :key="c.id" :value="c.id">{{ c.title }}</option>
                  </select>
                </div>
                <div class="field">
                  <label for="module-title">Título del Módulo *</label>
                  <input id="module-title" v-model="formModule.title" type="text" required />
                </div>
                <div class="field">
                  <label for="module-order">Número / Orden *</label>
                  <input id="module-order" v-model.number="formModule.order" type="number" min="1" required />
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

      <!-- Modal Lección -->
      <div v-if="showLessonModal" class="modal-backdrop" @click.self="closeLessonModal">
        <div class="modal" role="dialog" aria-modal="true">
          <header class="modal__header">
            <h3>{{ lessonModalTitle }}</h3>
            <button class="modal__close" @click="closeLessonModal">✕</button>
          </header>
          <div class="modal__body">
            <form class="form" @submit.prevent="saveLesson">
              <div class="grid">
                <div class="field">
                  <label for="lesson-course">Curso *</label>
                  <select id="lesson-course" v-model="formLesson.courseId" required @change="formLesson.moduleId = null">
                    <option v-for="c in courses" :key="c.id" :value="c.id">{{ c.title }}</option>
                  </select>
                </div>
                <div class="field">
                  <label for="lesson-module">Módulo *</label>
                  <select id="lesson-module" v-model="formLesson.moduleId" required>
                    <option v-for="m in availableModulesForLesson" :key="m.id" :value="m.id">
                      {{ m.title }} ({{ m.order }})
                    </option>
                  </select>
                </div>
                <div class="field">
                  <label for="lesson-title">Título de la Lección *</label>
                  <input id="lesson-title" v-model="formLesson.title" type="text" required />
                </div>
                <div class="field">
                  <label for="lesson-type">Tipo *</label>
                  <select id="lesson-type" v-model="formLesson.type" required>
                    <option value="video">Video</option>
                    <option value="texto">Texto</option>
                    <option value="archivo">Archivo</option>
                    <option value="quiz">Quiz</option>
                  </select>
                </div>
                <div class="field" v-if="formLesson.type === 'video' || formLesson.type === 'archivo'">
                  <label for="lesson-url">{{ formLesson.type === 'video' ? 'URL del Video' : 'URL del Archivo' }}</label>
                  <input id="lesson-url" v-model="formLesson.url" type="url" />
                </div>
                <div class="field" v-if="formLesson.type !== 'quiz'">
                  <label for="lesson-duration">Duración (minutos)</label>
                  <input id="lesson-duration" v-model.number="formLesson.duration" type="number" min="0" />
                </div>
                <div class="field">
                  <label for="lesson-order">Orden *</label>
                  <input id="lesson-order" v-model.number="formLesson.order" type="number" min="1" required />
                </div>
                <div class="field field--full" v-if="formLesson.type === 'texto'">
                  <label for="lesson-content">Contenido de texto</label>
                  <textarea id="lesson-content" v-model="formLesson.contentText" rows="6"></textarea>
                </div>
                <div v-if="formLesson.type === 'quiz'" class="field field--full quiz-builder">
                  <h4>Configuración del Quiz</h4>
                  <div class="quiz-title">
                    <label for="quiz-title">Título del Quiz</label>
                    <input id="quiz-title" v-model="formLesson.quiz.title" type="text" required />
                  </div>
                  <div v-for="(question, qIndex) in formLesson.quiz.questions" :key="qIndex" class="question-block">
                    <label>Pregunta {{ qIndex + 1 }}</label>
                    <input v-model="question.text" type="text" placeholder="Escribe la pregunta..." required />
                    <div v-for="(option, oIndex) in question.options" :key="oIndex" class="option-row">
                      <input v-model="option.text" type="text" placeholder="Opción..." required />
                      <label class="radio-label">
                        <input type="radio" v-model="question.correctOption" :value="oIndex" />
                        Correcta
                      </label>
                    </div>
                    <button type="button" class="btn btn--small" @click="addOption(qIndex)">+ Opción</button>
                  </div>
                  <button type="button" class="btn btn--primary btn--small mt-2" @click="addQuestion">+ Pregunta</button>
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
  url: '',
  duration: 0,
  order: 1,
  contentText: '',
  quiz: { title: '', questions: [] }
})

const openCreateCourseModal = () => {
  Object.assign(formCourse, { id: null, title: '', description: '', price: 0, coverImage: '', category: '', difficulty: '', instructor: '', status: 'Borrador' })
  courseModalTitle.value = 'Nuevo Curso'
  showCourseModal.value = true
}

const openEditCourseModal = (course) => {
  Object.assign(formCourse, { ...course })
  courseModalTitle.value = 'Editar Curso'
  showCourseModal.value = true
}

const saveCourse = () => {
  if (formCourse.title && formCourse.price >= 0) {
    if (formCourse.id) {
      const index = courses.findIndex(c => c.id === formCourse.id)
      if (index !== -1) courses[index] = { ...formCourse }
    } else {
      courses.push({ id: courses.length + 1, ...formCourse, enrolled: 0, maxEnrolled: 100 })
    }
    alert('Curso guardado (simulado).')
    closeCourseModal()
  }
}

const closeCourseModal = () => showCourseModal.value = false

const openCreateModuleModal = (preselectCourseId = null) => {
  Object.assign(formModule, { id: null, courseId: preselectCourseId, title: '', order: getModulesForCourse(preselectCourseId).length + 1 || 1 })
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

const openCreateLessonModal = (preselectCourseId = null) => {
  Object.assign(formLesson, {
    id: null,
    courseId: preselectCourseId,
    moduleId: null,
    title: '',
    type: 'video',
    url: '',
    duration: 0,
    order: 1,
    contentText: '',
    quiz: { title: '', questions: [] }
  })
  lessonModalTitle.value = 'Nueva Lección'
  showLessonModal.value = true
}

const openEditLessonModal = (lesson) => {
  Object.assign(formLesson, { ...lesson, courseId: modules.find(m => m.id === lesson.moduleId)?.courseId })
  if (formLesson.type === 'quiz') {
    formLesson.quiz.questions.forEach(q => {
      q.correctOption = q.options.findIndex(o => o.correct === true)
    })
  }
  lessonModalTitle.value = 'Editar Lección'
  showLessonModal.value = true
}

const saveLesson = () => {
  if (formLesson.moduleId && formLesson.title && formLesson.order) {
    if (formLesson.type === 'quiz') {
      formLesson.quiz.questions.forEach(q => {
        q.options.forEach((o, i) => {
          o.correct = (i === q.correctOption)
        })
        delete q.correctOption
      })
    }
    const lessonData = {
      moduleId: formLesson.moduleId,
      title: formLesson.title,
      type: formLesson.type,
      order: formLesson.order,
      duration: formLesson.duration,
      url: formLesson.url,
      contentText: formLesson.contentText
    }
    if (formLesson.type === 'quiz') lessonData.quiz = { ...formLesson.quiz }
    if (formLesson.id) {
      const index = lessons.findIndex(l => l.id === formLesson.id)
      if (index !== -1) lessons[index] = { id: formLesson.id, ...lessonData }
    } else {
      lessons.push({ id: lessons.length + 1, ...lessonData })
    }
    alert('Lección guardada (simulado).')
    closeLessonModal()
  }
}

const closeLessonModal = () => showLessonModal.value = false

const addQuestion = () => {
  formLesson.quiz.questions.push({
    text: '',
    options: [{ text: '', correct: false }, { text: '', correct: false }],
    correctOption: 0
  })
}

const addOption = (qIndex) => {
  formLesson.quiz.questions[qIndex].options.push({ text: '', correct: false })
}
</script>

<style scoped>
/* Todo el estilo necesario para la gestión de cursos (del original) */
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

.course-accordions {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.accordion-item {
  width: 100%;
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
  max-height: 2000px;
}

.course-info-column {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.cover-container {
  flex-shrink: 0;
  width: 100%;
}

.cover-preview {
  max-width: 200px;
  height: auto;
  border-radius: 0.4rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.course-details {
  flex: 1;
  width: 100%;
}

.course-info-list {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.5rem 1rem;
  font-size: 1.1rem;
}

.course-info-list dt {
  font-weight: bold;
  color: var(--color-morado);
  text-align: right;
}

.course-info-list dd {
  margin: 0;
  color: var(--color-oscuro);
}

.course-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: 1.5rem;
}

.modules-column {
  flex: 1;
}

.modules-section h4 {
  margin: 0 0 1rem;
  color: var(--color-morado);
  font-size: 1.4rem;
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
  font-size: 1.1rem;
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
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
}

.lesson-item:last-child {
  border-bottom: none;
}

.lesson-edit-btn {
  margin-left: auto;
}

.empty {
  color: var(--color-oscuro);
  font-style: italic;
  text-align: center;
  margin: 1rem 0;
  background: var(--color-blanco);
  border-radius: 0.6rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  padding: 1rem;
}

.empty-mini {
  color: var(--color-oscuro-variante);
  font-style: italic;
  margin: 1.5rem 0;
  font-size: 1rem;
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

.btn--small {
  font-size: 0.9rem;
}

/* Modal styles (del original) */
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
  gap: 0.75rem;
  grid-template-columns: repeat(12, 1fr);
}

.field {
  grid-column: span 12;
}

.field--full {
  grid-column: span 12;
}

.modal__actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.6rem;
  padding-top: 0.5rem;
}

/* Responsive */
@media (min-width: 768px) {
  .card__expanded-content {
    flex-direction: row;
  }

  .course-info-column {
    width: 40%;
  }

  .modules-column {
    flex: 1;
  }
}
</style>