<!-- BackToTop.vue -->
<template>
  <button
    class="back-to-top"
    @click="scrollToTop"
    aria-label="Volver al inicio"
    title="Volver arriba"
    :class="{ 'is-hidden': isCartOpen }"
  >
    <svg viewBox="0 0 24 24" class="arrow-icon">
      <path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14l-6-6z"/>
    </svg>
  </button>
</template>

<script setup>
import { useCartStore } from '@/store/cartStore'
import { computed } from 'vue'

const cartStore = useCartStore()
const isCartOpen = computed(() => cartStore.isCartOpen)

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
  bottom: 1.5rem;
  right: 1.5rem;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(145deg, #7c3aed, var(--color-morado));
  color: white;
  border: none;
  cursor: pointer;
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 
    0 4px 12px rgba(136, 49, 255, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  opacity: 0.9;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  overflow: hidden;
}

.back-to-top::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.15), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.back-to-top:hover {
  transform: translateY(-4px) scale(1.1);
  box-shadow: 
    0 8px 24px rgba(136, 49, 255, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  opacity: 1;
}

.back-to-top:hover::before {
  opacity: 1;
}

.back-to-top:active {
  transform: translateY(-1px) scale(1.05);
  box-shadow: 
    0 2px 8px rgba(136, 49, 255, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  transition: all 0.1s ease;
}

/* Icono SVG más moderno y minimalista */
.arrow-icon {
  width: 20px;
  height: 20px;
  fill: currentColor;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  z-index: 1;
}

.back-to-top:hover .arrow-icon {
  transform: translateY(-2px);
}

/* Efecto de círculo sutil al hover */
.back-to-top::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.1);
  transform: scale(1.1);
  opacity: 0;
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.back-to-top:hover::after {
  opacity: 1;
  transform: scale(1.15);
}

/* Clase para ocultar cuando el carrito está abierto - IMPORTANTE: Agregar !important */
.back-to-top.is-hidden {
  opacity: 0 !important;
  visibility: hidden !important;
  transform: scale(0.8) !important;
  pointer-events: none !important;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
}

/* Responsive para móviles */
@media (max-width: 768px) {
  .back-to-top {
    bottom: 1rem;
    right: 1rem;
    width: 40px;
    height: 40px;
  }
  
  .arrow-icon {
    width: 18px;
    height: 18px;
  }
}

/* Para reducir movimiento en usuarios con preferencia */
@media (prefers-reduced-motion: reduce) {
  .back-to-top,
  .back-to-top:hover,
  .arrow-icon {
    transition: none;
  }
  
  .back-to-top:hover .arrow-icon {
    transform: none;
  }
}
</style>