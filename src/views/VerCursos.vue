<template>
  <main class="course-view">
    <!-- ===== HEADER DEL CURSO ===== -->
    <section class="course-header">
      <div class="course-header__container">
        <!-- Contenedor principal (izquierda en PC) -->
        <div class="course__left-column" :class="{ 'course__left-column--full': enrolled }">
          <!-- Imagen del curso -->
          <div class="course__media-container">
            <div class="course__media">
              <img class="course__img" :src="course.imagen_curso" :alt="`Portada de ${course.nombre_curso}`" loading="lazy" decoding="async" />
            </div>
          </div>

          <!-- Información del curso -->
          <div class="course__info">
            <div class="course__meta">
              <span class="course__category">{{ course.category }}</span>
              <span class="course__difficulty" :class="getDifficultyClass(course.difficulty)">
                {{ course.difficulty }}
              </span>
              <div class="course__rating">
                <div class="stars">
                  <span v-for="n in 5" :key="n" class="star" :class="{ filled: n <= Math.round(course.rating) }">★</span>
                </div>
                <span class="rating-value">{{ course.rating.toFixed(1) }}</span>
              </div>
            </div>
            
            <h1 class="course__title">{{ course.nombre_curso }}</h1>
            
            <p class="course__desc">{{ course.descripcion_curso }}</p>
            
            <div class="course__stats">
              <div class="stat">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>{{ course.duration }}</span>
              </div>
              <div class="stat">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" stroke-width="2"/>
                  <path d="M12 6V12L16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>{{ course.lessons }} lecciones</span>
              </div>
              <div class="stat">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>{{ course.students }} estudiantes</span>
              </div>
            </div>

            <div v-if="enrolled" class="progress-section">
              <div class="progress__header">
                <h3>Tu progreso</h3>
                <span>{{ progress }}%</span>
              </div>
              <div class="progress__bar">
                <div class="progress__fill" :style="{ width: `${progress}%` }"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar de compra (solo visible si NO está inscrito) -->
        <div v-if="!enrolled" class="course__sidebar">
          <div class="pricing-card">
            <div class="pricing__header">
              <div class="pricing__amount">
                <div class="current-price">{{ formatPrice(course.price) }}</div>
                <div class="original-price" v-if="course.originalPrice">
                  {{ formatPrice(course.originalPrice) }}
                </div>
              </div>
              <div v-if="course.discount" class="pricing__discount">
                <span class="discount-badge">{{ course.discount }}% OFF</span>
              </div>
            </div>

            <div class="pricing__features">
              <ul>
                <li v-for="feature in course.features" :key="feature">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  {{ feature }}
                </li>
              </ul>
            </div>

            <div class="pricing__actions">
              <button class="btn btn--primary btn--block btn--large" @click="simulatePayment">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Comprar este curso
              </button>
            </div>

            <div class="pricing__guarantee">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <div>
                <strong>Garantía de 7 días</strong>
                <p>Si no estás satisfecho, te devolvemos tu dinero</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== MÓDULOS DEL CURSO ===== -->
    <section class="modules-section">
      <div class="modules-container">
        <div class="modules__header">
          <div>
            <h2>Contenido del curso</h2>
            <p>{{ modulos.length }} módulos • {{ totalLessons }} lecciones • {{ totalDuration }}</p>
          </div>
          <div class="modules__progress" v-if="enrolled">
            <span>{{ completedLessons }} de {{ totalLessons }} lecciones completadas</span>
            <div class="modules__progress-bar">
              <div class="modules__progress-fill" :style="{ width: `${lessonProgress}%` }"></div>
            </div>
          </div>
        </div>

        <div class="modules">
          <div v-for="modulo in modulos" :key="modulo.id_modulo" class="module">
            <div class="module__header" @click="toggleAccordion(modulo.id_modulo)">
              <div class="module__info">
                <div class="module__number">
                  <span>Módulo {{ modulo.numero }}</span>
                  <span v-if="enrolled && modulo.completed" class="module__completed">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Completado
                  </span>
                  <span v-if="!enrolled && modulo.numero > 1" class="module__locked">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z" stroke="currentColor" stroke-width="2"/>
                      <path d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" stroke-width="2"/>
                    </svg>
                    Bloqueado
                  </span>
                </div>
                <h3 class="module__title">{{ modulo.nombre_modulo }}</h3>
                <div class="module__meta">
                  <span>{{ modulo.lessons }} lecciones</span>
                  <span>•</span>
                  <span>{{ modulo.duration }}</span>
                </div>
              </div>
              <div class="module__toggle">
                <span class="module__icon">
                  {{ isOpen(modulo.id_modulo) ? '−' : '+' }}
                </span>
              </div>
            </div>

            <transition name="accordion">
              <div v-if="isOpen(modulo.id_modulo)" class="module__content">
                <div v-if="!enrolled && modulo.numero > 1" class="module__locked-overlay">
                  <div class="locked-content">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z" stroke="currentColor" stroke-width="2"/>
                      <path d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" stroke-width="2"/>
                    </svg>
                    <h4>Contenido bloqueado</h4>
                    <p>Adquiere el curso para desbloquear todos los módulos y lecciones</p>
                    <button class="btn btn--primary" @click="simulatePayment">
                      Comprar curso ahora
                    </button>
                  </div>
                </div>
                <div v-else class="lessons">
                  <div v-for="(item, index) in modulo.contenido" :key="index" class="lesson">
                    <div class="lesson__icon">
                      <img :src="getIcon(item.tipo)" :alt="`Icono de ${item.tipo}`" />
                    </div>
                    <div class="lesson__info">
                      <h4 class="lesson__title">{{ item.titulo }}</h4>
                      <div class="lesson__meta">
                        <span class="lesson__type">{{ item.tipo }}</span>
                        <span class="lesson__duration" v-if="item.duration">{{ item.duration }}</span>
                        <span class="lesson__status" v-if="enrolled && item.completed">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          </svg>
                          Completado
                        </span>
                      </div>
                    </div>
                    <div class="lesson__actions">
                      <button v-if="enrolled" 
                              class="btn btn--small" 
                              :class="item.completed ? 'btn--ghost' : 'btn--primary'"
                              @click="openLesson(item)">
                        {{ item.completed ? 'Repasar' : 'Comenzar' }}
                      </button>
                      <div v-else class="lesson__locked">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z" stroke="currentColor" stroke-width="2"/>
                          <path d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" stroke-width="2"/>
                        </svg>
                        <span>Bloqueado</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== INFORMACIÓN ADICIONAL ===== -->
    <section class="additional-info">
      <div class="info-grid">
        <div class="info-card">
          <div class="info-card__icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 10 12 10C10.3431 10 10 10.3431 10 12C10 13.1046 10.8954 14 12 14Z" stroke="currentColor" stroke-width="2"/>
              <path d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" stroke-width="2"/>
            </svg>
          </div>
          <h3>Certificado de finalización</h3>
          <p>Obtén un certificado digital al completar el curso que podrás compartir en tu LinkedIn.</p>
        </div>

        <div class="info-card">
          <div class="info-card__icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2"/>
              <path d="M12 6V12L16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <h3>Acceso de por vida</h3>
          <p>Accede al curso y todas sus actualizaciones futuras para siempre, sin pagos adicionales.</p>
        </div>

        <div class="info-card">
          <div class="info-card__icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 15V9M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <h3>Soporte 24/7</h3>
          <p>Nuestro equipo está disponible para resolver tus dudas en cualquier momento del día.</p>
        </div>
      </div>
    </section>

    <!-- Modal de simulación de pago - CORREGIDO -->
    <div v-if="showPaymentModal" class="payment-modal-overlay" @click="closePaymentModal">
      <div class="payment-modal" @click.stop>
        <div class="payment-modal__content">
          <div class="payment-modal__header">
            <h3>Simulación de Pago</h3>
            <button class="close-btn" @click="closePaymentModal">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
          
          <div class="payment-modal__body">
            <div class="payment-summary">
              <div class="summary-item">
                <span>Curso:</span>
                <span>{{ course.nombre_curso }}</span>
              </div>
              <div class="summary-item">
                <span>Precio:</span>
                <span>{{ formatPrice(course.price) }}</span>
              </div>
              <div class="summary-item" v-if="course.discount">
                <span>Descuento:</span>
                <span class="discount">-{{ course.discount }}%</span>
              </div>
              <div class="summary-total">
                <span>Total:</span>
                <span class="total-price">{{ formatPrice(course.price) }}</span>
              </div>
            </div>
            
            <div class="payment-loading" v-if="processingPayment">
              <div class="spinner"></div>
              <p>Procesando pago...</p>
            </div>
            
            <div v-else class="payment-success">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 6L9 17L4 12" stroke="#28a745" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#28a745" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <h4>¡Pago completado exitosamente!</h4>
              <p>Ahora tienes acceso completo al curso</p>
              <button class="btn btn--primary btn--start-learning" @click="completePayment">
                Comenzar a aprender
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue'

