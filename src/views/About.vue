<template>
  <main class="support" aria-describedby="support-intro">
    <!-- ===== ENCABEZADO ===== -->
    <header class="support__header">
      <h1 class="support__title">Centro de Soporte</h1>
      <p class="support__subtitle">Encuentra respuestas rápidas a tus preguntas y soluciones a problemas comunes</p>
    </header>

    <!-- ===== NAVEGACIÓN DE TABS ===== -->
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

    <!-- ===== CONTENIDO DE TABS ===== -->
    <section class="support__content">
      <!-- TAB: SOPORTE Y CONTACTO -->
      <div v-if="activeTab === 'contacto'" id="contacto" role="tabpanel" class="tab-content">
        <div class="section-header">
          <h2>Soporte y Contacto</h2>
          <p>Todos nuestros canales de atención y horarios de servicio</p>
        </div>

        <!-- Canales de Atención -->
        <section class="support__section">
          <div class="section-subheader">
            <h3>📌 Canales de Atención</h3>
          </div>
          
          <div class="faq-question" @click="toggleFAQ('contacto1')">
            <div class="faq-question__header">
              <h4>¿Cómo contactar al soporte?</h4>
              <span class="faq-toggle">{{ activeFAQ === 'contacto1' ? '−' : '+' }}</span>
            </div>
            <div v-if="activeFAQ === 'contacto1'" class="faq-answer">
              <p>Puedes contactarnos a través de nuestros canales disponibles: correo electrónico, WhatsApp o formulario de contacto en la plataforma.</p>
            </div>
          </div>

          <div class="channels-grid">
            <div class="channel-card">
              <div class="channel-icon">📧</div>
              <h4>Correo electrónico de soporte</h4>
              <p>Envía un email a <strong>soporte@tuempresa.com</strong> para asistencia general.</p>
            </div>
            
            <div class="channel-card">
              <div class="channel-icon">📱</div>
              <h4>WhatsApp de atención</h4>
              <p>Envía un mensaje al <strong>+57 123 456 789</strong> para soporte rápido.</p>
            </div>
            
            <div class="channel-card">
              <div class="channel-icon">📋</div>
              <h4>Formulario de contacto</h4>
              <p>Completa el formulario en la sección de contacto de la plataforma y te responderemos pronto.</p>
            </div>
          </div>
        </section>

        <!-- PQR -->
        <section class="support__section">
          <div class="section-subheader">
            <h3>📌 PQR (Peticiones, Quejas y Reclamos)</h3>
          </div>
          
          <div class="pqr-info">
            <div class="info-card">
              <h4>¿Cómo radicar una PQR?</h4>
              <p>Envía tu PQR a través del formulario dedicado en la plataforma o por email a <strong>pqr@tuempresa.com</strong>.</p>
            </div>
            
            <div class="info-card">
              <h4>Tiempos de respuesta de una PQR</h4>
              <p>Hasta 15 días hábiles según la normatividad colombiana.</p>
            </div>
            
            <div class="info-card">
              <h4>Seguimiento de una PQR</h4>
              <p>Recibirás un número de radicado para rastrear el estado vía email o plataforma.</p>
            </div>
            
            <div class="info-card warning">
              <h4>Entidad competente (SIC)</h4>
              <p>Si no estás satisfecho, puedes escalar a la SIC en <a href="https://www.sic.gov.co" target="_blank">www.sic.gov.co</a>.</p>
            </div>
          </div>
        </section>

        <!-- Horarios de Atención -->
        <section class="support__section">
          <div class="section-subheader">
            <h3>📌 Información de Atención</h3>
          </div>
          
          <div class="info-grid">
            <div class="info-card">
              <h4>Horarios de atención</h4>
              <p>Lunes a viernes de 8:00 AM a 6:00 PM (hora Colombia).</p>
            </div>
            
            <div class="info-card">
              <h4>Tiempos de respuesta</h4>
              <p>Respondemos en un máximo de 24 horas hábiles.</p>
            </div>
            
            <div class="info-card">
              <h4>Días hábiles de atención</h4>
              <p>Excluyendo fines de semana y festivos nacionales en Colombia.</p>
            </div>
            
            <div class="info-card">
              <h4>Soporte para estudiantes activos</h4>
              <p>Estudiantes inscritos tienen prioridad en respuestas y acceso a soporte premium.</p>
            </div>
          </div>
        </section>
      </div>

      <!-- TAB: AYUDA Y FAQ -->
      <div v-if="activeTab === 'ayuda'" id="ayuda" role="tabpanel" class="tab-content">
        <div class="section-header">
          <h2>Ayuda y Preguntas Frecuentes</h2>
          <p>Respuestas rápidas a las preguntas más comunes</p>
        </div>

        <div class="faq-categories">
          <!-- Cuenta y Perfil -->
          <section class="support__section">
            <div class="section-subheader">
              <h3>📌 Cuenta y Perfil</h3>
            </div>
            
            <div class="faq-list">
              <div v-for="faq in faqs.cuenta" :key="faq.id" class="faq-question" @click="toggleFAQ(faq.id)">
                <div class="faq-question__header">
                  <h4>{{ faq.question }}</h4>
                  <span class="faq-toggle">{{ activeFAQ === faq.id ? '−' : '+' }}</span>
                </div>
                <div v-if="activeFAQ === faq.id" class="faq-answer">
                  <p>{{ faq.answer }}</p>
                </div>
              </div>
            </div>
          </section>

          <!-- Cursos -->
          <section class="support__section">
            <div class="section-subheader">
              <h3>📌 Cursos</h3>
            </div>
            
            <div class="faq-list">
              <div v-for="faq in faqs.cursos" :key="faq.id" class="faq-question" @click="toggleFAQ(faq.id)">
                <div class="faq-question__header">
                  <h4>{{ faq.question }}</h4>
                  <span class="faq-toggle">{{ activeFAQ === faq.id ? '−' : '+' }}</span>
                </div>
                <div v-if="activeFAQ === faq.id" class="faq-answer">
                  <p>{{ faq.answer }}</p>
                </div>
              </div>
            </div>
          </section>

          <!-- Evaluaciones y Actividades -->
          <section class="support__section">
            <div class="section-subheader">
              <h3>📌 Evaluaciones y Actividades</h3>
            </div>
            
            <div class="faq-list">
              <div v-for="faq in faqs.evaluaciones" :key="faq.id" class="faq-question" @click="toggleFAQ(faq.id)">
                <div class="faq-question__header">
                  <h4>{{ faq.question }}</h4>
                  <span class="faq-toggle">{{ activeFAQ === faq.id ? '−' : '+' }}</span>
                </div>
                <div v-if="activeFAQ === faq.id" class="faq-answer">
                  <p>{{ faq.answer }}</p>
                </div>
              </div>
            </div>
          </section>

          <!-- Certificados -->
          <section class="support__section">
            <div class="section-subheader">
              <h3>📌 Certificados</h3>
            </div>
            
            <div class="faq-list">
              <div v-for="faq in faqs.certificados" :key="faq.id" class="faq-question" @click="toggleFAQ(faq.id)">
                <div class="faq-question__header">
                  <h4>{{ faq.question }}</h4>
                  <span class="faq-toggle">{{ activeFAQ === faq.id ? '−' : '+' }}</span>
                </div>
                <div v-if="activeFAQ === faq.id" class="faq-answer">
                  <p>{{ faq.answer }}</p>
                </div>
              </div>
            </div>
          </section>

          <!-- Pagos -->
          <section class="support__section" v-if="faqs.pagos">
            <div class="section-subheader">
              <h3>📌 Pagos</h3>
            </div>
            
            <div class="faq-list">
              <div v-for="faq in faqs.pagos" :key="faq.id" class="faq-question" @click="toggleFAQ(faq.id)">
                <div class="faq-question__header">
                  <h4>{{ faq.question }}</h4>
                  <span class="faq-toggle">{{ activeFAQ === faq.id ? '−' : '+' }}</span>
                </div>
                <div v-if="activeFAQ === faq.id" class="faq-answer">
                  <p>{{ faq.answer }}</p>
                </div>
              </div>
            </div>
          </section>

          <!-- Problemas Técnicos -->
          <section class="support__section">
            <div class="section-subheader">
              <h3>📌 Problemas Técnicos</h3>
            </div>
            
            <div class="faq-list">
              <div v-for="faq in faqs.tecnicos" :key="faq.id" class="faq-question" @click="toggleFAQ(faq.id)">
                <div class="faq-question__header">
                  <h4>{{ faq.question }}</h4>
                  <span class="faq-toggle">{{ activeFAQ === faq.id ? '−' : '+' }}</span>
                </div>
                <div v-if="activeFAQ === faq.id" class="faq-answer">
                  <p>{{ faq.answer }}</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <!-- TAB: TÉRMINOS Y POLÍTICAS -->
      <div v-if="activeTab === 'terminos'" id="terminos" role="tabpanel" class="tab-content">
        <div class="section-header">
          <h2>Términos, Condiciones y Políticas</h2>
          <p>Información legal y normativa de la plataforma</p>
        </div>

        <!-- Naturaleza de la Plataforma -->
        <section class="support__section">
          <div class="section-subheader">
            <h3>📌 Naturaleza de la Plataforma</h3>
          </div>
          
          <div class="legal-content">
            <div class="legal-item">
              <h4>¿Qué es la plataforma?</h4>
              <p>Plataforma digital de educación en línea con cursos no formales.</p>
            </div>
            
            <div class="legal-item">
              <h4>Tipo de formación ofrecida</h4>
              <p>Educación continua y capacitación técnica. No otorga títulos académicos.</p>
            </div>
            
            <div class="legal-item">
              <h4>Alcance de los servicios</h4>
              <p>Contenidos multimedia, evaluaciones, foros, certificados digitales y soporte.</p>
            </div>
            
            <div class="legal-item">
              <h4>Limitaciones del servicio</h4>
              <p>No garantiza empleo ni resultados específicos.</p>
            </div>
          </div>
        </section>

        <!-- Términos y Condiciones -->
        <section class="support__section">
          <div class="section-subheader">
            <h3>📌 Términos y Condiciones de Uso</h3>
          </div>
          
          <div class="legal-content">
            <div class="legal-item">
              <h4>Aceptación de los términos</h4>
              <p>El uso implica aceptación total de los términos.</p>
            </div>
            
            <div class="legal-item">
              <h4>Registro y cuenta</h4>
              <p>Información veraz y responsabilidad del usuario.</p>
            </div>
            
            <div class="legal-item">
              <h4>Uso permitido</h4>
              <p>Uso educativo personal únicamente.</p>
            </div>
            
            <div class="legal-item">
              <h4>Cancelación y suspensión</h4>
              <p>La cuenta puede suspenderse por incumplimiento.</p>
            </div>
            
            <div class="legal-item">
              <h4>Modificaciones del servicio</h4>
              <p>El servicio puede modificarse o suspenderse.</p>
            </div>
          </div>
        </section>

        <!-- Política de Privacidad -->
        <section class="support__section">
          <div class="section-subheader">
            <h3>📌 Política de Privacidad y Datos Personales</h3>
          </div>
          
          <div class="legal-content">
            <div class="legal-item">
              <h4>Recolección de datos</h4>
              <p>Datos personales y académicos para prestar el servicio.</p>
            </div>
            
            <div class="legal-item">
              <h4>Uso de la información</h4>
              <p>Gestión de cuenta, comunicaciones y obligaciones legales.</p>
            </div>
            
            <div class="legal-item">
              <h4>Compartición de datos</h4>
              <p>Solo con proveedores bajo confidencialidad.</p>
            </div>
            
            <div class="legal-item">
              <h4>Derechos del titular</h4>
              <p>Acceso, rectificación y supresión de datos (Ley 1581).</p>
            </div>
            
            <div class="legal-item">
              <h4>Cookies</h4>
              <p>Cookies esenciales y analíticas.</p>
            </div>
          </div>
        </section>

        <!-- Certificados y Validez Legal -->
        <section class="support__section">
          <div class="section-subheader">
            <h3>📌 Certificados y Validez Legal</h3>
          </div>
          
          <div class="legal-content">
            <div class="legal-item">
              <h4>Naturaleza de los certificados</h4>
              <p>Certificados digitales de participación y aprobación.</p>
            </div>
            
            <div class="legal-item">
              <h4>Validez</h4>
              <p>Constancia válida para empresas privadas.</p>
            </div>
            
            <div class="legal-item">
              <h4>Autenticidad</h4>
              <p>Código único, QR y firma digital.</p>
            </div>
            
            <div class="legal-item">
              <h4>Reemisión</h4>
              <p>Gratuita si hay errores imputables a la plataforma.</p>
            </div>
          </div>
        </section>

        <!-- Propiedad Intelectual -->
        <section class="support__section">
          <div class="section-subheader">
            <h3>📌 Propiedad Intelectual</h3>
          </div>
          
          <div class="legal-content">
            <div class="legal-item">
              <h4>Derechos de autor</h4>
              <p>Contenido protegido por derechos de autor.</p>
            </div>
            
            <div class="legal-item">
              <h4>Licencia limitada</h4>
              <p>Uso personal y educativo.</p>
            </div>
            
            <div class="legal-item">
              <h4>Prohibiciones</h4>
              <p>Prohibida reproducción o uso comercial.</p>
            </div>
          </div>
        </section>

        <!-- Legislación Aplicable -->
        <section class="support__section">
          <div class="section-subheader">
            <h3>📌 Legislación Aplicable</h3>
          </div>
          
          <div class="legal-content">
            <div class="legal-item">
              <h4>Jurisdicción</h4>
              <p>Leyes de la República de Colombia.</p>
            </div>
            
            <div class="legal-item">
              <h4>Resolución de controversias</h4>
              <p>Conciliación y jueces de Bogotá D.C.</p>
            </div>
            
            <div class="legal-item">
              <h4>Vigencia</h4>
              <p>Última actualización: 20 de diciembre de 2025.</p>
            </div>
          </div>
        </section>

        <div class="legal-footer">
          <p><strong>Última actualización:</strong> 20 de diciembre de 2025</p>
          <button class="btn btn--primary" @click="downloadTerms">Descargar Términos Completos</button>
        </div>
      </div>

      <!-- TAB: CONTACTO DIRECTO -->
      <div v-if="activeTab === 'directo'" id="directo" role="tabpanel" class="tab-content">
        <div class="section-header">
          <h2>Contacto Directo</h2>
          <p>Envíanos tu consulta o reporte directamente</p>
        </div>

        <div class="contact-form-container">
          <form @submit.prevent="submitContactForm" class="contact-form">
            <div class="form-group">
              <label for="contact-type">Tipo de consulta *</label>
              <select id="contact-type" v-model="contactForm.type" required @change="handleTypeChange">
                <option value="">Seleccionar...</option>
                <option value="soporte">Soporte Técnico</option>
                <option value="academico">Consulta Académica</option>
                <option value="facturacion">Facturación/Pagos</option>
                <option value="pqr">PQR (Petición, Queja o Reclamo)</option>
                <option value="reporte_error">Reporte de Error</option>
                <option value="reporte_curso">Reporte de Problema con Curso</option>
                <option value="reporte_certificado">Reporte de Problema con Certificado</option>
                <option value="otro">Otro</option>
              </select>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="contact-name">Nombre completo *</label>
                <input id="contact-name" v-model="contactForm.name" type="text" required>
              </div>
              
              <div class="form-group">
                <label for="contact-email">Correo electrónico *</label>
                <input id="contact-email" v-model="contactForm.email" type="email" required>
              </div>
            </div>

            <div v-if="showPhoneField" class="form-group">
              <label for="contact-phone">Teléfono de contacto</label>
              <input id="contact-phone" v-model="contactForm.phone" type="tel" placeholder="+57 123 456 7890">
            </div>

            <div class="form-group">
              <label for="contact-subject">Asunto *</label>
              <input id="contact-subject" v-model="contactForm.subject" type="text" required>
            </div>

            <div class="form-group">
              <label for="contact-message">Descripción detallada *</label>
              <textarea 
                id="contact-message" 
                v-model="contactForm.message" 
                rows="6" 
                :placeholder="messagePlaceholder" 
                required
              ></textarea>
            </div>

            <div class="form-group">
              <label for="contact-urgency">Nivel de urgencia</label>
              <select id="contact-urgency" v-model="contactForm.urgency">
                <option value="baja">Baja - Puede esperar varios días</option>
                <option value="media" selected>Media - Resolver en 24-48 horas</option>
                <option value="alta">Alta - Necesita atención inmediata</option>
                <option value="critica">Crítica - Bloquea funcionalidad esencial</option>
              </select>
            </div>

            <div class="form-group">
              <label for="contact-file">Adjuntar archivo (opcional)</label>
              <input id="contact-file" type="file" @change="handleFileUpload">
              <small class="file-info">Máximo 10MB. Formatos: PDF, JPG, PNG, DOC, DOCX</small>
            </div>

            <div class="form-actions">
              <button type="button" class="btn btn--ghost" @click="resetForm">Cancelar</button>
              <button type="submit" class="btn btn--primary" :disabled="isSubmitting">
                {{ isSubmitting ? 'Enviando...' : getSubmitButtonText() }}
              </button>
            </div>
          </form>

          <div class="contact-info-sidebar">
            <h3>Información de contacto</h3>
            <div class="contact-detail">
              <span class="contact-icon">📧</span>
              <div>
                <strong>Correo electrónico</strong>
                <p>soporte@tuempresa.com</p>
                <small>Para consultas generales</small>
              </div>
            </div>
            
            <div class="contact-detail">
              <span class="contact-icon">📧</span>
              <div>
                <strong>PQR</strong>
                <p>pqr@tuempresa.com</p>
                <small>Peticiones, Quejas y Reclamos</small>
              </div>
            </div>
            
            <div class="contact-detail">
              <span class="contact-icon">📱</span>
              <div>
                <strong>WhatsApp</strong>
                <p>+57 123 456 789</p>
                <small>Solo mensajes de texto</small>
              </div>
            </div>
            
            <div class="contact-detail">
              <span class="contact-icon">🕐</span>
              <div>
                <strong>Horarios de atención</strong>
                <p>Lunes a viernes: 8:00 AM - 6:00 PM</p>
                <small>Hora Colombia</small>
              </div>
            </div>
            
            <div class="contact-detail">
              <span class="contact-icon">⏱️</span>
              <div>
                <strong>Tiempos de respuesta</strong>
                <p>24 horas hábiles para consultas</p>
                <p>15 días hábiles para PQR</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'

