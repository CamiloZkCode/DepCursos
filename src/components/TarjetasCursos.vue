<template>
  <main class="cursos">
    <!-- ===== FILTROS ===== -->
    <section class="filters">
      <div class="filters__header">
        <h1 class="filters__title">Catálogo de Cursos</h1>
        <p class="filters__subtitle">Descubre programas diseñados para potenciar tu carrera</p>
      </div>

      <div class="filters__container">
        <div class="filters__controls">
          <div class="filters__fields">
            <div class="field">
              <div class="field__icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 11H5M19 11C20.1046 11 21 11.8954 21 13V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V13C3 11.8954 3.89543 11 5 11M19 11V9C19 7.89543 18.1046 7 17 7M5 11V9C5 7.89543 5.89543 7 7 7M7 7V5C7 3.89543 7.89543 3 9 3H15C16.1046 3 17 3.89543 17 5V7M7 7H17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <label for="f-categoria">Categoría</label>
              <select id="f-categoria" v-model="filters.category">
                <option value="">Todas las categorías</option>
                <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
              </select>
            </div>

            <div class="field">
              <div class="field__icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M19.4 15C19.2669 15.923 18.9771 16.818 18.5433 17.648C18.1095 18.478 17.5392 19.23 16.8572 19.871C16.1752 20.512 15.3921 21.033 14.5422 21.41C13.6922 21.787 12.7884 22.014 11.8673 22.081C10.9462 22.148 10.0214 22.055 9.13156 21.806C8.24169 21.557 7.40018 21.155 6.64501 20.618L3 22L4.382 18.355C3.84499 17.5998 3.44332 16.7583 3.19411 15.8684C2.9449 14.9786 2.85183 14.0538 2.91844 13.1327C2.98506 12.2116 3.21202 11.3078 3.58905 10.4578C3.96608 9.60792 4.48708 8.82484 5.12813 8.14284C5.76917 7.46085 6.5209 6.89052 7.3509 6.45672C8.18089 6.02292 9.07591 5.73307 9.999 5.6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <label for="f-dificultad">Nivel</label>
              <select id="f-dificultad" v-model="filters.difficulty">
                <option value="">Todos los niveles</option>
                <option v-for="dif in difficulties" :key="dif" :value="dif">{{ dif }}</option>
              </select>
            </div>
          </div>

          <button class="btn btn--ghost btn--icon" @click="clearFilters">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 6L5 18M5 6L19 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            Limpiar filtros
          </button>
        </div>

        <div class="filters__meta">
          <span class="filters__count">{{ filteredCourses.length }} cursos disponibles</span>
          <span v-if="filtersSummary" class="filters__active">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 18H14M6 12H18M3 6H21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            {{ filtersSummary }}
          </span>
        </div>
      </div>
    </section>

    <!-- ===== LISTADO DE CURSOS ===== -->
    <section class="results">
      <div v-if="filteredCourses.length === 0" class="empty-state">
        <div class="empty-state__icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 15V9M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <h3>No se encontraron cursos</h3>
        <p>Intenta con otros filtros de búsqueda</p>
        <button class="btn btn--primary" @click="clearFilters">Mostrar todos los cursos</button>
      </div>

      <ul class="cards" v-else>
        <li v-for="course in currentPageCourses" :key="course.id" class="card">
          <article class="course-card">
            <!-- Imagen del curso - MÁS ALTA -->
            <div class="course-card__image" :style="{ 'background-image': `url(${courseImage})` }">
              <div class="course-card__category">
                {{ course.category }}
              </div>
            </div>

            <!-- Contenido del curso - MÁS COMPACTO -->
            <div class="course-card__content">
              <div class="course-card__header">
                <h3 class="course-card__title">{{ course.name }}</h3>
                <div class="course-card__rating">
                  <div class="stars">
                    <span v-for="n in 5" :key="n" class="star" :class="{ filled: n <= Math.round(course.rating) }">★</span>
                  </div>
                  <span class="rating-value">{{ course.rating.toFixed(1) }}</span>
                </div>
              </div>

              <p class="course-card__description">
                Fundamentos de {{ course.category.toLowerCase() }}, conceptos clave y mejores prácticas.
              </p>

              <div class="course-card__details">
                <div class="course-card__difficulty" :class="getDifficultyClass(course.difficulty)">
                  <span class="difficulty-dot"></span>
                  {{ course.difficulty }}
                </div>
              </div>

              <div class="course-card__footer">
                <div class="course-card__price">{{ formatPrice(course.price) }}</div>
                <button class="btn btn--primary" @click="goToCourse(course.id)">
                  Ver curso
                </button>
              </div>
            </div>
          </article>
        </li>
      </ul>

      <!-- Paginación -->
      <div class="pagination" v-if="filteredCourses.length > perPage && filteredCourses.length > 0">
        <button class="btn btn--ghost btn--icon" @click="prevPage" :disabled="currentPage === 1">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Anterior
        </button>
        
        <div class="pagination__pages">
          <button v-for="page in totalPages" :key="page" 
                  class="btn btn--ghost pagination__page"
                  :class="{ 'pagination__page--active': page === currentPage }" 
                  @click="currentPage = page">
            {{ page }}
          </button>
        </div>
        
        <button class="btn btn--ghost btn--icon" @click="nextPage" :disabled="currentPage === totalPages">
          Siguiente
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const courseImage = 'https://images.unsplash.com/photo-1588912914078-2fe5224fd8b8?q=80&w=870&auto=format&fit=crop';

