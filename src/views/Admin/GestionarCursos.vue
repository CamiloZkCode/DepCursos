<template>
  <main class="profile" aria-describedby="profile-intro">
    <!-- Header -->
    <ProfileHeader 
      :user="user" 
      :avatar-src="avatarSrc" 
      @change-avatar="handleAvatarChange"
      :is-admin="true"
      :is-estudiante="false"
    />

    <!-- Navegación de Tabs -->
    <nav class="profile__tabs" role="tablist" aria-label="Gestión de cursos">
      <button 
        class="profile__tab"
        :class="{ 'is-active': activeTab === 'cursos' }"
        @click="activeTab = 'cursos'"
        role="tab"
        aria-selected="activeTab === 'cursos'"
      >
        <span class="profile__tab-icon">📚</span>
        <span class="profile__tab-label">Mis Cursos</span>
      </button>
    </nav>

    <section class="profile__content">
      <!-- Header con estadísticas -->
      <header class="section-header">
        <div class="header-content">
          <div>
            <h2>Gestionar Cursos</h2>
            <p>Crea y organiza cursos, módulos, lecciones y quizzes.</p>
          </div>
          <div class="header-stats">
            <div class="stat-badge">
              <span class="stat-value">{{ courses.length }}</span>
              <span class="stat-label">Cursos</span>
            </div>
            <div class="stat-badge">
              <span class="stat-value">{{ totalLessons }}</span>
              <span class="stat-label">Lecciones</span>
            </div>
            <div class="stat-badge">
              <span class="stat-value">{{ totalQuizzes }}</span>
              <span class="stat-label">Quizzes</span>
            </div>
          </div>
        </div>
      </header>

      <!-- Acciones principales -->
      <div class="management-actions">
        <button class="btn btn--primary btn--with-icon" @click="openCreateCourseModal">
          <span class="btn-icon">➕</span>
          Crear Nuevo Curso
        </button>
        
        <div class="view-controls">
          <button class="view-toggle" :class="{ 'active': viewMode === 'grid' }" @click="viewMode = 'grid'">
            <span>▦</span>
          </button>
          <button class="view-toggle" :class="{ 'active': viewMode === 'list' }" @click="viewMode = 'list'">
            <span>☰</span>
          </button>
        </div>
      </div>

      <!-- Vista de Cursos - Grid -->
      <div v-if="viewMode === 'grid' && courses.length" class="courses-grid">
        <div 
          v-for="course in courses" 
          :key="course.id" 
          class="course-card"
          :class="{ 'is-expanded': expandedCourse === course.id }"
        >
          <div class="course-card__header">
            <div class="course-card__image" :style="{ backgroundImage: `url(${course.coverImage || defaultCover})` }">
              <div class="course-card__badge">{{ course.status }}</div>
              <div class="course-card__category">{{ course.category }}</div>
            </div>
            
            <div class="course-card__content">
              <h3 class="course-card__title">{{ course.title }}</h3>
              <p class="course-card__description">{{ truncateText(course.description, 100) }}</p>
              
              <div class="course-card__meta">
                <div class="meta-item">
                  <span class="meta-icon">👨‍🏫</span>
                  <span>{{ course.instructor }}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-icon">💰</span>
                  <span>${{ course.price }}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-icon">📊</span>
                  <span>{{ course.difficulty }}</span>
                </div>
              </div>
              
              <div class="course-card__stats">
                <div class="stat">
                  <span class="stat-value">{{ getModulesForCourse(course.id).length }}</span>
                  <span class="stat-label">Módulos</span>
                </div>
                <div class="stat">
                  <span class="stat-value">{{ getLessonsForCourse(course.id).length }}</span>
                  <span class="stat-label">Lecciones</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="course-card__footer">
            <button class="btn btn--outline btn--small" @click="toggleCourseExpansion(course.id)">
              {{ expandedCourse === course.id ? 'Ver menos' : 'Ver detalles' }}
            </button>
            <div class="action-buttons">
              <button class="btn btn--ghost btn--small" @click="openEditCourseModal(course)">
                <span class="btn-icon">✏️</span>
                Editar
              </button>
              <button class="btn btn--primary btn--small" @click="openCreateModuleModal(course.id)">
                <span class="btn-icon">➕</span>
                Módulo
              </button>
            </div>
          </div>
          
          <!-- Contenido expandido -->
          <div v-if="expandedCourse === course.id" class="course-card__expanded">
            <div class="expanded-content">
              <div class="course-details">
                <h4>Detalles del Curso</h4>
                <div class="details-grid">
                  <div class="detail-item">
                    <span class="detail-label">Descripción:</span>
                    <p>{{ course.description }}</p>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Estado:</span>
                    <span class="status-badge" :class="`status-badge--${course.status === 'Publicado' ? 'active' : 'inactive'}`">
                      {{ course.status }}
                    </span>
                  </div>
                </div>
              </div>
              
              <div class="modules-section">
                <div class="section-header">
                  <h4>Módulos y Lecciones</h4>
                  <button class="btn btn--primary btn--small" @click="openCreateLessonModal(course.id)">
                    <span class="btn-icon">➕</span>
                    Nueva Lección
                  </button>
                </div>
                
                <div v-if="getModulesForCourse(course.id).length" class="modules-list">
                  <div 
                    v-for="module in getModulesForCourse(course.id)" 
                    :key="module.id" 
                    class="module-card"
                    :class="{ 'is-expanded': expandedModule === module.id }"
                  >
                    <div class="module-card__header" @click="toggleModuleExpansion(module.id)">
                      <div class="module-info">
                        <span class="module-order">{{ module.order }}.</span>
                        <h5 class="module-title">{{ module.title }}</h5>
                      </div>
                      <div class="module-actions">
                        <button class="btn btn--ghost btn--xs" @click.stop="openEditModuleModal(module)">
                          <span>✏️</span>
                        </button>
                        <span class="toggle-icon">{{ expandedModule === module.id ? '▲' : '▼' }}</span>
                      </div>
                    </div>
                    
                    <div v-if="expandedModule === module.id" class="module-card__content">
                      <div v-if="getLessonsForModule(module.id).length" class="lessons-list">
                        <div 
                          v-for="lesson in getLessonsForModule(module.id)" 
                          :key="lesson.id" 
                          class="lesson-item"
                        >
                          <div class="lesson-info">
                            <div class="lesson-type-badge" :class="`type-${lesson.type}`">
                              {{ lesson.type }}
                            </div>
                            <div>
                              <h6>{{ lesson.order }}. {{ lesson.title }}</h6>
                              <p v-if="lesson.duration" class="lesson-meta">
                                <span class="meta-icon">⏱️</span>
                                {{ lesson.duration }} min
                              </p>
                            </div>
                          </div>
                          <button class="btn btn--ghost btn--xs" @click="openEditLessonModal(lesson)">
                            <span>✏️</span>
                          </button>
                        </div>
                      </div>
                      <p v-else class="empty-state">No hay lecciones en este módulo</p>
                    </div>
                  </div>
                </div>
                <p v-else class="empty-state">No hay módulos en este curso</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Vista de Cursos - List -->
      <div v-else-if="viewMode === 'list' && courses.length" class="courses-table">
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Curso</th>
                <th>Categoría</th>
                <th>Estado</th>
                <th>Módulos</th>
                <th>Lecciones</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="course in courses" :key="course.id">
                <td>
                  <div class="course-cell">
                    <div 
                      class="course-avatar" 
                      :style="{ backgroundImage: `url(${course.coverImage || defaultCover})` }"
                    ></div>
                    <div class="course-info">
                      <strong>{{ course.title }}</strong>
                      <span class="course-instructor">{{ course.instructor }}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="category-badge">{{ course.category }}</span>
                </td>
                <td>
                  <span class="status-badge" :class="`status-badge--${course.status === 'Publicado' ? 'active' : 'inactive'}`">
                    {{ course.status }}
                  </span>
                </td>
                <td>
                  <span class="count-badge">{{ getModulesForCourse(course.id).length }}</span>
                </td>
                <td>
                  <span class="count-badge">{{ getLessonsForCourse(course.id).length }}</span>
                </td>
                <td>
                  <div class="action-buttons">
                    <button class="btn btn--ghost btn--xs" @click="openEditCourseModal(course)">
                      <span>✏️</span>
                    </button>
                    <button class="btn btn--primary btn--xs" @click="openCreateModuleModal(course.id)">
                      <span>📦</span>
                    </button>
                    <button class="btn btn--primary btn--xs" @click="openCreateLessonModal(course.id)">
                      <span>📝</span>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Estado vacío -->
      <div v-else class="empty-state">
        <div class="empty-state__icon">📚</div>
        <h3 class="empty-state__title">No hay cursos creados</h3>
        <p class="empty-state__description">
          Comienza creando tu primer curso para compartir conocimiento
        </p>
        <button class="btn btn--primary" @click="openCreateCourseModal">
          Crear Primer Curso
        </button>
      </div>
    </section>

    <!-- ===== MODALES ===== -->
    <teleport to="body">
      <!-- Modal Curso -->
      <div v-if="showCourseModal" class="modal-backdrop" @click.self="closeCourseModal">
        <div class="modal modal--large" role="dialog" aria-modal="true" aria-labelledby="course-modal-title">
          <header class="modal__header">
            <h3 id="course-modal-title">{{ courseModalTitle }}</h3>
            <button class="modal__close" @click="closeCourseModal" aria-label="Cerrar">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </header>
          <div class="modal__body">
            <form class="course-form" @submit.prevent="saveCourse">
              <div class="form-grid">
                <div class="form-group">
                  <label for="course-title" class="form-label">
                    Título del curso <span class="required">*</span>
                  </label>
                  <input 
                    id="course-title" 
                    v-model="formCourse.title" 
                    type="text" 
                    class="form-input"
                    required 
                    placeholder="Ej: Curso de Yoga para Principiantes"
                  />
                </div>
                
                <div class="form-group">
                  <label for="course-category" class="form-label">
                    Categoría <span class="required">*</span>
                  </label>
                  <select 
                    id="course-category" 
                    v-model="formCourse.category" 
                    class="form-select"
                    required
                  >
                    <option value="">Seleccionar categoría</option>
                    <option v-for="cat in categories" :key="cat.id" :value="cat.name">
                      {{ cat.name }}
                    </option>
                  </select>
                </div>
              </div>
              
              <div class="form-group">
                <label for="course-description" class="form-label">Descripción</label>
                <textarea 
                  id="course-description" 
                  v-model="formCourse.description" 
                  class="form-textarea"
                  rows="3"
                  placeholder="Describe el contenido y objetivos del curso..."
                ></textarea>
              </div>
              
              <div class="form-grid">
                <div class="form-group">
                  <label for="course-price" class="form-label">
                    Precio (USD) <span class="required">*</span>
                  </label>
                  <div class="input-with-icon">
                    <span class="input-icon">$</span>
                    <input 
                      id="course-price" 
                      v-model.number="formCourse.price" 
                      type="number" 
                      min="0" 
                      step="0.01"
                      class="form-input"
                      required 
                      placeholder="49.99"
                    />
                  </div>
                </div>
                
                <div class="form-group">
                  <label for="course-difficulty" class="form-label">
                    Dificultad <span class="required">*</span>
                  </label>
                  <select 
                    id="course-difficulty" 
                    v-model="formCourse.difficulty" 
                    class="form-select"
                    required
                  >
                    <option value="Principiante">Principiante</option>
                    <option value="Intermedio">Intermedio</option>
                    <option value="Avanzado">Avanzado</option>
                  </select>
                </div>
              </div>
              
              <div class="form-grid">
                <div class="form-group">
                  <label for="course-instructor" class="form-label">
                    Instructor <span class="required">*</span>
                  </label>
                  <select 
                    id="course-instructor" 
                    v-model="formCourse.instructor" 
                    class="form-select"
                    required
                  >
                    <option value="">Seleccionar instructor</option>
                    <option v-for="inst in instructorsList" :key="inst.id" :value="inst.name">
                      {{ inst.name }}
                    </option>
                  </select>
                </div>
                
                <div class="form-group">
                  <label for="course-status" class="form-label">
                    Estado <span class="required">*</span>
                  </label>
                  <select 
                    id="course-status" 
                    v-model="formCourse.status" 
                    class="form-select"
                    required
                  >
                    <option value="Borrador">Borrador</option>
                    <option value="Publicado">Publicado</option>
                  </select>
                </div>
              </div>
              
              <div class="form-group">
                <label class="form-label">
                  Portada del curso <span class="required">*</span>
                </label>
                <div class="image-upload">
                  <input 
                    type="file" 
                    id="course-cover-upload"
                    accept="image/*"
                    @change="handleCoverChange"
                    class="file-input"
                  />
                  <label for="course-cover-upload" class="upload-label">
                    <span class="upload-icon">📷</span>
                    <span>Subir portada</span>
                    <small>Recomendado: 1200x600px</small>
                  </label>
                  
                  <div v-if="coverPreview" class="image-preview">
                    <img :src="coverPreview" alt="Vista previa" />
                    <button type="button" class="btn btn--xs btn--ghost" @click="coverPreview = ''">
                      <span>✕</span>
                    </button>
                  </div>
                  <div v-else-if="formCourse.coverImage && formCourse.id" class="image-preview">
                    <img :src="formCourse.coverImage" alt="Portada actual" />
                    <p class="image-caption">Portada actual</p>
                  </div>
                </div>
              </div>
              
              <div class="modal__actions">
                <button type="button" class="btn btn--ghost" @click="closeCourseModal">
                  Cancelar
                </button>
                <button type="submit" class="btn btn--primary">
                  {{ formCourse.id ? 'Actualizar' : 'Crear' }} Curso
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Modal Módulo -->
      <div v-if="showModuleModal" class="modal-backdrop" @click.self="closeModuleModal">
        <div class="modal" role="dialog" aria-modal="true" aria-labelledby="module-modal-title">
          <header class="modal__header">
            <h3 id="module-modal-title">{{ moduleModalTitle }}</h3>
            <button class="modal__close" @click="closeModuleModal" aria-label="Cerrar">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </header>
          <div class="modal__body">
            <form class="module-form" @submit.prevent="saveModule">
              <div class="form-grid">
                <div class="form-group">
                  <label for="module-course" class="form-label">
                    Curso <span class="required">*</span>
                  </label>
                  <select 
                    id="module-course" 
                    v-model="formModule.courseId" 
                    class="form-select"
                    required
                  >
                    <option value="">Seleccionar curso</option>
                    <option v-for="course in courses" :key="course.id" :value="course.id">
                      {{ course.title }}
                    </option>
                  </select>
                </div>
                
                <div class="form-group">
                  <label for="module-order" class="form-label">
                    Orden <span class="required">*</span>
                  </label>
                  <input 
                    id="module-order" 
                    v-model.number="formModule.order" 
                    type="number" 
                    min="1" 
                    class="form-input"
                    required 
                    placeholder="1"
                  />
                </div>
              </div>
              
              <div class="form-group">
                <label for="module-title" class="form-label">
                  Título del módulo <span class="required">*</span>
                </label>
                <input 
                  id="module-title" 
                  v-model="formModule.title" 
                  type="text" 
                  class="form-input"
                  required 
                  placeholder="Ej: Introducción al Yoga"
                />
              </div>
              
              <div class="modal__actions">
                <button type="button" class="btn btn--ghost" @click="closeModuleModal">
                  Cancelar
                </button>
                <button type="submit" class="btn btn--primary">
                  {{ formModule.id ? 'Actualizar' : 'Crear' }} Módulo
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Modal Lección (mejorado) -->
      <div v-if="showLessonModal" class="modal-backdrop" @click.self="closeLessonModal">
        <div class="modal modal--xlarge" role="dialog" aria-modal="true" aria-labelledby="lesson-modal-title">
          <header class="modal__header">
            <h3 id="lesson-modal-title">{{ lessonModalTitle }}</h3>
            <button class="modal__close" @click="closeLessonModal" aria-label="Cerrar">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </header>
          <div class="modal__body">
            <form class="lesson-form" @submit.prevent="saveLesson">
              <div class="form-tabs">
                <button 
                  type="button" 
                  class="form-tab"
                  :class="{ 'is-active': lessonTab === 'info' }"
                  @click="lessonTab = 'info'"
                >
                  Información
                </button>
                <button 
                  v-if="formLesson.type === 'quiz'" 
                  type="button" 
                  class="form-tab"
                  :class="{ 'is-active': lessonTab === 'quiz' }"
                  @click="lessonTab = 'quiz'"
                >
                  Configurar Quiz
                </button>
              </div>
              
              <div v-if="lessonTab === 'info'" class="form-tab-content">
                <div class="form-grid">
                  <div class="form-group">
                    <label for="lesson-course" class="form-label">
                      Curso <span class="required">*</span>
                    </label>
                    <select 
                      id="lesson-course" 
                      v-model="formLesson.courseId" 
                      class="form-select"
                      required
                      @change="formLesson.moduleId = null"
                    >
                      <option value="">Seleccionar curso</option>
                      <option v-for="course in courses" :key="course.id" :value="course.id">
                        {{ course.title }}
                      </option>
                    </select>
                  </div>
                  
                  <div class="form-group">
                    <label for="lesson-module" class="form-label">
                      Módulo <span class="required">*</span>
                    </label>
                    <select 
                      id="lesson-module" 
                      v-model="formLesson.moduleId" 
                      class="form-select"
                      required
                      :disabled="!formLesson.courseId"
                    >
                      <option value="">Seleccionar módulo</option>
                      <option 
                        v-for="module in availableModulesForLesson" 
                        :key="module.id" 
                        :value="module.id"
                      >
                        {{ module.order }}. {{ module.title }}
                      </option>
                    </select>
                  </div>
                </div>
                
                <div class="form-grid">
                  <div class="form-group">
                    <label for="lesson-title" class="form-label">
                      Título <span class="required">*</span>
                    </label>
                    <input 
                      id="lesson-title" 
                      v-model="formLesson.title" 
                      type="text" 
                      class="form-input"
                      required 
                      placeholder="Título de la lección"
                    />
                  </div>
                  
                  <div class="form-group">
                    <label for="lesson-type" class="form-label">
                      Tipo <span class="required">*</span>
                    </label>
                    <select 
                      id="lesson-type" 
                      v-model="formLesson.type" 
                      class="form-select"
                      required
                    >
                      <option value="video">🎬 Video</option>
                      <option value="texto">📝 Texto</option>
                      <option value="archivo">📎 Archivo</option>
                      <option value="quiz">❓ Quiz</option>
                    </select>
                  </div>
                </div>
                
                <div class="form-grid">
                  <div class="form-group">
                    <label for="lesson-order" class="form-label">
                      Orden <span class="required">*</span>
                    </label>
                    <input 
                      id="lesson-order" 
                      v-model.number="formLesson.order" 
                      type="number" 
                      min="1" 
                      class="form-input"
                      required 
                      placeholder="1"
                    />
                  </div>
                  
                  <div class="form-group" v-if="formLesson.type !== 'quiz'">
                    <label for="lesson-duration" class="form-label">
                      Duración (minutos)
                    </label>
                    <input 
                      id="lesson-duration" 
                      v-model.number="formLesson.duration" 
                      type="number" 
                      min="0" 
                      class="form-input"
                      placeholder="0"
                    />
                  </div>
                </div>
                
                <!-- Contenido específico por tipo -->
                <div v-if="formLesson.type === 'video'" class="form-group">
                  <label class="form-label">
                    Video <span class="required">*</span>
                  </label>
                  <div class="file-upload">
                    <input 
                      type="file" 
                      id="lesson-video-upload"
                      accept="video/*"
                      @change="handleFileChange"
                      class="file-input"
                    />
                    <label for="lesson-video-upload" class="upload-label">
                      <span class="upload-icon">🎬</span>
                      <span>Subir video</span>
                      <small>Formatos: MP4, WebM, MOV</small>
                    </label>
                    
                    <div v-if="selectedFileName" class="file-preview">
                      <p><strong>Archivo:</strong> {{ selectedFileName }}</p>
                      <video v-if="filePreviewUrl" controls class="video-preview">
                        <source :src="filePreviewUrl" />
                      </video>
                    </div>
                  </div>
                </div>
                
                <div v-if="formLesson.type === 'texto'" class="form-group">
                  <label for="lesson-content" class="form-label">
                    Contenido <span class="required">*</span>
                  </label>
                  <textarea 
                    id="lesson-content" 
                    v-model="formLesson.contentText" 
                    class="form-textarea"
                    rows="8"
                    placeholder="Escribe el contenido de la lección..."
                  ></textarea>
                </div>
                
                <div v-if="formLesson.type === 'archivo'" class="form-group">
                  <label class="form-label">
                    Archivo <span class="required">*</span>
                  </label>
                  <div class="file-upload">
                    <input 
                      type="file" 
                      id="lesson-file-upload"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
                      @change="handleFileChange"
                      class="file-input"
                    />
                    <label for="lesson-file-upload" class="upload-label">
                      <span class="upload-icon">📎</span>
                      <span>Subir archivo</span>
                      <small>PDF, Word, Excel, PowerPoint, Texto</small>
                    </label>
                    
                    <div v-if="selectedFileName" class="file-preview">
                      <p><strong>Archivo:</strong> {{ selectedFileName }}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Pestaña de Quiz -->
              <div v-if="lessonTab === 'quiz' && formLesson.type === 'quiz'" class="form-tab-content">
                <div class="quiz-config">
                  <div class="form-group">
                    <label for="quiz-title" class="form-label">
                      Título del quiz <span class="required">*</span>
                    </label>
                    <input 
                      id="quiz-title" 
                      v-model="formLesson.quiz.title" 
                      type="text" 
                      class="form-input"
                      required 
                      placeholder="Ej: Examen del módulo 1"
                    />
                  </div>
                  
                  <div class="quiz-settings">
                    <h4>Preguntas</h4>
                    
                    <div 
                      v-for="(question, qIndex) in formLesson.quiz.questions" 
                      :key="qIndex" 
                      class="question-card"
                    >
                      <div class="question-header">
                        <h5>Pregunta {{ qIndex + 1 }}</h5>
                        <button 
                          type="button" 
                          class="btn btn--danger btn--xs"
                          @click="removeQuestion(qIndex)"
                          :disabled="formLesson.quiz.questions.length <= 1"
                        >
                          Eliminar
                        </button>
                      </div>
                      
                      <div class="form-group">
                        <label class="form-label">
                          Enunciado <span class="required">*</span>
                        </label>
                        <textarea 
                          v-model="question.text" 
                          class="form-textarea"
                          rows="2"
                          placeholder="Escribe la pregunta..."
                          required
                        ></textarea>
                      </div>
                      
                      <div class="options-section">
                        <h6>Opciones de respuesta</h6>
                        
                        <div 
                          v-for="(option, oIndex) in question.options" 
                          :key="oIndex" 
                          class="option-row"
                        >
                          <div class="option-content">
                            <input 
                              type="radio" 
                              :name="'correct-' + qIndex" 
                              v-model="question.correctOption" 
                              :value="oIndex"
                              class="correct-radio"
                            />
                            <input 
                              v-model="option.text" 
                              type="text" 
                              class="form-input"
                              placeholder="Texto de la opción..."
                              required
                            />
                          </div>
                          <button 
                            type="button" 
                            class="btn btn--ghost btn--xs"
                            @click="removeOption(qIndex, oIndex)"
                            :disabled="question.options.length <= 2"
                          >
                            ✕
                          </button>
                        </div>
                        
                        <button 
                          type="button" 
                          class="btn btn--outline btn--small"
                          @click="addOption(qIndex)"
                        >
                          + Agregar opción
                        </button>
                        
                        <div class="correct-hint" v-if="question.correctOption !== undefined">
                          ✅ Opción {{ question.correctOption + 1 }} marcada como correcta
                        </div>
                      </div>
                    </div>
                    
                    <button 
                      type="button" 
                      class="btn btn--primary"
                      @click="addQuestion"
                    >
                      + Agregar pregunta
                    </button>
                  </div>
                </div>
              </div>
              
              <div class="modal__actions">
                <button type="button" class="btn btn--ghost" @click="closeLessonModal">
                  Cancelar
                </button>
                <button 
                  v-if="lessonTab === 'quiz'" 
                  type="button" 
                  class="btn btn--outline"
                  @click="lessonTab = 'info'"
                >
                  ← Volver
                </button>
                <button type="submit" class="btn btn--primary">
                  {{ formLesson.id ? 'Actualizar' : 'Crear' }} Lección
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
import { ref, computed, reactive } from 'vue'
import ProfileHeader from '@/components/ProfileHeader.vue'