// Estado principal
const activeTab = ref('contacto')
const activeFAQ = ref(null)
const isSubmitting = ref(false)
const showPhoneField = ref(false)

// Formulario de contacto
const contactForm = reactive({
  type: '',
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
  urgency: 'media',
  file: null
})

// Tabs de navegación
const tabs = [
  { id: 'contacto', label: 'Soporte y Contacto', icon: '📞' },
  { id: 'ayuda', label: 'Ayuda y FAQ', icon: '❓' },
  { id: 'terminos', label: 'Términos y Políticas', icon: '📜' },
  { id: 'directo', label: 'Contacto Directo', icon: '✉️' }
]

// FAQ Data - Actualizado según tu información
const faqs = {
  cuenta: [
    { id: 'cuenta1', question: '¿Cómo crear una cuenta?', answer: 'Haz clic en "Registrarse" y completa el formulario con tus datos.' },
    { id: 'cuenta2', question: '¿Cómo confirmar mi correo?', answer: 'Revisa tu bandeja de entrada y haz clic en el enlace de confirmación.' },
    { id: 'cuenta3', question: '¿Cómo iniciar sesión?', answer: 'Ingresa tu email y contraseña en la página de login.' },
    { id: 'cuenta4', question: '¿Cómo recuperar mi contraseña?', answer: 'Haz clic en "Olvidé mi contraseña" y sigue las instrucciones.' },
    { id: 'cuenta5', question: '¿Cómo cambiar mis datos personales?', answer: 'Ve a tu perfil y edita la información en la sección correspondiente.' },
    { id: 'cuenta6', question: '¿Cómo cerrar sesión?', answer: 'Haz clic en tu avatar y selecciona "Cerrar sesión".' },
    { id: 'cuenta7', question: '¿Cómo eliminar o desactivar mi cuenta?', answer: 'Contacta soporte para solicitar la desactivación. Las cuentas eliminadas no se pueden recuperar.' }
  ],
  cursos: [
    { id: 'curso1', question: '¿Cómo registrarme en un curso?', answer: 'Selecciona el curso y haz clic en "Inscribirse".' },
    { id: 'curso2', question: '¿Cómo acceder a mis cursos?', answer: 'Ve a "Mis Cursos" en tu dashboard.' },
    { id: 'curso3', question: '¿Cuándo inicia un curso?', answer: 'Revisa la fecha de inicio en la descripción del curso.' },
    { id: 'curso4', question: '¿Los cursos tienen horarios?', answer: 'La mayoría son asincrónicos, pero algunos tienen sesiones en vivo.' },
    { id: 'curso5', question: '¿Puedo inscribirme en varios cursos?', answer: 'Sí, no hay límite.' },
    { id: 'curso6', question: '¿Qué pasa si no termino un curso?', answer: 'Puedes retomarlo más tarde o inscribirte nuevamente.' },
    { id: 'curso7', question: '¿Cómo ver mi progreso?', answer: 'En la barra de progreso dentro del curso.' }
  ],
  evaluaciones: [
    { id: 'eval1', question: '¿Cómo presentar evaluaciones?', answer: 'Accede al módulo de evaluación y envía tus respuestas.' },
    { id: 'eval2', question: '¿Cuántas oportunidades tengo para aprobar?', answer: 'Generalmente 3 intentos por evaluación.' },
    { id: 'eval3', question: '¿Qué pasa si pierdo una evaluación?', answer: 'Puedes intentarlo nuevamente hasta agotar los intentos.' },
    { id: 'eval4', question: '¿Cómo se califican las actividades?', answer: 'Por rubricas definidas por el instructor.' },
    { id: 'eval5', question: '¿Puedo repetir una evaluación?', answer: 'Sí, dentro de los intentos permitidos.' }
  ],
  certificados: [
    { id: 'cert1', question: '¿Cómo solicitar mi certificado?', answer: 'Se emite automáticamente al completar el curso.' },
    { id: 'cert2', question: '¿Cuándo se emite el certificado?', answer: 'Inmediatamente después de aprobar todas las evaluaciones.' },
    { id: 'cert3', question: 'Requisitos para obtener el certificado', answer: 'Completar el 100% del curso y aprobar evaluaciones.' },
    { id: 'cert4', question: '¿Cómo descargar mi certificado?', answer: 'Desde "Mis Certificados" en tu perfil.' },
    { id: 'cert5', question: '¿Puedo volver a descargarlo?', answer: 'Sí, en cualquier momento.' },
    { id: 'cert6', question: '¿Qué hago si mi certificado tiene errores?', answer: 'Contacta soporte con detalles.' },
    { id: 'cert7', question: '¿Cómo validar un certificado?', answer: 'Usa el código QR o ingresa el ID en nuestra herramienta de validación.' }
  ],
  pagos: [
    { id: 'pago1', question: '¿Qué medios de pago existen?', answer: 'Tarjetas de crédito, PSE, transferencias bancarias.' },
    { id: 'pago2', question: '¿Es seguro pagar?', answer: 'Sí, usamos encriptación SSL y proveedores certificados.' },
    { id: 'pago3', question: '¿Cómo ver mis pagos?', answer: 'En "Historial de Pagos" en tu perfil.' },
    { id: 'pago4', question: '¿Puedo pedir reembolso?', answer: 'Sí, dentro de 7 días si no has iniciado el curso.' },
    { id: 'pago5', question: '¿Qué pasa si mi pago falla?', answer: 'Intenta nuevamente o contacta soporte.' }
  ],
  tecnicos: [
    { id: 'tec1', question: 'La plataforma no carga', answer: 'Verifica tu conexión a internet o borra caché del navegador.' },
    { id: 'tec2', question: 'Problemas con videos', answer: 'Asegúrate de tener un navegador actualizado y buena conexión.' },
    { id: 'tec3', question: 'Error al descargar material', answer: 'Intenta con otro navegador o contacta soporte.' },
    { id: 'tec4', question: 'Navegadores compatibles', answer: 'Chrome, Firefox, Edge (versiones recientes).' },
    { id: 'tec5', question: 'Requisitos mínimos del sistema', answer: 'Windows 10+, macOS 11+, 4GB RAM, conexión estable.' }
  ]
}

