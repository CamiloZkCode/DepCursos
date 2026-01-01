<template>
  <main class="profile-admin" aria-describedby="profile-admin-intro">
    <!-- ===== HEADER DEL PERFIL ===== -->
    <ProfileHeader :user="user" :avatar-src="user.img_usuario || '/src/assets/icons/LogoFondo.jpeg'"
      @change-avatar="handleAvatarChange" :is-admin="true" :is-estudiante="false" />

    <!-- ===== NAVEGACIÓN DE TABS ===== -->
    <nav class="profile__tabs" role="tablist" aria-label="Secciones del perfil administrador">
      <button v-for="tab in tabs" :key="tab.id" class="profile__tab" :class="{ 'is-active': activeTab === tab.id }"
        @click="activeTab = tab.id" role="tab" :aria-selected="activeTab === tab.id" :aria-controls="tab.id">
        <span class="profile__tab-icon">{{ tab.icon }}</span>
        <span class="profile__tab-label">{{ tab.label }}</span>
      </button>
    </nav>

    <!-- ===== CONTENIDO DE TABS ===== -->
    <section class="profile__content">
      <!-- ===== TAB 1: PERFIL DEL USUARIO ===== -->
      <div v-if="activeTab === 'perfil'" id="perfil" role="tabpanel" class="tab-content">
        <!-- Estado de carga -->
        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          <p>Cargando datos del perfil...</p>
        </div>

        <!-- Contenido del perfil -->
        <template v-else>
          <header class="section-header">
            <h2>Información Personal</h2>
            <p>Actualiza tus datos personales</p>
          </header>

          <div class="profile__form-container">
            <form class="profile__form" @submit.prevent="updateProfile">
              <!-- Sección: Datos Personales -->
              <div class="form-section">
                <h3 class="form-section__title">Datos Personales</h3>
                <div class="form-grid">
                  <div class="form-group">
                    <label for="nombreCompleto" class="form-label">
                      Nombre Completo <span class="required">*</span>
                    </label>
                    <input id="nombreCompleto" v-model="editedUser.fullName" type="text" class="form-input" required
                      :disabled="isSaving" placeholder="Ej: Juan Pérez" />
                  </div>

                  <div class="form-group">
                    <label for="telefono" class="form-label">Teléfono</label>
                    <input id="telefono" v-model="editedUser.phone" type="tel" class="form-input" :disabled="isSaving"
                      placeholder="+57 123 456 7890" />
                  </div>

                  <div class="form-group">
                    <label for="correo" class="form-label">Correo electrónico</label>
                    <input id="correo" v-model="editedUser.email" type="email" class="form-input" :disabled="isSaving"
                      placeholder="admin@ejemplo.com" />
                  </div>
                </div>
              </div>

              <!-- Sección: Localización -->
              <div class="form-section">
                <h3 class="form-section__title">Localización</h3>
                <div class="form-grid">
                  <div class="form-group">
                    <label for="pais" class="form-label">
                      País
                    </label>
                    <input id="pais" v-model="editedUser.country" type="text" class="form-input" :disabled="isSaving"
                      placeholder="Ej: Colombia, México, Argentina" />
                  </div>

                  <div class="form-group">
                    <label for="estado" class="form-label">
                      Departamento/Estado
                    </label>
                    <input id="estado" v-model="editedUser.state" type="text" class="form-input" :disabled="isSaving"
                      placeholder="Ej: Tolima, Bogotá D.C., Antioquia" />
                  </div>
                </div>
              </div>

              <!-- Sección: Seguridad -->
              <div class="form-section">
                <h3 class="form-section__title">Seguridad</h3>
                <div class="account-settings">
                  <div class="account-setting">
                    <div class="account-setting__info">
                      <h4>Contraseña</h4>
                      <p>Cambia tu contraseña regularmente para mayor seguridad</p>
                    </div>
                    <button type="button" class="btn btn--outline" @click="showPasswordModal = true"
                      :disabled="isSaving">
                      Cambiar contraseña
                    </button>
                  </div>
                </div>
              </div>

              <!-- Acciones del formulario -->
              <div class="form-actions">
                <button type="button" class="btn btn--ghost" @click="resetForm" :disabled="!hasChanges || isSaving">
                  Cancelar
                </button>
                <button type="submit" class="btn btn--primary" :disabled="!hasChanges || isSaving"
                  :class="{ 'btn--loading': isSaving }">
                  <span v-if="isSaving">Guardando...</span>
                  <span v-else>Guardar Cambios</span>
                </button>
              </div>
            </form>
          </div>
        </template>
      </div>

      <!-- ===== TAB 2: GESTIONAR CATEGORÍAS ===== -->
      <div v-if="activeTab === 'categorias'" id="categorias" role="tabpanel" class="tab-content">
        <header class="section-header">
          <h2>Gestionar Categorías</h2>
          <p>Crea y administra las categorías de cursos</p>
        </header>

        <div class="management-container">
          <!-- Estado de carga -->
          <div v-if="loadingCategories" class="loading-state">
            <div class="spinner"></div>
            <p>Cargando categorías...</p>
          </div>

          <template v-else>
            <!-- Encabezado con estadísticas y botón de acción -->
            <div class="management-header">
              <div class="stats-overview">
                <div class="stat-card">
                  <div class="stat-card__icon">📂</div>
                  <div class="stat-card__content">
                    <div class="stat-card__value">{{ categories.length }}</div>
                    <div class="stat-card__label">Categorías Totales</div>
                  </div>
                </div>
              </div>

              <button class="btn btn--primary" @click="openCreateCategoryModal">
                <span class="btn-icon">➕</span>
                Nueva Categoría
              </button>
            </div>

            <!-- Grid de categorías -->
            <div class="categories-grid">
              <div v-for="category in categories" :key="category.id" class="category-card">
                <div class="category-card__image" :style="{ backgroundImage: `url(${category.image_url})` }">
                  <div class="category-card__badge">{{ category.badge || 'CAT' }}</div>
                </div>

                <div class="category-card__content">
                  <div class="category-card__header">
                    <h3 class="category-card__title">{{ category.name }}</h3>
                  </div>

                  <p class="category-card__description">{{ category.description || 'Sin descripción' }}</p>

                  <div class="category-card__actions">
                    <button class="btn btn--outline" @click="openEditCategoryModal(category)">
                      Editar
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Estado vacío -->
            <div v-if="categories.length === 0" class="empty-state">
              <div class="empty-state__icon">📂</div>
              <h3 class="empty-state__title">No hay categorías registradas</h3>
              <p class="empty-state__description">
                Comienza creando tu primera categoría para organizar los cursos
              </p>
              <button class="btn btn--primary" @click="openCreateCategoryModal">
                Crear Primera Categoría
              </button>
            </div>
          </template>
        </div>
      </div>

      <!-- ===== TAB 3: GESTIONAR INSTRUCTORES ===== -->
      <div v-if="activeTab === 'instructores'" id="instructores" role="tabpanel" class="tab-content">
        <header class="section-header">
          <h2>Gestionar Instructores</h2>
          <p>Administra los instructores de la plataforma</p>
        </header>

        <div class="management-container">
          <!-- Estado de carga -->
          <div v-if="loadingInstructors && instructorsList.length === 0" class="loading-state">
            <div class="spinner"></div>
            <p>Cargando instructores...</p>
          </div>

          <template v-else>
            <!-- Encabezado con estadísticas -->
            <div class="management-header">
              <div class="stats-overview">
                <div class="stat-card">
                  <div class="stat-card__icon">👥</div>
                  <div class="stat-card__content">
                    <div class="stat-card__value">{{ instructorsList.length }}</div>
                    <div class="stat-card__label">Total Instructores</div>
                  </div>
                </div>
              </div>

              <!-- Botón para crear nuevo instructor -->
              <button class="btn btn--primary" @click="openCreateInstructorModal">
                <span class="btn-icon">👨‍🏫</span>
                Nuevo Instructor
              </button>
            </div>

            <!-- Tabla de instructores simplificada -->
            <div class="table-container">
              <div class="table-responsive">
                <table class="data-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Instructor</th>
                      <th>Teléfono</th>
                      <th>Correo</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="instructor in instructorsList" :key="instructor.id_usuario">
                      <td>
                        <span class="user-id">{{ instructor.id_usuario }}</span>
                      </td>
                      <td>
                        <div class="user-cell">
                          <div class="user-avatar" :style="{
                            backgroundImage: `url(${instructor.img_usuario || instructor.avatar || avatarSrc})`
                          }"></div>
                          <div class="user-info">
                            <strong>{{ instructor.nombre }}</strong>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div class="contact-item">
                          <span class="contact-icon">📱</span>
                          <span>{{ instructor.telefono || 'Sin teléfono' }}</span>
                        </div>
                      </td>
                      <td>
                        <div class="contact-item">
                          <span class="contact-icon">📧</span>
                          <span>{{ instructor.correo }}</span>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Estado vacío -->
            <div v-if="instructorsList.length === 0 && !loadingInstructors" class="empty-state">
              <div class="empty-state__icon">👨‍🏫</div>
              <h3 class="empty-state__title">No hay instructores registrados</h3>
              <p class="empty-state__description">
                Agrega instructores para que puedan crear y gestionar cursos
              </p>
              <button class="btn btn--primary" @click="openCreateInstructorModal">
                Agregar Primer Instructor
              </button>
            </div>
          </template>
        </div>
      </div>

      <!-- ===== TAB 4: ESTADÍSTICAS (DASHBOARD) ===== -->
      <div v-if="activeTab === 'estadisticas'" id="estadisticas" role="tabpanel" class="tab-content">
        <header class="section-header">
          <h2>Dashboard de Estadísticas</h2>
          <p>Métricas y análisis de la plataforma</p>
        </header>

        <div class="dashboard-container">
          <!-- Tarjetas de métricas principales -->
          <div class="metrics-grid">
            <div class="metric-card metric-card--primary">
              <div class="metric-card__icon">👥</div>
              <div class="metric-card__content">
                <div class="metric-card__value">{{ formatNumber(totalRegisteredUsers) }}</div>
                <div class="metric-card__label">Usuarios Registrados</div>
              </div>
            </div>

            <div class="metric-card metric-card--success">
              <div class="metric-card__icon">📚</div>
              <div class="metric-card__content">
                <div class="metric-card__value">{{ formatNumber(totalEnrolled) }}</div>
                <div class="metric-card__label">Inscripciones Totales</div>
              </div>
            </div>

            <div class="metric-card metric-card--warning">
              <div class="metric-card__icon">🎓</div>
              <div class="metric-card__content">
                <div class="metric-card__value">{{ courses.length }}</div>
                <div class="metric-card__label">Cursos Activos</div>
              </div>
            </div>
          </div>

          <!-- Gráficos y visualizaciones -->
          <div class="charts-grid">
            <!-- Gráfico de inscripciones por curso -->
            <div class="chart-container">
              <div class="chart-header">
                <h3>Inscripciones por Curso</h3>
                <span class="chart-subtitle">Top 5 cursos más populares</span>
              </div>
              <div class="chart-content">
                <div class="bar-chart">
                  <div v-for="course in topCourses" :key="course.id" class="bar-item">
                    <div class="bar-label">{{ course.title }}</div>
                    <div class="bar-wrapper">
                      <div class="bar-fill" :style="{ width: `${(course.enrolled / course.maxEnrolled) * 100}%` }">
                      </div>
                    </div>
                    <div class="bar-value">{{ course.enrolled }} inscritos</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Gráfico de distribución por categoría -->
            <div class="chart-container">
              <div class="chart-header">
                <h3>Distribución por Categoría</h3>
                <span class="chart-subtitle">Cantidad de cursos por categoría</span>
              </div>
              <div class="chart-content">
                <div class="category-distribution">
                  <div v-for="category in categoryDistribution" :key="category.name" class="category-item">
                    <div class="category-info">
                      <span class="category-name">{{ category.name }}</span>
                      <span class="category-count">{{ category.count }} cursos</span>
                    </div>
                    <div class="category-bar">
                      <div class="category-bar-fill" :style="{ width: `${(category.count / totalCourses) * 100}%` }">
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== MODALES ===== -->
    <teleport to="body">
      <!-- Modal: Cambio de Contraseña -->
      <div v-if="showPasswordModal" class="modal-backdrop" @click.self="closePasswordModal">
        <div class="modal" role="dialog" aria-modal="true" aria-labelledby="password-modal-title">
          <header class="modal__header">
            <h3 id="password-modal-title">Cambiar Contraseña</h3>
            <button class="modal__close" @click="closePasswordModal" aria-label="Cerrar">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
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
                  <input id="current-password" v-model="passwordForm.current"
                    :type="showCurrentPassword ? 'text' : 'password'" required class="form-input"
                    placeholder="Ingresa tu contraseña actual" />
                  <button type="button" class="password-toggle" @click="showCurrentPassword = !showCurrentPassword">
                    <svg v-if="showCurrentPassword" width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M2 10C2 10 5 4 10 4C15 4 18 10 18 10C18 10 15 16 10 16C5 16 2 10 2 10Z"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                      <circle cx="10" cy="10" r="3" stroke="currentColor" stroke-width="2" />
                      <path d="M4 4L16 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                    </svg>
                    <svg v-else width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M2 10C2 10 5 4 10 4C15 4 18 10 18 10C18 10 15 16 10 16C5 16 2 10 2 10Z"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                      <circle cx="10" cy="10" r="3" stroke="currentColor" stroke-width="2" />
                    </svg>
                  </button>
                </div>
              </div>

              <div class="form-group">
                <label for="new-password" class="form-label">
                  Nueva contraseña <span class="required">*</span>
                </label>
                <div class="password-input">
                  <input id="new-password" v-model="passwordForm.new" :type="showNewPassword ? 'text' : 'password'"
                    required class="form-input" placeholder="Mínimo 8 caracteres" />
                  <button type="button" class="password-toggle" @click="showNewPassword = !showNewPassword">
                    <svg v-if="showNewPassword" width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M2 10C2 10 5 4 10 4C15 4 18 10 18 10C18 10 15 16 10 16C5 16 2 10 2 10Z"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                      <circle cx="10" cy="10" r="3" stroke="currentColor" stroke-width="2" />
                      <path d="M4 4L16 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                    </svg>
                    <svg v-else width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M2 10C2 10 5 4 10 4C15 4 18 10 18 10C18 10 15 16 10 16C5 16 2 10 2 10Z"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                      <circle cx="10" cy="10" r="3" stroke="currentColor" stroke-width="2" />
                    </svg>
                  </button>
                </div>
                <div class="password-strength">
                  <div class="strength-bar" :class="passwordStrengthClass"></div>
                  <span class="strength-text">{{ passwordStrengthText }}</span>
                </div>
              </div>

              <div class="form-group">
                <label for="confirm-password" class="form-label">
                  Confirmar nueva contraseña <span class="required">*</span>
                </label>
                <div class="password-input">
                  <input id="confirm-password" v-model="passwordForm.confirm"
                    :type="showConfirmPassword ? 'text' : 'password'" required class="form-input"
                    placeholder="Repite la nueva contraseña" />
                  <button type="button" class="password-toggle" @click="showConfirmPassword = !showConfirmPassword">
                    <svg v-if="showConfirmPassword" width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M2 10C2 10 5 4 10 4C15 4 18 10 18 10C18 10 15 16 10 16C5 16 2 10 2 10Z"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                      <circle cx="10" cy="10" r="3" stroke="currentColor" stroke-width="2" />
                      <path d="M4 4L16 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                    </svg>
                    <svg v-else width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M2 10C2 10 5 4 10 4C15 4 18 10 18 10C18 10 15 16 10 16C5 16 2 10 2 10Z"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                      <circle cx="10" cy="10" r="3" stroke="currentColor" stroke-width="2" />
                    </svg>
                  </button>
                </div>
              </div>

              <div class="modal__actions">
                <button type="button" class="btn btn--ghost" @click="closePasswordModal">
                  Cancelar
                </button>
                <button type="submit" class="btn btn--primary" :disabled="!canSubmitPassword">
                  Cambiar Contraseña
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Modal: Crear/Editar Categoría -->
      <div v-if="showCategoryModal" class="modal-backdrop" @click.self="closeCategoryModal">
        <div class="modal modal--large" role="dialog" aria-modal="true" aria-labelledby="category-modal-title">
          <header class="modal__header">
            <h3 id="category-modal-title">{{ categoryModalTitle }}</h3>
            <button class="modal__close" @click="closeCategoryModal" aria-label="Cerrar">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
              </svg>
            </button>
          </header>
          <div class="modal__body">
            <form @submit.prevent="saveCategory" class="category-form">
              <div class="form-grid">
                <div class="form-group">
                  <label for="category-name" class="form-label">
                    Nombre de la categoría <span class="required">*</span>
                  </label>
                  <input id="category-name" v-model="formCategory.nombre_categoria" type="text" class="form-input"
                    required placeholder="Ej: Fitness, Yoga, Nutrición" />
                </div>

                <div class="form-group">
                  <label for="category-badge" class="form-label">
                    Insignia <span class="required">*</span>
                  </label>
                  <input id="category-badge" v-model="formCategory.insignia" type="text" class="form-input" required
                    placeholder="Ej: FIT, YGA, NUT" maxlength="5" />
                  <div class="form-help">Máximo 5 caracteres</div>
                </div>
              </div>

              <div class="form-group">
                <label for="category-description" class="form-label">Descripción</label>
                <textarea id="category-description" v-model="formCategory.descripcion_categoria" class="form-textarea"
                  rows="3" placeholder="Describe la categoría..."></textarea>
              </div>

              <div class="form-group">
                <label class="form-label">
                  Imagen de la categoría
                  <span v-if="!formCategory.id_categoria" class="required">*</span>
                  <span v-else>(Opcional para actualizar)</span>
                </label>
                <div class="image-upload">
                  <input type="file" id="category-image-upload" accept="image/*" @change="handleCategoryImageChange"
                    class="file-input" />
                  <label for="category-image-upload" class="upload-label">
                    <span class="upload-icon">📷</span>
                    <span>Subir imagen</span>
                  </label>

                  <div v-if="categoryImagePreview" class="image-preview">
                    <img :src="categoryImagePreview" alt="Vista previa" />
                    <button type="button" class="btn btn--xs btn--ghost"
                      @click="categoryImagePreview = ''; categoryImageFile = null;">
                      <span>✕</span>
                    </button>
                  </div>
                  <div v-else-if="formCategory.image_url && formCategory.id_categoria" class="image-preview">
                    <img :src="formCategory.image_url" alt="Imagen actual" />
                    <p class="image-caption">Imagen actual</p>
                  </div>
                  <div v-else class="image-placeholder">
                    <span>No hay imagen seleccionada</span>
                  </div>
                </div>
                <div v-if="!formCategory.id_categoria" class="form-help">
                  * La imagen es requerida para nuevas categorías
                </div>
                <div v-if="formCategory.id_categoria" class="form-help">
                  * Si no seleccionas una nueva imagen, se mantendrá la actual
                </div>
              </div>

              <div class="modal__actions">
                <button type="button" class="btn btn--ghost" @click="closeCategoryModal"
                  :disabled="isSubmittingCategory">
                  Cancelar
                </button>
                <button type="submit" class="btn btn--primary" :disabled="isSubmittingCategory">
                  <span v-if="isSubmittingCategory">Guardando...</span>
                  <span v-else>{{ formCategory.id_categoria ? 'Actualizar' : 'Crear' }} Categoría</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Modal: Crear Nuevo Instructor -->
      <!-- Modal: Crear Nuevo Instructor -->
      <div v-if="showInstructorModal" class="modal-backdrop" @click.self="closeInstructorModal">
        <div class="modal" role="dialog" aria-modal="true" aria-labelledby="instructor-modal-title">
          <header class="modal__header">
            <h3 id="instructor-modal-title">Nuevo Instructor</h3>
            <button class="modal__close" @click="closeInstructorModal" aria-label="Cerrar">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
              </svg>
            </button>
          </header>
          <div class="modal__body">
            <form @submit.prevent="createInstructor" class="instructor-form">
              <div class="form-grid">
                <div class="form-group">
                  <label for="instructor-name" class="form-label">
                    Nombre completo <span class="required">*</span>
                  </label>
                  <input id="instructor-name" v-model="newInstructor.nombre" type="text" class="form-input" required
                    placeholder="Nombre del instructor" />
                </div>

                <div class="form-group">
                  <label for="instructor-id" class="form-label">
                    Cédula/Número de identificación <span class="required">*</span>
                  </label>
                  <input id="instructor-id" v-model="newInstructor.id_usuario" type="text" class="form-input" required
                    placeholder="Ej: 1234567890" :disabled="isCreatingInstructor" />
                </div>
              </div>

              <div class="form-grid">
                <div class="form-group">
                  <label for="instructor-email" class="form-label">
                    Correo electrónico <span class="required">*</span>
                  </label>
                  <input id="instructor-email" v-model="newInstructor.correo" type="email" class="form-input" required
                    placeholder="instructor@ejemplo.com" />
                </div>

                <div class="form-group">
                  <label for="instructor-phone" class="form-label">Teléfono</label>
                  <input id="instructor-phone" v-model="newInstructor.telefono" type="tel" class="form-input"
                    placeholder="+57 123 456 7890" />
                </div>
              </div>

              <div class="form-grid">
                <div class="form-group">
                  <label for="instructor-password" class="form-label">
                    Contraseña <span class="required">*</span>
                  </label>
                  <div class="password-input">
                    <input id="instructor-password" v-model="newInstructor.contrasena"
                      :type="showInstructorPassword ? 'text' : 'password'" class="form-input" required
                      placeholder="Contraseña temporal" />
                    <button type="button" class="password-toggle"
                      @click="showInstructorPassword = !showInstructorPassword">
                      <svg v-if="showInstructorPassword" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M2 10C2 10 5 4 10 4C15 4 18 10 18 10C18 10 15 16 10 16C5 16 2 10 2 10Z"
                          stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                        <circle cx="10" cy="10" r="3" stroke="currentColor" stroke-width="2" />
                        <path d="M4 4L16 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                      </svg>
                      <svg v-else width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M2 10C2 10 5 4 10 4C15 4 18 10 18 10C18 10 15 16 10 16C5 16 2 10 2 10Z"
                          stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                        <circle cx="10" cy="10" r="3" stroke="currentColor" stroke-width="2" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div class="form-group">
                  <label for="instructor-confirm-password" class="form-label">
                    Confirmar contraseña <span class="required">*</span>
                  </label>
                  <div class="password-input">
                    <input id="instructor-confirm-password" v-model="newInstructor.confirmPassword"
                      :type="showConfirmInstructorPassword ? 'text' : 'password'" class="form-input" required
                      placeholder="Confirmar contraseña" />
                    <button type="button" class="password-toggle"
                      @click="showConfirmInstructorPassword = !showConfirmInstructorPassword">
                      <svg v-if="showConfirmInstructorPassword" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M2 10C2 10 5 4 10 4C15 4 18 10 18 10C18 10 15 16 10 16C5 16 2 10 2 10Z"
                          stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                        <circle cx="10" cy="10" r="3" stroke="currentColor" stroke-width="2" />
                        <path d="M4 4L16 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                      </svg>
                      <svg v-else width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M2 10C2 10 5 4 10 4C15 4 18 10 18 10C18 10 15 16 10 16C5 16 2 10 2 10Z"
                          stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                        <circle cx="10" cy="10" r="3" stroke="currentColor" stroke-width="2" />
                      </svg>
                    </button>
                  </div>
                  <div v-if="newInstructor.contrasena && newInstructor.confirmPassword" class="password-match">
                    <span
                      :class="newInstructor.contrasena === newInstructor.confirmPassword ? 'match-success' : 'match-error'">
                      {{ newInstructor.contrasena === newInstructor.confirmPassword ? '✓ Las contraseñas coinciden' : '✗ Las contraseñas no coinciden' }}
                    </span>
                  </div>
                </div>
              </div>

              <div class="modal__actions">
                <button type="button" class="btn btn--ghost" @click="closeInstructorModal"
                  :disabled="isCreatingInstructor">
                  Cancelar
                </button>
                <button type="submit" class="btn btn--primary" :disabled="!canCreateInstructor || isCreatingInstructor">
                  <span v-if="isCreatingInstructor">Creando...</span>
                  <span v-else>Crear Instructor</span>
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
// =================================================================
// IMPORTS - ORGANIZADOS POR FUNCIONALIDAD
// =================================================================

