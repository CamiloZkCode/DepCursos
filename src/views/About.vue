<template>
  <main class="support" aria-describedby="support-intro">
    <!-- Header adaptado para la sección de Soporte -->
    <header class="support__header">
      <h1 class="support__title">Centro de Ayuda y Soporte</h1>
      <p class="support__subtitle">
        Encuentra respuestas rápidas, contacta con nosotros o revisa nuestras políticas.
      </p>
    </header>

    <!-- NAVEGACIÓN DE TABS -->
    <nav class="support__tabs" role="tablist" aria-label="Secciones de soporte">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="support__tab"
        :class="{ 'is-active': activeTab === tab.id }"
        @click="activeTab = tab.id"
        role="tab"
        :aria-selected="activeTab === tab.id"
        :aria-controls="tab.id"
      >
        <span class="support__tab-icon">{{ tab.icon }}</span>
        {{ tab.label }}
      </button>
    </nav>

    <!-- CONTENIDO DE TABS -->
    <section class="support__content">
      <!-- TAB 1: Soporte y Contacto -->
      <div v-if="activeTab === 'contacto'" id="contacto" role="tabpanel">
        <header class="section-header">
          <h2>Soporte y Contacto</h2>
        </header>

        <div class="faq-section">
          <h3>📌 Canales de Atención</h3>
          <details class="faq-item">
            <summary>¿Cómo contactar al soporte?</summary>
            <p>Puedes contactarnos a través de nuestros canales disponibles: correo electrónico, chat en línea, WhatsApp o formulario de contacto en la plataforma.</p>
          </details>
          <details class="faq-item">
            <summary>Correo electrónico de soporte</summary>
            <p>Envía un email a <strong>soporte@tuempresa.com</strong> para asistencia general.</p>
          </details>
          <details class="faq-item">
            <summary>Chat en línea</summary>
            <p>Accede al chat en vivo desde la esquina inferior derecha de la plataforma durante horarios de atención.</p>
          </details>
          <details class="faq-item">
            <summary>WhatsApp de atención</summary>
            <p>Envía un mensaje al <strong>+57 123 456 789</strong> para soporte rápido.</p>
          </details>
          <details class="faq-item">
            <summary>Formulario de contacto</summary>
            <p>Completa el formulario en la sección de contacto de la plataforma y te responderemos pronto.</p>
          </details>

          <h3>📌 Atención al Usuario</h3>
          <details class="faq-item">
            <summary>Horarios de atención</summary>
            <p>Lunes a viernes de 8:00 AM a 6:00 PM (hora Colombia).</p>
          </details>
          <details class="faq-item">
            <summary>Tiempos de respuesta</summary>
            <p>Respondemos en un máximo de 24 horas hábiles.</p>
          </details>
          <details class="faq-item">
            <summary>Soporte para estudiantes activos</summary>
            <p>Estudiantes inscritos tienen prioridad en respuestas y acceso a soporte premium.</p>
          </details>

          <h3>📌 PQR (Peticiones, Quejas y Reclamos)</h3>
          <details class="faq-item">
            <summary>¿Cómo radicar una PQR?</summary>
            <p>Envía tu PQR a través del formulario dedicado en la plataforma o por email a <strong>pqr@tuempresa.com</strong>.</p>
          </details>
          <details class="faq-item">
            <summary>Tiempos de respuesta de una PQR</summary>
            <p>Hasta 15 días hábiles según la normatividad colombiana.</p>
          </details>
          <details class="faq-item">
            <summary>Entidad competente (SIC)</summary>
            <p>Si no estás satisfecho, puedes escalar a la SIC en <a href="https://www.sic.gov.co" target="_blank">www.sic.gov.co</a>.</p>
          </details>

          <h3>📌 Reporte de Problemas</h3>
          <details class="faq-item">
            <summary>Reportar errores técnicos</summary>
            <p>Usa el botón "Reportar error" en la plataforma o contacta soporte.</p>
          </details>
          <details class="faq-item">
            <summary>Problemas con cursos / pagos / certificados</summary>
            <p>
              • Cursos: formulario específico<br>
              • Pagos: <strong>finanzas@tuempresa.com</strong><br>
              • Certificados: <strong>certificados@tuempresa.com</strong>
            </p>
          </details>
        </div>
      </div>

      <!-- TAB 2: Ayuda y Preguntas Frecuentes -->
      <div v-if="activeTab === 'faq'" id="faq" role="tabpanel">
        <header class="section-header">
          <h2>Preguntas Frecuentes (FAQ)</h2>
        </header>

        <div class="faq-section">
          <h3>📌 Cuenta y Perfil</h3>
          <!-- Aquí van todas las preguntas de cuenta -->
          <details class="faq-item">
            <summary>¿Cómo crear una cuenta?</summary>
            <p>Haz clic en "Registrarse" y completa el formulario con tus datos.</p>
          </details>
          <details class="faq-item">
            <summary>¿Cómo recuperar mi contraseña?</summary>
            <p>Haz clic en "Olvidé mi contraseña" y sigue las instrucciones.</p>
          </details>
          <!-- ... puedes agregar las demás de esta sección ... -->

          <h3>📌 Cursos</h3>
          <details class="faq-item">
            <summary>¿Cómo registrarme en un curso?</summary>
            <p>Selecciona el curso y haz clic en "Inscribirse".</p>
          </details>
          <details class="faq-item">
            <summary>¿Los cursos tienen horarios?</summary>
            <p>La mayoría son asincrónicos, pero algunos tienen sesiones en vivo.</p>
          </details>

          <h3>📌 Evaluaciones y Actividades</h3>
          <details class="faq-item">
            <summary>¿Cuántas oportunidades tengo para aprobar?</summary>
            <p>Generalmente 3 intentos por evaluación.</p>
          </details>

          <h3>📌 Certificados</h3>
          <details class="faq-item">
            <summary>¿Cómo solicitar mi certificado?</summary>
            <p>Se emite automáticamente al completar el curso.</p>
          </details>

          <h3>📌 Pagos</h3>
          <details class="faq-item">
            <summary>¿Puedo pedir reembolso?</summary>
            <p>Sí, dentro de 7 días si no has iniciado el curso.</p>
          </details>

          <h3>📌 Problemas Técnicos</h3>
          <details class="faq-item">
            <summary>La plataforma no carga</summary>
            <p>Verifica tu conexión a internet o borra caché del navegador.</p>
          </details>
          <details class="faq-item">
            <summary>Navegadores compatibles</summary>
            <p>Chrome, Firefox, Edge (versiones recientes).</p>
          </details>
        </div>
      </div>

      <!-- TAB 3: Términos, Condiciones y Políticas -->
      <div v-if="activeTab === 'terminos'" id="terminos" role="tabpanel">
        <header class="section-header">
          <h2>Términos, Condiciones y Políticas</h2>
          <p class="update-date">Última actualización: 20 de diciembre de 2025</p>
        </header>

        <div class="faq-section">
          <h3>📌 Naturaleza de la Plataforma</h3>
          <details class="faq-item">
            <summary>¿Qué es la plataforma?</summary>
            <p>Plataforma digital de educación en línea con cursos no formales.</p>
          </details>
          <details class="faq-item">
            <summary>Tipo de formación ofrecida</summary>
            <p>Educación continua y capacitación técnica. No otorga títulos académicos.</p>
          </details>

          <h3>📌 Términos y Condiciones de Uso</h3>
          <details class="faq-item">
            <summary>Aceptación de los términos</summary>
            <p>El uso implica aceptación total de los términos.</p>
          </details>

          <h3>📌 Política de Privacidad y Datos Personales</h3>
          <details class="faq-item">
            <summary>Derechos del titular</summary>
            <p>Acceso, rectificación y supresión de datos (Ley 1581).</p>
          </details>

          <h3>📌 Certificados y Validez Legal</h3>
          <details class="faq-item">
            <summary>Validez</summary>
            <p>Constancia válida para empresas privadas.</p>
          </details>

          <h3>📌 Propiedad Intelectual</h3>
          <details class="faq-item">
            <summary>Prohibiciones</summary>
            <p>Prohibida reproducción o uso comercial.</p>
          </details>

          <h3>📌 Legislación Aplicable</h3>
          <details class="faq-item">
            <summary>Jurisdicción</summary>
            <p>Leyes de la República de Colombia.</p>
          </details>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref } from 'vue'

