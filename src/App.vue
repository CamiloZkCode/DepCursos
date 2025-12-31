<template>
  <router-view />
  <BackToTop />
  <CartShop />
</template>

<script setup>
import BackToTop from '@/components/backtotp.vue'  
import CartShop from '@/components/CartShop.vue'
</script>

<style>
:root {
  --color-azul: #0188db;
  --color-amarillo: #f4b908;
  --color-naranja: #f0ad4e;
  --color-morado: #8831FF;
  --color-rojo: #b6212b;
  --color-verde: #28a745;
  --color-blanco: #FFF;
  --color-info-gris: #7d8da1;
  --color-info-luz: #dce1eb;
  --color-oscuro: #363949;
  --color-light: rgba(132, 139, 200, 0.18);
  --color-azul-variante: #2749aa;
  --color-oscuro-variante: #677483;
  --color-background: #f6f6f9;
  --card-border-radius: 2rem;
  --border-radius-1: 0.4rem;
  --border-radius-2: 0.8rem;
  --border-radius-3: 1.2rem;
  --card-padding: 1rem;
  --padding-1: 1.2rem;
  --box-shadow: 0 2rem 3rem var(--color-light);
}


* {
  margin: 0;
  padding: 0;
  outline: 0;
  appearance: none;
  border: 0;
  text-decoration: none;
  list-style: none;
  box-sizing: border-box;
}

html {
  font-size: 14px;
}

body {
  font-family: 'Poppins', sans-serif;
  font-size: 0.88rem;
  background: var(--color-background);
  user-select: none;
  min-height: 100vh;
}
</style>