// Estado principal
const activeTab = ref('cursos')
const viewMode = ref('grid') // 'grid' | 'list'
const expandedCourse = ref(null)
const expandedModule = ref(null)

// Datos del usuario
const user = reactive({
  firstName: 'Admin',
  lastName: 'Ejemplo',
  fullName: computed(() => `${user.firstName} ${user.lastName}`),
  role: 'Administrador - Academia Deportiva'
})

const avatarSrc = ref('/src/assets/icons/LogoFondo.jpeg')
const defaultCover = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=200&fit=crop'

// Datos de ejemplo
const courses = reactive([
  {
    id: 1,
    title: 'Curso de Yoga para Principiantes',
    description: 'Aprende las bases del yoga con este curso completo para principiantes. Incluye posturas básicas, técnicas de respiración y meditación.',
    price: 49.99,
    coverImage: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=400&h=200&fit=crop',
    category: 'Yoga',
    difficulty: 'Principiante',
    instructor: 'Ana Martínez',
    status: 'Publicado'
  },
  {
    id: 2,
    title: 'Entrenamiento Fitness Avanzado',
    description: 'Programa intensivo de fitness para personas con experiencia. Mejora tu fuerza, resistencia y composición corporal.',
    price: 79.99,
    coverImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=200&fit=crop',
    category: 'Fitness',
    difficulty: 'Avanzado',
    instructor: 'Carlos Rodríguez',
    status: 'Borrador'
  }
])

