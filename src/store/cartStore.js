// src/stores/cartStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  // Estado del carrito: array de productos
  const items = ref([])
  
  // NUEVO: Estado para controlar si el drawer del carrito está abierto
  const isCartOpen = ref(false)

  // Computed properties
  // Cantidad total de productos (para el badge del botón)
  const itemsCount = computed(() => {
    return items.value.reduce((total, item) => total + item.quantity, 0)
  })

  // Precio total del carrito
  const totalPrice = computed(() => {
    return items.value
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2)
  })

  // ¿Está vacío el carrito?
  const isEmpty = computed(() => items.value.length === 0)

  // -----------------------------
  // Acciones / Métodos
  // -----------------------------

  // NUEVO: Métodos para controlar el estado del drawer
  const openCart = () => {
    isCartOpen.value = true
  }

  const closeCart = () => {
    isCartOpen.value = false
  }

  const toggleCart = () => {
    isCartOpen.value = !isCartOpen.value
  }

  /**
   * Agregar un producto al carrito
   * @param {Object} product - Producto con al menos: id, title, price, image (opcional)
   */
  const addToCart = (product) => {
    // Buscar si ya existe
    const existingItem = items.value.find(item => item.id === product.id)

    if (existingItem) {
      existingItem.quantity += 1
    } else {
      items.value.push({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image || '/default-course.jpg', // imagen por defecto si no viene
        quantity: 1
      })
    }
    
    // NUEVO: Automáticamente abrir el carrito cuando se agrega un producto
    openCart()
  }

  /**
   * Incrementar cantidad de un producto
   */
  const increaseQuantity = (id) => {
    const item = items.value.find(item => item.id === id)
    if (item) item.quantity += 1
  }

  /**
   * Disminuir cantidad de un producto
   * Si llega a 0, se elimina automáticamente
   */
  const decreaseQuantity = (id) => {
    const item = items.value.find(item => item.id === id)
    if (item) {
      if (item.quantity > 1) {
        item.quantity -= 1
      } else {
        removeFromCart(id)
      }
    }
  }

  /**
   * Eliminar un producto del carrito
   */
  const removeFromCart = (id) => {
    items.value = items.value.filter(item => item.id !== id)
  }

  /**
   * Vaciar completamente el carrito
   */
  const clearCart = () => {
    items.value = []
  }

  // -----------------------------
  // Retornamos todo lo necesario
  // -----------------------------
  return {
    // Estado
    items,
    isCartOpen, // NUEVO: Exportamos el estado del drawer
    
    // Computed
    itemsCount,
    totalPrice,
    isEmpty,
    
    // Acciones
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
    openCart,    // NUEVO
    closeCart,   // NUEVO
    toggleCart   // NUEVO
  }
}, {
  // Persistencia en localStorage (gracias a pinia-plugin-persistedstate)
  persist: {
    key: 'cart-store',
    paths: ['items'] // Solo persistimos los items, no el estado isCartOpen
  }
})