// Importamos los iconos
import iconDocumento from '@/assets/icons/documento.png'
import iconVideo from '@/assets/icons/Video.png'
import iconQuiz from '@/assets/icons/Quiz.png'

// Datos del curso
const course = ref({
  id_curso: '1',
  nombre_curso: 'Fitness Intensivo',
  descripcion_curso: 'Clases grupales de alta energía para mejorar fuerza y resistencia. Incluye rutinas personalizadas, seguimiento de progreso y tips nutricionales.',
  imagen_curso: 'https://cdn.prod.website-files.com/65d7b904c0af185c6d721f6f/66745b16786e4667065274df_Friends-Taking-Fitness-Class-NewYorkCity.webp',
  category: 'Fitness',
  difficulty: 'Intermedio',
  rating: 4.8,
  duration: '8 semanas',
  lessons: 24,
  students: '1,250',
  price: 120000,
  originalPrice: 180000,
  discount: 33,
  features: [
    'Acceso de por vida',
    'Certificado de finalización',
    'Proyectos prácticos',
    'Acceso en móvil y TV',
    'Soporte 24/7',
    'Actualizaciones gratuitas'
  ]
})

const modulos = ref([
  {
    id_modulo: '1',
    numero: 1,
    nombre_modulo: 'Fundamentos del Fitness',
    lessons: 5,
    duration: '2h 30m',
    completed: false,
    contenido: [
      { tipo: 'Video', titulo: 'Introducción y objetivos del curso', duration: '15m', completed: false },
      { tipo: 'Video', titulo: 'Anatomía básica para el ejercicio', duration: '25m', completed: false },
      { tipo: 'PDF', titulo: 'Guía de ejercicios básicos', duration: '45m', completed: false },
      { tipo: 'Video', titulo: 'Técnicas de respiración y postura', duration: '20m', completed: false },
      { tipo: 'Quiz', titulo: 'Evaluación de conocimientos básicos', duration: '30m', completed: false }
    ]
  },
  {
    id_modulo: '2',
    numero: 2,
    nombre_modulo: 'Entrenamiento de Fuerza Avanzado',
    lessons: 6,
    duration: '3h 45m',
    completed: false,
    contenido: [
      { tipo: 'Video', titulo: 'Rutinas con pesas libres', duration: '35m', completed: false },
      { tipo: 'Video', titulo: 'Entrenamiento con máquinas', duration: '30m', completed: false },
      { tipo: 'PDF', titulo: 'Plan de 6 semanas para fuerza', duration: '40m', completed: false },
      { tipo: 'Video', titulo: 'Técnicas de hipertrofia', duration: '25m', completed: false },
      { tipo: 'Video', titulo: 'Prevención de lesiones', duration: '20m', completed: false },
      { tipo: 'Quiz', titulo: 'Test de fuerza y técnica', duration: '35m', completed: false }
    ]
  },
  {
    id_modulo: '3',
    numero: 3,
    nombre_modulo: 'Cardio y Resistencia',
    lessons: 4,
    duration: '2h 15m',
    completed: false,
    contenido: [
      { tipo: 'Video', titulo: 'Sesiones HIIT para quemar grasa', duration: '30m', completed: false },
      { tipo: 'PDF', titulo: 'Guía de cardio en casa', duration: '35m', completed: false },
      { tipo: 'Video', titulo: 'Entrenamiento de intervalos', duration: '25m', completed: false },
      { tipo: 'Quiz', titulo: 'Evaluación de resistencia', duration: '45m', completed: false }
    ]
  }
])