// Computed para placeholders dinámicos
const messagePlaceholder = computed(() => {
  if (contactForm.type.includes('reporte')) {
    return 'Describe el problema con detalle: qué sucedió, cuándo, cómo reproducirlo, qué esperabas que pasara, y qué pasó en su lugar...'
  } else if (contactForm.type === 'pqr') {
    return 'Describe tu petición, queja o reclamo con todos los detalles necesarios, incluyendo fechas, personas involucradas y documentos de soporte si los tienes...'
  }
  return 'Describe tu consulta con detalle...'
})

// Métodos
const toggleFAQ = (id) => {
  activeFAQ.value = activeFAQ.value === id ? null : id
}

const handleTypeChange = () => {
  // Mostrar campo de teléfono para PQR y reportes críticos
  showPhoneField.value = ['pqr', 'reporte_error', 'facturacion'].includes(contactForm.type)
  
  // Generar asunto automático basado en el tipo
  if (contactForm.type && !contactForm.subject) {
    const typeMap = {
      'soporte': 'Solicitud de Soporte Técnico',
      'academico': 'Consulta Académica',
      'facturacion': 'Consulta sobre Facturación/Pagos',
      'pqr': 'PQR - ',
      'reporte_error': 'Reporte de Error Técnico',
      'reporte_curso': 'Reporte de Problema con Curso',
      'reporte_certificado': 'Reporte de Problema con Certificado',
      'otro': 'Consulta General'
    }
    contactForm.subject = typeMap[contactForm.type] || 'Consulta'
  }
}

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    if (file.size > 10 * 1024 * 1024) {
      alert('El archivo es demasiado grande. Máximo 10MB.')
      return
    }
    contactForm.file = file
  }
}