// Vue & Pinia
import { ref, reactive, computed, onMounted, watch, nextTick } from 'vue'
import { useAuthStore } from '@/store/auth'

// Componentes
import ProfileHeader from '@/components/ProfileHeader.vue'

// Servicios API
import {
  obtenerDatosPerfil,
  actualizarDatosPerfil,
  cambiarContrasenaUsuario,
  actualizarAvatarUsuario,
  registroUsuario,
  obtenerInstructores

} from '@/services/usuario.services'

// Servicios de categorías
import { categoriasService } from '@/services/categorias.services'

// Librerías externas
import Swal from 'sweetalert2'

// =================================================================
// SECCIÓN 1: PERFIL Y CONTRASEÑA
// =================================================================

// ===== ESTADO =====
const authStore = useAuthStore()

// Estado principal del perfil
const activeTab = ref('perfil')
const hasChanges = ref(false)
const isSaving = ref(false)
const loading = ref(true)

// Datos del usuario real desde el backend
const user = reactive({
  fullName: '',
  phone: '',
  email: '',
  country: '',
  state: '',
  id_usuario: '',
  img_usuario: ''
})

const editedUser = ref({
  fullName: '',
  phone: '',
  email: '',
  country: '',
  state: ''
})

// Estado para contraseña
const showPasswordModal = ref(false)
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