const modules = reactive([
  { id: 1, courseId: 1, title: 'Introducción al Yoga', order: 1 },
  { id: 2, courseId: 1, title: 'Posturas Básicas', order: 2 },
  { id: 3, courseId: 2, title: 'Fundamentos del Entrenamiento', order: 1 }
])

const lessons = reactive([
  { 
    id: 1, 
    moduleId: 1, 
    title: '¿Qué es el Yoga?', 
    type: 'video', 
    order: 1, 
    duration: 15 
  },
  { 
    id: 2, 
    moduleId: 1, 
    title: 'Beneficios del Yoga', 
    type: 'texto', 
    order: 2, 
    duration: 10,
    contentText: 'El yoga ofrece numerosos beneficios...' 
  },
  { 
    id: 3, 
    moduleId: 2, 
    title: 'Postura de la Montaña', 
    type: 'video', 
    order: 1, 
    duration: 20 
  },
  { 
    id: 4, 
    moduleId: 3, 
    title: 'Principios del Fitness', 
    type: 'archivo', 
    order: 1, 
    duration: 25 
  }
])

const categories = reactive([
  { id: 1, name: 'Fitness' },
  { id: 2, name: 'Yoga' },
  { id: 3, name: 'Nutrición' }
])

const instructorsList = reactive([
  { id: 1, name: 'Carlos Rodríguez' },
  { id: 2, name: 'Ana Martínez' },
  { id: 3, name: 'Luis Gómez' }
])