const courses = ref([
  { id: 1, name: 'CCNA Routing & Switching', category: 'Redes', difficulty: 'Principiante', rating: 4.7, price: 120000 },
  { id: 2, name: 'Ciberseguridad Esencial', category: 'Seguridad', difficulty: 'Intermedio', rating: 4.5, price: 120000 },
  { id: 3, name: 'JavaScript Profesional', category: 'Programación', difficulty: 'Avanzado', rating: 4.9, price: 120000 },
  { id: 4, name: 'Python para Data Science', category: 'Data Science', difficulty: 'Intermedio', rating: 4.8, price: 120000 },
  { id: 5, name: 'Diseño UI/UX con Figma', category: 'Diseño', difficulty: 'Principiante', rating: 4.6, price: 120000 },
  { id: 6, name: 'DevOps con Docker y Kubernetes', category: 'DevOps', difficulty: 'Avanzado', rating: 4.4, price: 120000 },
]);

const categories = computed(() => [...new Set(courses.value.map(c => c.category))].sort());
const difficulties = computed(() => ['Principiante', 'Intermedio', 'Avanzado']);

const filters = reactive({
  category: '',
  difficulty: '',
});

const filteredCourses = computed(() => {
  return courses.value.filter(course => {
    if (filters.category && course.category !== filters.category) return false;
    if (filters.difficulty && course.difficulty !== filters.difficulty) return false;
    return true;
  });
});

const filtersSummary = computed(() => {
  const parts = [];
  if (filters.category) parts.push(filters.category);
  if (filters.difficulty) parts.push(filters.difficulty);
  return parts.length ? parts.join(' • ') : '';
});

const perPage = 12;
const currentPage = ref(1);
const totalPages = computed(() => Math.ceil(filteredCourses.value.length / perPage));
const currentPageCourses = computed(() => {
  const start = (currentPage.value - 1) * perPage;
  return filteredCourses.value.slice(start, start + perPage);
});

watch(filteredCourses, () => { currentPage.value = 1; });

function prevPage() { if (currentPage.value > 1) currentPage.value--; }
function nextPage() { if (currentPage.value < totalPages.value) currentPage.value++; }

function clearFilters() {
  filters.category = '';
  filters.difficulty = '';
}

function goToCourse(id) {
  router.push(`/ver-curso`);
}

function getDifficultyClass(difficulty) {
  const classes = {
    'Principiante': 'difficulty--beginner',
    'Intermedio': 'difficulty--intermediate',
    'Avanzado': 'difficulty--advanced'
  };
  return classes[difficulty] || '';
}