const passwordForm = reactive({
  current: '',
  new: '',
  confirm: ''
})

// Tabs de navegación
const tabs = [
  { id: 'perfil', label: 'Perfil', icon: '👤' },
  { id: 'categorias', label: 'Gestionar Categorías', icon: '📂' },
  { id: 'instructores', label: 'Gestionar Instructores', icon: '👥' },
  { id: 'estadisticas', label: 'Dashboard', icon: '📊' }
]

// ===== COMPUTED =====
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

// ===== MÉTODOS =====
//Carga los datos del usuario desde el backend
const cargarDatosUsuario = async () => {
  try {
    loading.value = true

    // CORREGIR: Usar 'id' en lugar de 'id_usuario'
    const userId = authStore.user?.id

    if (!userId) {
      console.error('No se encontró ID de usuario en el store')
      Swal.fire({
        icon: 'warning',
        title: 'Datos incompletos',
        text: 'No se pudo identificar al usuario',
        timer: 2000
      })
      return
    }

    const datos = await obtenerDatosPerfil(userId)

    if (!datos) {
      throw new Error('El servidor no retornó datos')
    }

    // Mapear datos del backend al frontend
    user.fullName = datos.nombre || authStore.user?.nombre || ''
    user.phone = datos.telefono || datos.phone || ''
    user.email = datos.correo || datos.email || authStore.user?.correo || ''
    user.country = datos.pais || datos.country || ''
    user.state = datos.departamento || datos.state || datos.estado || ''
    user.id_usuario = datos.id_usuario || datos.id || userId
    user.img_usuario = datos.img_usuario || datos.imagen || '/src/assets/icons/LogoFondo.jpeg'

    // Inicializar editedUser con los datos del usuario
    editedUser.value = {
      fullName: user.fullName,
      phone: user.phone,
      email: user.email,
      country: user.country,
      state: user.state
    }
  } catch (error) {
    console.error('❌ Error al cargar datos del usuario:', error)
    console.error('Detalles del error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    })

    // Cargar datos mínimos desde el store de auth
    user.fullName = authStore.user?.nombre || 'Usuario'
    user.email = authStore.user?.correo || ''
    user.id_usuario = authStore.user?.id || ''

    editedUser.value = {
      fullName: user.fullName,
      phone: '',
      email: user.email,
      country: '',
      state: ''
    }

    Swal.fire({
      icon: 'warning',
      title: 'Datos limitados',
      text: 'Se cargaron datos básicos. Algunos campos pueden estar vacíos.',
      timer: 3000
    })

  } finally {
    loading.value = false
  }
}

// Restablece el formulario a los valores originales
const resetForm = () => {
  editedUser.value = {
    fullName: user.fullName,
    phone: user.phone,
    email: user.email,
    country: user.country,
    state: user.state
  }
  hasChanges.value = false
}

// Actualiza el perfil del usuario en el backend
const updateProfile = async () => {
  if (!hasChanges.value) return

  try {
    isSaving.value = true

    const datosActualizados = {
      nombre: editedUser.value.fullName,
      telefono: editedUser.value.phone,
      correo: editedUser.value.email,
      pais: editedUser.value.country,
      departamento: editedUser.value.state
    }

    await actualizarDatosPerfil(user.id_usuario, datosActualizados)

    // Actualizar el objeto user con los nuevos datos
    user.fullName = editedUser.value.fullName
    user.phone = editedUser.value.phone
    user.email = editedUser.value.email
    user.country = editedUser.value.country
    user.state = editedUser.value.state

    // ¡SOLUCIÓN DIRECTA Y FUNCIONAL!
    if (authStore.user) {
      // 1. Actualizar el store
      authStore.user.nombre = editedUser.value.fullName
      authStore.user.correo = editedUser.value.email

      // 2. ¡ESTO ES LO QUE TE FALTA! Actualizar localStorage
      localStorage.setItem("user", JSON.stringify(authStore.user))
    }

    Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
      text: 'Perfil actualizado correctamente',
      timer: 2000,
      showConfirmButton: false
    })

  } catch (error) {
    console.error('Error al actualizar perfil:', error)
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.response?.data?.message || 'Error al actualizar el perfil'
    })
  } finally {
    isSaving.value = false
  }
}