const getSubmitButtonText = () => {
  if (contactForm.type.includes('reporte')) {
    return 'Enviar Reporte'
  } else if (contactForm.type === 'pqr') {
    return 'Radicar PQR'
  }
  return 'Enviar Consulta'
}

const resetForm = () => {
  Object.keys(contactForm).forEach(key => {
    if (key !== 'urgency') contactForm[key] = ''
  })
  contactForm.urgency = 'media'
  contactForm.file = null
  showPhoneField.value = false
}

const submitContactForm = async () => {
  isSubmitting.value = true
  
  // Validaciones adicionales
  if (contactForm.type === 'pqr' && !contactForm.phone) {
    alert('Para radicar una PQR es necesario proporcionar un número de teléfono de contacto.')
    isSubmitting.value = false
    return
  }
  
  // Simulación de envío
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  console.log('Formulario enviado:', contactForm)
  
  // Mensajes personalizados según el tipo
  const successMessages = {
    'soporte': 'Tu solicitud de soporte ha sido enviada. Te responderemos en máximo 24 horas hábiles.',
    'academico': 'Tu consulta académica ha sido enviada. Te responderemos en máximo 24 horas hábiles.',
    'facturacion': 'Tu consulta sobre facturación ha sido enviada. Te responderemos en máximo 24 horas hábiles.',
    'pqr': 'Tu PQR ha sido radicada exitosamente. Recibirás un número de radicado por email en las próximas horas.',
    'reporte_error': 'Tu reporte de error ha sido enviado. Nuestro equipo técnico lo revisará pronto.',
    'reporte_curso': 'Tu reporte sobre el curso ha sido enviado. El equipo académico lo revisará pronto.',
    'reporte_certificado': 'Tu reporte sobre el certificado ha sido enviado. Lo revisaremos y te contactaremos.',
    'otro': 'Tu consulta ha sido enviada. Te responderemos en máximo 24 horas hábiles.'
  }
  
  alert(successMessages[contactForm.type] || 'Tu consulta ha sido enviada. Te responderemos pronto.')
  
  resetForm()
  isSubmitting.value = false
}

