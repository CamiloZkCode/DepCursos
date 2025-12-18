<template>
  <main class="course-view" aria-describedby="course-intro">
    <!-- ===== HEADER DEL CURSO ===== -->
    <section class="course-header">
      <div class="course__media">
        <img class="course__img" :src="course.imagen_curso" :alt="`Portada de ${course.nombre_curso}`" loading="lazy" decoding="async" />
      </div>
      <div class="course__body">
        <h1 class="course__title">{{ course.nombre_curso }}</h1>
        <p id="course-intro" class="course__desc">{{ course.descripcion_curso }}</p>
        <div v-if="enrolled" class="progress">
          <header class="progress__header">
            <h3>Progreso del curso</h3>
            <span>{{ progress }}%</span>
          </header>
          <div class="progress__bar">
            <div class="progress__fill" :style="{ width: `${progress}%` }"></div>
          </div>
        </div>
        <div class="course__actions" v-if="!enrolled">
          <button class="btn btn--primary btn--large" @click="handleEnrollment">
            Inscribirse
          </button>
        </div>
      </div>
    </section>

    <!-- ===== MÓDULOS ===== -->
    <section class="modules">
      <header class="section-header">
        <h2>Módulos del curso</h2>
        <p v-if="!enrolled">Inscríbete para acceder a los módulos y comenzar tu aprendizaje.</p>
        <p v-else>Explora los módulos y completa las actividades para avanzar.</p>
      </header>

      <ul class="modules__grid" role="list">
        <li v-for="modulo in modulos" :key="modulo.id_modulo" class="module">
          <article class="module__card" :class="{ 'is-locked': !enrolled }">
            <header
              class="module__header"
              @click="toggleAccordion(modulo.id_modulo)"
              @keydown.enter.space.prevent="toggleAccordion(modulo.id_modulo)"
              role="button"
              :aria-expanded="isOpen(modulo.id_modulo)"
              :aria-controls="`module-content-${modulo.id_modulo}`"
              tabindex="0"
            >
              <h3 class="module__title">
                Módulo {{ modulo.numero }}: {{ modulo.nombre_modulo }}
              </h3>
              <span class="module__icon" aria-hidden="true">
                {{ isOpen(modulo.id_modulo) ? '▲' : '▼' }}
              </span>
            </header>

            <transition name="accordion">
              <div
                v-if="enrolled && isOpen(modulo.id_modulo)"
                :id="`module-content-${modulo.id_modulo}`"
                class="module__content"
              >
                <ul class="module__items">
                  <li v-for="(item, index) in modulo.contenido" :key="index" class="module__item">
                    <img class="module__item-icon" :src="getIcon(item.tipo)" :alt="`Icono de ${item.tipo}`" />
                    <a :href="item.link" target="_blank" rel="noopener noreferrer" class="module__link">
                      {{ item.titulo }} <span class="module__type">({{ item.tipo }})</span>
                    </a>
                  </li>
                </ul>
              </div>
            </transition>

            <div v-if="!enrolled" class="module__overlay">
              <span class="module__lock">🔒 Bloqueado</span>
            </div>
          </article>
        </li>
      </ul>
    </section>
  </main>
</template>

<script setup>
import { ref } from 'vue'

// Importamos los iconos
import iconDocumento from '@/assets/icons/documento.png'
import iconVideo from '@/assets/icons/Video.png'
import iconQuiz from '@/assets/icons/Quiz.png'
import iconDefault from '@/assets/icons/Notify.png' // Asegúrate de tener este fallback

// Datos del curso
const course = ref({
  id_curso: '1',
  nombre_curso: 'Fitness Intensivo',
  descripcion_curso: 'Clases grupales de alta energía para mejorar fuerza y resistencia. Incluye rutinas personalizadas, seguimiento de progreso y tips nutricionales.',
  imagen_curso: 'https://cdn.prod.website-files.com/65d7b904c0af185c6d721f6f/66745b16786e4667065274df_Friends-Taking-Fitness-Class-NewYorkCity.webp'
})

const modulos = ref([
  {
    id_modulo: '1',
    numero: 1,
    nombre_modulo: 'Introducción al Fitness',
    contenido: [
      { tipo: 'Video', titulo: 'Bienvenida y objetivos', link: '/videos/intro.mp4' },
      { tipo: 'PDF', titulo: 'Guía básica de ejercicios', link: '/pdfs/guia.pdf' },
      { tipo: 'Quiz', titulo: 'Evaluación inicial', link: '/quizzes/intro' }
    ]
  },
  {
    id_modulo: '2',
    numero: 2,
    nombre_modulo: 'Entrenamiento de Fuerza',
    contenido: [
      { tipo: 'Video', titulo: 'Rutinas de pesas', link: '/videos/fuerza.mp4' },
      { tipo: 'PDF', titulo: 'Plan de 4 semanas', link: '/pdfs/plan.pdf' },
      { tipo: 'Quiz', titulo: 'Test de conocimiento', link: '/quizzes/fuerza' }
    ]
  },
  {
    id_modulo: '3',
    numero: 3,
    nombre_modulo: 'Cardio y Resistencia',
    contenido: [
      { tipo: 'Video', titulo: 'Sesiones de cardio', link: '/videos/cardio.mp4' },
      { tipo: 'PDF', titulo: 'Consejos para mejorar resistencia', link: '/pdfs/consejos.pdf' },
      { tipo: 'Quiz', titulo: 'Evaluación final', link: '/quizzes/cardio' }
    ]
  }
])