// Maneja el cambio de avatar del usuario
const handleAvatarChange = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  try {
    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      Swal.fire({
        icon: 'warning',
        title: 'Formato inválido',
        text: 'Por favor selecciona una imagen válida'
      })
      return
    }

    // Validar tamaño (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        icon: 'warning',
        title: 'Imagen muy grande',
        text: 'La imagen debe ser menor a 5MB'
      })
      return
    }

    const response = await actualizarAvatarUsuario(user.id_usuario, file)

    if (response.success) {
      // Actualizar la imagen en el frontend
      user.img_usuario = response.data.imagen

      Swal.fire({
        icon: 'success',
        title: '¡Éxito!',
        text: 'Avatar actualizado correctamente',
        timer: 2000,
        showConfirmButton: false
      })
    }

  } catch (error) {
    console.error('Error al cambiar avatar:', error)
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.response?.data?.message || 'Error al actualizar el avatar'
    })
  }
}

//Cierra el modal de cambio de contraseña y limpia el formulario
const closePasswordModal = () => {
  showPasswordModal.value = false
  passwordForm.current = ''
  passwordForm.new = ''
  passwordForm.confirm = ''
  showCurrentPassword.value = false
  showNewPassword.value = false
  showConfirmPassword.value = false
}

// Envía el formulario de cambio de contraseña al backend
const submitChangePassword = async () => {
  if (!canSubmitPassword.value) {
    console.warn('Formulario de contraseña inválido')
    return
  }

  try {
    const userId = user.id_usuario

    if (!userId) {
      throw new Error('ID de usuario no encontrado. No se puede cambiar la contraseña.')
    }

    await cambiarContrasenaUsuario(userId, {
      contrasenaActual: passwordForm.current,
      nuevaContrasena: passwordForm.new
    })

    Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
      text: 'Contraseña cambiada exitosamente',
      timer: 2000,
      showConfirmButton: false
    })

    closePasswordModal()

  } catch (error) {
    console.error('Error completo al cambiar contraseña:', error)
    console.error('Response:', error.response?.data)
    console.error('Status:', error.response?.status)

    Swal.fire({
      icon: 'error',
      title: 'Error al cambiar contraseña',
      text: error.response?.data?.message || error.message || 'Error desconocido'
    })
  }
}