const downloadTerms = () => {
  alert('Descargando términos y condiciones...')
  // Implementar descarga real
}
</script>

<style scoped>
.support {
  display: grid;
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem;
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
}

.support * {
  box-sizing: border-box;
  max-width: 100%;
}

/* Encabezado con degradado morado-naranja */
.support__header {
  text-align: center;
  padding: 2.5rem 1rem;
  background: linear-gradient(135deg, var(--color-morado), #ff6b35, #ffa62e);
  border-radius: var(--border-radius-3);
  color: var(--color-blanco);
  position: relative;
  overflow: hidden;
  width: 100%;
}

.support__header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%);
  pointer-events: none;
}

.support__title {
  margin: 0 0 0.5rem;
  font-size: clamp(2rem, 4vw, 2.5rem);
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.support__subtitle {
  margin: 0;
  opacity: 0.95;
  font-size: 1.1rem;
  max-width: 600px;
  margin: 0 auto;
}

/* Tabs */
.support__tabs {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  border-bottom: 1px solid var(--color-light);
  padding-bottom: 0.5rem;
  scrollbar-width: thin;
  scrollbar-color: var(--color-light) transparent;
  -webkit-overflow-scrolling: touch;
}

.support__tabs::-webkit-scrollbar {
  height: 4px;
}

.support__tabs::-webkit-scrollbar-track {
  background: transparent;
}

.support__tabs::-webkit-scrollbar-thumb {
  background-color: var(--color-light);
  border-radius: 20px;
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
  font-weight: 600;
  min-width: max-content;
  flex-shrink: 0;
  justify-content: center;
}

.support__tab:hover {
  color: var(--color-morado);
  background: rgba(124, 58, 237, 0.05);
}

.support__tab.is-active {
  color: var(--color-morado);
  border-bottom: 3px solid var(--color-morado);
  background: rgba(124, 58, 237, 0.1);
}

.support__tab-icon {
  font-size: 1.2rem;
}

/* Contenido */
.support__content {
  background: var(--color-blanco);
  border-radius: var(--border-radius-3);
  box-shadow: var(--box-shadow);
  padding: 2rem;
  overflow-x: hidden;
  width: 100%;
  box-sizing: border-box;
}

.tab-content {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Headers */
.section-header {
  text-align: left;
  margin: 0 0 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--color-light);
  width: 100%;
}

.section-header h2 {
  margin: 0 0 .5rem;
  color: var(--color-oscuro);
  font-size: clamp(1.6rem, 3vw, 2.1rem);
}

.section-header p {
  margin: 0;
  color: var(--color-oscuro-variante);
  font-size: 1.1rem;
}

.section-subheader {
  margin-bottom: 1.5rem;
  width: 100%;
}

.section-subheader h3 {
  margin: 0;
  color: var(--color-oscuro);
  font-size: 1.3rem;
}

/* Secciones */
.support__section {
  margin-bottom: 2.5rem;
  width: 100%;
}

/* Grids */
.channels-grid,
.info-grid,
.pqr-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
  width: 100%;
}