// Computed properties
const totalLessons = computed(() => lessons.length)
const totalQuizzes = computed(() => lessons.filter(l => l.type === 'quiz').length)

const getModulesForCourse = (courseId) => {
  return modules.filter(m => m.courseId === courseId).sort((a, b) => a.order - b.order)
}

const getLessonsForCourse = (courseId) => {
  const courseModules = modules.filter(m => m.courseId === courseId).map(m => m.id)
  return lessons.filter(l => courseModules.includes(l.moduleId))
}

const getLessonsForModule = (moduleId) => {
  return lessons.filter(l => l.moduleId === moduleId).sort((a, b) => a.order - b.order)
}

// Funciones de utilidad
const truncateText = (text, length) => {
  if (!text) return ''
  return text.length > length ? text.substring(0, length) + '...' : text
}

const toggleCourseExpansion = (courseId) => {
  expandedCourse.value = expandedCourse.value === courseId ? null : courseId
  if (expandedCourse.value === courseId) {
    expandedModule.value = null
  }
}

const toggleModuleExpansion = (moduleId) => {
  expandedModule.value = expandedModule.value === moduleId ? null : moduleId
}

// Avatar
const handleAvatarChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    avatarSrc.value = URL.createObjectURL(file)
    alert('Imagen de perfil actualizada (simulado).')
  }
}

