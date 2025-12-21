<template>
  <main class="profile" aria-describedby="profile-intro">
    <!-- Importar el Header como componente -->
    <ProfileHeader 
      :user="user" 
      :avatar-src="avatarSrc" 
      @change-avatar="handleAvatarChange"
      :is-estudiante="true"
      :is-admin="false"
    />

    <!-- ===== NAVEGACIÓN DE TABS (Scroll horizontal en mobile) ===== -->
    <nav class="profile__tabs" role="tablist" aria-label="Secciones del perfil">
      <button 
        v-for="tab in tabs" 
        :key="tab.id" 
        class="profile__tab" 
        :class="{ 'is-active': activeTab === tab.id }"
        @click="activeTab = tab.id" 
        role="tab" 
        :aria-selected="activeTab === tab.id" 
        :aria-controls="tab.id"
      >
        <span class="profile__tab-icon">{{ tab.icon }}</span>
        <span class="profile__tab-label">{{ tab.label }}</span>
      </button>
    </nav>

    <!-- ===== CONTENIDO DE TABS ===== -->
    <section class="profile__content">
      <!-- TAB: PERFIL MEJORADO -->
      <div v-if="activeTab === 'perfil'" id="perfil" role="tabpanel" class="tab-content">
        <header class="section-header">
          <h2>Información Personal</h2>
          <p>Actualiza tus datos personales</p>
        </header>
        
        <div class="profile__form-container">
          <form class="profile__form" @submit.prevent="updateProfile">
            <div class="form-section">
              <h3 class="form-section__title">Datos Personales</h3>
              <div class="form-grid">
                <div class="form-group">
                  <label for="nombre" class="form-label">
                    Nombre <span class="required">*</span>
                  </label>
                  <input 
                    id="nombre" 
                    v-model="editedUser.firstName" 
                    type="text" 
                    class="form-input"
                    required 
                    @input="checkChanges"
                    placeholder="Tu nombre"
                  />
                </div>
                
                <div class="form-group">
                  <label for="apellido" class="form-label">
                    Apellido <span class="required">*</span>
                  </label>
                  <input 
                    id="apellido" 
                    v-model="editedUser.lastName" 
                    type="text" 
                    class="form-input"
                    required 
                    @input="checkChanges"
                    placeholder="Tu apellido"
                  />
                </div>
                
                <div class="form-group">
                  <label for="telefono" class="form-label">Teléfono</label>
                  <input 
                    id="telefono" 
                    v-model="editedUser.phone" 
                    type="tel" 
                    class="form-input"
                    @input="checkChanges"
                    placeholder="+57 123 456 7890"
                  />
                </div>
                
                <div class="form-group">
                  <label for="correo" class="form-label">Correo electrónico</label>
                  <input 
                    id="correo" 
                    v-model="editedUser.email" 
                    type="email" 
                    class="form-input"
                    @input="checkChanges"
                    placeholder="tu@email.com"
                  />
                  <div class="form-help">Usamos tu correo para notificaciones importantes</div>
                </div>
              </div>
            </div>
            
            <div class="form-section">
              <h3 class="form-section__title">Localización</h3>
              <div class="form-grid">
                <div class="form-group">
                  <label for="pais" class="form-label">
                    País <span class="required">*</span>
                  </label>
                  <select 
                    id="pais" 
                    v-model="editedUser.country" 
                    class="form-select"
                    required 
                    @change="checkChanges"
                  >
                    <option value="">Seleccionar país</option>
                    <option value="Colombia">Colombia</option>
                    <option value="México">México</option>
                    <option value="Argentina">Argentina</option>
                    <option value="España">España</option>
                    <option value="Estados Unidos">Estados Unidos</option>
                    <option value="Perú">Perú</option>
                    <option value="Chile">Chile</option>
                    <option value="Ecuador">Ecuador</option>
                  </select>
                </div>
                
                <div class="form-group">
                  <label for="estado" class="form-label">
                    Departamento/Estado <span class="required">*</span>
                  </label>
                  <select 
                    id="estado" 
                    v-model="editedUser.state" 
                    class="form-select"
                    required 
                    @change="checkChanges"
                  >
                    <option value="">Seleccionar departamento</option>
                    <option value="Tolima">Tolima</option>
                    <option value="Bogotá D.C.">Bogotá D.C.</option>
                    <option value="Antioquia">Antioquia</option>
                    <option value="Valle del Cauca">Valle del Cauca</option>
                    <option value="Santander">Santander</option>
                    <option value="Cundinamarca">Cundinamarca</option>
                    <option value="Atlántico">Atlántico</option>
                    <option value="Bolívar">Bolívar</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div class="form-section">
              <h3 class="form-section__title">Seguridad</h3>
              <div class="account-settings">
                <div class="account-setting">
                  <div class="account-setting__info">
                    <h4>Contraseña</h4>
                    <p>Cambia tu contraseña regularmente para mayor seguridad</p>
                  </div>
                  <button 
                    type="button" 
                    class="btn btn--outline"
                    @click="showPasswordModal = true"
                  >
                    Cambiar contraseña
                  </button>
                </div>
              </div>
            </div>
            
            <div class="form-actions">
              <button 
                type="button" 
                class="btn btn--ghost"
                @click="resetForm"
                :disabled="!hasChanges"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                class="btn btn--primary"
                :disabled="!hasChanges"
                :class="{ 'btn--loading': isSaving }"
              >
                <span v-if="isSaving">Guardando...</span>
                <span v-else>Guardar Cambios</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- TAB: CURSOS COMPLETADOS -->
      <div v-if="activeTab === 'cursos-completados'" id="cursos-completados" role="tabpanel" class="tab-content">
        <header class="section-header">
          <h2>Cursos Completados</h2>
          <p>Certificados de los cursos que has finalizado</p>
        </header>
        
        <div class="certificates-container">
          <div v-if="sortedCertificates.length > 0" class="certificates-grid">
            <div 
              v-for="certificate in sortedCertificates" 
              :key="certificate.id" 
              class="certificate-card"
            >
              <div class="certificate-card__header">
                <span class="certificate-card__date">{{ certificate.date }}</span>
                <span class="certificate-card__status">✅ Completado</span>
              </div>
              
              <div class="certificate-card__content">
                <div class="certificate-card__info">
                  <h3 class="certificate-card__title">{{ certificate.title }}</h3>
                  <p class="certificate-card__description">{{ certificate.description }}</p>
                  
                  <div class="certificate-card__details">
                    <div class="detail">
                      <span class="detail__label">Duración:</span>
                      <span class="detail__value">{{ certificate.duration }}</span>
                    </div>
                    <div class="detail">
                      <span class="detail__label">Calificación:</span>
                      <span class="detail__value grade" :class="`grade--${certificate.gradeLevel}`">
                        {{ certificate.grade }}
                      </span>
                    </div>
                    <div class="detail">
                      <span class="detail__label">Código:</span>
                      <code class="detail__value code">{{ certificate.code }}</code>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="certificate-card__actions">
                <button 
                  class="btn btn--primary btn--sm"
                  @click="viewCertificate(certificate)"
                >
                  <span class="btn-icon">👁️</span>
                  Ver Certificado
                </button>
              </div>
            </div>
          </div>
          
          <div v-else class="empty-state">
            <div class="empty-state__icon">📚</div>
            <h3 class="empty-state__title">Aún no has completado cursos</h3>
            <p class="empty-state__description">
              Comienza tu primer curso y obtén tu certificado
            </p>
            <button class="btn btn--primary">
              Explorar Cursos
            </button>
          </div>
        </div>
      </div>

      <!-- TAB: HISTORIAL -->
      <div v-if="activeTab === 'historial'" id="historial" role="tabpanel" class="tab-content">
        <header class="section-header">
          <h2>Historial de Aprendizaje</h2>
          <p>Sigue tu progreso en los cursos</p>
        </header>
        
        <div class="history-container">
          <div class="history-stats">
            <div class="history-stat-card">
              <div class="stat-icon">📚</div>
              <div class="stat-content">
                <div class="stat-value">{{ totalCourses }}</div>
                <div class="stat-label">Cursos Totales</div>
              </div>
            </div>
          </div>
          
          <div class="progress-overview">
            <h3 class="section-title">Progreso General</h3>
            <div class="progress-chart">
              <div class="progress-item" v-for="course in progressCourses" :key="course.id">
                <div class="progress-item__header">
                  <h4>{{ course.title }}</h4>
                  <span class="progress-percentage">{{ course.progress }}%</span>
                </div>
                <div class="progress-bar">
                  <div 
                    class="progress-bar__fill" 
                    :style="{ width: `${course.progress}%` }"
                    :class="`progress-bar__fill--${course.status}`"
                  ></div>
                </div>
                <div class="progress-item__footer">
                  <span class="progress-status" :class="`status--${course.status}`">
                    {{ course.status === 'completed' ? 'Completado' : 
                       course.status === 'in-progress' ? 'En progreso' : 'Pendiente' }}
                  </span>
                  <span class="progress-time">{{ course.lastActivity }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB: DESCUENTOS -->
      <div v-if="activeTab === 'descuentos'" id="descuentos" role="tabpanel" class="tab-content">
        <header class="section-header">
          <h2>Descuentos y Promociones</h2>
          <p>Códigos de descuento disponibles</p>
        </header>
        
        <div class="discounts-container">
          <div class="discounts-header">
            <div class="discounts-stats">
              <div class="stat-badge stat-badge--active">
                <span class="stat-badge__value">{{ activeDiscounts.length }}</span>
                <span class="stat-badge__label">Activos</span>
              </div>
              <div class="stat-badge stat-badge--used">
                <span class="stat-badge__value">{{ usedDiscounts.length }}</span>
                <span class="stat-badge__label">Usados</span>
              </div>
              <div class="stat-badge stat-badge--expired">
                <span class="stat-badge__value">{{ expiredDiscounts.length }}</span>
                <span class="stat-badge__label">Expirados</span>
              </div>
            </div>
          </div>
          
          <div v-if="activeDiscounts.length > 0" class="discounts-grid">
            <div 
              v-for="discount in activeDiscounts" 
              :key="discount.id" 
              class="discount-card"
            >
              <div class="discount-card__content">
                <div class="discount-card__header">
                  <h3 class="discount-card__title">{{ discount.title }}</h3>
                  <div class="discount-card__percentage">
                    {{ discount.percentage }}% OFF
                  </div>
                </div>
                
                <p class="discount-card__description">{{ discount.description }}</p>
                
                <div class="discount-card__details">
                  <div class="detail-row">
                    <span class="detail-label">Código:</span>
                    <div class="detail-value-group">
                      <code class="discount-code">{{ discount.code }}</code>
                      <button 
                        class="btn btn--xs btn--ghost"
                        @click="copyDiscountCode(discount.code)"
                        title="Copiar código"
                      >
                        <span class="btn-icon">📋</span>
                      </button>
                    </div>
                  </div>
                  
                  <div class="detail-row">
                    <span class="detail-label">Válido hasta:</span>
                    <span class="detail-value">{{ discount.validUntil }}</span>
                  </div>
                  
                  <div class="detail-row">
                    <span class="detail-label">Estado:</span>
                    <span class="detail-value status-active">Disponible</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div v-else class="empty-state">
            <div class="empty-state__icon">💸</div>
            <h3 class="empty-state__title">No tienes descuentos disponibles</h3>
            <p class="empty-state__description">
              Completa cursos o participa en actividades para ganar descuentos
            </p>
          </div>
          
          <!-- Sección de descuentos usados -->
          <div v-if="usedDiscounts.length > 0" class="discounts-section">
            <h3 class="section-title">Descuentos Usados</h3>
            <div class="used-discounts">
              <div 
                v-for="discount in usedDiscounts" 
                :key="discount.id" 
                class="used-discount-card"
              >
                <div class="used-discount-card__content">
                  <h4>{{ discount.title }}</h4>
                  <p>Código: <code>{{ discount.code }}</code> • Usado el: {{ discount.usedDate }}</p>
                </div>
                <span class="used-discount-card__status">Utilizado</span>
              </div>
            </div>
          </div>

          <!-- Sección de descuentos expirados -->
          <div v-if="expiredDiscounts.length > 0" class="discounts-section">
            <h3 class="section-title">Descuentos Expirados</h3>
            <div class="used-discounts">
              <div 
                v-for="discount in expiredDiscounts" 
                :key="discount.id" 
                class="expired-discount-card"
              >
                <div class="expired-discount-card__content">
                  <h4>{{ discount.title }}</h4>
                  <p>Código: <code>{{ discount.code }}</code> • Expiró el: {{ discount.validUntil }}</p>
                </div>
                <span class="expired-discount-card__status">Expirado</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB: TRANSCRIPCIÓN -->
      <div v-if="activeTab === 'transcripcion'" id="transcripcion" role="tabpanel" class="tab-content">
        <header class="section-header">
          <h2>Transcripción Académica</h2>
          <p>Documento oficial de tus logros académicos</p>
        </header>
        
        <div class="transcript-container">
          <div class="transcript-actions">
            <button class="btn btn--primary" @click="downloadTranscriptPDF">
              <span class="btn-icon">📄</span>
              Descargar PDF
            </button>
          </div>
          
          <div class="transcript-preview" ref="transcriptContent">
            <div class="transcript-header">
              <div class="transcript-logo">
                <img 
                  src="/src/assets/icons/LogoFondo.jpeg" 
                  alt="Logo de la empresa" 
                  class="logo-image"
                >
              </div>
              <div class="transcript-info">
                <h3>Transcripción Académica Oficial</h3>
                <div class="transcript-details">
                  <div class="detail-column">
                    <p><strong>Estudiante:</strong> {{ user.fullName }}</p>
                    <p><strong>ID Estudiante:</strong> {{ studentId }}</p>
                    <p><strong>Correo:</strong> {{ user.email }}</p>
                  </div>
                  <div class="detail-column">
                    <p><strong>Fecha de Emisión:</strong> {{ currentDate }}</p>
                    <p><strong>Estado:</strong> Activo</p>
                    <p><strong>Tipo:</strong> Educación Continua</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="transcript-summary">
              <div class="summary-card">
                <h4>Resumen Académico</h4>
                <div class="summary-grid">
                  <div class="summary-item">
                    <span class="summary-label">Promedio General:</span>
                    <span class="summary-value grade--a">{{ averageGrade }}/5.0</span>
                  </div>
                  <div class="summary-item">
                    <span class="summary-label">Cursos Completados:</span>
                    <span class="summary-value">{{ completedCourses }}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="transcript-table-container">
              <h4>Detalle de Cursos</h4>
              <div class="transcript-table">
                <table>
                  <thead>
                    <tr>
                      <th>Código</th>
                      <th>Curso</th>
                      <th>Fecha</th>
                      <th>Estado</th>
                      <th>Calificación</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="course in transcriptCourses" :key="course.id">
                      <td>{{ course.code }}</td>
                      <td class="course-name">{{ course.name }}</td>
                      <td>{{ course.date }}</td>
                      <td>
                        <span class="status-badge" :class="`status-badge--${course.status}`">
                          {{ course.status === 'approved' ? 'Aprobado' : 'En curso' }}
                        </span>
                      </td>
                      <td>
                        <span class="grade" :class="`grade--${course.gradeLevel}`">
                          {{ course.grade }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <div class="transcript-footer">
              <div class="footer-section">
                <h5>Leyenda de Calificaciones</h5>
                <div class="grade-legend">
                  <div class="legend-item">
                    <span class="legend-color grade--a"></span>
                    <span>4.5 - 5.0: Excelente (A)</span>
                  </div>
                  <div class="legend-item">
                    <span class="legend-color grade--b"></span>
                    <span>4.0 - 4.4: Bueno (B)</span>
                  </div>
                  <div class="legend-item">
                    <span class="legend-color grade--c"></span>
                    <span>3.5 - 3.9: Aceptable (C)</span>
                  </div>
                </div>
              </div>
              
              <div class="disclaimer">
                <p>
                  <strong>Nota:</strong> Este documento es emitido electrónicamente y tiene validez oficial.
                  Cualquier modificación o alteración invalida su autenticidad.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Modal Cambio de Contraseña (iconos profesionales) -->
    <teleport to="body">
      <div v-if="showPasswordModal" class="modal-backdrop" @click.self="closePasswordModal">
        <div class="modal" role="dialog" aria-modal="true" aria-labelledby="password-modal-title">
          <header class="modal__header">
            <h3 id="password-modal-title">Cambiar Contraseña</h3>
            <button class="modal__close" @click="closePasswordModal" aria-label="Cerrar">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </header>
          <div class="modal__body">
            <form @submit.prevent="submitChangePassword" class="password-form">
              <div class="form-group">
                <label for="current-password" class="form-label">
                  Contraseña actual <span class="required">*</span>
                </label>
                <div class="password-input">
                  <input 
                    id="current-password" 
                    v-model="passwordForm.current" 
                    :type="showCurrentPassword ? 'text' : 'password'" 
                    required 
                    class="form-input"
                    placeholder="Ingresa tu contraseña actual"
                  />
                  <button 
                    type="button" 
                    class="password-toggle"
                    @click="showCurrentPassword = !showCurrentPassword"
                  >
                    <svg v-if="showCurrentPassword" width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M2 10C2 10 5 4 10 4C15 4 18 10 18 10C18 10 15 16 10 16C5 16 2 10 2 10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                      <circle cx="10" cy="10" r="3" stroke="currentColor" stroke-width="2"/>
                      <path d="M4 4L16 16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                    <svg v-else width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M2 10C2 10 5 4 10 4C15 4 18 10 18 10C18 10 15 16 10 16C5 16 2 10 2 10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                      <circle cx="10" cy="10" r="3" stroke="currentColor" stroke-width="2"/>
                    </svg>
                  </button>
                </div>
              </div>
              
              <div class="form-group">
                <label for="new-password" class="form-label">
                  Nueva contraseña <span class="required">*</span>
                </label>
                <div class="password-input">
                  <input 
                    id="new-password" 
                    v-model="passwordForm.new" 
                    :type="showNewPassword ? 'text' : 'password'" 
                    required 
                    class="form-input"
                    placeholder="Mínimo 8 caracteres"
                  />
                  <button 
                    type="button" 
                    class="password-toggle"
                    @click="showNewPassword = !showNewPassword"
                  >
                    <svg v-if="showNewPassword" width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M2 10C2 10 5 4 10 4C15 4 18 10 18 10C18 10 15 16 10 16C5 16 2 10 2 10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                      <circle cx="10" cy="10" r="3" stroke="currentColor" stroke-width="2"/>
                      <path d="M4 4L16 16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                    <svg v-else width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M2 10C2 10 5 4 10 4C15 4 18 10 18 10C18 10 15 16 10 16C5 16 2 10 2 10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                      <circle cx="10" cy="10" r="3" stroke="currentColor" stroke-width="2"/>
                    </svg>
                  </button>
                </div>
                <div class="password-strength">
                  <div 
                    class="strength-bar" 
                    :class="passwordStrengthClass"
                  ></div>
                  <span class="strength-text">{{ passwordStrengthText }}</span>
                </div>
                <ul class="password-requirements">
                  <li :class="{ 'requirement-met': passwordForm.new.length >= 8 }">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="2"/>
                      <path v-if="passwordForm.new.length >= 8" d="M5 8L7 10L11 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                    Al menos 8 caracteres
                  </li>
                  <li :class="{ 'requirement-met': /[A-Z]/.test(passwordForm.new) }">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="2"/>
                      <path v-if="/[A-Z]/.test(passwordForm.new)" d="M5 8L7 10L11 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                    Al menos una mayúscula
                  </li>
                  <li :class="{ 'requirement-met': /[0-9]/.test(passwordForm.new) }">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="2"/>
                      <path v-if="/[0-9]/.test(passwordForm.new)" d="M5 8L7 10L11 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                    Al menos un número
                  </li>
                </ul>
              </div>
              
              <div class="form-group">
                <label for="confirm-password" class="form-label">
                  Confirmar nueva contraseña <span class="required">*</span>
                </label>
                <div class="password-input">
                  <input 
                    id="confirm-password" 
                    v-model="passwordForm.confirm" 
                    :type="showConfirmPassword ? 'text' : 'password'" 
                    required 
                    class="form-input"
                    placeholder="Repite la nueva contraseña"
                  />
                  <button 
                    type="button" 
                    class="password-toggle"
                    @click="showConfirmPassword = !showConfirmPassword"
                  >
                    <svg v-if="showConfirmPassword" width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M2 10C2 10 5 4 10 4C15 4 18 10 18 10C18 10 15 16 10 16C5 16 2 10 2 10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                      <circle cx="10" cy="10" r="3" stroke="currentColor" stroke-width="2"/>
                      <path d="M4 4L16 16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                    <svg v-else width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M2 10C2 10 5 4 10 4C15 4 18 10 18 10C18 10 15 16 10 16C5 16 2 10 2 10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                      <circle cx="10" cy="10" r="3" stroke="currentColor" stroke-width="2"/>
                    </svg>
                  </button>
                </div>
                <div v-if="passwordForm.new && passwordForm.confirm" class="password-match">
                  <span :class="passwordsMatch ? 'match-success' : 'match-error'">
                    <svg v-if="passwordsMatch" width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="8" r="8" fill="#10b981"/>
                      <path d="M5 8L7 10L11 6" stroke="white" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                    <svg v-else width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="8" r="8" fill="#ef4444"/>
                      <path d="M6 6L10 10M10 6L6 10" stroke="white" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                    {{ passwordsMatch ? 'Las contraseñas coinciden' : 'Las contraseñas no coinciden' }}
                  </span>
                </div>
              </div>
              
              <div class="modal__actions">
                <button type="button" class="btn btn--ghost" @click="closePasswordModal">
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  class="btn btn--primary"
                  :disabled="!canSubmitPassword"
                >
                  Cambiar Contraseña
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </teleport>
  </main>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import ProfileHeader from '@/components/ProfileHeader.vue'
import html2pdf from 'html2pdf.js'

// Estado principal
const activeTab = ref('perfil')
const hasChanges = ref(false)
const isSaving = ref(false)
const showPasswordModal = ref(false)
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)
const transcriptContent = ref(null)

// Datos del usuario
const user = reactive({
  firstName: 'Juan Camilo',
  lastName: 'Pimiento Garcia',
  phone: '+57 123 456 789',
  email: 'juan@example.com',
  country: 'Colombia',
  state: 'Tolima',
  fullName: computed(() => `${user.firstName} ${user.lastName}`),
  role: 'Estudiante - Academia Deportiva'
})

const editedUser = ref({ ...user })

// Contraseña
const passwordForm = reactive({
  current: '',
  new: '',
  confirm: ''
})

// Tabs en nuevo orden
const tabs = [
  { id: 'perfil', label: 'Perfil', icon: '👤' },
  { id: 'cursos-completados', label: 'Cursos Completados', icon: '📜' },
  { id: 'historial', label: 'Historial', icon: '📊' },
  { id: 'descuentos', label: 'Descuentos', icon: '💸' },
  { id: 'transcripcion', label: 'Transcripción', icon: '📄' }
]

// Certificados (ordenados por fecha más reciente)
const certificates = reactive([
  { 
    id: 1, 
    title: 'Introduction to IoT', 
    description: 'Fundamentos de Internet de las Cosas',
    date: '20 Nov 2024',
    duration: '40 horas',
    grade: '4.8',
    gradeLevel: 'a',
    code: 'CERT-IOT-2024-001'
  },
  { 
    id: 2, 
    title: 'Python Fundamentals', 
    description: 'Programación básica con Python',
    date: '15 Oct 2024',
    duration: '35 horas',
    grade: '4.5',
    gradeLevel: 'a',
    code: 'CERT-PYTHON-2024-045'
  },
  { 
    id: 3, 
    title: 'Data Analysis with Excel', 
    description: 'Análisis de datos avanzado con Excel',
    date: '10 Sep 2024',
    duration: '30 horas',
    grade: '4.3',
    gradeLevel: 'a',
    code: 'CERT-EXCEL-2024-089'
  }
])

// Ordenar certificados por fecha (más reciente primero)
const sortedCertificates = computed(() => {
  return [...certificates].sort((a, b) => {
    return new Date(b.date) - new Date(a.date)
  })
})

// Promedio de calificaciones
const averageGrade = computed(() => {
  if (certificates.length === 0) return '0.0'
  const total = certificates.reduce((sum, cert) => {
    return sum + parseFloat(cert.grade)
  }, 0)
  return (total / certificates.length).toFixed(1)
})

// Descuentos
const activeDiscounts = reactive([
  {
    id: 1,
    title: 'Descuento por Fidelidad',
    description: 'Descuento especial por ser estudiante activo',
    percentage: 20,
    code: 'FIDELIDAD2024',
    validUntil: '31 Dic 2024'
  },
  {
    id: 2,
    title: 'Promoción de Temporada',
    description: 'Aprovecha esta promoción especial',
    percentage: 15,
    code: 'FINDEAÑO2024',
    validUntil: '25 Dic 2024'
  }
])

const usedDiscounts = reactive([
  {
    id: 3,
    title: 'Descuento de Bienvenida',
    code: 'BIENVENIDA2024',
    usedDate: '15 Ene 2024'
  }
])

const expiredDiscounts = reactive([
  {
    id: 4,
    title: 'Promoción Verano',
    code: 'VERANO2023',
    validUntil: '31 Ago 2023'
  }
])

// Historial de aprendizaje
const totalCourses = ref(8)

const progressCourses = reactive([
  {
    id: 1,
    title: 'Digital Marketing',
    progress: 75,
    status: 'in-progress',
    lastActivity: 'Hoy, 10:30 AM'
  },
  {
    id: 2,
    title: 'Web Development',
    progress: 30,
    status: 'in-progress',
    lastActivity: 'Ayer, 14:20'
  },
  {
    id: 3,
    title: 'Project Management',
    progress: 100,
    status: 'completed',
    lastActivity: '15 Nov 2024'
  }
])

// Transcripción
const studentId = ref('EST-2024-00123')
const currentDate = new Date().toLocaleDateString('es-ES', {
  day: '2-digit',
  month: 'long',
  year: 'numeric'
})

const transcriptCourses = reactive([
  {
    id: 1,
    code: 'IOT-101',
    name: 'Introduction to IoT',
    date: 'Nov 2024',
    status: 'approved',
    grade: '4.8',
    gradeLevel: 'a'
  },
  {
    id: 2,
    code: 'PYTH-101',
    name: 'Python Fundamentals',
    date: 'Oct 2024',
    status: 'approved',
    grade: '4.5',
    gradeLevel: 'a'
  },
  {
    id: 3,
    code: 'EXCEL-201',
    name: 'Data Analysis with Excel',
    date: 'Sep 2024',
    status: 'approved',
    grade: '4.3',
    gradeLevel: 'a'
  },
  {
    id: 4,
    code: 'NET-101',
    name: 'Network Fundamentals',
    date: 'Ago 2024',
    status: 'approved',
    grade: '4.0',
    gradeLevel: 'b'
  }
])

const completedCourses = computed(() => certificates.length)

// Computed para validación de contraseña
const passwordStrength = computed(() => {
  const password = passwordForm.new
  if (!password) return 0
  
  let strength = 0
  if (password.length >= 8) strength += 33
  if (/[A-Z]/.test(password)) strength += 33
  if (/[0-9]/.test(password)) strength += 34
  
  return strength
})

const passwordStrengthClass = computed(() => {
  if (passwordStrength.value < 33) return 'strength-weak'
  if (passwordStrength.value < 66) return 'strength-medium'
  return 'strength-strong'
})

const passwordStrengthText = computed(() => {
  if (passwordStrength.value < 33) return 'Débil'
  if (passwordStrength.value < 66) return 'Media'
  return 'Fuerte'
})

const passwordsMatch = computed(() => {
  return passwordForm.new && passwordForm.confirm && passwordForm.new === passwordForm.confirm
})

const canSubmitPassword = computed(() => {
  return passwordForm.current && 
         passwordForm.new && 
         passwordForm.confirm && 
         passwordStrength.value >= 66 && 
         passwordsMatch.value
})

// Avatar
const avatarSrc = ref('/src/assets/icons/LogoFondo.jpeg')

// Métodos
const checkChanges = () => {
  hasChanges.value = JSON.stringify(editedUser.value) !== JSON.stringify({
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone,
    email: user.email,
    country: user.country,
    state: user.state
  })
}

const resetForm = () => {
  editedUser.value = { ...user }
  hasChanges.value = false
}

const updateProfile = async () => {
  if (!hasChanges.value) return
  
  isSaving.value = true
  
  // Simular guardado
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  Object.assign(user, editedUser.value)
  hasChanges.value = false
  isSaving.value = false
  
  alert('Perfil actualizado exitosamente')
}

const handleAvatarChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    avatarSrc.value = URL.createObjectURL(file)
    alert('Imagen de perfil actualizada')
  }
}