.channel-card,
.info-card {
  background: var(--color-blanco);
  border: 1px solid var(--color-light);
  border-radius: var(--border-radius-2);
  padding: 1.5rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  width: 100%;
}

.channel-card:hover,
.info-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--box-shadow);
}

.info-card.warning {
  border-left: 4px solid #f59e0b;
  background: #fffbeb;
}

.channel-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.channel-card h4,
.info-card h4 {
  margin: 0 0 0.5rem;
  color: var(--color-oscuro);
}

.channel-card p,
.info-card p {
  margin: 0;
  color: var(--color-oscuro-variante);
  line-height: 1.5;
}

/* FAQ */
.faq-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
}

.faq-question {
  border: 1px solid var(--color-light);
  border-radius: var(--border-radius-2);
  overflow: hidden;
  cursor: pointer;
  width: 100%;
}

.faq-question__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: var(--color-blanco);
  transition: background-color 0.2s ease;
  width: 100%;
}

.faq-question__header:hover {
  background: #f8fafc;
}

.faq-question__header h4 {
  margin: 0;
  color: var(--color-oscuro);
  font-size: 1rem;
  font-weight: 600;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}

.faq-toggle {
  font-size: 1.2rem;
  font-weight: bold;
  color: var(--color-morado);
  flex-shrink: 0;
}