const enrolled = ref(false)
const progress = ref(0)
const openAccordion = ref(null)
const showPaymentModal = ref(false)
const processingPayment = ref(false)

// Computed properties
const totalLessons = computed(() => {
  return modulos.value.reduce((total, modulo) => total + modulo.lessons, 0)
})

const totalDuration = computed(() => {
  return '8h 30m'
})

const completedLessons = computed(() => {
  let completed = 0
  modulos.value.forEach(modulo => {
    modulo.contenido.forEach(lesson => {
      if (lesson.completed) completed++
    })
  })
  return completed
})

const lessonProgress = computed(() => {
  return Math.round((completedLessons.value / totalLessons.value) * 100)
})

const isOpen = (id) => openAccordion.value === id

// Métodos
const toggleAccordion = (id) => {
  if (!enrolled.value && id !== '1') {
    // Si no está inscrito y no es el módulo 1, no permite abrir
    if (id === '1') {
      openAccordion.value = openAccordion.value === id ? null : id
    } else {
      // Muestra mensaje o modal para comprar
      simulatePayment()
    }
    return
  }
  openAccordion.value = openAccordion.value === id ? null : id
}

const simulatePayment = () => {
  showPaymentModal.value = true
  // Procesar pago automáticamente después de mostrar el modal
  setTimeout(() => {
    processPayment()
  }, 500)
}

