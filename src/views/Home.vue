<template>
  <main class="home" aria-describedby="home-intro">
    <!-- ===== HERO / CARRUSEL ===== -->
    <section class="hero" ref="heroRef" @mouseenter="pause" @mouseleave="play">
      <div class="hero__slides" :style="slidesStyle">
        <article v-for="(img, i) in images" :key="img.src" class="hero__slide" :class="{ 'is-active': i === current }"
          role="img" :aria-label="img.alt" :style="{ backgroundImage: `url(${img.src})` }" />
      </div>

      <div class="hero__overlay">
        <header class="hero__content">
          <h1 class="hero__title">{{ title }}</h1>
          <p id="home-intro" class="hero__desc">{{ description }}</p>
          <div class="hero__cta">
            <RouterLink to="/cursos" class="btn btn--primary btn--large">
              Explorar todos los cursos
            </RouterLink>
            <button class="btn btn--ghost btn--large" @click="scrollToCategorias">Ver categorías</button>
          </div>
        </header>

        <nav class="hero__controls" aria-label="Controles del carrusel">
          <button class="hero__nav" @click="prev" aria-label="Anterior">‹</button>
          <button class="hero__nav" @click="next" aria-label="Siguiente">›</button>
        </nav>

        <div class="hero__dots" role="tablist" aria-label="Cambiar imagen">
          <button v-for="(img, i) in images" :key="'dot-' + i" class="hero__dot" :class="{ 'is-active': i === current }"
            @click="go(i)" role="tab" :aria-selected="i === current" :aria-controls="'slide-' + i" :title="img.alt" />
        </div>
      </div>
    </section>

    <!-- ===== CATEGORÍAS ===== -->
    <section class="categorias" ref="categoriasRef">
      <header class="section-header">
        <h2>Categorías Principales</h2>
        <p>Encuentra cursos especializados en las áreas más demandadas</p>
      </header>

      <div class="categorias__grid">
        <article v-for="categoria in categorias" :key="categoria.id" class="categoria-card">
          <div class="categoria-card__media">
            <img class="categoria-card__img" :src="categoria.imagen" :alt="`Categoría ${categoria.nombre}`"
              loading="lazy" decoding="async" />
            <span class="categoria-card__badge">
              {{ categoria.insignia }}
            </span>
          </div>
          <div class="categoria-card__content">
            <h3 class="categoria-card__title">{{ categoria.nombre }}</h3>
            <p class="categoria-card__desc">{{ categoria.descripcion }}</p>
            <div class="categoria-card__actions">
              <RouterLink class="btn btn--primary btn--block" :to="`/cursos?categoria=${categoria.id}`">
                Ver categoría
              </RouterLink>
            </div>
          </div>
        </article>
      </div>
    </section>

    <!-- ===== CURSOS DESTACADOS ===== -->
    <section class="destacados">
      <header class="section-header">
        <h2>Cursos Destacados</h2>
        <p>Los cursos más populares y mejor valorados por nuestra comunidad</p>
      </header>

      <div class="destacados__grid">
        <article v-for="curso in cursosDestacados" :key="curso.id" class="curso-card">
          <div class="curso-card__header">
            <img class="curso-card__img" :src="curso.imagen" :alt="curso.nombre" loading="lazy" decoding="async" />
            <span class="curso-card__categoria">{{ curso.categoria }}</span>
          </div>
          <div class="curso-card__content">
            <div class="curso-card__meta">
              <div class="curso-card__rating">
                <div class="stars">
                  <span v-for="n in 5" :key="n" class="star" :class="{ filled: n <= curso.rating }">★</span>
                </div>
                <span class="rating-value">{{ curso.rating.toFixed(1) }}</span>
              </div>
              <span class="curso-card__dificultad" :class="'dificultad--' + curso.dificultad">
                {{ curso.dificultad }}
              </span>
            </div>
            <h3 class="curso-card__title">{{ curso.nombre }}</h3>
            <p class="curso-card__desc">{{ curso.descripcion }}</p>

            <div class="curso-card__footer">
              <div class="curso-card__precio">
                <div class="precio-actual">{{ curso.precio }}</div>
                <div class="precio-anterior" v-if="curso.precioOriginal">{{ curso.precioOriginal }}</div>
              </div>
              <RouterLink class="btn btn--primary" :to="`/curso/${curso.id}`">
                Ver detalles
              </RouterLink>
            </div>
          </div>
        </article>
      </div>
    </section>

    <!-- ===== BENEFICIOS ===== -->
    <section class="beneficios">
      <div class="beneficios__container">
        <header class="section-header">
          <h2>¿Por qué elegir nuestros cursos?</h2>
          <p>Ventajas exclusivas para tu crecimiento profesional</p>
        </header>

        <div class="beneficios__grid">
          <div class="beneficio-card">
            <div class="beneficio-card__icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 10 12 10C10.3431 10 10 10.3431 10 12C10 13.1046 10.8954 14 12 14Z" stroke="currentColor" stroke-width="2"/>
                <path d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
            <h3>Certificación oficial</h3>
            <p>Recibe certificados digitales avalados por la industria.</p>
          </div>

          <div class="beneficio-card">
            <div class="beneficio-card__icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2"/>
                <path d="M12 6V12L16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h3>Acceso permanente</h3>
            <p>Accede al contenido y actualizaciones para siempre.</p>
          </div>

          <div class="beneficio-card">
            <div class="beneficio-card__icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h3>Comunidad exclusiva</h3>
            <p>Únete a nuestra red de profesionales y estudiantes.</p>
          </div>

          <div class="beneficio-card">
            <div class="beneficio-card__icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h3>Garantía de 7 días</h3>
            <p>Si no estás satisfecho, te devolvemos tu dinero.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== CARRUSEL DE TESTIMONIOS - ANCHO COMPLETO ===== -->
    <section class="testimonios">
      <header class="section-header">
        <h2>Testimonios de estudiantes</h2>
        <p>Lo que dicen quienes han transformado sus carreras</p>
      </header>

      <div class="testimonios__carousel" ref="testimoniosRef" @mouseenter="pauseTestimonios" @mouseleave="playTestimonios">
        <div class="testimonios__track" :style="testimoniosStyle">
          <article v-for="testimonio in testimoniosDuplicados" :key="testimonio.id" class="testimonio-card">
            <div class="testimonio-card__content">
              <p class="testimonio-card__text">"{{ testimonio.texto }}"</p>
            </div>
            <div class="testimonio-card__author">
              <div>
                <h4 class="testimonio-card__name">{{ testimonio.nombre }}</h4>
                <p class="testimonio-card__curso">{{ testimonio.curso }}</p>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- ===== CTA FINAL ===== -->
    <section class="cta-final">
      <div class="cta-final__content">
        <h2 class="cta-final__title">Comienza tu transformación profesional hoy</h2>
        <p class="cta-final__desc">Únete a miles de profesionales que han acelerado sus carreras con nuestros cursos.</p>
        <div class="cta-final__actions">
          <RouterLink to="/cursos" class="btn btn--primary btn--large">
            Explorar todos los cursos
          </RouterLink>
          <RouterLink to="/login" class="btn btn--ghost btn--large">
            Registrarse gratis
          </RouterLink>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import { onMounted, onBeforeUnmount, reactive, ref, computed } from 'vue'