// Modal Curso
const showCourseModal = ref(false)
const courseModalTitle = ref('Nuevo Curso')
const formCourse = reactive({
  id: null,
  title: '',
  description: '',
  price: 0,
  coverImage: '',
  category: '',
  difficulty: 'Principiante',
  instructor: '',
  status: 'Borrador'
})
const coverPreview = ref('')
const selectedCoverFile = ref(null)

const openCreateCourseModal = () => {
  Object.assign(formCourse, { 
    id: null, 
    title: '', 
    description: '', 
    price: 0, 
    coverImage: '', 
    category: '', 
    difficulty: 'Principiante', 
    instructor: '', 
    status: 'Borrador' 
  })
  selectedCoverFile.value = null
  coverPreview.value = ''
  courseModalTitle.value = 'Nuevo Curso'
  showCourseModal.value = true
}

const openEditCourseModal = (course) => {
  Object.assign(formCourse, { ...course })
  selectedCoverFile.value = null
  coverPreview.value = ''
  courseModalTitle.value = 'Editar Curso'
  showCourseModal.value = true
}

const handleCoverChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    selectedCoverFile.value = file
    coverPreview.value = URL.createObjectURL(file)
  }
}

const saveCourse = () => {
  if (formCourse.title && formCourse.price >= 0 && formCourse.category && formCourse.instructor) {
    if (formCourse.id) {
      const index = courses.findIndex(c => c.id === formCourse.id)
      if (index !== -1) {
        courses[index] = { 
          ...formCourse,
          coverImage: selectedCoverFile.value ? 'URL_SIMULADA_' + selectedCoverFile.value.name : courses[index].coverImage
        }
      }
    } else {
      courses.push({ 
        id: courses.length + 1, 
        ...formCourse,
        coverImage: selectedCoverFile.value ? 'URL_SIMULADA_' + selectedCoverFile.value.name : defaultCover
      })
    }
    alert('Curso guardado exitosamente')
    closeCourseModal()
  }
}