.faq-answer {
  padding: 1rem 1.5rem;
  background: #f8fafc;
  border-top: 1px solid var(--color-light);
  width: 100%;
}

.faq-answer p {
  margin: 0;
  color: var(--color-oscuro-variante);
  line-height: 1.6;
}

/* Contenido Legal */
.legal-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
}

.legal-item {
  padding: 1rem;
  background: #f8fafc;
  border-radius: var(--border-radius-2);
  border-left: 3px solid var(--color-morado);
  width: 100%;
}

.legal-item h4 {
  margin: 0 0 0.5rem;
  color: var(--color-oscuro);
  font-size: 1rem;
}

.legal-item p {
  margin: 0;
  color: var(--color-oscuro-variante);
  line-height: 1.5;
}

.legal-footer {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-light);
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  flex-wrap: wrap;
}

/* Formulario de Contacto */
.contact-form-container {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 2rem;
  width: 100%;
  overflow: hidden;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
  max-width: 100%;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  width: 100%;
}

.form-group {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.form-group label {
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--color-oscuro);
  width: 100%;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--color-light);
  border-radius: var(--border-radius-2);
  background: var(--color-blanco);
  color: var(--color-oscuro);
  font-family: inherit;
  font-size: 1rem;
  transition: border-color 0.2s ease;
  box-sizing: border-box;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--color-morado);
  box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
}