export default {
  setup() {
    // TEXTOS
    const title = 'Domina las habilidades del futuro'
    const description =
      'Cursos especializados en tecnología con instructores expertos. Desde principiantes hasta profesionales avanzados.'

    // CARRUSEL HERO - Cambia automáticamente cada 5 segundos
    const images = reactive([
      { src: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', alt: 'Entrenamiento de fútbol' },
      { src: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', alt: 'Entrenamiento de baloncesto' },
      { src: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', alt: 'Entrenamiento de natación' },
      { src: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', alt: 'Entrenamiento de atletismo' },
      { src: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80', alt: 'Entrenamiento en equipo' }
    ])

    // CATEGORÍAS - 4 categorías de deportes
    const categorias = reactive([
      {
        id: 'futbol',
        nombre: 'Fútbol',
        descripcion: 'Técnicas, tácticas y estrategias para jugadores y entrenadores de fútbol.',
        imagen: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80',
        insignia: 'Más popular'
      },
      {
        id: 'baloncesto',
        nombre: 'Baloncesto',
        descripcion: 'Dominio del balón, tiros, defensa y estrategias de equipo.',
        imagen: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-4.0.3&auto=format&fit=crop&w=2090&q=80',
        insignia: 'En alta demanda'
      },
      {
        id: 'natacion',
        nombre: 'Natación',
        descripcion: 'Técnicas de nado, respiración y entrenamiento para todos los niveles.',
        imagen: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
        insignia: 'Certificado'
      },
      {
        id: 'atletismo',
        nombre: 'Atletismo',
        descripcion: 'Velocidad, resistencia, saltos y lanzamientos para atletas.',
        imagen: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80',
        insignia: 'Especializado'
      }
    ])

    // CURSOS DESTACADOS
    const cursosDestacados = reactive([
      {
        id: 1,
        nombre: 'Fútbol Avanzado: Tácticas Modernas',
        descripcion: 'Domina las estrategias más actuales del fútbol profesional.',
        imagen: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80',
        categoria: 'Fútbol',
        dificultad: 'Avanzado',
        precio: '$120.000',
        precioOriginal: '$180.000',
        rating: 4.8
      },
      {
        id: 2,
        nombre: 'Baloncesto: Técnicas de Tiro',
        descripcion: 'Perfecciona tu tiro desde cualquier posición de la cancha.',
        imagen: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-4.0.3&auto=format&fit=crop&w=2090&q=80',
        categoria: 'Baloncesto',
        dificultad: 'Intermedio',
        precio: '$95.000',
        precioOriginal: null,
        rating: 4.9
      },
      {
        id: 3,
        nombre: 'Natación Competitiva',
        descripcion: 'Técnicas avanzadas para competición y marcas personales.',
        imagen: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
        categoria: 'Natación',
        dificultad: 'Principiante',
        precio: '$85.000',
        precioOriginal: '$120.000',
        rating: 4.7
      }
    ])

    // TESTIMONIOS
    const testimonios = reactive([
      {
        id: 1,
        nombre: 'Carlos Rodríguez',
        curso: 'Fútbol Avanzado',
        texto: 'Mejoré mi juego considerablemente y ahora juego en un equipo semiprofesional.',
      },
      {
        id: 2,
        nombre: 'Ana Martínez',
        curso: 'Natación Competitiva',
        texto: 'Reduje mi tiempo en 100m libre en 15 segundos. Increíble metodología.',
      },
      {
        id: 3,
        nombre: 'Luis González',
        curso: 'Baloncesto Profesional',
        texto: 'De jugar recreativo a integrar el equipo universitario. Totalmente recomendado.',
      },
      {
        id: 4,
        nombre: 'María López',
        curso: 'Atletismo para Principiantes',
        texto: 'Perdí 10kg y gané mucha resistencia. Los entrenadores son excelentes.',
      }
    ])

    // Hero carousel logic
    const current = ref(0)
    const DURATION = 5000
    let timer = null
    const heroRef = ref(null)

    const next = () => (current.value = (current.value + 1) % images.length)
    const prev = () => (current.value = (current.value - 1 + images.length) % images.length)
    const go = (i) => (current.value = i)

    const stop = () => {
      if (timer) {
        window.clearInterval(timer)
        timer = null
      }
    }
    
    const play = () => {
      stop()
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      timer = window.setInterval(next, DURATION)
    }
    
    const pause = () => stop()

    const handleVisibility = () => (document.hidden ? stop() : play())

    // Swipe para mobile
    let touchStartX = 0
    let touchEndX = 0
    function bindSwipe(el) {
      if (!el) return
      el.addEventListener('touchstart', onTouchStart, { passive: true })
      el.addEventListener('touchend', onTouchEnd, { passive: true })
    }
    
    function unbindSwipe() {
      if (!heroRef.value) return
      heroRef.value.removeEventListener('touchstart', onTouchStart)
      heroRef.value.removeEventListener('touchend', onTouchEnd)
    }
    
    function onTouchStart(e) {
      touchStartX = e.changedTouches[0].screenX
    }
    
    function onTouchEnd(e) {
      touchEndX = e.changedTouches[0].screenX
      const delta = touchEndX - touchStartX
      if (Math.abs(delta) > 40) {
        delta < 0 ? next() : prev()
      }
    }

    const slidesStyle = computed(() => ({ '--active-index': String(current.value) }))

    // Scroll a categorías
    const categoriasRef = ref(null)
    const scrollToCategorias = () => {
      categoriasRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    // Testimonios carousel infinito - ESTILO ANCHO COMO LOGOS
    const testimoniosRef = ref(null)
    const testimonioOffset = ref(0)
    const TESTIMONIO_SPEED = 0.5 // Aumenté la velocidad para mejor fluidez
    let testimonioAnimationFrame = null

    // Duplicar testimonios para efecto infinito
    const testimoniosDuplicados = computed(() => [...testimonios, ...testimonios])

    function animateTestimonios() {
      testimonioOffset.value -= TESTIMONIO_SPEED
      const testimonioWidth = 320 + 32 // ancho + gap (igual que en tu ejemplo de logos)
      const totalWidth = testimonios.length * testimonioWidth
      if (Math.abs(testimonioOffset.value) >= totalWidth) {
        testimonioOffset.value += totalWidth // Reset suave como en el ejemplo de logos
      }
      testimonioAnimationFrame = requestAnimationFrame(animateTestimonios)
    }

    const playTestimonios = () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      if (!testimonioAnimationFrame) animateTestimonios()
    }

    const pauseTestimonios = () => {
      if (testimonioAnimationFrame) {
        cancelAnimationFrame(testimonioAnimationFrame)
        testimonioAnimationFrame = null
      }
    }

    const testimoniosStyle = computed(() => ({
      transform: `translateX(${testimonioOffset.value}px)`
    }))

    // Teclas flechas para hero
    const onKey = (e) => {
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', onKey)

    onMounted(() => {
      // Preload next image
      const preload = new Image()
      preload.src = images[(current.value + 1) % images.length].src

      // Hero auto-play
      play()
      document.addEventListener('visibilitychange', handleVisibility)
      
      // Intersection observer para hero
      const io = new IntersectionObserver(
        (entries) => (entries[0].isIntersecting ? play() : stop()),
        { threshold: 0.25 }
      )
      if (heroRef.value) io.observe(heroRef.value)
      bindSwipe(heroRef.value)

      // Testimonios carousel
      playTestimonios()
      const ioTestimonios = new IntersectionObserver(
        (entries) => (entries[0].isIntersecting ? playTestimonios() : pauseTestimonios()),
        { threshold: 0.25 }
      )
      if (testimoniosRef.value) ioTestimonios.observe(testimoniosRef.value)
    })

    onBeforeUnmount(() => {
      stop()
      document.removeEventListener('visibilitychange', handleVisibility)
      unbindSwipe()
      pauseTestimonios()
      window.removeEventListener('keydown', onKey)
    })

    return {
      title,
      description,
      images,
      current,
      heroRef,
      next,
      prev,
      go,
      pause,
      play,
      slidesStyle,
      categorias,
      categoriasRef,
      scrollToCategorias,
      cursosDestacados,
      testimonios,
      testimoniosDuplicados,
      testimoniosRef,
      testimoniosStyle,
      pauseTestimonios,
      playTestimonios
    }
  }
}
</script>

<style scoped>
/* ===== Base ===== */
.home {
  display: grid;
  gap: 4rem;
}

/* ===== Hero ===== */
.hero {
  position: relative;
  height: min(85vh, 800px);
  border-radius: var(--card-border-radius);
  overflow: clip;
  background: var(--color-dark-variant);
  box-shadow: var(--box-shadow);
  isolation: isolate;
}

.hero__slides {
  position: absolute;
  inset: 0;
}

.hero__slide {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  opacity: 0;
  transform: scale(1.04);
  transition: opacity 680ms ease, transform 1400ms ease;
}

.hero__slide.is-active {
  opacity: 1;
  transform: scale(1);
}

@media (prefers-reduced-motion: reduce) {
  .hero__slide {
    transition: none
  }
}

.hero__overlay {
  position: relative;
  z-index: 2;
  inset: 0;
  display: grid;
  place-items: center;
  height: 100%;
  padding: 2rem;
  color: var(--color-blanco);
  background:
    radial-gradient(60% 50% at 50% 70%, rgba(0, 0, 0, 0.45), transparent 70%),
    linear-gradient(to bottom, rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.55));
}

.hero__content {
  text-align: center;
  display: grid;
  gap: 1.2rem;
  max-width: 780px;
}

.hero__title {
  margin: 0;
  font-size: clamp(2.5rem, 6vw, 4rem);
  line-height: 1.1;
  text-shadow: 0 8px 28px rgba(0, 0, 0, .5);
  font-weight: 800;
}

.hero__desc {
  margin: 0 auto;
  max-width: 60ch;
  font-size: clamp(1.1rem, 1.8vw, 1.4rem);
  opacity: .95;
  line-height: 1.6;
}

.hero__cta {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 1.5rem;
}

.hero__controls {
  position: absolute;
  inset: auto 0 2rem 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.hero__nav {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: 0;
  cursor: pointer;
  font-size: 1.8rem;
  background: var(--color-morado);
  color: var(--color-blanco);
  box-shadow: 0 10px 24px rgba(0, 0, 0, .28);
  transition: transform 120ms ease, filter 120ms ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero__nav:hover {
  transform: translateY(-2px);
  filter: brightness(.98);
}

.hero__dots {
  position: absolute;
  left: 50%;
  bottom: 1.5rem;
  transform: translateX(-50%);
  display: flex;
  gap: .6rem;
}

.hero__dot {
  width: 12px;
  height: 12px;
  border-radius: 999px;
  border: 2px solid var(--color-blanco);
  background: transparent;
  opacity: .7;
  cursor: pointer;
  transition: width 180ms ease, opacity 120ms ease, background 180ms ease, border-color 180ms ease;
}

.hero__dot.is-active {
  width: 30px;
  background: var(--color-morado);
  border-color: var(--color-blanco);
  opacity: 1;
}

/* ===== Section headers ===== */
.section-header {
  text-align: center;
  margin: 0 auto 3rem;
  max-width: 800px;
}

.section-header h2 {
  margin: 0 0 1rem;
  color: var(--color-oscuro);
  font-size: clamp(2rem, 4vw, 2.8rem);
  font-weight: 800;
  line-height: 1.2;
}

.section-header p {
  margin: 0;
  color: var(--color-oscuro-variante);
  font-size: 1.1rem;
  line-height: 1.6;
}

/* ===== Categorías ===== */
.categorias {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.categorias__grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 2rem;
}

@media (min-width: 768px) {
  .categorias__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .categorias__grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.categoria-card {
  background: var(--color-blanco);
  border-radius: var(--card-border-radius);
  box-shadow: var(--box-shadow);
  overflow: hidden;
  transition: transform 300ms ease, box-shadow 300ms ease;
}

.categoria-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.categoria-card__media {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.categoria-card__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 400ms ease;
}

.categoria-card:hover .categoria-card__img {
  transform: scale(1.05);
}

.categoria-card__badge {
  position: absolute;
  top: 1rem;
  left: 1rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, var(--color-morado) 0%, var(--color-naranja) 100%);
  color: white;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.2);
}

.categoria-card__content {
  padding: 1.5rem;
}

.categoria-card__title {
  margin: 0 0 0.75rem 0;
  color: var(--color-oscuro);
  font-size: 1.4rem;
  font-weight: 700;
  line-height: 1.3;
}

.categoria-card__desc {
  margin: 0 0 1.5rem 0;
  color: var(--color-oscuro-variante);
  line-height: 1.6;
  font-size: 0.95rem;
}

.categoria-card__actions {
  margin-top: 1rem;
}

/* ===== Cursos Destacados ===== */
.destacados {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.destacados__grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 2rem;
}

@media (min-width: 768px) {
  .destacados__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .destacados__grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.curso-card {
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

.curso-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  border-color: rgba(106, 17, 203, 0.08);
}

/* IMAGEN MÁS ALTA */
.curso-card__header {
  height: 180px;
  position: relative;
  overflow: hidden;
}

.curso-card__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 400ms ease;
}

.curso-card:hover .curso-card__img {
  transform: scale(1.05);
}

.curso-card__categoria {
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
.curso-card__content {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 0.75rem;
}

.curso-card__meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.2rem;
}

.curso-card__rating {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.curso-card__dificultad {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.6rem;
  border-radius: 1.5rem;
}

.dificultad--Principiante {
  background: rgba(40, 167, 69, 0.1);
  color: #28a745;
}

.dificultad--Intermedio {
  background: rgba(253, 126, 20, 0.1);
  color: #fd7e14;
}

.dificultad--Avanzado {
  background: rgba(220, 53, 69, 0.1);
  color: #dc3545;
}

.curso-card__title {
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

.curso-card__desc {
  margin: 0;
  font-size: 0.85rem;
  color: var(--color-oscuro);
  line-height: 1.4;
  opacity: 0.85;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex-grow: 1;
}

.curso-card__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 0.75rem;
  border-top: 1px solid #f1f3f5;
}

.curso-card__precio {
  display: flex;
  flex-direction: column;
}

.precio-actual {
  font-size: 1.2rem;
  font-weight: 800;
  color: var(--color-oscuro);
  line-height: 1;
}

.precio-anterior {
  font-size: 0.9rem;
  color: var(--color-oscuro-variante);
  text-decoration: line-through;
}

/* ===== Beneficios ===== */
.beneficios {
  background: linear-gradient(135deg, var(--color-light) 0%, rgba(106, 17, 203, 0.05) 100%);
  padding: 4rem 2rem;
}

.beneficios__container {
  max-width: 1200px;
  margin: 0 auto;
}

.beneficios__grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 2rem;
}

@media (min-width: 768px) {
  .beneficios__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .beneficios__grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.beneficio-card {
  background: var(--color-blanco);
  border-radius: var(--card-border-radius);
  padding: 2rem;
  text-align: center;
  box-shadow: var(--box-shadow);
  transition: transform 300ms ease;
}

.beneficio-card:hover {
  transform: translateY(-5px);
}

.beneficio-card__icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, rgba(106, 17, 203, 0.1), rgba(106, 17, 203, 0.05));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
}

.beneficio-card__icon svg {
  color: var(--color-morado);
  width: 32px;
  height: 32px;
}

.beneficio-card h3 {
  margin: 0 0 1rem 0;
  color: var(--color-oscuro);
  font-size: 1.3rem;
  font-weight: 700;
}

.beneficio-card p {
  margin: 0;
  color: var(--color-oscuro-variante);
  line-height: 1.6;
  font-size: 0.95rem;
}

/* ===== Testimonios Carousel - ESTILO ANCHO COMO LOGOS ===== */
.testimonios {
  width: 100%;
  margin: 0 auto 3rem;
  padding: 0 1rem;
}

.testimonios__carousel {
  position: relative;
  height: 320px; 
  overflow: clip;
  isolation: isolate;
}

.testimonios__track {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  gap: 2rem;
}

.testimonio-card {
  flex: 0 0 auto;
  width: 320px; 
  background: var(--color-blanco);
  border-radius: var(--card-border-radius);
  padding: 2rem;
  box-shadow: var(--box-shadow);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.3s ease;
}

.testimonio-card:hover {
  transform: translateY(-5px);
}

.testimonio-card__content {
  flex: 1;
}


.testimonio-card__text {
  margin: 0 0 1.5rem 0;
  color: var(--color-oscuro-variante);
  line-height: 1.6;
  font-size: 1rem;
  font-style: italic;
}

.testimonio-card__author {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.testimonio-card__name {
  margin: 0;
  color: var(--color-oscuro);
  font-size: 1.1rem;
  font-weight: 700;
}

.testimonio-card__curso {
  margin: 0.25rem 0 0 0;
  color: var(--color-morado);
  font-size: 0.9rem;
  font-weight: 600;
}

/* ===== CTA Final ===== */
.cta-final {
  background: linear-gradient(135deg, var(--color-morado) 0%, var(--color-naranja) 100%);
  color: var(--color-blanco);
  padding: 4rem 2rem;
  text-align: center;
  border-radius: var(--card-border-radius);
  margin: 0 2rem;
}

.cta-final__content {
  max-width: 800px;
  margin: 0 auto;
}

.cta-final__title {
  margin: 0 0 1rem 0;
  font-size: clamp(2rem, 4vw, 2.8rem);
  font-weight: 800;
  line-height: 1.2;
}

.cta-final__desc {
  margin: 0 auto 2rem;
  font-size: 1.2rem;
  opacity: 0.9;
  max-width: 600px;
  line-height: 1.6;
}

.cta-final__actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

/* ===== Botones ===== */
.btn {
  padding: 0.85rem 1.75rem;
  border-radius: var(--border-radius-2);
  border: 1px solid transparent;
  cursor: pointer;
  font-weight: 700;
  letter-spacing: 0.2px;
  transition: transform 120ms ease, filter 120ms ease, box-shadow 120ms ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn:hover {
  transform: translateY(-2px);
  filter: brightness(.98);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.btn:active {
  transform: translateY(0);
}

.btn--primary {
  background: linear-gradient(135deg, var(--color-morado) 0%, var(--color-naranja) 100%);
  color: var(--color-blanco);
}

.btn--ghost {
  background: transparent;
  border-color: var(--color-blanco);
  color: var(--color-blanco);
}

.btn--ghost:hover {
  background: rgba(255, 255, 255, 0.1);
}

.btn--large {
  padding: 1rem 2.5rem;
  font-size: 1.1rem;
}

.btn--small {
  padding: 0.6rem 1.2rem;
  font-size: 0.9rem;
}

.btn--block {
  width: 100%;
}

/* ===== Focus visible ===== */
:focus-visible {
  outline: 3px solid var(--color-amarillo);
  outline-offset: 2px;
}

/* ===== Responsive ===== */
@media (max-width: 768px) {
  .home {
    gap: 3rem;
  }
  
  .hero {
    height: min(80vh, 600px);
  }
  
  .hero__content {
    padding: 1rem;
  }
  
  .categorias,
  .destacados,
  .testimonios {
    padding: 0 1rem;
  }
  
  .beneficios {
    padding: 3rem 1rem;
  }
  
  .cta-final {
    margin: 0 1rem;
    padding: 3rem 1rem;
  }
  
  .testimonios__carousel {
    height: 320px;
  }
  
  .testimonio-card {
    width: 280px;
    padding: 1.5rem;
  }
  
  .cta-final__actions {
    flex-direction: column;
    align-items: center;
  }
  
  .cta-final__actions .btn {
    width: 100%;
    max-width: 300px;
  }
}

@media (min-width: 1024px) {
  .testimonios__carousel {
    height: 340px;
  }
  
  .testimonio-card {
    width: 340px;
  }
}

/* Estrellas */
.stars {
  display: flex;
  font-size: 1rem;
  color: #e0e0e0;
}

.star.filled {
  color: #ffc107;
}

.rating-value {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--color-oscuro);
}
</style>