// =================================================================
// SECCIÓN 2: GESTIÓN DE CATEGORÍAS
// =================================================================

// Estado reactivo para categorías
const categories = ref([])
const loadingCategories = ref(false)
const isSubmittingCategory = ref(false)
const categoryImageFile = ref(null)

// Estado del modal
const showCategoryModal = ref(false)
const categoryModalTitle = ref('Nueva Categoría')
const categoryImagePreview = ref('')

const formCategory = reactive({
  id_categoria: null,
  nombre_categoria: '',
  insignia: '',
  descripcion_categoria: '',
  image_url: ''
})

// ===== MÉTODOS =====

// Cargar categorías desde el backend
const cargarCategorias = async () => {
  try {
    loadingCategories.value = true
    const response = await categoriasService.obtenerCategorias()

    if (response.success) {
      categories.value = response.data.map(cat => ({
        id: cat.id_categoria,
        name: cat.nombre_categoria,
        badge: cat.insignia,
        description: cat.descripcion_categoria,
        image_url: cat.img_categoria,
        originalData: cat
      }))
    }
  } catch (error) {
    console.error('Error al cargar categorías:', error)
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudieron cargar las categorías'
    })
  } finally {
    loadingCategories.value = false
  }
}

// Abre el modal para crear una nueva categoría
const openCreateCategoryModal = () => {
  // Resetear el formulario
  formCategory.id_categoria = null
  formCategory.nombre_categoria = ''
  formCategory.insignia = ''
  formCategory.descripcion_categoria = ''
  formCategory.image_url = ''
  categoryImageFile.value = null
  categoryImagePreview.value = ''

  categoryModalTitle.value = 'Nueva Categoría'
  showCategoryModal.value = true
}