const processPayment = () => {
  processingPayment.value = true
  
  // Simular proceso de pago
  setTimeout(() => {
    processingPayment.value = false
  }, 2000)
}

const completePayment = () => {
  enrolled.value = true
  showPaymentModal.value = false
  progress.value = 0
  openAccordion.value = '1'
}

const closePaymentModal = () => {
  if (!processingPayment.value) {
    showPaymentModal.value = false
  }
}

const continueLearning = () => {
  const incompleteModule = modulos.value.find(m => !m.completed) || modulos.value[0]
  openAccordion.value = incompleteModule.id_modulo
  window.scrollTo({ top: 600, behavior: 'smooth' })
}

const openLesson = (lesson) => {
  console.log('Abriendo lección:', lesson)
  alert(`Abriendo: ${lesson.titulo}`)
}

const getDifficultyClass = (level) => {
  const classes = {
    'Principiante': 'difficulty--beginner',
    'Intermedio': 'difficulty--intermediate',
    'Avanzado': 'difficulty--advanced'
  }
  return classes[level] || ''
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
      return iconVideo
  }
}

const formatPrice = (value) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}
</script>

<style scoped>
.course-view {
  padding: 2rem 1rem;
  max-width: 1200px;
  margin: 0 auto;
}

/* ===== COURSE HEADER ===== */
.course-header {
  margin-bottom: 3rem;
}

.course-header__container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

@media (min-width: 768px) {
  .course-header__container {
    flex-direction: row;
    gap: 3rem;
    align-items: flex-start;
  }
}

/* Columna izquierda (imagen + información) */
.course__left-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

@media (min-width: 768px) {
  .course__left-column {
    flex: 1;
    min-width: 0; /* Permite que se reduzca si es necesario */
  }
  
  .course__left-column--full {
    flex: 1 1 100%;
  }
}

/* Imagen del curso */
.course__media-container {
  width: 100%;
}

.course__media {
  position: relative;
  border-radius: 1.25rem;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  height: 250px;
}

@media (min-width: 768px) {
  .course__media {
    height: 350px;
  }
}

.course__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* Información del curso */
.course__info {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.course__meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.course__category {
  background: rgba(106, 17, 203, 0.1);
  color: var(--color-morado);
  padding: 0.4rem 1rem;
  border-radius: 2rem;
  font-size: 0.85rem;
  font-weight: 600;
}

.course__difficulty {
  padding: 0.4rem 1rem;
  border-radius: 2rem;
  font-size: 0.85rem;
  font-weight: 600;
}

.difficulty--beginner {
  background: rgba(40, 167, 69, 0.1);
  color: #28a745;
}

.difficulty--intermediate {
  background: rgba(253, 126, 20, 0.1);
  color: #fd7e14;
}

.difficulty--advanced {
  background: rgba(220, 53, 69, 0.1);
  color: #dc3545;
}

.course__rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.stars {
  display: flex;
  font-size: 1.1rem;
  color: #e0e0e0;
}

.star.filled {
  color: #ffc107;
  text-shadow: 0 2px 4px rgba(255, 193, 7, 0.3);
}

.rating-value {
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-oscuro);
}