.form-group textarea {
  resize: vertical;
  min-height: 120px;
  width: 100%;
}

.form-group input[type="file"] {
  padding: 0.5rem;
  background: #f8fafc;
  border: 1px dashed var(--color-light);
  cursor: pointer;
  width: 100%;
}

.form-group input[type="file"]:hover {
  border-color: var(--color-morado);
  background: rgba(124, 58, 237, 0.05);
}

.file-info {
  margin-top: 0.25rem;
  color: var(--color-oscuro-variante);
  font-size: 0.875rem;
  display: block;
  width: 100%;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
  width: 100%;
}

/* Sidebar de Contacto */
.contact-info-sidebar {
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
  border-radius: var(--border-radius-2);
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
  align-self: start;
  position: sticky;
  top: 2rem;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

.contact-info-sidebar h3 {
  margin: 0 0 1.5rem;
  color: var(--color-oscuro);
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--color-light);
  width: 100%;
}

.contact-detail {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  align-items: flex-start;
  padding: 0.75rem;
  border-radius: var(--border-radius-1);
  transition: background-color 0.2s ease;
  width: 100%;
}

.contact-detail:hover {
  background: rgba(124, 58, 237, 0.05);
}

.contact-icon {
  font-size: 1.5rem;
  color: var(--color-morado);
  flex-shrink: 0;
}

.contact-detail div {
  flex: 1;
  min-width: 0;
}

.contact-detail strong {
  display: block;
  margin-bottom: 0.25rem;
  color: var(--color-oscuro);
  font-size: 0.9rem;
}

.contact-detail p {
  margin: 0 0 0.25rem;
  color: var(--color-oscuro-variante);
  font-size: 0.9rem;
  line-height: 1.4;
}

.contact-detail small {
  color: #94a3b8;
  font-size: 0.8rem;
}

/* Botones */
.btn {
  padding: 0.75rem 1.5rem;
  border-radius: var(--border-radius-2);
  border: 1px solid transparent;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  text-align: center;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: auto;
  min-width: 120px;
}

.btn:hover:not(:disabled) {
  transform: translateY(-1px);
  filter: brightness(.98);
}

.btn--primary {
  background: linear-gradient(135deg, var(--color-morado), #6d28d9);
  color: var(--color-blanco);
  border: none;
}

.btn--ghost {
  background: transparent;
  border-color: var(--color-light);
  color: var(--color-oscuro);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Responsive */
@media (max-width: 768px) {
  .contact-form-container {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .form-row {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .contact-info-sidebar {
    position: static;
    order: -1;
    margin-bottom: 1rem;
  }
  
  .form-group input,
  .form-group select,
  .form-group textarea {
    max-width: 100%;
    min-width: 0;
  }
  
  .form-actions {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .btn {
    width: 100%;
    justify-content: center;
  }
  
  .channels-grid,
  .info-grid,
  .pqr-info {
    grid-template-columns: 1fr;
  }
  
  .support__content {
    padding: 1.5rem;
  }
  
  .legal-footer {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .support__tab {
    padding: 0.75rem 1rem;
    font-size: 0.9rem;
  }
  
  .support__tab-icon {
    font-size: 1rem;
  }
  
  .support__content {
    padding: 1rem;
  }
  
  .contact-form-container {
    gap: 1rem;
  }
  
  .contact-form {
    gap: 1rem;
  }
  
  .form-group input,
  .form-group select,
  .form-group textarea {
    padding: 0.6rem;
    font-size: 0.95rem;
  }
  
  .contact-info-sidebar {
    padding: 1rem;
  }
  
  .btn {
    min-width: 100%;
  }
}
</style>