const activeTab = ref('contacto')

const tabs = [
  { id: 'contacto', label: 'Soporte y Contacto', icon: '📞' },
  { id: 'faq', label: 'Preguntas Frecuentes', icon: '❓' },
  { id: 'terminos', label: 'Términos y Políticas', icon: '📄' }
]
</script>

<style scoped>
.support {
  display: grid;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

.support__header {
  text-align: center;
  padding: 2rem 1rem;
  background: linear-gradient(135deg, var(--color-morado), var(--color-naranja));
  border-radius: var(--border-radius-3);
}

.support__title {
  font-size: clamp(2rem, 5vw, 2.8rem);
  color: var(--color-blanco);
  margin: 0 0 0.5rem;
}

.support__subtitle {
  color: var(--color-blanco);
  font-size: 1.1rem;
  max-width: 800px;
  margin: 0 auto;
}

.support__tabs {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  border-bottom: 1px solid var(--color-light);
  padding-bottom: 0.5rem;
}

.support__tab {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  background: transparent;
  border: none;
  cursor: pointer;
  color: var(--color-oscuro-variante);
  transition: all 0.2s ease;
  border-bottom: 3px solid transparent;
  white-space: nowrap;
}

.support__tab.is-active {
  color: var(--color-morado);
  border-bottom: 3px solid var(--color-morado);
  font-weight: 600;
}

.support__tab-icon {
  font-size: 1.3rem;
}

.support__content {
  background: var(--color-blanco);
  border-radius: var(--border-radius-3);
  box-shadow: var(--box-shadow);
  padding: 2rem;
}

.section-header {
  text-align: left;
  margin-bottom: 2rem;
}

.section-header h2 {
  margin: 0 0 0.5rem;
  color: var(--color-oscuro);
  font-size: clamp(1.8rem, 4vw, 2.2rem);
}

.update-date {
  font-size: 0.9rem;
  color: var(--color-oscuro-variante);
  font-style: italic;
}

.faq-section h3 {
  margin: 2rem 0 1rem;
  color: var(--color-morado);
  font-size: 1.4rem;
  border-bottom: 1px solid var(--color-light);
  padding-bottom: 0.5rem;
}

.faq-section h3:first-child {
  margin-top: 0;
}

.faq-item {
  margin-bottom: 0.8rem;
  border: 1px solid var(--color-light);
  border-radius: var(--border-radius-2);
  overflow: hidden;
}

.faq-item summary {
  padding: 1rem;
  font-weight: 600;
  cursor: pointer;
  background: #f8f5ff;
  transition: background 0.2s ease;
}

.faq-item summary:hover {
  background: #f0e6ff;
}

.faq-item[open] summary {
  background: linear-gradient(225deg, var(--color-morado), var(--color-naranja));
  color: var(--color-blanco);
}

.faq-item p,
.faq-item ul {
  padding: 0 1rem 1rem;
  color: var(--color-oscuro-variante);
  line-height: 1.6;
}

.faq-item a {
  color: var(--color-morado);
  text-decoration: underline;
}

@media (max-width: 768px) {
  .support__tabs {
    flex-direction: column;
  }

  .support__tab {
    justify-content: flex-start;
  }

  .support__content {
    padding: 1rem;
  }
}
</style>