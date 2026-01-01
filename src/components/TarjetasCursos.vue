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
                  <path
                    d="M19 11H5M19 11C20.1046 11 21 11.8954 21 13V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V13C3 11.8954 3.89543 11 5 11M19 11V9C19 7.89543 18.1046 7 17 7M5 11V9C5 7.89543 5.89543 7 7 7M7 7V5C7 3.89543 7.89543 3 9 3H15C16.1046 3 17 3.89543 17 5V7M7 7H17"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </div>
              <label for="f-categoria">Categoría</label>
              <select id="f-categoria" v-model="filters.category">
                <option value="">Todas las categorías</option>
                <option v-for="cat in categorias" :key="cat.id_categoria" :value="cat.id_categoria">
                  {{ cat.nombre_categoria }}
                </option>
              </select>
            </div>

            <div class="field">
              <div class="field__icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  <path
                    d="M19.4 15C19.2669 15.923 18.9771 16.818 18.5433 17.648C18.1095 18.478 17.5392 19.23 16.8572 19.871C16.1752 20.512 15.3921 21.033 14.5422 21.41C13.6922 21.787 12.7884 22.014 11.8673 22.081C10.9462 22.148 10.0214 22.055 9.13156 21.806C8.24169 21.557 7.40018 21.155 6.64501 20.618L3 22L4.382 18.355C3.84499 17.5998 3.44332 16.7583 3.19411 15.8684C2.9449 14.9786 2.85183 14.0538 2.91844 13.1327C2.98506 12.2116 3.21202 11.3078 3.58905 10.4578C3.96608 9.60792 4.48708 8.82484 5.12813 8.14284C5.76917 7.46085 6.5209 6.89052 7.3509 6.45672C8.18089 6.02292 9.07591 5.73307 9.999 5.6"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </div>
              <label for="f-dificultad">Nivel</label>
              <select id="f-dificultad" v-model="filters.difficulty">
                <option value="">Todos los niveles</option>
                <option v-for="dif in dificultades" :key="dif.id_dificultad" :value="dif.id_dificultad">
                  {{ dif.dificultad}}
                </option>
              </select>
            </div>
          </div>

          <button class="btn btn--ghost btn--icon" @click="clearFilters">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 6L5 18M5 6L19 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            </svg>
            Limpiar filtros
          </button>
        </div>

        <div class="filters__meta">
          <span class="filters__count">{{ filteredCourses.length }} cursos disponibles</span>
          <span v-if="filtersSummary" class="filters__active">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 18H14M6 12H18M3 6H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            </svg>
            {{ filtersSummary }}
          </span>
        </div>
      </div>
    </section>

    <!-- ===== LISTADO DE CURSOS ===== -->
    <section class="results">
      <!-- Estado de carga -->
      <div v-if="loading" class="loading-state">
        <div class="spinner-large"></div>
        <p>Cargando cursos...</p>
      </div>

      <!-- Error al cargar -->
      <div v-else-if="error" class="error-state">
        <div class="error-state__icon">⚠️</div>
        <h3>Error al cargar cursos</h3>
        <p>{{ error }}</p>
        <button class="btn btn--primary" @click="loadCourses">
          Reintentar
        </button>
      </div>

      <!-- Sin cursos -->
      <div v-else-if="filteredCourses.length === 0 && !loading" class="empty-state">
        <div class="empty-state__icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 15V9M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
        <h3>No se encontraron cursos</h3>
        <p>Intenta con otros filtros de búsqueda</p>
        <button class="btn btn--primary" @click="clearFilters">Mostrar todos los cursos</button>
      </div>

      <!-- Cursos disponibles -->
      <ul class="cards" v-else>
        <li v-for="course in currentPageCourses" :key="course.id_curso" class="card">
          <article class="course-card">
            <!-- Imagen del curso -->
            <div class="course-card__image" :style="{ 'background-image': `url(${course.img_portada || defaultImage})` }">
              <div class="course-card__category">
                {{ getCategoryName(course.id_categoria) }}
              </div>
              <!-- Estado del curso -->
              <div v-if="course.estatus === 'Publicado'" class="course-card__status">
                {{ course.estatus }}
              </div>
            </div>

            <!-- Contenido del curso -->
            <div class="course-card__content">
              <div class="course-card__header">
                <h3 class="course-card__title">{{ course.titulo_curso }}</h3>
                <div class="course-card__rating">
                  <div class="stars">
                    <span v-for="n in 5" :key="n" class="star"
                      :class="{ filled: n <= Math.round(course.rating || 0) }">★</span>
                  </div>
                  <span class="rating-value">{{ (course.rating || 0).toFixed(1) }}</span>
                </div>
              </div>

              <p class="course-card__description">
                {{ truncateDescription(course.descripcion) }}
              </p>

              <div class="course-card__details">
                <div class="course-card__difficulty" :class="getDifficultyClass(course.id_dificultad)">
                  <span class="difficulty-dot"></span>
                  {{ getDifficultyName(course.id_dificultad) }}
                </div>
              </div>

              <div class="course-card__footer">
                <div class="course-card__price">{{ formatPrice(course.precio) }}</div>
                <div class="course-card__actions">
                  <button class="btn btn--ghost btn--icon" @click="addToCart(course)">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.707 15.293C4.077 15.923 4.523 17 5.414 17H17M17 17C15.895 17 15 17.895 15 19C15 20.105 15.895 21 17 21C18.105 21 19 20.105 19 19C19 17.895 18.105 17 17 17ZM9 19C9 20.105 8.105 21 7 21C5.895 21 5 20.105 5 19C5 17.895 5.895 17 7 17C8.105 17 9 17.895 9 19Z" 
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Carrito
                  </button>
                  <button class="btn btn--primary" @click="goToCourse(course.id_curso)">
                    Ver curso
                  </button>
                </div>
              </div>
            </div>
          </article>
        </li>
      </ul>

      <!-- Paginación -->
      <div class="pagination" v-if="filteredCourses.length > perPage && filteredCourses.length > 0 && !loading">
        <button class="btn btn--ghost btn--icon" @click="prevPage" :disabled="currentPage === 1">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round" />
          </svg>
          Anterior
        </button>

        <div class="pagination__pages">
          <button v-for="page in totalPages" :key="page" class="btn btn--ghost pagination__page"
            :class="{ 'pagination__page--active': page === currentPage }" @click="currentPage = page">
            {{ page }}
          </button>
        </div>

        <button class="btn btn--ghost btn--icon" @click="nextPage" :disabled="currentPage === totalPages">
          Siguiente
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round" />
          </svg>
        </button>
      </div>
    </section>
  </main>
