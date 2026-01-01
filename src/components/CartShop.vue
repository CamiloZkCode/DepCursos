<!-- CartButton.vue -->
<template>
  <div>
    <!-- Botón flotante del carrito -->
    <button
      class="cart-button"
      @click="cartStore.toggleCart()"
      aria-label="Abrir carrito de compras"
      title="Mi Carrito"
    >
      <img src="@/assets/icons/Shop.png" alt="Carrito" class="cart-icon" />
      <!-- Badge con cantidad de items -->
      <span v-if="cartStore.itemsCount > 0" class="cart-badge">
        {{ cartStore.itemsCount }}
      </span>
    </button>

    <!-- Drawer lateral (panel que sale de la derecha) -->
    <div
      class="cart-drawer-overlay"
      :class="{ 'is-open': cartStore.isCartOpen }"
      @click="cartStore.closeCart()"
    ></div>

    <aside
      class="cart-drawer"
      :class="{ 'is-open': cartStore.isCartOpen }"
      aria-hidden="!cartStore.isCartOpen"
    >
      <div class="cart-drawer__header">
        <h3>Mi Carrito</h3>
        <button
          class="cart-drawer__close"
          @click="cartStore.closeCart()"
          aria-label="Cerrar carrito"
        >
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
      </div>

      <div class="cart-drawer__body">
        <!-- Aquí va el contenido del carrito -->
        <div v-if="cartStore.isEmpty" class="empty-cart">
          <p>Tu carrito está vacío 😔</p>
          <p>¡Agrega algunos productos!</p>
        </div>

        <div v-else class="cart-items">
          <div
            v-for="item in cartStore.items"
            :key="item.id"
            class="cart-item"
          >
            <img :src="item.image" :alt="item.title" class="item-image" />
            <div class="item-info">
              <h4>{{ item.title }}</h4>
              <div class="item-quantity-controls">
                <button 
                  @click="cartStore.decreaseQuantity(item.id)" 
                  class="quantity-btn"
                  aria-label="Disminuir cantidad"
                >
                  −
                </button>
                <span>{{ item.quantity }}</span>
                <button 
                  @click="cartStore.increaseQuantity(item.id)" 
                  class="quantity-btn"
                  aria-label="Aumentar cantidad"
                >
                  +
                </button>
              </div>
              <p class="item-price">${{ (item.price * item.quantity).toFixed(2) }}</p>
            </div>
            <button 
              @click="cartStore.removeFromCart(item.id)" 
              class="remove-btn"
              aria-label="Eliminar producto"
            >
              ✕
            </button>
          </div>

          <div class="cart-total">
            <strong>Total: ${{ cartStore.totalPrice }}</strong>
          </div>

          <button class="checkout-btn" @click="proceedToCheckout">
            Proceder al Pago
          </button>
          
          <button 
            v-if="!cartStore.isEmpty" 
            @click="cartStore.clearCart()" 
            class="clear-cart-btn"
          >
            Vaciar Carrito
          </button>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup>
import { useCartStore } from '@/store/cartStore'

const cartStore = useCartStore()

const proceedToCheckout = () => {
  // Tu lógica para ir al checkout
  console.log('Procediendo al pago...')
  // Redirigir a la página de checkout o abrir modal de pago
}
</script>

<style scoped>
/* Botón flotante - similar al back-to-top pero al izquierdo */
.cart-button {
  position: fixed;
  bottom: 1.5rem;
  left: 1.5rem; /* ← Lado izquierdo */
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(145deg, #7c3aed, var(--color-morado));
  color: white;
  border: none;
  cursor: pointer;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 
    0 4px 12px rgba(136, 49, 255, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  opacity: 0.95;
  backdrop-filter: blur(8px);
}

.cart-button:hover {
  transform: translateY(-4px) scale(1.1);
  box-shadow: 
    0 8px 24px rgba(136, 49, 255, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  opacity: 1;
}

.cart-button:active {
  transform: translateY(-1px) scale(1.1);
}

/* Icono/imagen del carrito */
.cart-icon {
  width: 25px;
  height: 25px;
  filter: brightness(0) invert(1); /* Hace la imagen blanca si es oscura */
}

/* Badge con número de items */
.cart-badge {
  position: absolute;
  top: -6px;
  right: -6px;
  min-width: 20px;
  height: 20px;
  background: #ef4444;
  color: white;
  border-radius: 50%;
  font-size: 0.75rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 6px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}

/* Overlay oscuro */
.cart-drawer-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  z-index: 10000;
}

.cart-drawer-overlay.is-open {
  opacity: 1;
  visibility: visible;
}

/* Drawer lateral */
.cart-drawer {
  position: fixed;
  top: 0;
  right: -400px; /* Oculto inicialmente */
  width: 400px;
  max-width: 90vw;
  height: 100%;
  background: white;
  box-shadow: -8px 0 32px rgba(0, 0, 0, 0.2);
  transition: right 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  z-index: 10001;
  display: flex;
  flex-direction: column;
}

.cart-drawer.is-open {
  right: 0;
}

.cart-drawer__header {
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8fafc;
}

.cart-drawer__header h3 {
  margin: 0;
  font-size: 1.25rem;
}

.cart-drawer__close {
  background: none;
  border: none;
  cursor: pointer;
  color: #64748b;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background 0.2s;
}

.cart-drawer__close:hover {
  background: #e2e8f0;
}

.cart-drawer__body {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}

.empty-cart {
  text-align: center;
  color: #64748b;
  margin-top: 4rem;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.cart-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 0.5rem;
  position: relative;
}

.item-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 0.5rem;
}

.item-info h4 {
  margin: 0 0 0.5rem;
  font-size: 1rem;
}

.item-price {
  font-weight: 600;
  color: var(--color-morado);
}

.item-quantity-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0.5rem 0;
}

.quantity-btn {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 1px solid #cbd5e1;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s;
}

.quantity-btn:hover {
  background: #f1f5f9;
  border-color: var(--color-morado);
}

.remove-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: none;
  border: none;
  font-size: 1.25rem;
  color: #ef4444;
  cursor: pointer;
}

.cart-total {
  text-align: right;
  font-size: 1.25rem;
  padding: 1rem 0;
  border-top: 1px solid #e2e8f0;
  margin-top: 1rem;
}

.checkout-btn {
  width: 100%;
  padding: 1rem;
  background: var(--color-morado);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
}

.checkout-btn:hover {
  background: #6d28d9;
}

.clear-cart-btn {
  width: 100%;
  padding: 0.75rem;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 0.5rem;
  transition: background 0.2s;
}

.clear-cart-btn:hover {
  background: #dc2626;
}

/* Responsive */
@media (max-width: 768px) {
  .cart-button {
    bottom: 1rem;
    left: 1rem;
    width: 50px;
    height: 50px;
  }

  .cart-icon {
    width: 24px;
    height: 24px;
  }

  .cart-drawer {
    width: 100%;
    max-width: 100%;
  }
}
</style>