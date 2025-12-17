<template>
  <button
    class="back-to-top"
    @click="scrollToTop"
    aria-label="Volver al inicio"
    title="Volver arriba"
  >
    <svg viewBox="0 0 24 24" class="arrow-icon">
      <path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14l-6-6z"/>
    </svg>
  </button>
</template>

<script setup>
const scrollToTop = () => {
  const start = document.documentElement.scrollTop || document.body.scrollTop
  const duration = 1000 // Duración en ms
  const startTime = performance.now()

  const easeInOutCubic = (t) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

  const animateScroll = (currentTime) => {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    const ease = easeInOutCubic(progress)

    const position = start * (1 - ease)

    document.documentElement.scrollTop = position
    document.body.scrollTop = position

    if (progress < 1) {
      requestAnimationFrame(animateScroll)
    }
  }

  requestAnimationFrame(animateScroll)
}
</script>



<style scoped>
.back-to-top {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 48px;
  height: 48px;
  border-radius: 12px; /* Cuadrado con bordes redondeados */
  background: var(--color-morado);
  color: var(--color-blanco);
  border: none;
  cursor: pointer;
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 20px rgba(136, 49, 255, 0.3); /* Sombra morada suave */
  transition: all 0.3s ease;
  opacity: 0.9;
  backdrop-filter: blur(10px); /* Efecto vidrio esmerilado (opcional, bonito) */
}

.back-to-top:hover {
  transform: translateY(-8px) scale(1.05);
  box-shadow: 0 12px 28px rgba(136, 49, 255, 0.4);
  opacity: 1;
}

.back-to-top:active {
  transform: translateY(-4px) scale(1);
}

/* Icono SVG de flecha hacia arriba (más fina y elegante) */
.arrow-icon {
  width: 24px;
  height: 24px;
  fill: currentColor;
  transition: transform 0.3s ease;
}

.back-to-top:hover .arrow-icon {
  transform: translateY(-2px);
}
</style>

