<template>
  <footer class="site-footer" aria-label="Pie de página">
    <div class="footer-container">
      <!-- Logo y descripción -->
      <div class="footer-section">
        <div class="footer-brand">
          <h3 class="footer-title">SportCampus</h3>
          <p class="footer-description">
            Plataforma líder en cursos deportivos especializados. Transformamos pasión en profesión.
          </p>
          <p class="footer-company">
            Desarrollado por <strong>CJ Digital Solutions</strong>
          </p>
        </div>
        
        <!-- Redes sociales destacadas -->
        <div class="footer-social">
          <p class="social-title">Síguenos en redes</p>
          <div class="social-icons">
            <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" 
               class="social-icon" aria-label="Instagram">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3Z"/>
              </svg>
            </a>
            <a href="https://www.facebook.com/?locale=es_LA" target="_blank" rel="noopener noreferrer" 
               class="social-icon" aria-label="Facebook">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                <path d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96A10 10 0 0 0 22 12.06C22 6.53 17.5 2.04 12 2.04Z"/>
              </svg>
            </a>
            <a href="https://www.tiktok.com/es/" target="_blank" rel="noopener noreferrer" 
               class="social-icon" aria-label="TikTok">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                <path d="M16.6 5.82s.51.5 0 0A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6c0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64c0 3.33 2.76 5.7 5.69 5.7c3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48z"/>
              </svg>
            </a>
            <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer" 
               class="social-icon" aria-label="YouTube">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                <path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9c.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83c-.25.9-.83 1.48-1.73 1.73c-.47.13-1.33.22-2.65.28c-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44c-.9-.25-1.48-.83-1.73-1.73c-.13-.47-.22-1.1-.28-1.9c-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83c.25-.9.83-1.48 1.73-1.73c.47-.13 1.33-.22 2.65-.28c1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44c.9.25 1.48.83 1.73 1.73Z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      <!-- Enlaces rápidos -->
      <div class="footer-section">
        <h4 class="footer-heading">Enlaces rápidos</h4>
        <ul class="footer-links">
          <li><RouterLink to="/" class="footer-link">Inicio</RouterLink></li>
          <li><RouterLink to="/cursos" class="footer-link">Cursos</RouterLink></li>
          <li><RouterLink to="/about" class="footer-link">Contacto</RouterLink></li>
        </ul>
      </div>

      <!-- Información legal -->
      <div class="footer-section">
        <h4 class="footer-heading">Información</h4>
        <ul class="footer-links">
          <li><RouterLink to="/about" class="footer-link">Sobre nosotros</RouterLink></li>
          <li><RouterLink to="/about" class="footer-link">Preguntas frecuentes</RouterLink></li>
          <li><RouterLink to="/about" class="footer-link">Política de privacidad</RouterLink></li>
          <li><RouterLink to="/about" class="footer-link">Términos y condiciones</RouterLink></li>
        </ul>
      </div>

      <!-- Información de contacto -->
      <div class="footer-section">
        <h4 class="footer-heading">Contacto</h4>
        <div class="contact-info">
          <p class="contact-item">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" class="contact-icon">
              <path d="M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z"/>
            </svg>
            info@sportcampus.com
          </p>
          <p class="contact-item">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" class="contact-icon">
              <path d="M6.62,10.79C8.06,13.62 10.38,15.94 13.21,17.38L15.41,15.18C15.69,14.9 16.08,14.82 16.43,14.93C17.55,15.3 18.75,15.5 20,15.5A1,1 0 0,1 21,16.5V20A1,1 0 0,1 20,21A17,17 0 0,1 3,4A1,1 0 0,1 4,3H7.5A1,1 0 0,1 8.5,4C8.5,5.25 8.7,6.45 9.07,7.57C9.18,7.92 9.1,8.31 8.82,8.59L6.62,10.79Z"/>
            </svg>
            +1 (555) 123-4567
          </p>
        </div>
        <div class="business-hours">
          <h5 class="hours-title">Horarios de atención</h5>
          <p class="hours-item">Lunes a Viernes: 8:00 AM - 6:00 PM</p>
          <p class="hours-item">Sábados: 9:00 AM - 2:00 PM</p>
          <p class="hours-item">Domingos: Cerrado</p>
        </div>
      </div>
    </div>

    <!-- Pie inferior -->
    <div class="footer-bottom">
      <div class="footer-bottom-content">
        <p class="copyright">&copy; {{ currentYear }} SportCampus. Todos los derechos reservados.</p>
        <div class="footer-legal">
          <RouterLink to="/about" class="legal-link">Privacidad</RouterLink>
          <span class="separator">•</span>
          <RouterLink to="/about" class="legal-link">Términos</RouterLink>
          <span class="separator">•</span>
          <RouterLink to="/about" class="legal-link">Cookies</RouterLink>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'AppFooter',
  computed: {
    currentYear() {
      return new Date().getFullYear();
    }
  }
}
</script>