// Abre el modal para editar una categoría existente
const openEditCategoryModal = (category) => {
  // Cargar datos de la categoría
  formCategory.id_categoria = category.id
  formCategory.nombre_categoria = category.name
  formCategory.insignia = category.badge
  formCategory.descripcion_categoria = category.description
  formCategory.image_url = category.image_url

  categoryImageFile.value = null
  categoryImagePreview.value = ''

  categoryModalTitle.value = 'Editar Categoría'
  showCategoryModal.value = true
}

// Cierra el modal de categoría
const closeCategoryModal = () => {
  showCategoryModal.value = false
  // Resetear el formulario
  formCategory.id_categoria = null
  formCategory.nombre_categoria = ''
  formCategory.insignia = ''
  formCategory.descripcion_categoria = ''
  formCategory.image_url = ''
  categoryImageFile.value = null
  categoryImagePreview.value = ''
}

// Maneja el cambio de imagen en el formulario de categoría
const handleCategoryImageChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      Swal.fire({
        icon: 'warning',
        title: 'Formato inválido',
        text: 'Por favor selecciona una imagen válida'
      })
      return
    }

    // Validar tamaño (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        icon: 'warning',
        title: 'Imagen muy grande',
        text: 'La imagen debe ser menor a 5MB'
      })
      return
    }

    categoryImageFile.value = file
    categoryImagePreview.value = URL.createObjectURL(file)
  }
}

// Guarda o actualiza una categoría
const saveCategory = async () => {
  try {
    isSubmittingCategory.value = true

    // Validar campos
    if (!formCategory.nombre_categoria || !formCategory.insignia) {
      throw new Error('Nombre e insignia son campos requeridos')
    }

    // Para nueva categoría, validar que tenga imagen
    if (!formCategory.id_categoria && !categoryImageFile.value) {
      throw new Error('La imagen es requerida para nuevas categorías')
    }

    // Crear FormData
    const formData = new FormData()
    formData.append('nombre_categoria', formCategory.nombre_categoria)
    formData.append('insignia', formCategory.insignia)
    formData.append('descripcion_categoria', formCategory.descripcion_categoria)

    if (categoryImageFile.value) {
      formData.append('img_categoria', categoryImageFile.value)
    }

    let response

    if (formCategory.id_categoria) {
      // Actualizar categoría existente
      response = await categoriasService.actualizarCategoria(formCategory.id_categoria, formData)
    } else {
      // Crear nueva categoría
      response = await categoriasService.crearCategoria(formData)
    }

    if (response.success) {
      // Recargar categorías
      await cargarCategorias()

      // Cerrar modal
      closeCategoryModal()

      // Mostrar mensaje de éxito
      Swal.fire({
        icon: 'success',
        title: '¡Éxito!',
        text: response.message,
        timer: 2000,
        showConfirmButton: false
      })
    }

  } catch (error) {
    console.error('Error al guardar categoría:', error)
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.response?.data?.message || error.message || 'Error al guardar la categoría'
    })
  } finally {
    isSubmittingCategory.value = false
  }
}

// =================================================================
// SECCIÓN 3: GESTIÓN DE INSTRUCTORES
// =================================================================

// ===== ESTADO =====
const instructorsList = ref([])
const loadingInstructors = ref(false)
const isCreatingInstructor = ref(false)

const newInstructor = ref({
  nombre: '',
  id_usuario: '',
  correo: '',
  telefono: '',
  contrasena: '',
  confirmPassword: '',
  id_rol: 3  // Siempre 3 para instructores
})
const showInstructorModal = ref(false)
const showInstructorPassword = ref(false)
const showConfirmInstructorPassword = ref(false)

// ===== COMPUTED =====
const activeInstructors = computed(() => {
  return instructorsList.value.length
})

const canCreateInstructor = computed(() => {
  return newInstructor.value.nombre &&
    newInstructor.value.id_usuario &&
    newInstructor.value.correo &&
    newInstructor.value.contrasena &&
    newInstructor.value.contrasena === newInstructor.value.confirmPassword
})

// ===== MÉTODOS =====

/**
 * Carga la lista de instructores desde el backend
 */
const cargarInstructores = async () => {
  try {
    loadingInstructors.value = true
    
    const response = await obtenerInstructores()
    
    // Si no hay respuesta o está vacía
    if (!response) {
      instructorsList.value = []
      return
    }
    
    // Determinar de dónde obtener los datos
    let data = []
    
    if (Array.isArray(response)) {
      data = response
    } else if (response.data && Array.isArray(response.data)) {
      data = response.data
    } else if (response.success && response.data && Array.isArray(response.data)) {
      data = response.data
    }
    
    // Mapear los datos
    instructorsList.value = data.map(instructor => ({
      id_usuario: instructor.id_usuario || '',
      nombre: instructor.nombre || '',
      correo: instructor.correo || '',
      telefono: instructor.telefono || '',
      img_usuario: instructor.img_usuario || instructor.imagen || '/src/assets/icons/LogoFondo.jpeg'
    }))
    
  } catch (error) {
    // Si no hay instructores (404), mostrar array vacío
    if (error.response?.status === 404) {
      instructorsList.value = []
    } else {
      // Para otros errores, mostrar mensaje
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron cargar los instructores',
        timer: 2000,
        showConfirmButton: false
      })
      instructorsList.value = []
    }
  } finally {
    loadingInstructors.value = false
  }
}

/**
 * Abre el modal para crear un nuevo instructor
 */
const openCreateInstructorModal = () => {
  newInstructor.value = {
    nombre: '',
    id_usuario: '',
    correo: '',
    telefono: '',
    contrasena: '',
    confirmPassword: '',
    id_rol: 3
  }
  showInstructorPassword.value = false
  showConfirmInstructorPassword.value = false
  showInstructorModal.value = true
}

/**
 * Cierra el modal de instructor
 */
const closeInstructorModal = () => {
  showInstructorModal.value = false
  // Limpiar formulario
  newInstructor.value = {
    nombre: '',
    id_usuario: '',
    correo: '',
    telefono: '',
    contrasena: '',
    confirmPassword: '',
    id_rol: 3
  }
}

/**
 * Crea un nuevo instructor usando el endpoint de registro
 */