const closeCourseModal = () => {
  showCourseModal.value = false
  selectedCoverFile.value = null
  coverPreview.value = ''
}

// Modal Módulo
const showModuleModal = ref(false)
const moduleModalTitle = ref('Nuevo Módulo')
const formModule = reactive({
  id: null,
  courseId: null,
  title: '',
  order: 1
})

const openCreateModuleModal = (courseId) => {
  const nextOrder = getModulesForCourse(courseId).length + 1
  Object.assign(formModule, { 
    id: null, 
    courseId: courseId, 
    title: '', 
    order: nextOrder 
  })
  moduleModalTitle.value = 'Nuevo Módulo'
  showModuleModal.value = true
}

const openEditModuleModal = (module) => {
  Object.assign(formModule, { ...module })
  moduleModalTitle.value = 'Editar Módulo'
  showModuleModal.value = true
}

const saveModule = () => {
  if (formModule.courseId && formModule.title && formModule.order) {
    if (formModule.id) {
      const index = modules.findIndex(m => m.id === formModule.id)
      if (index !== -1) {
        modules[index] = { ...formModule }
      }
    } else {
      modules.push({ 
        id: modules.length + 1, 
        ...formModule 
      })
    }
    alert('Módulo guardado exitosamente')
    closeModuleModal()
  }
}

const closeModuleModal = () => {
  showModuleModal.value = false
}

// Modal Lección
const showLessonModal = ref(false)
const lessonModalTitle = ref('Nueva Lección')
const lessonTab = ref('info')
const formLesson = reactive({
  id: null,
  courseId: null,
  moduleId: null,
  title: '',
  type: 'video',
  duration: 0,
  order: 1,
  contentText: '',
  quiz: { title: '', questions: [] }
})
const selectedFileName = ref('')
const filePreviewUrl = ref('')

const availableModulesForLesson = computed(() => {
  if (!formLesson.courseId) return []
  return getModulesForCourse(formLesson.courseId)
})

const openCreateLessonModal = (courseId) => {
  resetLessonForm()
  formLesson.courseId = courseId
  lessonModalTitle.value = 'Nueva Lección'
  lessonTab.value = 'info'
  showLessonModal.value = true
}

const openEditLessonModal = (lesson) => {
  resetLessonForm()
  // Encontrar el curso al que pertenece el módulo
  const module = modules.find(m => m.id === lesson.moduleId)
  if (module) {
    formLesson.courseId = module.courseId
    formLesson.moduleId = module.id
  }
  
  Object.assign(formLesson, {
    id: lesson.id,
    title: lesson.title,
    type: lesson.type,
    duration: lesson.duration || 0,
    order: lesson.order,
    contentText: lesson.contentText || '',
    quiz: lesson.quiz ? JSON.parse(JSON.stringify(lesson.quiz)) : { title: '', questions: [] }
  })
  
  // Convertir opciones correctas a formato radio
  if (lesson.type === 'quiz' && lesson.quiz && lesson.quiz.questions) {
    formLesson.quiz.questions.forEach((q, qIndex) => {
      if (q.options) {
        q.correctOption = q.options.findIndex(o => o.correct === true)
      }
    })
  }
  
  lessonModalTitle.value = 'Editar Lección'
  lessonTab.value = 'info'
  showLessonModal.value = true
}

const resetLessonForm = () => {
  Object.assign(formLesson, {
    id: null,
    courseId: null,
    moduleId: null,
    title: '',
    type: 'video',
    duration: 0,
    order: 1,
    contentText: '',
    quiz: { title: '', questions: [] }
  })
  selectedFileName.value = ''
  filePreviewUrl.value = ''
}

const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    formLesson.file = file
    selectedFileName.value = file.name
    if (formLesson.type === 'video') {
      filePreviewUrl.value = URL.createObjectURL(file)
    } else {
      filePreviewUrl.value = ''
    }
  }
}