<style scoped>
.site-footer {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  color: #ffffff;
  padding: 3rem 0 0;
  margin-top: auto;
  position: relative;
  overflow: hidden;
}

.site-footer::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(106, 17, 203, 0.5), transparent);
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 3rem;
}

@media (min-width: 768px) {
  .footer-container {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .footer-container {
    grid-template-columns: repeat(4, 1fr);
  }
}

.footer-section {
  display: flex;
  flex-direction: column;
}

.footer-brand {
  margin-bottom: 2rem;
}

.footer-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 0.5rem;
  color: #ffffff;
  position: relative;
  display: inline-block;
}

.footer-title::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 40px;
  height: 3px;
  background: linear-gradient(90deg, var(--color-morado), var(--color-naranja));
  border-radius: 2px;
}

.footer-description {
  color: #a0a0c0;
  line-height: 1.6;
  margin: 0 0 0.5rem;
  font-size: 0.95rem;
}

.footer-company {
  color: #666699;
  font-size: 0.85rem;
  margin: 0;
}

.footer-company strong {
  color: var(--color-morado);
  font-weight: 600;
}

.footer-social {
  margin-top: 1rem;
}

.social-title {
  font-size: 0.9rem;
  color: #a0a0c0;
  margin: 0 0 1rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.social-icons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.social-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 50%;
  color: #ffffff;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.social-icon:hover {
  background: linear-gradient(135deg, var(--color-morado), var(--color-naranja));
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(106, 17, 203, 0.3);
  border-color: transparent;
}

.footer-heading {
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0 0 1.5rem;
  color: #ffffff;
  position: relative;
  padding-bottom: 0.5rem;
}

.footer-heading::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 30px;
  height: 2px;
  background: linear-gradient(90deg, var(--color-morado), var(--color-naranja));
  border-radius: 2px;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 0.75rem;
}

.footer-link {
  color: #a0a0c0;
  text-decoration: none;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.footer-link:hover {
  color: #ffffff;
  transform: translateX(5px);
}

.footer-link::before {
  content: '›';
  color: var(--color-morado);
  font-weight: bold;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.footer-link:hover::before {
  opacity: 1;
}

.contact-info {
  margin-bottom: 1.5rem;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #a0a0c0;
  font-size: 0.9rem;
  margin-bottom: 0.75rem;
}

.contact-icon {
  color: var(--color-morado);
  flex-shrink: 0;
}

.business-hours {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.hours-title {
  font-size: 0.9rem;
  color: #a0a0c0;
  margin: 0 0 0.75rem;
  font-weight: 600;
}

.hours-item {
  color: #a0a0c0;
  font-size: 0.85rem;
  margin: 0 0 0.5rem;
  line-height: 1.4;
}

.hours-item:last-child {
  margin-bottom: 0;
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: 3rem;
  padding: 1.5rem 0;
}

.footer-bottom-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  text-align: center;
}

@media (min-width: 768px) {
  .footer-bottom-content {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}

.copyright {
  color: #a0a0c0;
  font-size: 0.9rem;
  margin: 0;
}

.footer-legal {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.legal-link {
  color: #a0a0c0;
  text-decoration: none;
  font-size: 0.85rem;
  transition: color 0.3s ease;
}

.legal-link:hover {
  color: #ffffff;
}

.separator {
  color: #666699;
  font-size: 0.8rem;
}

/* Animación para el hover de enlaces */
.footer-link {
  position: relative;
  overflow: hidden;
}

.footer-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: -100%;
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, transparent, #ffffff, transparent);
  transition: left 0.3s ease;
}

.footer-link:hover::after {
  left: 100%;
}

/* Efecto de brillo en las redes sociales */
.social-icon {
  position: relative;
  overflow: hidden;
}

.social-icon::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
  transform: scale(0);
  transition: transform 0.5s ease;
}

.social-icon:hover::before {
  transform: scale(1);
}
</style>