const createInstructor = async () => {
  if (!canCreateInstructor.value) return
  
  try {
    isCreatingInstructor.value = true
    
    // Validar que las contraseñas coincidan
    if (newInstructor.value.contrasena !== newInstructor.value.confirmPassword) {
      Swal.fire({
        icon: 'warning',
        title: 'Contraseñas no coinciden',
        text: 'Las contraseñas deben ser iguales',
        timer: 2000,
        showConfirmButton: false
      })
      return
    }
    
    // Preparar los datos para el registro
    const usuarioData = {
      id_usuario: newInstructor.value.id_usuario,
      nombre: newInstructor.value.nombre,
      correo: newInstructor.value.correo,
      telefono: newInstructor.value.telefono || null,
      contraseña_hash: newInstructor.value.contrasena,
      id_rol: 3, // Siempre 3 para instructores
    }
    
    // Llamar al endpoint de registro
    const response = await registroUsuario(usuarioData)
    
    // Cerrar modal
    closeInstructorModal()
    
    // Mostrar mensaje de éxito
    Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
      text: response.message || 'Instructor creado exitosamente',
      timer: 2000,
      showConfirmButton: false
    })
    
    // Recargar la lista de instructores
    await cargarInstructores()
    
  } catch (error) {
    let errorMessage = 'Error al crear el instructor'
    
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message
    }
    
    // Mensajes específicos para errores comunes
    if (errorMessage.includes('duplicate') || errorMessage.includes('ya existe')) {
      errorMessage = 'El número de identificación o correo ya está registrado'
    }
    
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: errorMessage,
      confirmButtonText: 'Entendido'
    })
  } finally {
    isCreatingInstructor.value = false
  }
}

// =================================================================
// SECCIÓN 4: ESTADÍSTICAS (DASHBOARD)
// =================================================================

// ===== ESTADO =====
const courses = reactive([
  {
    id: 1,
    title: 'Fitness Intensivo',
    description: 'Entrenamiento de alta intensidad',
    enrolled: 150,
    maxEnrolled: 200,
    price: 49.99,
    category: 'Fitness',
    instructor: 'Instructor 1',
    completionRate: 75
  },
  {
    id: 2,
    title: 'Yoga para Principiantes',
    description: 'Introducción al yoga',
    enrolled: 120,
    maxEnrolled: 150,
    price: 39.99,
    category: 'Yoga',
    instructor: 'Instructor 2',
    completionRate: 82
  },
  {
    id: 3,
    title: 'Nutrición Deportiva',
    description: 'Alimentación para atletas',
    enrolled: 80,
    maxEnrolled: 100,
    price: 59.99,
    category: 'Nutrición',
    instructor: 'Instructor 1',
    completionRate: 68
  },
  {
    id: 4,
    title: 'CrossFit Avanzado',
    description: 'Entrenamiento CrossFit nivel avanzado',
    enrolled: 60,
    maxEnrolled: 80,
    price: 69.99,
    category: 'Fitness',
    instructor: 'Instructor 3',
    completionRate: 90
  },
  {
    id: 5,
    title: 'Meditación Guiada',
    description: 'Técnicas de meditación',
    enrolled: 90,
    maxEnrolled: 120,
    price: 29.99,
    category: 'Yoga',
    instructor: 'Instructor 2',
    completionRate: 78
  }
])

const totalRegisteredUsers = ref(1245)

// ===== COMPUTED =====
const totalEnrolled = computed(() => {
  return courses.reduce((sum, course) => sum + course.enrolled, 0)
})

const averageCompletionRate = computed(() => {
  if (courses.length === 0) return 0
  const total = courses.reduce((sum, course) => sum + (course.completionRate || 0), 0)
  return Math.round(total / courses.length)
})

const topCourses = computed(() => {
  return [...courses]
    .sort((a, b) => b.enrolled - a.enrolled)
    .slice(0, 5)
})

const categoryDistribution = computed(() => {
  const distribution = {}

  courses.forEach(course => {
    if (!distribution[course.category]) {
      distribution[course.category] = 0
    }
    distribution[course.category]++
  })

  return Object.keys(distribution).map(category => ({
    name: category,
    count: distribution[category]
  }))
})

const totalCourses = computed(() => courses.length)

// ===== MÉTODOS =====
const formatNumber = (num) => {
  return new Intl.NumberFormat('es-ES').format(num)
}

// =================================================================
// OnMounted
// =================================================================
onMounted(async () => {
  await nextTick()

  if (authStore.isAuthenticated && authStore.user?.id) {
    await cargarDatosUsuario()
  } else {
    loading.value = false
    return
  }

  // Solo cargar categorías si esa es la pestaña activa
  if (activeTab.value === 'categorias') {
    cargarCategorias()
  }
  
  // Solo cargar instructores si esa es la pestaña activa
  if (activeTab.value === 'instructores') {
    cargarInstructores()
  }
})

// Cargar datos cuando se cambia de pestaña
watch(() => activeTab.value, (newTab) => {
  if (newTab === 'categorias') {
    cargarCategorias()
  }
  
  if (newTab === 'instructores') {
    cargarInstructores()
  }
})

// Recargar datos del usuario cuando cambia el ID
watch(
  () => authStore.user?.id,
  (newId) => {
    if (newId) {
      cargarDatosUsuario()
    }
  },
  { immediate: true }
)

// Detectar cambios en el formulario de perfil
watch(editedUser, (newVal) => {
  hasChanges.value = JSON.stringify(newVal) !== JSON.stringify({
    fullName: user.fullName,
    phone: user.phone,
    email: user.email,
    country: user.country,
    state: user.state
  })
}, { deep: true })
</script>

<style scoped>
/* =================================================================
   ESTILOS GENERALES
   ================================================================= */

.profile-admin {
  display: grid;
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem;
}

/* =================================================================
   ESTILOS PARA TABS DE NAVEGACIÓN
   ================================================================= */

.profile__tabs {
  display: flex;
  gap: 0.25rem;
  overflow-x: auto;
  border-bottom: 1px solid var(--color-light);
  padding-bottom: 0.5rem;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
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
  flex-shrink: 0;
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

/* =================================================================
   ESTILOS PARA CONTENIDO PRINCIPAL
   ================================================================= */

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
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Estado de carga */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid var(--color-morado);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

/* =================================================================
   ESTILOS PARA HEADERS DE SECCIÓN
   ================================================================= */

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

/* =================================================================
   ESTILOS PARA FORMULARIOS (PERFIL)
   ================================================================= */

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
.form-select,
.form-textarea {
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
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--color-morado);
  box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
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

/* =================================================================
   ESTILOS PARA BOTONES
   ================================================================= */

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

.btn--success {
  background: #10b981;
  color: white;
  border: none;
}

.btn--success:hover:not(:disabled) {
  filter: brightness(1.1);
}

.btn--danger {
  background: #ef4444;
  color: white;
  border: none;
}

.btn--danger:hover:not(:disabled) {
  filter: brightness(1.1);
}

.btn--toggle {
  padding: 0.5rem 1rem;
  font-size: 0.85rem;
  min-width: 100px;
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

/* =================================================================
   ESTILOS PARA GESTIÓN DE CATEGORÍAS
   ================================================================= */

.management-container {
  margin-top: 1rem;
}

.management-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.stats-overview {
  display: flex;
  gap: 1rem;
  flex: 1;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: #f8fafc;
  border-radius: var(--border-radius-2);
  border: 1px solid var(--color-light);
  min-width: 200px;
}

.stat-card__icon {
  font-size: 2rem;
  color: var(--color-morado);
}

.stat-card__content {
  flex: 1;
}

.stat-card__value {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-morado);
  line-height: 1;
}

.stat-card__label {
  margin-top: 0.25rem;
  color: var(--color-oscuro-variante);
  font-size: 0.875rem;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.category-card {
  background: var(--color-blanco);
  border-radius: var(--border-radius-2);
  border: 1px solid var(--color-light);
  overflow: hidden;
  transition: all 0.3s ease;
}

.category-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border-color: var(--color-morado);
}

.category-card__image {
  height: 150px;
  background-size: cover;
  background-position: center;
  position: relative;
}

.category-card__badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: var(--color-morado);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: var(--border-radius-1);
  font-weight: 600;
  font-size: 0.875rem;
}