function formatPrice(value) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}
</script>

<style scoped>
.cursos {
  padding: 2rem 1rem;
  max-width: 1400px;
  margin: 0 auto;
}

/* ===== FILTROS ===== */
.filters {
  margin-bottom: 2.5rem;
}

.filters__header {
  margin-bottom: 2rem;
  text-align: center;
}

.filters__title {
  font-size: 2.2rem;
  font-weight: 800;
  color: var(--color-oscuro);
  margin: 0 0 0.5rem 0;
  background: linear-gradient(135deg, var(--color-morado) 0%, var(--color-naranja) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.filters__subtitle {
  font-size: 1.1rem;
  color: var(--color-oscuro-variante);
  margin: 0;
  opacity: 0.8;
}

.filters__container {
  background: var(--color-blanco);
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  padding: 1.75rem;
  border: 1px solid rgba(0, 0, 0, 0.04);
}

.filters__controls {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1.5rem;
  margin-bottom: 1.25rem;
}

.filters__fields {
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem;
  flex: 1;
  min-width: 280px;
}

.field {
  position: relative;
  display: grid;
  gap: 0.6rem;
  flex: 1;
  min-width: 220px;
}

.field__icon {
  position: absolute;
  left: 1rem;
  top: 2.6rem;
  color: var(--color-oscuro-variante);
  opacity: 0.6;
  z-index: 1;
}

.field label {
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--color-oscuro);
  letter-spacing: 0.3px;
}

.field select {
  padding: 0.8rem 1rem 0.8rem 2.75rem;
  border: 1.5px solid #e9ecef;
  border-radius: 0.75rem;
  background: var(--color-blanco);
  font-size: 0.95rem;
  color: var(--color-oscuro);
  transition: all 0.3s ease;
  appearance: none;
  cursor: pointer;
}

.field select:focus {
  outline: none;
  border-color: var(--color-morado);
  box-shadow: 0 0 0 3px rgba(106, 17, 203, 0.1);
}

.filters__meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  padding-top: 1.25rem;
  border-top: 1px solid #f1f3f5;
}

.filters__count {
  font-weight: 600;
  color: var(--color-oscuro);
  font-size: 1rem;
}

.filters__active {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(106, 17, 203, 0.08);
  color: var(--color-morado);
  padding: 0.4rem 0.9rem;
  border-radius: 1.5rem;
  font-size: 0.85rem;
  font-weight: 500;
}

/* ===== CARDS MÁS COMPACTAS Y CON IMAGEN MÁS ALTA ===== */
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  list-style: none;
  padding: 0;
  margin: 0;
}

.course-card {
  background: var(--color-blanco);
  border-radius: 0.875rem;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
  transition: all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.1);
  position: relative;
  border: 1px solid rgba(0, 0, 0, 0.04);
}

.course-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  border-color: rgba(106, 17, 203, 0.08);
}

/* IMAGEN MÁS ALTA */
.course-card__image {
  height: 180px; /* 20px más alto que antes */
  background-size: cover;
  background-position: center;
  position: relative;
  overflow: hidden;
  background-image: url('https://images.unsplash.com/photo-1588912914078-2fe5224fd8b8?q=80&w=870&auto=format&fit=crop');
}

.course-card__image::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40%;
  background: linear-gradient(to top, rgba(0,0,0,0.25), transparent);
}

.course-card__category {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  background: rgba(255, 255, 255, 0.95);
  color: var(--color-oscuro);
  padding: 0.3rem 0.8rem;
  border-radius: 1.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  backdrop-filter: blur(4px);
  z-index: 2;
}

/* CONTENIDO MÁS COMPACTO */
.course-card__content {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 0.75rem;
}

.course-card__header {
  margin-bottom: 0.2rem;
}

