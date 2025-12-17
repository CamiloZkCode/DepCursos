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
            <button class="btn btn--primary">
              <RouterLink to="/cursos" class="footer-link"> Nuestro Cursos</RouterLink>
            </button>
            <button class="btn btn--ghost" @click="scrollToCursos">Nuestras categorías</button>
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

    <!-- ===== TIPOS DE CURSOS ===== -->
    <section class="cursos" ref="cursosRef">
      <header class="section-header">
        <h2>Categorias disponibles</h2>
        <p>Explora nuestras categorías y encuentra el curso ideal para ti.</p>
      </header>

      <ul class="cursos__grid" role="list">
        <li v-for="curso in cursos" :key="curso.id_curso" class="place">
          <article class="place__card">
            <div class="place__media">
              <img class="place__img" :src="curso.imagen_curso" :alt="`Curso ${curso.nombre_curso}`"
                loading="lazy" decoding="async" />
              <span class="place__badge">{{ curso.insignia }}</span>
            </div>
            <div class="place__body">
              <h3 class="place__title">
                {{ curso.nombre_curso }}
              </h3>
              <p class="place__desc">{{ curso.descripcion_curso }}</p>
              <div class="place__meta">
                <span class="chip" v-if="curso.caracteristica">• {{ curso.caracteristica }}</span>
              </div>
              <div class="place__actions">
                <RouterLink class="btn btn--primary"
                  :to="{ path: '/cursos', query: { curso: curso.id_curso } }">
                  Ver categoría
                </RouterLink>
              </div>
            </div>
          </article>
        </li>
      </ul>
    </section>

    <!-- ===== CARRUSEL DE LOGOS ===== -->
    <section class="logos">
      <header class="section-header">
        <h2>Nuestras Academias Asociadas</h2>
        <p>Colaboramos con las mejores academias deportivas para ofrecerte cursos de calidad.</p>
      </header>
      <div class="logos__carousel" ref="logosRef" @mouseenter="pauseLogos" @mouseleave="playLogos">
        <div class="logos__track" :style="logosStyle">
          <img v-for="(logo, i) in logos.concat(logos)" :key="'logo-' + i" class="logos__item" :src="logo.src"
            :alt="logo.alt" loading="lazy" decoding="async" />
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
    const title = 'Inscríbete en tu curso deportivo con un clic'
    const description =
      'Experiencias motivadoras en cursos únicos: gym intensivo, yoga relajante, natación profesional y boxing dinámico.'

    // CARRUSEL HERO - Imágenes de deportes/fitness
    const images = reactive([
      { src: 'https://cdn.prod.website-files.com/65d7b904c0af185c6d721f6f/66745b16786e4667065274df_Friends-Taking-Fitness-Class-NewYorkCity.webp', alt: 'Clase de fitness grupal' },
      { src: 'https://images.squarespace-cdn.com/content/v1/61f7e7b2a3feff07fcdb6e0c/7f5eeaed-ff23-4c43-9367-69073ca654fd/JPCY22_asana-48.jpg', alt: 'Clase de yoga' },
      { src: 'https://d3rqy6w6tyyf68.cloudfront.net/AcuCustom/Sitename/DAM/082/6752-swim-training.jpg', alt: 'Entrenamiento de natación' },
      { src: 'https://www.onelifefitness.com/hs-fs/hubfs/Strike%20Studio%20pic10.jpg?width=1280&height=960&name=Strike%20Studio%20pic10.jpg', alt: 'Clase de boxing' },
      { src: 'https://cdn-ilapngp.nitrocdn.com/xCbEnuoxxjPRmKNEjSsKtvDOAhgRMWTr/assets/images/optimized/rev-c24a617/bellinghamevo.com/wp-content/uploads/2022/03/Is-It-More-Effective-to-Go-to-a-Fitness-Class-or-to-the-Gym-1024x682.jpg', alt: 'Grupo en gimnasio' }
    ])

    // Datos estáticos de cursos
    const cursos = reactive([
      {
        id_curso: '1',
        nombre_curso: 'Fitness Intensivo',
        descripcion_curso: 'Clases grupales de alta energía para mejorar fuerza y resistencia.',
        imagen_curso: 'https://cdn.prod.website-files.com/65d7b904c0af185c6d721f6f/66745b16786e4667065274df_Friends-Taking-Fitness-Class-NewYorkCity.webp',
        insignia: 'Popular'
      },
      {
        id_curso: '2',
        nombre_curso: 'Yoga y Mindfulness',
        descripcion_curso: 'Sesiones relajantes para mejorar flexibilidad y bienestar mental.',
        imagen_curso: 'https://arisebw.com/wp-content/uploads/2022/11/Yoga-Studio.jpg',
        insignia: 'Relajante'
      },
      {
        id_curso: '3',
        nombre_curso: 'Natación Avanzada',
        descripcion_curso: 'Entrenamiento técnico en piscina para todos los niveles.',
        imagen_curso: 'https://vmrw8k5h.tinifycdn.com/news/wp-content/uploads/2021/10/gmx7-resistance-training-swimming-Trailing_Kick_2-scaled-1.jpeg',
        insignia: 'Pro'
      },
      {
        id_curso: '4',
        nombre_curso: 'Boxing Fitness',
        descripcion_curso: 'Clases dinámicas combinando cardio y técnica de boxeo.',
        imagen_curso: 'https://i0.wp.com/spartansboxing.com/wp-content/uploads/2025/01/Boxing-Gym-Program_-Unlock-Your-Potential_-Copy.webp?fit=1920%2C1080&ssl=1',
        insignia: 'Energético'
      }
    ])

    // LOGOS de academias/marcas deportivas
    const logos = reactive([
      { src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Logo_NIKE.svg/1200px-Logo_NIKE.svg.png', alt: 'Nike' },
      { src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Under_armour_logo.svg/1200px-Under_armour_logo.svg.png', alt: 'Under Armour' },
      { src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Adidas_Logo.svg/1200px-Adidas_Logo.svg.png', alt: 'Adidas' },
      { src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Puma_logo.svg/1200px-Puma_logo.svg.png', alt: 'Puma' },
      { src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Reebok_logo.svg/1200px-Reebok_logo.svg.png', alt: 'Reebok' },
      { src: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Asics_logo.svg', alt: 'Asics' }
    ])

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

    // Swipe
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

    // Logos carousel
    const logosOffset = ref(0)
    const LOGO_SPEED = 0.5
    let logosAnimationFrame = null
    const logosRef = ref(null)

    function animateLogos() {
      logosOffset.value -= LOGO_SPEED
      const logoWidth = 80
      const totalWidth = logos.length * logoWidth
      if (Math.abs(logosOffset.value) >= totalWidth) {
        logosOffset.value += totalWidth
      }
      logosAnimationFrame = requestAnimationFrame(animateLogos)
    }

    const playLogos = () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      if (!logosAnimationFrame) animateLogos()
    }

    const pauseLogos = () => {
      if (logosAnimationFrame) {
        cancelAnimationFrame(logosAnimationFrame)
        logosAnimationFrame = null
      }
    }

    const logosStyle = computed(() => ({
      transform: `translateX(${logosOffset.value}px)`,
      display: 'flex'
    }))

    // Scroll a cursos
    const cursosRef = ref(null)
    const scrollToCursos = () => {
      cursosRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    // Teclas flechas
    const onKey = (e) => {
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', onKey)

    onMounted(() => {
      const preload = new Image()
      preload.src = images[(current.value + 1) % images.length].src

      document.addEventListener('visibilitychange', handleVisibility)
      const io = new IntersectionObserver(
        (entries) => (entries[0].isIntersecting ? play() : stop()),
        { threshold: 0.25 }
      )
      if (heroRef.value) io.observe(heroRef.value)
      bindSwipe(heroRef.value)

      // Logos
      playLogos()
      const ioLogos = new IntersectionObserver(
        (entries) => (entries[0].isIntersecting ? playLogos() : pauseLogos()),
        { threshold: 0.25 }
      )
      if (logosRef.value) ioLogos.observe(logosRef.value)
    })

    onBeforeUnmount(() => {
      stop()
      document.removeEventListener('visibilitychange', handleVisibility)
      unbindSwipe()
      pauseLogos()
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
      cursos,
      cursosRef,
      scrollToCursos,
      logos,
      logosRef,
      logosStyle,
      pauseLogos,
      playLogos
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
  height: min(78vh, 720px);
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
  padding: 1.5rem;
  color: var(--color-blanco);
  background:
    radial-gradient(60% 50% at 50% 70%, rgba(0, 0, 0, 0.45), transparent 70%),
    linear-gradient(to bottom, rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.55));
}

.hero__content {
  text-align: center;
  display: grid;
  gap: .9rem;
  max-width: 780px;
}

.hero__title {
  margin: 0;
  font-size: clamp(2rem, 5vw, 3.5rem);
  line-height: 1.1;
  text-shadow: 0 8px 28px rgba(0, 0, 0, .5);
}

.hero__desc {
  margin: 0 auto;
  max-width: 60ch;
  font-size: clamp(1rem, 1.6vw, 1.2rem);
  opacity: .95;
}

.hero__cta {
  display: flex;
  gap: .6rem;
  justify-content: center;
  flex-wrap: wrap;
}

.hero__controls {
  position: absolute;
  inset: auto 0 1.25rem 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 1rem;
}

.hero__nav {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 0;
  cursor: pointer;
  font-size: 1.6rem;
  background: var(--color-morado);
  color: var(--color-blanco);
  box-shadow: 0 10px 24px rgba(0, 0, 0, .28);
  transition: transform 120ms ease, filter 120ms ease;
}

.hero__nav:hover {
  transform: translateY(-2px);
  filter: brightness(.98);
}

.hero__dots {
  position: absolute;
  left: 50%;
  bottom: .9rem;
  transform: translateX(-50%);
  display: flex;
  gap: .45rem;
}

.hero__dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  border: 2px solid var(--color-blanco);
  background: transparent;
  opacity: .7;
  cursor: pointer;
  transition: width 180ms ease, opacity 120ms ease, background 180ms ease, border-color 180ms ease;
}

.hero__dot.is-active {
  width: 26px;
  background: var(--color-morado);
  border-color: var(--color-blanco);
  opacity: 1;
}

/* ===== Section headers ===== */
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

/* ===== Cursos ===== */
.cursos {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.cursos__grid {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 1rem;
}

.place {
  grid-column: span 12;
  display: flex;
}

.place__card {
  height: 100%;
  min-height: 200px; /* Asegura tamaño mínimo uniforme */
  display: grid;
  grid-template-columns: 128px 1fr;
  gap: .9rem;
  align-items: stretch;
  background: var(--color-blanco);
  border-radius: var(--border-radius-3);
  box-shadow: var(--box-shadow);
  padding: .7rem;
  transition: transform 140ms ease, box-shadow 140ms ease;
}

.place__card:hover {
  transform: translateY(-2px);
  box-shadow: 0 1.4rem 3rem var(--color-light);
}

.place__media {
  position: relative;
  border-radius: var(--border-radius-2);
  overflow: clip;
  height: 100%;
}

.place__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.place__badge {
  position: absolute;
  top: .5rem;
  left: .5rem;
  padding: .25rem .5rem;
  background: linear-gradient(135deg, var(--color-naranja), var(--color-morado));
  color: var(--color-blanco);
  border-radius: 999px;
  font-size: .75rem;
  font-weight: 700;
  letter-spacing: .2px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, .25);
}

.place__body {
  display: flex;
  flex-direction: column;
  gap: .25rem;
  min-height: 170px;
}

.place__title {
  margin: 0;
  color: var(--color-oscuro);
  font-size: 1.1rem;
}

.place__desc {
  margin: 0;
  color: var(--color-oscuro-variante);
  font-size: 0.9rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex-grow: 1; /* Permite que la descripción ocupe espacio para uniformidad */
}

.place__meta {
  margin-top: 1rem; 
}

.place__actions {
  display: flex;
  justify-content: center; /* Centra el botón */
  gap: .55rem;
  flex-wrap: wrap;
  margin-top: 1rem; 
}

/* ===== Logos Carousel ===== */
.logos {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto 3rem;
  padding: 0 1rem;
}

.logos__carousel {
  position: relative;
  height: 100px;
  overflow: clip;
  border-radius: var(--card-border-radius);
  isolation: isolate;
}

.logos__track {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
}

.logos__item {
  flex: 0 0 auto;
  width: 80px;
  height: 60px;
  object-fit: contain;
  margin: 0 2.5rem;
  filter: grayscale(20%);
  transition: filter 0.3s ease;
}

.logos__item:hover {
  filter: grayscale(0%);
}

/* ===== Botones ===== */
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

.btn:active {
  transform: translateY(0);
}

.btn--primary {
  background:var(--color-morado);
  color: var(--color-blanco);
}

.footer-link {
  color: var(--color-blanco);
}

.btn--ghost {
  background: var(--color-blanco);
  border-color: var(--color-info-luz);
  color: var(--color-oscuro);
}

/* ===== Focus visible ===== */
:focus-visible {
  outline: 3px solid var(--color-amarillo);
  outline-offset: 2px;
}

/* ===== Breakpoints ===== */
@media (min-width: 480px) {
  .place__desc {
    font-size: 1.1rem;
  }

  .logos__item {
    width: 110px;
    height: 85px;
  }
}

@media (min-width: 768px) {
  .place {
    grid-column: span 6;
  }
}

@media (min-width: 1024px) {
  .place {
    grid-column: span 3;
  }

  .place__card {
    grid-template-columns: 1fr;
    padding: .9rem;
    min-height: 380px; /* Tamaño uniforme en desktop */
  }

  .place__media {
    min-height: 160px;
    max-height: 160px;
  }

  .place__body {
    min-height: 200px;
  }

  .logos__carousel {
    max-width: 1100px;
    margin: 0 auto;
    height: 160px;
  }

  .logos__item {
    width: 120px;
    height: 90px;
  }
}
</style>