.course__title {
  font-size: 2rem;
  font-weight: 800;
  color: var(--color-oscuro);
  line-height: 1.2;
  margin: 0;
}

@media (min-width: 768px) {
  .course__title {
    font-size: 2.3rem;
  }
}

.course__desc {
  font-size: 1.1rem;
  line-height: 1.6;
  color: var(--color-oscuro-variante);
  margin: 0;
}

.course__stats {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  padding: 1rem 0;
  border-top: 1px solid #f1f3f5;
  border-bottom: 1px solid #f1f3f5;
}

.stat {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  color: var(--color-oscuro-variante);
  font-weight: 500;
}

.stat svg {
  color: var(--color-morado);
  flex-shrink: 0;
}

/* Progress */
.progress-section {
  margin-top: 1rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, rgba(106, 17, 203, 0.05), rgba(106, 17, 203, 0.1));
  border-radius: 1rem;
}

.progress__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.progress__header h3 {
  font-size: 1.1rem;
  color: var(--color-oscuro);
  margin: 0;
}

.progress__header span {
  font-weight: 700;
  color: var(--color-morado);
  font-size: 1.2rem;
}

.progress__bar {
  height: 10px;
  background: #e9ecef;
  border-radius: 5px;
  overflow: hidden;
}

.progress__fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-morado), var(--color-naranja));
  transition: width 0.3s ease;
  border-radius: 5px;
}

/* Sidebar de compra */
.course__sidebar {
  width: 100%;
}

@media (min-width: 768px) {
  .course__sidebar {
    width: 380px;
    flex-shrink: 0;
  }
}

.pricing-card {
  background: var(--color-blanco);
  border-radius: 1.25rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  border: 1px solid #f1f3f5;
}

@media (min-width: 768px) {
  .pricing-card {
    position: sticky;
    top: 2rem;
  }
}

.pricing__header {
  text-align: center;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #f1f3f5;
}

.pricing__amount {
  margin: 1.5rem 0;
}

.current-price {
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--color-oscuro);
  line-height: 1;
}

.original-price {
  font-size: 1.2rem;
  color: var(--color-oscuro-variante);
  text-decoration: line-through;
  margin-top: 0.5rem;
}

.pricing__discount {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}

.discount-badge {
  background: linear-gradient(135deg, #28a745, #20c997);
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 2rem;
  font-weight: 600;
  font-size: 0.9rem;
  display: inline-block;
}

.pricing__features {
  margin-bottom: 2rem;
}

.pricing__features ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 0.75rem;
}

.pricing__features li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.95rem;
  color: var(--color-oscuro-variante);
}

.pricing__features svg {
  color: #28a745;
  flex-shrink: 0;
}