</template>

<script setup>
import { onMounted, ref, reactive, computed, watch } from "vue";
import { cursoService } from "../services/cursos.services";
import { categoriasService } from "../services/categorias.services";
import { DificultadServices } from "../services/dificultad.services";
import { useRouter } from 'vue-router';
import { useCartStore } from "../store/cartStore";

const router = useRouter();
const cartStore = useCartStore();

// Imagen por defecto
const defaultImage = 'https://images.unsplash.com/photo-1588912914078-2fe5224fd8b8?q=80&w=870&auto=format&fit=crop';

// Estados
const loading = ref(false);
const error = ref(null);
const courses = ref([]);
const categorias = ref([]);
const dificultades = ref([]);

// Filtros
const filters = reactive({
  category: "",
  difficulty: "",
});

// Paginación
const perPage = 12;
const currentPage = ref(1);

// Cargar datos iniciales
onMounted(async () => {
  await Promise.all([
    loadCourses(),
    loadCategories(),
    loadDifficulties()
  ]);
});

// Cargar cursos desde la API
const loadCourses = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await cursoService.obtenerCursos();
    console.log("📦 Cursos cargados:", response);
    
    if (response.success && Array.isArray(response.data)) {
      courses.value = response.data.map(course => ({
        ...course,
        // Asegurar que todos los campos existan
        rating: course.rating || 0,
        estatus: course.estatus || 'Borrador',
      }));
    } else if (Array.isArray(response)) {
      // Si la API devuelve directamente un array
      courses.value = response.map(course => ({
        ...course,
        rating: course.rating || 0,
        estatus: course.estatus || 'Borrador',
      }));
    } else {
      throw new Error("Formato de respuesta inválido");
    }
  } catch (err) {
    console.error("❌ Error cargando cursos:", err);
    error.value = err.message || "No se pudieron cargar los cursos";
    courses.value = [];
  } finally {
    loading.value = false;
  }
};

// Cargar categorías
const loadCategories = async () => {
  try {
    const response = await categoriasService.obtenerCategorias();
    if (response.success && Array.isArray(response.data)) {
      categorias.value = response.data;
    } else if (Array.isArray(response)) {
      categorias.value = response;
    }
  } catch (err) {
    console.error("Error cargando categorías:", err);
  }
};

// Cargar dificultades
const loadDifficulties = async () => {
  try {
    const response = await DificultadServices.obtenerDificultades();
    if (response.success && Array.isArray(response.data)) {
      dificultades.value = response.data;
    } else if (Array.isArray(response)) {
      dificultades.value = response;
    }
  } catch (err) {
    console.error("Error cargando dificultades:", err);
  }
};