const closePasswordModal = () => {
  showPasswordModal.value = false
  passwordForm.current = ''
  passwordForm.new = ''
  passwordForm.confirm = ''
  showCurrentPassword.value = false
  showNewPassword.value = false
  showConfirmPassword.value = false
}

const submitChangePassword = async () => {
  if (!canSubmitPassword.value) return
  
  // Simular cambio de contraseña
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  alert('Contraseña cambiada exitosamente')
  closePasswordModal()
}

const viewCertificate = (certificate) => {
  alert(`Viendo certificado: ${certificate.title}`)
}


const copyDiscountCode = (code) => {
  navigator.clipboard.writeText(code)
  alert('Código copiado al portapapeles')
}

const downloadTranscriptPDF = async () => {
  if (!transcriptContent.value) return
  
  try {
    const element = transcriptContent.value
    const opt = {
      margin: [0.5, 0.5, 0.5, 0.5],
      filename: `transcripcion_${user.firstName}_${user.lastName}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        logging: false
      },
      jsPDF: { 
        unit: 'in', 
        format: 'letter', 
        orientation: 'portrait' 
      }
    }
    
    // Agregar estilo para la impresión
    const originalDisplay = element.style.display
    element.style.display = 'block'
    
    // Generar PDF
    await html2pdf().set(opt).from(element).save()
    
    // Restaurar estilo original
    element.style.display = originalDisplay
    
    alert('Transcripción descargada exitosamente')
  } catch (error) {
    console.error('Error al generar PDF:', error)
    alert('Error al generar el PDF. Por favor, inténtalo de nuevo.')
  }
}
</script>

<style scoped>
/* Estilos Base */
.profile {
  display: grid;
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem;
}

/* Tabs con scroll horizontal en mobile */
.profile__tabs {
  display: flex;
  gap: 0.25rem;
  overflow-x: auto;
  border-bottom: 1px solid var(--color-light);
  padding-bottom: 0.5rem;
  -webkit-overflow-scrolling: touch; /* Scroll suave en iOS */
  scrollbar-width: thin; /* Firefox */
}

.profile__tabs::-webkit-scrollbar {
  height: 4px;
}

.profile__tabs::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.profile__tabs::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 2px;
}

.profile__tab {
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
  flex-shrink: 0; /* Evita que se encojan los tabs */
  font-weight: 600;
}

.profile__tab:hover {
  color: var(--color-morado);
}

.profile__tab.is-active {
  color: var(--color-morado);
  border-bottom: 3px solid var(--color-morado);
}

.profile__tab-icon {
  font-size: 1.2rem;
}

.profile__tab-label {
  font-size: 0.95rem;
}

/* Contenido Principal */
.profile__content {
  background: var(--color-blanco);
  border-radius: var(--border-radius-3);
  box-shadow: var(--box-shadow);
  overflow: hidden;
}

.tab-content {
  padding: 2rem;
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

/* Formulario */
.profile__form-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0;
}

.form-section {
  margin-bottom: 2.5rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--color-light);
}

.form-section:last-of-type {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.form-section__title {
  margin: 0 0 1.5rem;
  color: var(--color-oscuro);
  font-size: 1.25rem;
  font-weight: 600;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--color-oscuro);
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.required {
  color: #ef4444;
}

.form-input,
.form-select {
  padding: 0.75rem 1rem;
  border: 1px solid var(--color-light);
  border-radius: var(--border-radius-2);
  background: var(--color-blanco);
  color: var(--color-oscuro);
  font-family: inherit;
  font-size: 1rem;
  transition: all 0.2s ease;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: var(--color-morado);
  box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
}

.form-input::placeholder {
  color: var(--color-oscuro-variante);
  opacity: 0.6;
}

.form-help {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: var(--color-oscuro-variante);
}

/* Configuración de Cuenta */
.account-settings {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.account-setting {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f8fafc;
  border-radius: var(--border-radius-2);
  border: 1px solid var(--color-light);
}

.account-setting__info h4 {
  margin: 0 0 0.25rem;
  color: var(--color-oscuro);
  font-size: 1rem;
}

.account-setting__info p {
  margin: 0;
  color: var(--color-oscuro-variante);
  font-size: 0.875rem;
}

/* Botones */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: var(--border-radius-2);
  border: 1px solid transparent;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  text-align: center;
  line-height: 1;
}

.btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

.btn--primary {
  background: linear-gradient(135deg, var(--color-morado), #6d28d9);
  color: var(--color-blanco);
  border: none;
}

.btn--primary:hover:not(:disabled) {
  filter: brightness(1.1);
}

.btn--outline {
  background: transparent;
  border-color: var(--color-morado);
  color: var(--color-morado);
}

.btn--ghost {
  background: transparent;
  border-color: var(--color-light);
  color: var(--color-oscuro);
}

.btn--sm {
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
}

.btn--xs {
  padding: 0.25rem 0.5rem;
  font-size: 0.7rem;
}

.btn--loading {
  opacity: 0.8;
  cursor: wait;
}

.btn-icon {
  font-size: 1rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
  padding-top: 0rem;
}

/* Cursos Completados */
.certificates-container {
  margin-top: 1rem;
}

.certificates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.certificate-card {
  background: var(--color-blanco);
  border-radius: var(--border-radius-2);
  border: 1px solid var(--color-light);
  overflow: hidden;
  transition: all 0.3s ease;
}

.certificate-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border-color: var(--color-morado);
}

.certificate-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f8fafc;
  border-bottom: 1px solid var(--color-light);
}

.certificate-card__date {
  font-size: 0.875rem;
  color: var(--color-oscuro-variante);
}

.certificate-card__status {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  background: #d1fae5;
  color: #065f46;
}

.certificate-card__content {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
}

.certificate-card__info {
  flex: 1;
}

.certificate-card__title {
  margin: 0 0 0.5rem;
  color: var(--color-oscuro);
  font-size: 1.1rem;
  font-weight: 600;
}

.certificate-card__description {
  margin: 0 0 1rem;
  color: var(--color-oscuro-variante);
  font-size: 0.875rem;
  line-height: 1.5;
}

.certificate-card__details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.detail {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.detail__label {
  color: var(--color-oscuro-variante);
  min-width: 80px;
}

.detail__value {
  color: var(--color-oscuro);
  font-weight: 500;
}

.grade {
  padding: 0.125rem 0.5rem;
  border-radius: 4px;
  font-weight: 600;
}

.grade--a {
  background: #d1fae5;
  color: #065f46;
}

.grade--b {
  background: #fef3c7;
  color: #92400e;
}

.grade--c {
  background: #fee2e2;
  color: #991b1b;
}

.code {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  background: #f1f5f9;
  padding: 0.125rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
}

.certificate-card__actions {
  display: flex;
  gap: 0.5rem;
  padding: 1rem;
  background: #f8fafc;
  border-top: 1px solid var(--color-light);
}

.empty-state {
  text-align: center;
  padding: 3rem 2rem;
  background: #f8fafc;
  border-radius: var(--border-radius-2);
  border: 2px dashed var(--color-light);
}

.empty-state__icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-state__title {
  margin: 0 0 0.5rem;
  color: var(--color-oscuro);
  font-size: 1.25rem;
}

.empty-state__description {
  margin: 0 0 1.5rem;
  color: var(--color-oscuro-variante);
  max-width: 400px;
  margin: 0 auto 1.5rem;
}

/* Historial */
.history-container {
  margin-top: 1rem;
}

.history-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.history-stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: #f8fafc;
  border-radius: var(--border-radius-2);
  border: 1px solid var(--color-light);
}

.stat-icon {
  font-size: 2rem;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-morado);
  line-height: 1;
}

.stat-label {
  margin-top: 0.25rem;
  color: var(--color-oscuro-variante);
  font-size: 0.875rem;
}

.progress-overview {
  background: #f8fafc;
  border-radius: var(--border-radius-2);
  border: 1px solid var(--color-light);
  padding: 1.5rem;
}

.section-title {
  margin: 0 0 1.5rem;
  color: var(--color-oscuro);
  font-size: 1.1rem;
  font-weight: 600;
}

.progress-chart {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.progress-item {
  margin-bottom: 1.5rem;
}

.progress-item:last-child {
  margin-bottom: 0;
}

.progress-item__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.progress-item__header h4 {
  margin: 0;
  color: var(--color-oscuro);
  font-size: 0.95rem;
  font-weight: 600;
}

.progress-percentage {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-morado);
}

.progress-bar {
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-bar__fill {
  height: 100%;
  transition: width 0.3s ease;
}

.progress-bar__fill--completed {
  background: #10b981;
}

.progress-bar__fill--in-progress {
  background: var(--color-morado);
}

.progress-bar__fill--pending {
  background: #f59e0b;
}

.progress-item__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.progress-status {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.125rem 0.5rem;
  border-radius: 999px;
}

.status--completed {
  background: #d1fae5;
  color: #065f46;
}

.status--in-progress {
  background: #e0e7ff;
  color: var(--color-morado);
}

.status--pending {
  background: #fef3c7;
  color: #92400e;
}

.progress-time {
  font-size: 0.75rem;
  color: var(--color-oscuro-variante);
}

/* Descuentos */
.discounts-container {
  margin-top: 1rem;
}

.discounts-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.discounts-stats {
  display: flex;
  gap: 1rem;
  flex: 1;
}

.stat-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  border-radius: var(--border-radius-2);
  min-width: 80px;
  flex: 1;
}

.stat-badge--active {
  background: #d1fae5;
  color: #065f46;
}

.stat-badge--used {
  background: #fef3c7;
  color: #92400e;
}

.stat-badge--expired {
  background: #f1f5f9;
  color: #64748b;
}

.stat-badge__value {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1;
}

.stat-badge__label {
  font-size: 0.75rem;
  margin-top: 0.25rem;
  text-align: center;
}

.discounts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.discount-card {
  background: var(--color-blanco);
  border-radius: var(--border-radius-2);
  border: 1px solid var(--color-light);
  overflow: hidden;
  transition: all 0.3s ease;
}

.discount-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border-color: var(--color-morado);
}

.discount-card__content {
  padding: 1.5rem;
}

.discount-card__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.discount-card__title {
  margin: 0;
  color: var(--color-oscuro);
  font-size: 1.1rem;
  font-weight: 600;
  flex: 1;
}

.discount-card__percentage {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-morado);
  background: #e0e7ff;
  padding: 0.25rem 0.75rem;
  border-radius: var(--border-radius-1);
}

.discount-card__description {
  margin: 0 0 1.5rem;
  color: var(--color-oscuro-variante);
  font-size: 0.875rem;
  line-height: 1.5;
}

.discount-card__details {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.detail-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.detail-label {
  color: var(--color-oscuro-variante);
  min-width: 100px;
}

.detail-value-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.discount-code {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  background: #f1f5f9;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
}

.detail-value {
  color: var(--color-oscuro);
  font-weight: 500;
}

.status-active {
  color: #10b981;
  font-weight: 600;
}

.discounts-section {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid var(--color-light);
}

.used-discounts {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.used-discount-card,
.expired-discount-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-radius: var(--border-radius-2);
  border: 1px solid var(--color-light);
}

.used-discount-card {
  background: #f8fafc;
}

.expired-discount-card {
  background: #fef2f2;
}

.used-discount-card__content h4,
.expired-discount-card__content h4 {
  margin: 0 0 0.25rem;
  color: var(--color-oscuro);
  font-size: 0.95rem;
}

.used-discount-card__content p,
.expired-discount-card__content p {
  margin: 0;
  color: var(--color-oscuro-variante);
  font-size: 0.8rem;
}

.used-discount-card__status {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  background: #f1f5f9;
  color: var(--color-oscuro);
}

.expired-discount-card__status {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  background: #f1f5f9;
  color: var(--color-oscuro);
}

/* Transcripción */
.transcript-container {
  margin-top: 1rem;
}

.transcript-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.transcript-preview {
  background: white;
  border-radius: var(--border-radius-2);
  border: 1px solid var(--color-light);
  padding: 2rem;
}

.transcript-header {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 2px solid var(--color-light);
}

.transcript-logo {
  flex-shrink: 0;
}

.logo-image {
  width: 100px;
  height: 100px;
  object-fit: contain;
  border-radius: var(--border-radius-2);
  border: 1px solid #e5e7eb;
  background: white;
  padding: 0.5rem;
}

.transcript-info {
  flex: 1;
}

.transcript-info h3 {
  margin: 0 0 1rem;
  color: var(--color-oscuro);
  font-size: 1.5rem;
}

.transcript-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.detail-column p {
  margin: 0.25rem 0;
  color: var(--color-oscuro);
  font-size: 0.95rem;
}

.transcript-summary {
  margin-bottom: 2rem;
}

.summary-card {
  background: #f8fafc;
  border-radius: var(--border-radius-2);
  padding: 1.5rem;
  border: 1px solid var(--color-light);
}

.summary-card h4 {
  margin: 0 0 1rem;
  color: var(--color-oscuro);
  font-size: 1.1rem;
  font-weight: 600;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: white;
  border-radius: var(--border-radius-1);
  border: 1px solid var(--color-light);
}

.summary-label {
  color: var(--color-oscuro-variante);
  font-size: 0.875rem;
}

.summary-value {
  font-weight: 600;
  color: var(--color-oscuro);
}

.transcript-table-container {
  margin-bottom: 2rem;
}

.transcript-table-container h4 {
  margin: 0 0 1rem;
  color: var(--color-oscuro);
  font-size: 1.1rem;
  font-weight: 600;
}

.transcript-table {
  overflow-x: auto;
  border: 1px solid var(--color-light);
  border-radius: var(--border-radius-2);
}

.transcript-table table {
  width: 100%;
  border-collapse: collapse;
}

.transcript-table th {
  background: #f1f5f9;
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: var(--color-oscuro);
  border-bottom: 1px solid var(--color-light);
  white-space: nowrap;
}

.transcript-table td {
  padding: 1rem;
  border-bottom: 1px solid var(--color-light);
  color: var(--color-oscuro);
}

.transcript-table tr:last-child td {
  border-bottom: none;
}

.course-name {
  min-width: 200px;
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.status-badge--approved {
  background: #d1fae5;
  color: #065f46;
}

.status-badge--in-progress {
  background: #fef3c7;
  color: #92400e;
}

.transcript-footer {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid var(--color-light);
}

.footer-section {
  margin-bottom: 1.5rem;
}

.footer-section h5 {
  margin: 0 0 1rem;
  color: var(--color-oscuro);
  font-size: 1rem;
  font-weight: 600;
}

.grade-legend {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.legend-color {
  width: 20px;
  height: 20px;
  border-radius: 4px;
}

.legend-color.grade--a {
  background: #d1fae5;
}

.legend-color.grade--b {
  background: #fef3c7;
}

.legend-color.grade--c {
  background: #fee2e2;
}

.disclaimer {
  background: #fef3c7;
  padding: 1rem;
  border-radius: var(--border-radius-2);
  border: 1px solid #f59e0b;
  margin-top: 1.5rem;
}

.disclaimer p {
  margin: 0;
  color: #92400e;
  font-size: 0.875rem;
}

/* Modal Mejorado */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: grid;
  place-items: center;
  padding: 1rem;
  z-index: 1000;
  animation: backdropFadeIn 0.2s ease;
}

@keyframes backdropFadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal {
  background: var(--color-blanco);
  width: min(500px, 100%);
  max-height: 90vh;
  overflow-y: auto;
  border-radius: var(--border-radius-3);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  animation: modalSlideIn 0.3s ease;
}

@keyframes modalSlideIn {
  from { 
    opacity: 0; 
    transform: translateY(-20px) scale(0.95);
  }
  to { 
    opacity: 1; 
    transform: translateY(0) scale(1);
  }
}

.modal__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--color-light);
}

.modal__header h3 {
  margin: 0;
  color: var(--color-oscuro);
  font-size: 1.25rem;
}

.modal__close {
  background: transparent;
  border: none;
  cursor: pointer;
  color: var(--color-oscuro-variante);
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  border-radius: 4px;
  transition: all 0.2s ease;
  padding: 0;
}

.modal__close:hover {
  background: #f1f5f9;
  color: var(--color-oscuro);
}

.modal__body {
  padding: 1.5rem;
}

.password-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.password-input {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  cursor: pointer;
  color: var(--color-oscuro-variante);
  padding: 0.25rem;
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
}

.password-toggle svg {
  width: 20px;
  height: 20px;
}

.password-strength {
  margin-top: 0.5rem;
}

.strength-bar {
  height: 4px;
  border-radius: 2px;
  background: #e5e7eb;
  margin-bottom: 0.25rem;
  overflow: hidden;
}

.strength-bar::before {
  content: '';
  display: block;
  height: 100%;
  transition: width 0.3s ease;
}

.strength-weak::before {
  width: 33%;
  background: #ef4444;
}

.strength-medium::before {
  width: 66%;
  background: #f59e0b;
}

.strength-strong::before {
  width: 100%;
  background: #10b981;
}

.strength-text {
  font-size: 0.75rem;
  color: var(--color-oscuro-variante);
}

.password-requirements {
  margin: 0.5rem 0 0;
  padding: 0;
  list-style: none;
  font-size: 0.75rem;
}

.password-requirements li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.125rem 0;
  color: #94a3b8;
}

.password-requirements li svg {
  flex-shrink: 0;
}

.password-requirements li.requirement-met {
  color: #10b981;
}

.password-match {
  margin-top: 0.5rem;
  font-size: 0.875rem;
}

.password-match span {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.match-success {
  color: #10b981;
  font-weight: 600;
}

.match-error {
  color: #ef4444;
  font-weight: 600;
}

.modal__actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-light);
}

/* Responsive */
@media (max-width: 768px) {
  .profile__tabs {
    flex-wrap: nowrap;
    overflow-x: auto;
    padding-bottom: 0;
  }
  
  .profile__tab {
    padding: 1rem;
    min-width: fit-content;
  }
  
  .tab-content {
    padding: 1.5rem;
  }
  
  .certificates-grid,
  .discounts-grid {
    grid-template-columns: 1fr;
  }
  
  .transcript-details {
    grid-template-columns: 1fr;
  }
  
  .transcript-actions {
    justify-content: center;
  }
  
  .transcript-header {
    flex-direction: column;
    gap: 1rem;
  }
  
  .discounts-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .discounts-stats {
    justify-content: space-between;
  }
  
  .modal__actions {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .profile__tab-label {
    font-size: 0.85rem;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .history-stats {
    grid-template-columns: 1fr;
  }
  
  .summary-grid {
    grid-template-columns: 1fr;
  }
}
</style>