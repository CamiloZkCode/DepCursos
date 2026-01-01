<template>
  <!-- Modal: Detalles del Curso -->
  <div v-if="showCourseDetailModal" class="modal-backdrop" @click.self="$emit('close-course-detail')">
    <div class="modal modal--xlarge" role="dialog" aria-modal="true" aria-labelledby="course-detail-title">
      <header class="modal__header">
        <div class="modal-header-content">
          <div>
            <h3 id="course-detail-title">{{ selectedCourse?.titulo_curso }}</h3>
          </div>
          <button class="modal__close" @click="$emit('close-course-detail')" aria-label="Cerrar">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
      </header>
      <div class="modal__body">
        <div class="course-detail-content">
          <div class="course-detail-section">
            <div class="section-header">
              <h4>Descripción del Curso</h4>
              <button 
                class="btn btn--outline btn--small"
                @click="$emit('edit-course', selectedCourse)"
              >
                <span class="btn-icon">✏️</span>
                Editar Curso
              </button>
            </div>
            <p class="course-description">{{ selectedCourse?.descripcion }}</p>
            
            <div class="course-details-grid">
              <div class="detail-item">
                <span class="detail-label">Estado:</span>
                <span class="status-badge" :class="`status-badge--${selectedCourse?.estatus === 'Publicado' ? 'active' : 'inactive'}`">
                  {{ selectedCourse?.estatus }}
                </span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Precio:</span>
                <span class="detail-value">${{ selectedCourse?.precio }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Dificultad:</span>
                <span class="detail-value">{{ getDifficultyName(selectedCourse?.id_dificultad) }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Categoría:</span>
                <span class="detail-value">{{ getCategoryName(selectedCourse?.id_categoria) }}</span>
              </div>
            </div>
            
            <div class="detail-item">
              <span class="detail-label">Instructor:</span>
              <span class="detail-value">{{ selectedCourse?.id_instructor }}</span>
            </div>
          </div>
          
          <!-- Gestión de Módulos -->
          <div class="course-detail-section">
            <div class="section-header">
              <h4>Módulos del Curso</h4>
              <button 
                class="btn btn--primary btn--small"
                @click="$emit('create-module', selectedCourse)"
              >
                <span class="btn-icon">➕</span>
                Nuevo Módulo
              </button>
            </div>
            
            <div v-if="courseModules.length" class="modules-list">
              <div 
                v-for="module in courseModules" 
                :key="module.id" 
                class="module-item"
                :class="{ 'is-expanded': expandedModule === module.id }"
              >
                <div class="module-header" @click="$emit('toggle-module', module.id)">
                  <div class="module-info">
                    <div class="module-order">{{ module.order }}.</div>
                    <div>
                      <h5 class="module-title">{{ module.title }}</h5>
                    </div>
                  </div>
                  <div class="module-actions">
                    <button 
                      class="btn btn--ghost btn--xs"
                      @click.stop="$emit('edit-module', module)"
                      title="Editar módulo"
                    >
                      <span>✏️</span>
                    </button>
                    <span class="toggle-icon">{{ expandedModule === module.id ? '▲' : '▼' }}</span>
                  </div>
                </div>
                
                <!-- Lecciones del módulo -->
                <div v-if="expandedModule === module.id" class="module-content">
                  <div class="lesson-management">
                    <div class="lesson-header">
                      <h6>Lecciones del Módulo</h6>
                      <button 
                        class="btn btn--primary btn--xs"
                        @click="$emit('create-lesson', selectedCourse?.id_curso, module.id)"
                      >
                        <span class="btn-icon">➕</span>
                        Nueva Lección
                      </button>
                    </div>
                    
                    <div v-if="moduleLessons(module.id).length" class="lessons-list">
                      <div 
                        v-for="lesson in moduleLessons(module.id)" 
                        :key="lesson.id" 
                        class="lesson-item"
                      >
                        <div class="lesson-info">
                          <div class="lesson-type-badge" :class="`type-${lesson.type}`">
                            {{ getLessonTypeLabel(lesson.type) }}
                          </div>
                          <div>
                            <div class="lesson-title">{{ lesson.order }}. {{ lesson.title }}</div>
                            <div v-if="lesson.duration" class="lesson-meta">
                              <span class="meta-icon">⏱️</span>
                              <span>{{ lesson.duration }} min</span>
                            </div>
                          </div>
                        </div>
                        <button 
                          class="btn btn--ghost btn--xs"
                          @click="$emit('edit-lesson', lesson)"
                          title="Editar lección"
                        >
                          <span>✏️</span>
                        </button>
                      </div>
                    </div>
                    <div v-else class="empty-lessons">
                      <p>No hay lecciones en este módulo</p>
                      <button 
                        class="btn btn--outline btn--small"
                        @click="$emit('create-lesson', selectedCourse?.id_curso, module.id)"
                      >
                        <span class="btn-icon">➕</span>
                        Crear Primera Lección
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="empty-modules">
              <p>No hay módulos en este curso</p>
              <button 
                class="btn btn--outline"
                @click="$emit('create-module', selectedCourse)"
              >
                <span class="btn-icon">➕</span>
                Crear Primer Módulo
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <footer class="modal__footer">
        <button class="btn btn--ghost" @click="$emit('close-course-detail')">
          Cerrar
        </button>
        <button 
          class="btn btn--primary"
          @click="$emit('create-lesson', selectedCourse?.id_curso)"
        >
          <span class="btn-icon">➕</span>
          Nueva Lección (en cualquier módulo)
        </button>
      </footer>
    </div>
  </div>

  <!-- Modal Curso -->
  <div v-if="showCourseModal" class="modal-backdrop" @click.self="$emit('close-course-modal')">
    <div class="modal modal--large" role="dialog" aria-modal="true" aria-labelledby="course-modal-title">
      <header class="modal__header">
        <h3 id="course-modal-title">{{ courseModalTitle }}</h3>
        <button class="modal__close" @click="$emit('close-course-modal')" aria-label="Cerrar">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </header>
      <div class="modal__body">
        <form class="course-form" @submit.prevent="$emit('save-course', formCourse)">
          <div class="form-grid">
            <div class="form-group">
              <label for="course-title" class="form-label">
                Título del curso <span class="required">*</span>
              </label>
              <input 
                id="course-title" 
                v-model="formCourse.titulo_curso" 
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
                v-model="formCourse.id_categoria" 
                class="form-select"
                required
                :disabled="loading.categories"
              >
                <option value="">Seleccionar categoría</option>
                <option 
                  v-for="category in categories" 
                  :key="category.id_categoria" 
                  :value="category.id_categoria"
                >
                  {{ category.nombre_categoria }}
                </option>
              </select>
              <div v-if="loading.categories" class="loading-indicator">
                Cargando categorías...
              </div>
            </div>
          </div>
          
          <div class="form-group">
            <label for="course-description" class="form-label">Descripción</label>
            <textarea 
              id="course-description" 
              v-model="formCourse.descripcion" 
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
                  v-model.number="formCourse.precio" 
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
                v-model="formCourse.id_dificultad" 
                class="form-select"
                required
                :disabled="loading.difficulties"
              >
                <option value="">Seleccionar dificultad</option>
                <option 
                  v-for="difficulty in difficulties" 
                  :key="difficulty.id_dificultad" 
                  :value="difficulty.id_dificultad"
                >
                  {{ difficulty.dificultad }}
                </option>
              </select>
              <div v-if="loading.difficulties" class="loading-indicator">
                Cargando dificultades...
              </div>
            </div>
          </div>
          
          <div class="form-grid">
            <div class="form-group">
              <label for="course-instructor" class="form-label">
                Instructor <span class="required">*</span>
              </label>
              <input 
                id="course-instructor" 
                v-model.number="formCourse.id_instructor" 
                type="number" 
                class="form-input"
                required 
                placeholder="ID del instructor"
              />
              <small class="form-hint">Ingresa el ID numérico del instructor</small>
            </div>
            
            <div class="form-group">
              <label for="course-status" class="form-label">
                Estado <span class="required">*</span>
              </label>
              <select 
                id="course-status" 
                v-model="formCourse.estatus" 
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
                @change="$emit('cover-change', $event)"
                class="file-input"
                :required="!formCourse.id_curso"
              />
              <label for="course-cover-upload" class="upload-label">
                <span class="upload-icon">📷</span>
                <span>Subir portada</span>
                <small>Recomendado: 1200x600px</small>
              </label>
              
              <div v-if="coverPreview" class="image-preview">
                <img :src="coverPreview" alt="Vista previa" />
                <button type="button" class="btn btn--xs btn--ghost" @click="$emit('clear-cover')">
                  <span>✕</span>
                </button>
              </div>
              <div v-else-if="formCourse.img_portada && formCourse.id_curso" class="image-preview">
                <img :src="formCourse.img_portada" alt="Portada actual" />
                <p class="image-caption">Portada actual</p>
              </div>
            </div>
          </div>
          
          <div class="modal__actions">
            <button type="button" class="btn btn--ghost" @click="$emit('close-course-modal')">
              Cancelar
            </button>
            <button type="submit" class="btn btn--primary" :disabled="loading.save">
              {{ loading.save ? 'Guardando...' : (formCourse.id_curso ? 'Actualizar' : 'Crear') }} Curso
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- Modal Módulo -->
  <div v-if="showModuleModal" class="modal-backdrop" @click.self="$emit('close-module-modal')">
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="module-modal-title">
      <header class="modal__header">
        <h3 id="module-modal-title">{{ moduleModalTitle }}</h3>
        <button class="modal__close" @click="$emit('close-module-modal')" aria-label="Cerrar">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </header>
      <div class="modal__body">
        <form class="module-form" @submit.prevent="$emit('save-module', formModule)">
          <!-- Campo de curso como texto (solo lectura) cuando se crea desde detalle de curso -->
          <div class="form-group" v-if="preSelectedCourse">
            <label class="form-label">
              Curso <span class="required">*</span>
            </label>
            <div class="course-readonly-field">
              <input 
                type="text" 
                v-model="preSelectedCourse.titulo_curso" 
                class="form-input"
                readonly
                disabled
              />
              <input 
                type="hidden" 
                v-model="formModule.courseId" 
              />
              <div class="readonly-hint">
                <span>ℹ️</span>
                <small>Este módulo se creará para el curso "{{ preSelectedCourse.titulo_curso }}"</small>
              </div>
            </div>
          </div>
          
          <!-- Select de curso (solo para cuando se crea desde otro lugar) -->
          <div class="form-group" v-else>
            <label for="module-course" class="form-label">
              Curso <span class="required">*</span>
            </label>
            <select 
              id="module-course" 
              v-model="formModule.courseId" 
              class="form-select"
              required
              :disabled="loading.courses"
            >
              <option value="">Seleccionar curso</option>
              <option v-for="course in courses" :key="course.id_curso" :value="course.id_curso">
                {{ course.titulo_curso }}
              </option>
            </select>
            <div v-if="loading.courses" class="loading-indicator">
              Cargando cursos...
            </div>
          </div>
          
          <div class="form-grid">
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
            <button type="button" class="btn btn--ghost" @click="$emit('close-module-modal')">
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

  <!-- Modal Lección -->
  <div v-if="showLessonModal" class="modal-backdrop" @click.self="$emit('close-lesson-modal')">
    <div class="modal modal--xlarge" role="dialog" aria-modal="true" aria-labelledby="lesson-modal-title">
      <header class="modal__header">
        <h3 id="lesson-modal-title">{{ lessonModalTitle }}</h3>
        <button class="modal__close" @click="$emit('close-lesson-modal')" aria-label="Cerrar">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </header>
      <div class="modal__body">
        <form class="lesson-form" @submit.prevent="$emit('save-lesson', formLesson)">
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
                  @change="$emit('lesson-course-change', formLesson.courseId)"
                  :disabled="loading.courses"
                >
                  <option value="">Seleccionar curso</option>
                  <option v-for="course in courses" :key="course.id_curso" :value="course.id_curso">
                    {{ course.titulo_curso }}
                  </option>
                </select>
                <div v-if="loading.courses" class="loading-indicator">
                  Cargando cursos...
                </div>
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
                  @change="$emit('file-change', $event)"
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
                  @change="$emit('file-change', $event)"
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
                      @click="$emit('remove-question', qIndex)"
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
                        @click="$emit('remove-option', qIndex, oIndex)"
                        :disabled="question.options.length <= 2"
                      >
                        ✕
                      </button>
                    </div>
                    
                    <button 
                      type="button" 
                      class="btn btn--outline btn--small"
                      @click="$emit('add-option', qIndex)"
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
                  @click="$emit('add-question')"
                >
                  + Agregar pregunta
                </button>
              </div>
            </div>
          </div>
          
          <div class="modal__actions">
            <button type="button" class="btn btn--ghost" @click="$emit('close-lesson-modal')">
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
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { cursoService } from '@/services/cursos.services'
import { categoriasService } from '@/services/categorias.services'
import { DificultadServices } from '@/services/dificultad.services'

const props = defineProps({
  // Course Detail Modal
  showCourseDetailModal: Boolean,
  selectedCourse: Object,
  courseModules: Array,
  expandedModule: [String, Number],
  lessons: Array,
  
  // Course Modal
  showCourseModal: Boolean,
  courseModalTitle: String,
  formCourse: Object,
  instructorsList: Array,
  coverPreview: String,
  
  // Module Modal
  showModuleModal: Boolean,
  moduleModalTitle: String,
  formModule: Object,
  
  // Lesson Modal
  showLessonModal: Boolean,
  lessonModalTitle: String,
  formLesson: Object,
  availableModulesForLesson: Array,
  selectedFileName: String,
  filePreviewUrl: String
})

const emit = defineEmits([
  // Course Detail Modal
  'close-course-detail',
  'edit-course',
  'create-module',
  'toggle-module',
  'edit-module',
  'create-lesson',
  'edit-lesson',
  
  // Course Modal
  'close-course-modal',
  'save-course',
  'cover-change',
  'clear-cover',
  
  // Module Modal
  'close-module-modal',
  'save-module',
  
  // Lesson Modal
  'close-lesson-modal',
  'save-lesson',
  'lesson-course-change',
  'file-change',
  'add-question',
  'remove-question',
  'add-option',
  'remove-option'
])

// Local state
const lessonTab = ref('info')
const categories = ref([])
const difficulties = ref([])
const courses = ref([])
const loading = ref({
  categories: false,
  difficulties: false,
  courses: false,
  save: false
})

// Cargar datos al montar el componente o cuando se abra el modal de curso
onMounted(() => {
  loadInitialData()
})

// Observar cuando se abre el modal de curso para cargar datos si es necesario
watch(() => props.showCourseModal, (isOpen) => {
  if (isOpen) {
    if (categories.value.length === 0) loadCategories()
    if (difficulties.value.length === 0) loadDifficulties()
  }
})

// Observar cuando se abre el modal de módulo para cargar cursos si es necesario
watch(() => props.showModuleModal, (isOpen) => {
  if (isOpen && courses.value.length === 0) {
    loadCourses()
  }
})

// Observar cuando se abre el modal de lección para cargar cursos si es necesario
watch(() => props.showLessonModal, (isOpen) => {
  if (isOpen && courses.value.length === 0) {
    loadCourses()
  }
})

// Métodos para cargar datos
const loadInitialData = async () => {
  await Promise.all([
    loadCourses(),
    loadCategories(),
    loadDifficulties()
  ])
}

const loadCourses = async () => {
  loading.value.courses = true
  try {
    const response = await cursoService.obtenerCursos()
    if (response.success && response.data) {
      courses.value = response.data
    }
  } catch (error) {
    console.error('Error al cargar cursos:', error)
    courses.value = []
  } finally {
    loading.value.courses = false
  }
}

const loadCategories = async () => {
  loading.value.categories = true
  try {
    const response = await categoriasService.obtenerCategorias()
    if (response.success && response.data) {
      categories.value = response.data
    }
  } catch (error) {
    console.error('Error al cargar categorías:', error)
    categories.value = []
  } finally {
    loading.value.categories = false
  }
}

const loadDifficulties = async () => {
  loading.value.difficulties = true
  try {
    const response = await DificultadServices.obtenerDificultades()
    if (response.success && response.data) {
      difficulties.value = response.data
    }
  } catch (error) {
    console.error('Error al cargar dificultades:', error)
    difficulties.value = []
  } finally {
    loading.value.difficulties = false
  }
}

// Variables computadas
const preSelectedCourse = computed(() => {
  if (props.formModule?.courseId && courses.value?.length) {
    const course = courses.value.find(c => c.id_curso === props.formModule.courseId)
    return course || null
  }
  return null
})

// Métodos auxiliares
const moduleLessons = (moduleId) => {
  return props.lessons?.filter(l => l.moduleId === moduleId).sort((a, b) => a.order - b.order) || []
}

const getLessonTypeLabel = (type) => {
  const labels = {
    'video': '🎬 Video',
    'texto': '📝 Texto',
    'archivo': '📎 Archivo',
    'quiz': '❓ Quiz'
  }
  return labels[type] || type
}

const getDifficultyName = (difficultyId) => {
  if (!difficultyId || !difficulties.value.length) return 'No asignada'
  const difficulty = difficulties.value.find(d => d.id_dificultad === difficultyId)
  return difficulty ? difficulty.nombre_dificultad : 'No asignada'
}

const getCategoryName = (categoryId) => {
  if (!categoryId || !categories.value.length) return 'No asignada'
  const category = categories.value.find(c => c.id_categoria === categoryId)
  return category ? category.nombre_categoria : 'No asignada'
}

// Exponer métodos para uso externo
defineExpose({
  loadCourses,
  loadCategories,
  loadDifficulties,
  setLoading: (type, value) => {
    if (type in loading.value) {
      loading.value[type] = value
    }
  }
})
</script>

<style scoped>
/* Modal de detalles del curso */
.modal-header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
}

.course-detail-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.course-detail-section {
  background: #f8fafc;
  border-radius: var(--border-radius-2);
  padding: 1.5rem;
  border: 1px solid var(--color-light);
}

.course-detail-section .section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  border-bottom: none;
  padding-bottom: 0;
}