// Filtro de cursos
const filteredCourses = computed(() => {
  return courses.value.filter(course => {
    // Si hay filtro de categoría y no coincide, excluir
    if (filters.category && course.id_categoria !== parseInt(filters.category)) return false;

    // Si hay filtro de dificultad y no coincide, excluir
    if (filters.difficulty && course.id_dificultad !== parseInt(filters.difficulty)) return false;

    // Solo mostrar cursos publicados
    if (course.estatus !== 'Publicado') return false;

    return true;
  });
});

// Resumen de filtros activos
const filtersSummary = computed(() => {
  const parts = [];
  if (filters.category) {
    const cat = categorias.value.find(c => c.id_categoria === parseInt(filters.category));
    if (cat) parts.push(cat.nombre_categoria);
  }
  if (filters.difficulty) {
    const dif = dificultades.value.find(d => d.id_dificultad === parseInt(filters.difficulty));
    if (dif) parts.push(dif.dificultad);
  }
  return parts.length ? parts.join(' • ') : '';
});

// Paginación
const totalPages = computed(() => Math.ceil(filteredCourses.value.length / perPage));
const currentPageCourses = computed(() => {
  const start = (currentPage.value - 1) * perPage;
  return filteredCourses.value.slice(start, start + perPage);
});

// Watchers
watch(filteredCourses, () => {
  currentPage.value = 1;
});

// Funciones de paginación
function prevPage() {
  if (currentPage.value > 1) currentPage.value--;
}

function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++;
}

// Funciones auxiliares
function clearFilters() {
  filters.category = '';
  filters.difficulty = '';
}

function goToCourse(id) {
  router.push(`/cursos/${id}`);
}

function getCategoryName(categoryId) {
  const category = categorias.value.find(c => c.id_categoria === categoryId);
  return category ? category.nombre_categoria : 'Sin categoría';
}

function getDifficultyName(difficultyId) {
  const difficulty = dificultades.value.find(d => d.id_dificultad === difficultyId);
  return difficulty ? difficulty.dificultad : 'Sin definir';
}

function getDifficultyClass(difficultyId) {
  const difficultyName = getDifficultyName(difficultyId);
  const classes = {
    'Principiante': 'difficulty--beginner',
    'Intermedio': 'difficulty--intermediate',
    'Avanzado': 'difficulty--advanced'
  };
  return classes[difficultyName] || '';
}

function formatPrice(value) {
  if (!value && value !== 0) return 'Gratis';
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function truncateDescription(text, maxLength = 100) {
  if (!text) return 'Sin descripción disponible';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

function addToCart(course) {
  // Crear un objeto producto compatible con el store
  const product = {
    id: course.id_curso,
    title: course.titulo_curso,
    price: course.precio,
    image: course.img_portada || defaultImage,
    category: getCategoryName(course.id_categoria),
    difficulty: getDifficultyName(course.id_dificultad),
    rating: course.rating || 0,
    description: course.descripcion
  };
  
  // Agregar al carrito usando el store
  cartStore.addToCart(product);
  
  // Mostrar feedback
  showAddToCartFeedback(course.titulo_curso);
}

function showAddToCartFeedback(courseName) {
  console.log(`✅ "${courseName}" agregado al carrito`);
  // Aquí puedes agregar un toast notification si lo deseas
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
  height: 180px;
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
  background: linear-gradient(to top, rgba(0, 0, 0, 0.25), transparent);
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

/* Estado del curso */
.course-card__status {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: rgba(40, 167, 69, 0.95);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
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

/* ===== ESTILOS PARA LOS BOTONES EN LA TARJETA ===== */
.course-card__actions {
  display: flex;
  gap: 0.5rem;
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
  padding: 0.5rem 0.8rem;
}

.btn--ghost:hover {
  background: rgba(106, 17, 203, 0.05);
  border-color: var(--color-morado);
  color: var(--color-morado);
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

/* ===== ESTADO DE CARGA ===== */
.loading-state {
  text-align: center;
  padding: 3rem 1.5rem;
}

.spinner-large {
  width: 48px;
  height: 48px;
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

/* ===== ESTADO DE ERROR ===== */
.error-state {
  text-align: center;
  padding: 3rem 1.5rem;
  background: #fee2e2;
  border-radius: 1rem;
  margin: 1.5rem 0;
}

.error-state__icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #dc3545;
}

.error-state h3 {
  color: #991b1b;
  margin: 0 0 0.5rem;
}

.error-state p {
  color: #991b1b;
  opacity: 0.8;
  margin-bottom: 1.5rem;
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

  .course-card__actions {
    width: 100%;
    justify-content: space-between;
  }

  .course-card__price {
    align-self: flex-start;
  }

  .btn--primary {
    flex: 1;
  }

  .btn--ghost {
    flex: 1;
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