.pricing__actions {
  display: grid;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.btn {
  padding: 0.85rem 1.75rem;
  border-radius: 0.875rem;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: none;
  outline: none;
}

.btn--primary {
  background: linear-gradient(135deg, var(--color-morado) 0%, var(--color-naranja) 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(106, 17, 203, 0.25);
}

.btn--primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(106, 17, 203, 0.35);
}

.btn--success {
  background: linear-gradient(135deg, #28a745, #20c997);
  color: white;
  box-shadow: 0 4px 15px rgba(40, 167, 69, 0.25);
}

.btn--success:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(40, 167, 69, 0.35);
}

.btn--ghost {
  background: transparent;
  color: var(--color-oscuro);
  border: 1.5px solid #e9ecef;
}

.btn--ghost:hover {
  background: #f8f9fa;
  border-color: #dee2e6;
}

.btn--block {
  width: 100%;
  justify-content: center;
}

.btn--large {
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 700;
}

.btn--small {
  padding: 0.4rem 1rem;
  font-size: 0.85rem;
}

.pricing__guarantee {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 0.75rem;
  border-left: 4px solid #28a745;
}

.pricing__guarantee svg {
  color: #28a745;
  flex-shrink: 0;
}

.pricing__guarantee strong {
  display: block;
  font-size: 0.95rem;
  color: var(--color-oscuro);
}

.pricing__guarantee p {
  font-size: 0.85rem;
  color: var(--color-oscuro-variante);
  margin: 0.25rem 0 0 0;
}

/* ===== MODULES SECTION ===== */
.modules-section {
  margin-bottom: 4rem;
}

.modules-container {
  background: var(--color-blanco);
  border-radius: 1.25rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  padding: 2rem;
  border: 1px solid #f1f3f5;
}

.modules__header {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #f1f3f5;
}

@media (min-width: 768px) {
  .modules__header {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-end;
  }
}

.modules__header h2 {
  font-size: 1.8rem;
  font-weight: 800;
  color: var(--color-oscuro);
  margin: 0 0 0.5rem 0;
}

.modules__header p {
  font-size: 1rem;
  color: var(--color-oscuro-variante);
  margin: 0;
}

.modules__progress {
  flex-shrink: 0;
}

.modules__progress span {
  display: block;
  font-size: 0.9rem;
  color: var(--color-oscuro-variante);
  margin-bottom: 0.5rem;
}

.modules__progress-bar {
  height: 6px;
  background: #e9ecef;
  border-radius: 3px;
  overflow: hidden;
}

.modules__progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-morado), var(--color-naranja));
  border-radius: 3px;
}

.modules {
  display: grid;
  gap: 1rem;
}

.module {
  border: 1px solid #f1f3f5;
  border-radius: 1rem;
  overflow: hidden;
  transition: all 0.3s ease;
}

.module:hover {
  border-color: #dee2e6;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.module__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  cursor: pointer;
  background: #f8f9fa;
  transition: background 0.2s ease;
}

.module__header:hover {
  background: #f1f3f5;
}

.module__info {
  flex: 1;
}

.module__number {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
  font-size: 0.85rem;
  color: var(--color-morado);
  font-weight: 600;
}

.module__completed,
.module__locked {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.75rem;
  border-radius: 2rem;
  font-size: 0.75rem;
  font-weight: 600;
}

.module__completed {
  background: rgba(40, 167, 69, 0.1);
  color: #28a745;
}

.module__locked {
  background: rgba(220, 53, 69, 0.1);
  color: #dc3545;
}

.module__title {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--color-oscuro);
  margin: 0 0 0.5rem 0;
}

.module__meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: var(--color-oscuro-variante);
}

.module__toggle {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.module__icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--color-morado);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: bold;
  transition: transform 0.2s ease;
}

.module__content {
  background: var(--color-blanco);
  position: relative;
}

.module__locked-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.locked-content {
  text-align: center;
  padding: 2rem;
  max-width: 400px;
}

.locked-content svg {
  color: var(--color-morado);
  margin-bottom: 1rem;
}

.locked-content h4 {
  font-size: 1.5rem;
  color: var(--color-oscuro);
  margin: 0 0 0.5rem 0;
}

.locked-content p {
  color: var(--color-oscuro-variante);
  margin-bottom: 1.5rem;
  font-size: 1rem;
}

.lessons {
  display: grid;
  gap: 0.75rem;
  padding: 1.5rem;
}

.lesson {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 0.75rem;
  align-items: center;
}

.lesson__icon {
  width: 40px;
  height: 40px;
  background: white;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.lesson__icon img {
  width: 20px;
  height: 20px;
}

.lesson__info {
  flex: 1;
}

.lesson__title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-oscuro);
  margin: 0 0 0.25rem 0;
}

.lesson__meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.lesson__type,
.lesson__duration,
.lesson__status {
  font-size: 0.85rem;
  padding: 0.2rem 0.6rem;
  border-radius: 2rem;
  font-weight: 500;
}

.lesson__type {
  background: rgba(106, 17, 203, 0.1);
  color: var(--color-morado);
}

.lesson__duration {
  background: rgba(253, 126, 20, 0.1);
  color: #fd7e14;
}