.course-card__title {
  margin: 0 0 0.4rem 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-oscuro);
  line-height: 1.3;
  letter-spacing: -0.01em;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.course-card__rating {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.stars {
  display: flex;
  font-size: 0.9rem;
  color: #e0e0e0;
  letter-spacing: 0.5px;
}

.star.filled {
  color: #ffc107;
  text-shadow: 0 1px 2px rgba(255, 193, 7, 0.2);
}

.rating-value {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-oscuro);
}

.course-card__description {
  margin: 0;
  font-size: 0.85rem;
  color: var(--color-oscuro);
  line-height: 1.4;
  opacity: 0.85;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.course-card__details {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0;
  border-top: 1px solid #f1f3f5;
}

.course-card__difficulty {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.6rem;
  border-radius: 1.5rem;
}

.difficulty-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  display: inline-block;
}

.difficulty--beginner .difficulty-dot {
  background: #28a745;
}

.difficulty--intermediate .difficulty-dot {
  background: #fd7e14;
}

.difficulty--advanced .difficulty-dot {
  background: #dc3545;
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

.course-card__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 0.75rem;
  border-top: 1px solid #f1f3f5;
}

.course-card__price {
  font-size: 1.2rem;
  font-weight: 800;
  color: var(--color-oscuro);
  line-height: 1;
}

/* ===== BOTONES MÁS COMPACTOS ===== */
.btn {
  padding: 0.6rem 1.2rem;
  border-radius: 0.65rem;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.25s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  border: none;
  outline: none;
  white-space: nowrap;
}

.btn--primary {
  background: linear-gradient(135deg, var(--color-morado) 0%, var(--color-naranja) 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(106, 17, 203, 0.2);
  padding: 0.6rem 1.2rem;
}

.btn--primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(106, 17, 203, 0.3);
}

.btn--ghost {
  background: transparent;
  color: var(--color-oscuro);
  border: 1.5px solid #e9ecef;
  padding: 0.5rem 1rem;
}

.btn--ghost:hover {
  background: #f8f9fa;
  border-color: #dee2e6;
}

.btn--icon {
  gap: 0.4rem;
}

/* ===== PAGINACIÓN ===== */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 3rem;
  flex-wrap: wrap;
}

.pagination__pages {
  display: flex;
  gap: 0.4rem;
}

.pagination__page {
  min-width: 36px;
  height: 36px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
}

.pagination__page--active {
  background: var(--color-morado);
  color: white;
  border-color: var(--color-morado);
}

/* ===== ESTADO VACÍO ===== */
.empty-state {
  text-align: center;
  padding: 3rem 1.5rem;
  background: var(--color-blanco);
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  margin: 1.5rem 0;
}

.empty-state__icon {
  margin: 0 auto 1.25rem;
  width: 70px;
  height: 70px;
  background: rgba(106, 17, 203, 0.08);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-morado);
}

.empty-state h3 {
  font-size: 1.3rem;
  color: var(--color-oscuro);
  margin: 0 0 0.4rem 0;
}

.empty-state p {
  color: var(--color-oscuro-variante);
  margin: 0 0 1.5rem 0;
  font-size: 0.95rem;
  opacity: 0.8;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  .cursos {
    padding: 1rem;
  }

  .filters__title {
    font-size: 1.8rem;
  }

  .filters__container {
    padding: 1.25rem;
  }

  .filters__controls {
    flex-direction: column;
    align-items: stretch;
  }

  .filters__fields {
    flex-direction: column;
  }

  .field {
    min-width: 100%;
  }

  .cards {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.25rem;
  }

  .course-card__footer {
    flex-direction: column;
    gap: 0.75rem;
    align-items: stretch;
  }

  .course-card__price {
    align-self: flex-start;
  }

  .btn--primary {
    width: 100%;
  }

  .pagination {
    flex-direction: column;
    gap: 0.75rem;
  }

  .pagination__pages {
    order: 3;
    margin-top: 0.75rem;
  }
}

@media (min-width: 1024px) {
  .cards {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1280px) {
  .cards {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (min-width: 1536px) {
  .cards {
    grid-template-columns: repeat(5, 1fr);
  }
}
</style>