.category-card__content {
  padding: 1.5rem;
}

.category-card__header {
  margin-bottom: 1rem;
}

.category-card__title {
  margin: 0;
  color: var(--color-oscuro);
  font-size: 1.1rem;
  font-weight: 600;
}

.category-card__description {
  margin: 0 0 1.5rem;
  color: var(--color-oscuro-variante);
  font-size: 0.875rem;
  line-height: 1.5;
  min-height: 60px;
}

.category-card__actions {
  display: flex;
  gap: 0.5rem;
}

/* =================================================================
   ESTILOS PARA GESTIÓN DE INSTRUCTORES (VERSIÓN SIMPLIFICADA)
   ================================================================= */

.table-container {
  margin-top: 1rem;
}

.table-responsive {
  overflow-x: auto;
  border: 1px solid var(--color-light);
  border-radius: var(--border-radius-2);
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 600px;
}

.data-table th,
.data-table td {
  padding: 1rem;
  border-bottom: 1px solid var(--color-light);
  text-align: left;
}

.data-table th {
  background: #f8fafc;
  font-weight: 600;
  color: var(--color-oscuro);
  position: sticky;
  top: 0;
}

.data-table tr:hover {
  background: #f8fafc;
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-size: cover;
  background-position: center;
  background-color: #f1f5f9;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-id {
  font-size: 0.75rem;
  color: var(--color-oscuro-variante);
  font-weight: 600;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.contact-icon {
  font-size: 0.75rem;
  opacity: 0.6;
}

/* =================================================================
   ESTILOS PARA ESTADÍSTICAS (DASHBOARD)
   ================================================================= */

.dashboard-container {
  margin-top: 1rem;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.metric-card {
  background: var(--color-blanco);
  border-radius: var(--border-radius-2);
  border: 1px solid var(--color-light);
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
}

.metric-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.metric-card--primary {
  border-left: 4px solid var(--color-morado);
}

.metric-card--success {
  border-left: 4px solid #10b981;
}

.metric-card--warning {
  border-left: 4px solid #f59e0b;
}

.metric-card--info {
  border-left: 4px solid #3b82f6;
}

.metric-card__icon {
  font-size: 2.5rem;
  color: var(--color-morado);
}

.metric-card--success .metric-card__icon {
  color: #10b981;
}

.metric-card--warning .metric-card__icon {
  color: #f59e0b;
}

.metric-card--info .metric-card__icon {
  color: #3b82f6;
}

.metric-card__content {
  flex: 1;
}

.metric-card__value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-oscuro);
  line-height: 1;
  margin-bottom: 0.25rem;
}

.metric-card__label {
  font-size: 0.875rem;
  color: var(--color-oscuro-variante);
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.chart-container {
  background: var(--color-blanco);
  border-radius: var(--border-radius-2);
  border: 1px solid var(--color-light);
  padding: 1.5rem;
}

.chart-header {
  margin-bottom: 1.5rem;
}

.chart-header h3 {
  margin: 0 0 0.25rem;
  color: var(--color-oscuro);
  font-size: 1.1rem;
}

.chart-subtitle {
  font-size: 0.875rem;
  color: var(--color-oscuro-variante);
}

.chart-content {
  min-height: 250px;
}

.bar-chart {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.bar-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.bar-label {
  min-width: 120px;
  font-size: 0.875rem;
  color: var(--color-oscuro);
}

.bar-wrapper {
  flex: 1;
  height: 20px;
  background: #f1f5f9;
  border-radius: 10px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-morado), #8b5cf6);
  border-radius: 10px;
  transition: width 0.6s ease;
}

.bar-value {
  min-width: 100px;
  text-align: right;
  font-size: 0.875rem;
  color: var(--color-oscuro-variante);
}

.category-distribution {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.category-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.category-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.category-name {
  font-size: 0.875rem;
  color: var(--color-oscuro);
}

.category-count {
  font-size: 0.75rem;
  color: var(--color-oscuro-variante);
}

.category-bar {
  height: 8px;
  background: #f1f5f9;
  border-radius: 4px;
  overflow: hidden;
}

.category-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  border-radius: 4px;
  transition: width 0.6s ease;
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

/* =================================================================
   ESTILOS PARA MODALES
   ================================================================= */

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
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
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

.modal--large {
  width: min(700px, 100%);
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

.password-form,
.category-form,
.instructor-form {
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

.password-match {
  margin-top: 0.5rem;
  font-size: 0.875rem;
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

/* Subida de imagen */
.image-upload {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.file-input {
  display: none;
}

.upload-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 2rem;
  border: 2px dashed #cbd5e1;
  border-radius: var(--border-radius-2);
  cursor: pointer;
  transition: all 0.2s ease;
  background: #f8fafc;
  text-align: center;
}

.upload-label:hover {
  border-color: var(--color-morado);
  background: #f1f5f9;
}

.upload-icon {
  font-size: 2rem;
  color: var(--color-morado);
}

.image-preview {
  position: relative;
  max-width: 300px;
  margin: 0 auto;
}

.image-preview img {
  width: 100%;
  height: auto;
  border-radius: var(--border-radius-2);
  border: 1px solid var(--color-light);
}

.image-preview .btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
}

.image-caption {
  text-align: center;
  font-size: 0.875rem;
  color: var(--color-oscuro-variante);
  margin-top: 0.5rem;
}

/* =================================================================
   ESTILOS RESPONSIVE
   ================================================================= */

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

  .management-header {
    flex-direction: column;
    align-items: stretch;
  }

  .stats-overview {
    flex-direction: column;
  }

  .stat-card {
    min-width: auto;
  }

  .categories-grid {
    grid-template-columns: 1fr;
  }

  .metrics-grid {
    grid-template-columns: 1fr;
  }

  .charts-grid {
    grid-template-columns: 1fr;
  }

  .modal {
    width: min(95%, 100%);
  }

  .modal--large {
    width: min(95%, 100%);
  }
}

@media (max-width: 480px) {
  .profile__tab-label {
    font-size: 0.85rem;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .modal__actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
</style>