.lesson__status {
  background: rgba(40, 167, 69, 0.1);
  color: #28a745;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.lesson__locked {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-oscuro-variante);
  font-size: 0.85rem;
  opacity: 0.7;
}

/* ===== ADDITIONAL INFO ===== */
.additional-info {
  margin-bottom: 3rem;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .info-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.info-card {
  background: var(--color-blanco);
  border-radius: 1rem;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
  border: 1px solid #f1f3f5;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.info-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.info-card__icon {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, rgba(106, 17, 203, 0.1), rgba(106, 17, 203, 0.05));
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
}

.info-card__icon svg {
  color: var(--color-morado);
}

.info-card h3 {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--color-oscuro);
  margin: 0 0 1rem 0;
}

.info-card p {
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--color-oscuro-variante);
  margin: 0;
}

/* ===== PAYMENT MODAL CORREGIDO ===== */
.payment-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  backdrop-filter: blur(4px);
}

.payment-modal {
  background: var(--color-blanco);
  border-radius: 1.5rem;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto; /* IMPORTANTE: Permite scroll si el contenido es muy largo */
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.payment-modal__content {
  padding: 2rem;
}

.payment-modal__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f1f3f5;
}

.payment-modal__header h3 {
  font-size: 1.5rem;
  color: var(--color-oscuro);
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  color: var(--color-oscuro-variante);
}

.payment-modal__body {
  display: flex;
  flex-direction: column;
}

.payment-summary {
  background: #f8f9fa;
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  color: var(--color-oscuro-variante);
  font-size: 0.95rem;
}

.summary-item .discount {
  color: #28a745;
  font-weight: 600;
}

.summary-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-top: 2px solid #e9ecef;
  margin-top: 0.5rem;
  font-weight: 700;
  color: var(--color-oscuro);
}

.total-price {
  font-size: 1.5rem;
  color: var(--color-morado);
}

.payment-loading {
  text-align: center;
  padding: 2rem 1rem;
}

.spinner {
  width: 60px;
  height: 60px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid var(--color-morado);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.payment-loading p {
  color: var(--color-oscuro-variante);
  margin: 0;
  font-size: 1rem;
}

.payment-success {
  text-align: center;
  padding: 1.5rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.payment-success svg {
  margin-bottom: 0.5rem;
}

.payment-success h4 {
  font-size: 1.5rem;
  color: var(--color-oscuro);
  margin: 0;
  line-height: 1.3;
}

.payment-success p {
  color: var(--color-oscuro-variante);
  margin: 0;
  font-size: 1rem;
  line-height: 1.5;
}

.btn--start-learning {
  margin-top: 1rem;
  padding: 1rem 2.5rem;
  font-size: 1.1rem;
  font-weight: 700;
  min-width: 200px;
}

/* ===== ACCORDION TRANSITION ===== */
.accordion-enter-active,
.accordion-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.accordion-enter-from,
.accordion-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-10px);
}

.accordion-enter-to,
.accordion-leave-from {
  max-height: 1000px;
  opacity: 1;
  transform: translateY(0);
}

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  .course__title {
    font-size: 1.8rem;
  }
  
  .course__media {
    height: 200px;
  }
  
  .course__stats {
    flex-direction: column;
    gap: 0.75rem;
    align-items: flex-start;
  }
  
  .module__header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .lesson {
    grid-template-columns: 1fr;
    gap: 0.75rem;
    text-align: center;
  }
  
  .lesson__meta {
    justify-content: center;
  }
  
  .course__sidebar {
    margin-top: 2rem;
  }
  
  .payment-modal {
    margin: 1rem;
  }
  
  .payment-modal__content {
    padding: 1.5rem;
  }
  
  .btn--start-learning {
    width: 100%;
    max-width: 280px;
  }
}

@media (max-width: 480px) {
  .course__media {
    height: 180px;
  }
  
  .modules-container {
    padding: 1.5rem;
  }
  
  .module__header {
    padding: 1rem;
  }
  
  .lesson {
    padding: 0.75rem;
  }
  
  .payment-success h4 {
    font-size: 1.3rem;
  }
  
  .payment-success p {
    font-size: 0.95rem;
  }
  
  .btn--start-learning {
    padding: 0.875rem 1.5rem;
    font-size: 1rem;
  }
}
</style>