const enrolled = ref(false)
const progress = ref(35)

const openAccordion = ref(null)
const isOpen = (id) => openAccordion.value === id

const toggleAccordion = (id) => {
  if (!enrolled.value) return
  openAccordion.value = openAccordion.value === id ? null : id
}

const handleEnrollment = () => {
  alert('Redirigiendo a pasarela de pagos... (simulación)')
  enrolled.value = true
  progress.value = 0
}

const getIcon = (tipo) => {
  switch (tipo.toLowerCase()) {
    case 'pdf':
      return iconDocumento
    case 'video':
      return iconVideo
    case 'quiz':
      return iconQuiz
    default:
      return iconDefault
  }
}
</script>

<style scoped>
/* ===== Base ===== */
.course-view {
  display: grid;
  gap: 3rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

/* ===== Course Header ===== */
.course-header {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  background: var(--color-blanco);
  border-radius: var(--card-border-radius);
  box-shadow: var(--box-shadow);
  padding: 1rem;
}

.course__media {
  position: relative;
  border-radius: var(--border-radius-3);
  overflow: clip;
  height: 200px;
}

.course__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.course__body {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.course__title {
  margin: 0;
  font-size: clamp(1.6rem, 3.5vw, 2.2rem);
  color: var(--color-oscuro);
}

.course__desc {
  margin: 0;
  color: var(--color-oscuro-variante);
  font-size: 1rem;
}

.course__actions {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}

.btn--large {
  --_pad: 0.8rem 1.8rem;
  font-size: 1.1rem;
}

/* ===== Progress Bar ===== */
.progress {
  margin-top: 1rem;
}

.progress__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.progress__header h3 {
  margin: 0;
  font-size: 1.1rem;
  color: var(--color-oscuro);
}

.progress__header span {
  font-weight: 700;
  color: var(--color-morado);
}

.progress__bar {
  height: 8px;
  background: var(--color-light);
  border-radius: 999px;
  overflow: hidden;
}

.progress__fill {
  height: 100%;
  background: linear-gradient(135deg, var(--color-naranja), var(--color-morado));
  transition: width 0.3s ease;
}

/* ===== Modules ===== */
.modules__grid {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 1.25rem;
}

.module {
  grid-column: 1 / -1;
}

.module__card {
  background: var(--color-blanco);
  border-radius: var(--border-radius-3);
  box-shadow: var(--box-shadow);
  overflow: hidden;
  position: relative;
}

.module__card:hover {
  box-shadow: 0 1.4rem 3rem var(--color-light);
}

.module__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.4rem 1.5rem;
  cursor: pointer;
  background: var(--color-morado);
  color: var(--color-blanco);
  transition: background 180ms ease;
}

.module__header:hover {
  background: #6b4b8a;
}

.module__title {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 700;
}

.module__icon {
  font-size: 1.3rem;
  font-weight: bold;
}

.module__content {
  padding: 1.5rem;
  background: var(--color-blanco);
}

/* Transición del acordeón */
.accordion-enter-active,
.accordion-leave-active {
  transition: all 0.35s ease;
  overflow: hidden;
}

.accordion-enter-from,
.accordion-leave-to {
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
}

.accordion-enter-to,
.accordion-leave-from {
  max-height: 500px;
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
}

.module__items {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 1rem;
}

.module__item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.8rem 0;
  border-bottom: 1px solid var(--color-light);
}

.module__item:last-child {
  border-bottom: none;
}

/* === Iconos pequeños y morados por defecto (igual que en hover del navbar) === */
.module__item-icon {
  width: 20px;
  height: 20px;
  object-fit: contain;
  flex-shrink: 0;
  /* Exactamente el mismo filtro que usas en .icon-btn:hover .icon */
  filter: brightness(0) saturate(100%) invert(23%) sepia(92%) saturate(7478%) hue-rotate(265deg) brightness(95%) contrast(101%);
}

.module__link {
  color: var(--color-morado);
  text-decoration: none;
  font-weight: 600;
  font-size: 1.05rem;
}

.module__link:hover {
  text-decoration: underline;
}

.module__type {
  font-weight: normal;
  color: var(--color-oscuro-variante);
  font-size: 0.95rem;
}

.module__overlay {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  background: rgba(0, 0, 0, 0.55);
  color: var(--color-blanco);
  pointer-events: none;
}

.module__lock {
  font-size: 1.6rem;
  font-weight: 700;
}

.is-locked .module__header {
  cursor: not-allowed;
  opacity: 0.8;
}

/* ===== Reutilizados ===== */
.section-header {
  text-align: center;
  margin: 0 auto 1.25rem;
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

.btn {
  --_pad: .6rem 1rem;
  padding: var(--_pad);
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

/* ===== Breakpoints ===== */
@media (min-width: 768px) {
  .course-header {
    grid-template-columns: 300px 1fr;
    gap: 1.5rem;
    padding: 1.5rem;
  }

  .course__media {
    height: 220px;
  }
}
</style>