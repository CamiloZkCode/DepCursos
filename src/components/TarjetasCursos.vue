<template>
  <main class="cursos">
    <!-- ===== FILTROS ===== -->
    <section class="filters">
      <div class="filters__container">
        <div class="filters__fields">
          <div class="field">
            <label for="f-categoria">Categoría</label>
            <select id="f-categoria" v-model="filters.category">
              <option value="">Todas</option>
              <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
            </select>
          </div>

          <div class="field">
            <label for="f-dificultad">Dificultad</label>
            <select id="f-dificultad" v-model="filters.difficulty">
              <option value="">Todas</option>
              <option v-for="dif in difficulties" :key="dif" :value="dif">{{ dif }}</option>
            </select>
          </div>
        </div>

        <button class="btn btn--ghost" @click="clearFilters">Limpiar filtros</button>
      </div>

      <div class="filters__meta">
        <span>{{ filteredCourses.length }} cursos</span>
        <span v-if="filtersSummary">• {{ filtersSummary }}</span>
      </div>
    </section>

    <!-- ===== LISTADO DE CURSOS ===== -->
    <section class="results">
      <ul class="cards">
        <li v-for="course in currentPageCourses" :key="course.id" class="card">
          <article>
            <div class="card__media" :style="{ '--img': `url(${courseImage})` }"></div>

            <div class="card__content">
              <h3 class="card__title">{{ course.name }}</h3>

              <div class="card__rating">
                <div class="stars">
                  <span v-for="n in 5" :key="n" class="star" :class="{ filled: n <= Math.round(course.rating) }">★</span>
                </div>
                <span class="rating-value">{{ course.rating.toFixed(1) }}</span>
              </div>

              <p class="card__level">
                {{ course.difficulty }} · {{ course.category.toLowerCase() }}
              </p>

              <p class="card__description">
                Fundamentos de {{ course.category.toLowerCase() }}, conceptos clave y mejores prácticas.
              </p>

              <div class="card__footer">
                <div class="card__price">{{ formatPrice(course.price) }}</div>
                <button class="btn btn--primary" @click="goToCourse(course.id)">
                  Ver curso
                </button>
              </div>
            </div>
          </article>
        </li>
      </ul>

      <!-- Paginación -->
      <div class="pagination" v-if="filteredCourses.length > perPage">
        <button class="btn btn--ghost" @click="prevPage" :disabled="currentPage === 1">Anterior</button>
        <button v-for="page in totalPages" :key="page" class="btn btn--ghost"
          :class="{ 'btn--active': page === currentPage }" @click="currentPage = page">
          {{ page }}
        </button>
        <button class="btn btn--ghost" @click="nextPage" :disabled="currentPage === totalPages">Siguiente</button>
      </div>

      <div v-else-if="filteredCourses.length === 0" class="empty">
        <p>No hay cursos que coincidan con los filtros seleccionados.</p>
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
  { id: 1, name: 'CCNA Routing & Switching', category: 'Redes', difficulty: 'Básico', rating: 4.7, price: 120000 },
  { id: 2, name: 'Ciberseguridad Esencial', category: 'Seguridad', difficulty: 'Intermedio', rating: 4.5, price: 120000 },
  { id: 3, name: 'JavaScript Profesional', category: 'Programación', difficulty: 'Avanzado', rating: 4.9, price: 120000 },
  { id: 4, name: 'Python para Data Science', category: 'Data Science', difficulty: 'Intermedio', rating: 4.8, price: 120000 },
  { id: 5, name: 'Diseño UI/UX con Figma', category: 'Diseño', difficulty: 'Principiante', rating: 4.6, price: 120000 },
  { id: 6, name: 'DevOps con Docker y Kubernetes', category: 'DevOps', difficulty: 'Avanzado', rating: 4.4, price: 120000 },
]);

const categories = computed(() => [...new Set(courses.value.map(c => c.category))].sort());
const difficulties = computed(() => [...new Set(courses.value.map(c => c.difficulty))].sort());

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
  return parts.length ? parts.join(' · ') : '';
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
  router.push(`/ver-curso/${id}`);
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

/* Filtros */
.filters {
  background: var(--color-blanco);
  border-radius: 1.5rem;
  box-shadow: var(--box-shadow);
  padding: 1.5rem;
  margin-bottom: 2.5rem;
}

.filters__container {
  display: flex;
  flex-wrap: wrap;
  align-items: end;
  justify-content: space-between;
  gap: 1.5rem;
}

.filters__fields {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  flex: 1;
  min-width: 300px;
}

.field {
  display: grid;
  gap: 0.5rem;
  flex: 1;
  min-width: 220px;
}

.field label {
  font-weight: 700;
  font-size: 1rem;
  color: var(--color-oscuro);
}

.field select {
  padding: 0.9rem 1rem;
  border: 1px solid var(--color-info-luz);
  border-radius: 1rem;
  background: var(--color-blanco);
  font-size: 1rem;
}

.filters__meta {
  margin-top: 1rem;
  font-size: 1.1rem;
  color: var(--color-oscuro-variante);
}

/* Cards */
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  list-style: none;
  padding: 0;
  margin: 0;
}

.card > article {
  background: var(--color-blanco);
  border-radius: 1.5rem;
  box-shadow: var(--box-shadow);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card > article:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.12);
}

.card__media {
  background-image: var(--img);
  background-size: cover;
  background-position: center;
  height: 200px;
  flex-shrink: 0;
}

.card__content {
  padding: 1.8rem;
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 1rem;
}

.card__title {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--color-oscuro);
  line-height: 1.3;
}

.card__rating {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.stars {
  display: flex;
  font-size: 1.5rem;
  color: #e0e0e0;
}

.star.filled {
  color: #ffd700;
}

.rating-value {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-oscuro);
}

.card__level {
  margin: 0;
  font-size: 1rem;
  color: var(--color-oscuro-variante);
  font-weight: 500;
}

.card__description {
  margin: 0;
  font-size: 1rem;
  color: var(--color-oscuro);
  line-height: 1.5;
  flex: 1;
}

.card__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.card__price {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-oscuro);
}

.btn--primary {
  padding: 0.9rem 2rem;
  font-size: 1.1rem;
  font-weight: 700;
  border-radius: 0.8rem;
  background: var(--color-morado);
  color: white;
  border: none;
  cursor: pointer;
  transition: background 0.3s ease;
}

.btn--primary:hover {
  background: var(--color-naranja);
}

/* Botones generales */
.btn--ghost {
  padding: 0.8rem 1.5rem;
  border-radius: 0.8rem;
  border: 1px solid var(--color-info-luz);
  background: transparent;
  color: var(--color-oscuro);
  font-weight: 700;
  cursor: pointer;
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 3rem;
}

.empty {
  text-align: center;
  padding: 4rem;
  font-size: 1.3rem;
  color: var(--color-oscuro-variante);
}

/* Responsive */
@media (max-width: 768px) {
  .filters__container {
    flex-direction: column;
    align-items: stretch;
  }

  .filters__fields {
    flex-direction: column;
  }

  .btn--ghost {
    align-self: flex-end;
  }

  .cards {
    grid-template-columns: 1fr;
  }

  .card__footer {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .card__price {
    align-self: flex-start;
  }

  .btn--primary {
    align-self: stretch;
  }
}
</style>