const saveLesson = () => {
  // Validaciones básicas
  if (!formLesson.moduleId || !formLesson.title || !formLesson.order) {
    alert('Completa todos los campos requeridos')
    return
  }

  // Validaciones específicas por tipo
  if (formLesson.type === 'quiz') {
    if (!formLesson.quiz.title || formLesson.quiz.questions.length === 0) {
      alert('Completa la configuración del quiz')
      return
    }
    
    // Validar cada pregunta
    const invalidQuestion = formLesson.quiz.questions.find(q => 
      !q.text || q.options.length < 2 || q.correctOption === undefined
    )
    
    if (invalidQuestion) {
      alert('Completa todas las preguntas con al menos 2 opciones y marca la respuesta correcta')
      return
    }
    
    // Preparar datos del quiz
    const quizData = { 
      title: formLesson.quiz.title,
      questions: formLesson.quiz.questions.map(q => ({
        text: q.text,
        options: q.options.map((o, index) => ({
          text: o.text,
          correct: index === q.correctOption
        }))
      }))
    }
    
    // Crear lección de quiz
    const lessonData = {
      id: formLesson.id || lessons.length + 1,
      moduleId: formLesson.moduleId,
      title: formLesson.title,
      type: 'quiz',
      order: formLesson.order,
      quiz: quizData
    }
    
    if (formLesson.id) {
      const index = lessons.findIndex(l => l.id === formLesson.id)
      if (index !== -1) {
        lessons[index] = lessonData
      }
    } else {
      lessons.push(lessonData)
    }
    
  } else {
    // Crear lección normal (video, texto, archivo)
    const lessonData = {
      id: formLesson.id || lessons.length + 1,
      moduleId: formLesson.moduleId,
      title: formLesson.title,
      type: formLesson.type,
      order: formLesson.order,
      duration: formLesson.duration || undefined,
      contentText: formLesson.contentText || undefined
    }
    
    if (formLesson.file) {
      lessonData.fileName = formLesson.file.name
    }
    
    if (formLesson.id) {
      const index = lessons.findIndex(l => l.id === formLesson.id)
      if (index !== -1) {
        lessons[index] = lessonData
      }
    } else {
      lessons.push(lessonData)
    }
  }
  
  alert('Lección guardada exitosamente')
  closeLessonModal()
}

const closeLessonModal = () => {
  showLessonModal.value = false
  resetLessonForm()
  lessonTab.value = 'info'
}

// Funciones para gestionar quiz
const addQuestion = () => {
  formLesson.quiz.questions.push({
    text: '',
    options: [{ text: '' }, { text: '' }],
    correctOption: 0
  })
}

const addOption = (qIndex) => {
  formLesson.quiz.questions[qIndex].options.push({ text: '' })
}

const removeQuestion = (qIndex) => {
  if (formLesson.quiz.questions.length > 1) {
    formLesson.quiz.questions.splice(qIndex, 1)
  }
}

const removeOption = (qIndex, oIndex) => {
  const question = formLesson.quiz.questions[qIndex]
  if (question.options.length > 2) {
    question.options.splice(oIndex, 1)
    // Ajustar respuesta correcta si es necesario
    if (question.correctOption === oIndex) {
      question.correctOption = 0
    } else if (question.correctOption > oIndex) {
      question.correctOption--
    }
  }
}
</script>

<style scoped>
/* Estilos base del perfil admin */
.profile {
  display: grid;
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem;
}

/* Tabs */
.profile__tabs {
  display: flex;
  gap: 0.25rem;
  overflow-x: auto;
  border-bottom: 1px solid var(--color-light);
  padding-bottom: 0.5rem;
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

/* Contenido principal */
.profile__content {
  background: var(--color-blanco);
  border-radius: var(--border-radius-3);
  box-shadow: var(--box-shadow);
  overflow: hidden;
}

/* Header con estadísticas */
.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.header-stats {
  display: flex;
  gap: 1rem;
}

.stat-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.75rem 1.25rem;
  background: #f8fafc;
  border-radius: var(--border-radius-2);
  border: 1px solid var(--color-light);
  min-width: 80px;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-morado);
  line-height: 1;
}

.stat-label {
  margin-top: 0.25rem;
  font-size: 0.875rem;
  color: var(--color-oscuro-variante);
}

/* Acciones de gestión */
.management-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1rem 0;
  border-bottom: 1px solid var(--color-light);
}

.btn--with-icon {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.view-controls {
  display: flex;
  gap: 0.25rem;
  background: #f8fafc;
  padding: 0.25rem;
  border-radius: var(--border-radius-2);
  border: 1px solid var(--color-light);
}

.view-toggle {
  padding: 0.5rem 1rem;
  background: transparent;
  border: none;
  border-radius: var(--border-radius-1);
  cursor: pointer;
  color: var(--color-oscuro-variante);
  transition: all 0.2s ease;
}

.view-toggle:hover {
  background: #e2e8f0;
}

.view-toggle.active {
  background: var(--color-blanco);
  color: var(--color-morado);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Grid de cursos */
.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.course-card {
  background: var(--color-blanco);
  border-radius: var(--border-radius-2);
  border: 1px solid var(--color-light);
  overflow: hidden;
  transition: all 0.3s ease;
}

.course-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.course-card__header {
  position: relative;
}

.course-card__image {
  height: 200px;
  background-size: cover;
  background-position: center;
  position: relative;
}

.course-card__badge {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: var(--color-morado);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: var(--border-radius-1);
  font-weight: 600;
  font-size: 0.75rem;
}

.course-card__category {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: var(--border-radius-1);
  font-size: 0.75rem;
}

.course-card__content {
  padding: 1.5rem;
}

.course-card__title {
  margin: 0 0 0.75rem;
  color: var(--color-oscuro);
  font-size: 1.1rem;
  font-weight: 600;
}

.course-card__description {
  margin: 0 0 1rem;
  color: var(--color-oscuro-variante);
  font-size: 0.875rem;
  line-height: 1.5;
}

.course-card__meta {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--color-oscuro-variante);
}

.meta-icon {
  font-size: 1rem;
}

.course-card__stats {
  display: flex;
  gap: 1.5rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--color-light);
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-morado);
}