.course-detail-section .section-header h4 {
  margin: 0;
  color: var(--color-oscuro);
  font-size: 1.1rem;
}

.course-description {
  margin: 0 0 1.5rem;
  color: var(--color-oscuro-variante);
  line-height: 1.6;
}

.course-details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
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

.detail-value {
  color: var(--color-oscuro-variante);
}

/* Loading indicator */
.loading-indicator {
  margin-top: 0.5rem;
  padding: 0.5rem;
  background: #f0f9ff;
  border-radius: var(--border-radius-1);
  color: #0369a1;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.loading-indicator::before {
  content: '';
  width: 12px;
  height: 12px;
  border: 2px solid #0369a1;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Form hints */
.form-hint {
  display: block;
  margin-top: 0.25rem;
  font-size: 0.75rem;
  color: var(--color-oscuro-variante);
}

/* Módulos en modal de detalles */
.modules-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.module-item {
  background: var(--color-blanco);
  border: 1px solid var(--color-light);
  border-radius: var(--border-radius-2);
  overflow: hidden;
}

.module-header {
  padding: 1rem 1.25rem;
  background: var(--color-blanco);
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background 0.2s ease;
}

.module-header:hover {
  background: #f8fafc;
}

.module-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.module-order {
  font-weight: 700;
  color: var(--color-morado);
  min-width: 24px;
  text-align: center;
}

.module-title {
  margin: 0;
  font-size: 1rem;
  color: var(--color-oscuro);
  font-weight: 600;
}

.module-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.toggle-icon {
  font-size: 0.75rem;
  color: var(--color-oscuro-variante);
}

.module-content {
  border-top: 1px solid var(--color-light);
}

.lesson-management {
  padding: 1.25rem;
}

.lesson-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.lesson-header h6 {
  margin: 0;
  color: var(--color-oscuro);
  font-size: 0.95rem;
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
  background: var(--color-blanco);
  border-radius: var(--border-radius-1);
  border: 1px solid var(--color-light);
}

.lesson-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.lesson-type-badge {
  padding: 0.25rem 0.5rem;
  border-radius: var(--border-radius-1);
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
}

.type-video { background: #fef3c7; color: #92400e; }
.type-texto { background: #dbeafe; color: #1e40af; }
.type-archivo { background: #e0e7ff; color: #3730a3; }
.type-quiz { background: #fce7f3; color: #9d174d; }

.lesson-title {
  font-weight: 600;
  color: var(--color-oscuro);
  font-size: 0.875rem;
}

.lesson-meta {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: var(--color-oscuro-variante);
  margin-top: 0.125rem;
}

.empty-modules,
.empty-lessons {
  text-align: center;
  padding: 2rem;
  background: var(--color-blanco);
  border: 2px dashed var(--color-light);
  border-radius: var(--border-radius-2);
}

.empty-modules p,
.empty-lessons p {
  margin: 0 0 1rem;
  color: var(--color-oscuro-variante);
}

/* Footer del modal */
.modal__footer {
  padding: 1.5rem;
  border-top: 1px solid var(--color-light);
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.form-input:read-only,
.form-input:disabled {
  background-color: #f8fafc;
  color: var(--color-oscuro-variante);
  cursor: not-allowed;
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

/* Campo de curso solo lectura */
.course-readonly-field {
  position: relative;
}

.course-readonly-field .form-input {
  background-color: #f8fafc;
  padding-right: 2.5rem;
}

.readonly-hint {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
  padding: 0.5rem;
  background-color: #f0f9ff;
  border-radius: var(--border-radius-1);
  font-size: 0.875rem;
  color: #0369a1;
}

.readonly-hint span {
  font-size: 1rem;
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
  .modal__footer {
    flex-direction: column;
    gap: 1rem;
  }
  
  .modal__footer .btn {
    width: 100%;
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
}
</style>