.stat-label {
  font-size: 0.75rem;
  color: var(--color-oscuro-variante);
  margin-top: 0.25rem;
}

.course-card__footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--color-light);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

/* Contenido expandido */
.course-card__expanded {
  border-top: 1px solid var(--color-light);
}

.expanded-content {
  padding: 1.5rem;
}

.details-grid {
  display: grid;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.detail-label {
  font-weight: 600;
  color: var(--color-oscuro);
  font-size: 0.875rem;
}

/* Módulos en vista expandida */
.modules-section {
  margin-top: 2rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.modules-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.module-card {
  border: 1px solid var(--color-light);
  border-radius: var(--border-radius-2);
  overflow: hidden;
}

.module-card__header {
  padding: 1rem 1.25rem;
  background: #f8fafc;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background 0.2s ease;
}

.module-card__header:hover {
  background: #f1f5f9;
}

.module-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.module-order {
  font-weight: 700;
  color: var(--color-morado);
}

.module-title {
  margin: 0;
  font-size: 1rem;
  color: var(--color-oscuro);
}

.module-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.module-card__content {
  padding: 1.25rem;
  background: var(--color-blanco);
}

.lessons-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.lesson-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #f8fafc;
  border-radius: var(--border-radius-1);
}

.lesson-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.lesson-type-badge {
  padding: 0.25rem 0.5rem;
  border-radius: var(--border-radius-1);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.type-video { background: #fef3c7; color: #92400e; }
.type-texto { background: #dbeafe; color: #1e40af; }
.type-archivo { background: #e0e7ff; color: #3730a3; }
.type-quiz { background: #fce7f3; color: #9d174d; }

.lesson-meta {
  margin: 0.25rem 0 0;
  font-size: 0.875rem;
  color: var(--color-oscuro-variante);
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

/* Vista de tabla */
.courses-table {
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
  min-width: 800px;
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
}

.data-table tr:hover {
  background: #f8fafc;
}

.course-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.course-avatar {
  width: 50px;
  height: 50px;
  border-radius: var(--border-radius-2);
  background-size: cover;
  background-position: center;
  background-color: #f1f5f9;
}

.course-info {
  display: flex;
  flex-direction: column;
}

.course-instructor {
  font-size: 0.875rem;
  color: var(--color-oscuro-variante);
}

.category-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: #e0e7ff;
  color: #3730a3;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.status-badge--active {
  background: #d1fae5;
  color: #065f46;
}

.status-badge--inactive {
  background: #fee2e2;
  color: #991b1b;
}

.count-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: var(--color-morado);
  color: white;
  border-radius: 50%;
  font-weight: 600;
  font-size: 0.875rem;
}

/* Estado vacío */
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

/* Modales */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: grid;
  place-items: center;
  padding: 1rem;
  z-index: 1000;
}

.modal {
  background: var(--color-blanco);
  width: min(600px, 100%);
  max-height: 90vh;
  overflow-y: auto;
  border-radius: var(--border-radius-3);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.modal--large {
  width: min(800px, 100%);
}

.modal--xlarge {
  width: min(900px, 100%);
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

/* Formularios en modales */
.form-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid var(--color-light);
}

.form-tab {
  padding: 0.75rem 1rem;
  background: transparent;
  border: none;
  border-bottom: 3px solid transparent;
  cursor: pointer;
  color: var(--color-oscuro-variante);
  font-weight: 600;
  transition: all 0.2s ease;
}

.form-tab:hover {
  color: var(--color-morado);
}

.form-tab.is-active {
  color: var(--color-morado);
  border-bottom-color: var(--color-morado);
}

.form-tab-content {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Estilos de formulario */
.course-form,
.module-form,
.lesson-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
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

.input-with-icon {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-oscuro-variante);
}

.input-with-icon .form-input {
  padding-left: 2.5rem;
}

/* Subida de archivos */
.image-upload,
.file-upload {
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

.upload-label small {
  font-size: 0.875rem;
  color: var(--color-oscuro-variante);
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

.file-preview {
  padding: 1rem;
  background: #f8fafc;
  border-radius: var(--border-radius-2);
  border: 1px solid var(--color-light);
}

.video-preview {
  width: 100%;
  max-height: 300px;
  border-radius: var(--border-radius-2);
  margin-top: 0.5rem;
}

/* Quiz builder */
.quiz-config {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.quiz-settings {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.question-card {
  padding: 1.5rem;
  background: #f8fafc;
  border-radius: var(--border-radius-2);
  border: 1px solid var(--color-light);
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.question-header h5 {
  margin: 0;
  color: var(--color-oscuro);
}

.options-section {
  margin-top: 1rem;
}

.options-section h6 {
  margin: 0 0 1rem;
  color: var(--color-oscuro);
  font-size: 0.875rem;
}

.option-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.option-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
}

.correct-radio {
  width: 20px;
  height: 20px;
  accent-color: var(--color-morado);
}

.correct-hint {
  margin-top: 0.75rem;
  padding: 0.5rem;
  background: #d1fae5;
  color: #065f46;
  border-radius: var(--border-radius-1);
  font-size: 0.875rem;
  font-weight: 600;
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

.btn--danger {
  background: #ef4444;
  color: white;
  border: none;
}

.btn--danger:hover:not(:disabled) {
  filter: brightness(1.1);
}

.btn--small {
  padding: 0.5rem 1rem;
  font-size: 0.85rem;
}

.btn--xs {
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  min-width: auto;
}

.btn-icon {
  font-size: 1rem;
}

.modal__actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-light);
}

/* Responsive */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    align-items: stretch;
  }
  
  .header-stats {
    justify-content: center;
  }
  
  .management-actions {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .view-controls {
    align-self: center;
  }
  
  .courses-grid {
    grid-template-columns: 1fr;
  }
  
  .modal {
    width: min(95%, 100%);
  }
  
  .modal--large,
  .modal--xlarge {
    width: min(95%, 100%);
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