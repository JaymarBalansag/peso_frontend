<template>
  <div v-if="document" class="document-preview">
    <template v-if="previewUrl">
      <button
        v-if="isImage"
        type="button"
        class="document-thumbnail-button"
        :aria-label="`Zoom in on ${document.label}`"
        @click="showZoom = true"
      >
        <img class="document-thumbnail" :src="previewUrl" :alt="document.label" loading="lazy">
        <span class="thumbnail-hint"><i class="bi bi-search" aria-hidden="true"></i> Click to enlarge</span>
      </button>
      <div v-else class="document-file-icon" aria-hidden="true">
        <i class="bi bi-file-earmark-text"></i>
        <span>PDF or document</span>
      </div>
      <div class="document-preview-copy">
        <strong>{{ document.label || 'Applicant document' }}</strong>
        <small>{{ document.file_name }}</small>
        <a class="document-open-button" :href="previewUrl" target="_blank" rel="noopener noreferrer">
          {{ isImage ? 'View full image' : 'Open document' }}
          <i class="bi bi-box-arrow-up-right" aria-hidden="true"></i>
        </a>
      </div>
      <div
        v-if="showZoom && isImage"
        class="document-zoom-backdrop"
        role="presentation"
        @click.self="closeZoom"
        @keydown.esc.stop="closeZoom"
      >
        <section
          class="document-zoom-dialog"
          role="dialog"
          aria-modal="true"
          :aria-label="`Image preview: ${document.label || document.file_name}`"
        >
          <header class="document-zoom-header">
            <div>
              <h2>{{ document.label || 'Applicant document' }}</h2>
              <p>{{ document.file_name }}</p>
            </div>
            <button type="button" class="zoom-close-button" aria-label="Close image preview" @click="closeZoom">
              <i class="bi bi-x-lg" aria-hidden="true"></i>
            </button>
          </header>
          <div
            class="document-zoom-image-frame"
            :class="{ 'is-zoomed': imageZoom > 1, 'is-dragging': isDragging }"
            @pointerdown="startPan"
            @pointermove="panImage"
            @pointerup="stopPan"
            @pointercancel="stopPan"
          >
            <img
              ref="zoomImage"
              :src="previewUrl"
              :alt="document.label || 'Applicant document'"
              draggable="false"
              :style="{ transform: `translate(${panX}px, ${panY}px) scale(${imageZoom})` }"
            >
          </div>
          <footer class="document-zoom-footer">
            <div class="zoom-controls" aria-label="Image zoom controls">
              <button type="button" aria-label="Zoom out" :disabled="imageZoom <= 1" @click="zoomOut">
                <i class="bi bi-dash-lg" aria-hidden="true"></i>
              </button>
              <span>{{ Math.round(imageZoom * 100) }}%</span>
              <button type="button" aria-label="Zoom in" :disabled="imageZoom >= 3" @click="zoomIn">
                <i class="bi bi-plus-lg" aria-hidden="true"></i>
              </button>
              <button type="button" class="zoom-reset-button" :disabled="imageZoom === 1" @click="imageZoom = 1">Reset</button>
            </div>
            <a class="document-open-button" :href="previewUrl" target="_blank" rel="noopener noreferrer">
              View in new tab <i class="bi bi-box-arrow-up-right" aria-hidden="true"></i>
            </a>
          </footer>
        </section>
      </div>
    </template>
    <p v-else-if="loading" class="document-unavailable">Loading document…</p>
    <div v-else-if="failed" class="document-load-error" role="status">
      <span>Document preview could not be loaded.</span>
      <button type="button" @click="loadDocument">Retry</button>
    </div>
  </div>
  <p v-else class="document-unavailable">No file uploaded.</p>
</template>

<script>
import api from '@/controller/axios';

export default {
  name: 'DocumentPreview',
  props: {
    document: { type: Object, default: null },
  },
  data() {
    return {
      previewUrl: null,
      loading: false,
      failed: false,
      showZoom: false,
      imageZoom: 1,
      panX: 0,
      panY: 0,
      isDragging: false,
      dragStartX: 0,
      dragStartY: 0,
      dragOriginX: 0,
      dragOriginY: 0,
      dragPointerId: null,
      requestId: 0,
    };
  },
  mounted() {
    this.loadDocument();
  },
  beforeUnmount() {
    this.requestId += 1;
    this.revokePreviewUrl();
  },
  watch: {
    'document.url'() {
      this.loadDocument();
    },
  },
  methods: {
    zoomIn() {
      this.imageZoom = Math.min(3, Number((this.imageZoom + 0.25).toFixed(2)));
    },
    zoomOut() {
      this.imageZoom = Math.max(1, Number((this.imageZoom - 0.25).toFixed(2)));
      if (this.imageZoom === 1) {
        this.panX = 0;
        this.panY = 0;
      }
    },
    startPan(event) {
      if (this.imageZoom <= 1 || event.button !== 0) return;
      this.isDragging = true;
      this.dragPointerId = event.pointerId;
      this.dragStartX = event.clientX;
      this.dragStartY = event.clientY;
      this.dragOriginX = this.panX;
      this.dragOriginY = this.panY;
      event.currentTarget.setPointerCapture(event.pointerId);
      event.preventDefault();
    },
    panImage(event) {
      if (!this.isDragging || event.pointerId !== this.dragPointerId) return;
      const image = this.$refs.zoomImage;
      const frame = event.currentTarget;
      const maxX = Math.max(0, (image.offsetWidth * this.imageZoom - frame.clientWidth) / 2);
      const maxY = Math.max(0, (image.offsetHeight * this.imageZoom - frame.clientHeight) / 2);
      this.panX = Math.min(maxX, Math.max(-maxX, this.dragOriginX + event.clientX - this.dragStartX));
      this.panY = Math.min(maxY, Math.max(-maxY, this.dragOriginY + event.clientY - this.dragStartY));
    },
    stopPan(event) {
      if (event.pointerId !== this.dragPointerId) return;
      this.isDragging = false;
      this.dragPointerId = null;
    },
    closeZoom() {
      this.showZoom = false;
      this.imageZoom = 1;
      this.panX = 0;
      this.panY = 0;
      this.isDragging = false;
      this.dragPointerId = null;
    },
    revokePreviewUrl() {
      if (this.previewUrl) URL.revokeObjectURL(this.previewUrl);
      this.previewUrl = null;
    },
    async loadDocument() {
      const requestId = ++this.requestId;
      this.revokePreviewUrl();
      this.failed = false;
      this.loading = false;
      this.closeZoom();
      if (!this.document?.url) return;

      this.loading = true;
      try {
        const response = await api.get(this.document.url, { responseType: 'blob' });
        if (requestId !== this.requestId) return;
        this.previewUrl = URL.createObjectURL(response.data);
      } catch (error) {
        if (requestId === this.requestId) {
          this.failed = true;
          console.error('Unable to load applicant document preview:', error);
        }
      } finally {
        if (requestId === this.requestId) this.loading = false;
      }
    },
  },
  computed: {
    isImage() {
      return Boolean(this.document?.mime_type?.startsWith('image/'));
    },
  },
};
</script>

<style scoped>
.document-preview {
  min-width: 0;
  display: grid;
  grid-template-columns: 112px minmax(0, 1fr);
  align-items: center;
  gap: 0.65rem;
}

.document-thumbnail-button {
  position: relative;
  width: 112px;
  height: 88px;
  padding: 0;
  overflow: hidden;
  border: 1px solid #dce5e1;
  border-radius: 8px;
  background: #f2f6f4;
  cursor: zoom-in;
}

.document-thumbnail {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.thumbnail-hint {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  padding: 0.25rem 0.3rem;
  background: rgb(23 43 77 / 78%);
  color: #fff;
  font-size: 0.62rem;
  text-align: center;
  opacity: 0;
  transition: opacity 120ms ease;
}

.document-thumbnail-button:hover .thumbnail-hint,
.document-thumbnail-button:focus-visible .thumbnail-hint {
  opacity: 1;
}

.document-file-icon {
  width: 112px;
  height: 88px;
  display: grid;
  place-content: center;
  gap: 0.35rem;
  border: 1px solid #e1e8e5;
  border-radius: 8px;
  background: #f2f6f4;
  color: #648474;
  font-size: 1.5rem;
  text-align: center;
}

.document-file-icon span {
  color: #647267;
  font-size: 0.62rem;
}

.document-preview-copy {
  min-width: 0;
  display: grid;
  justify-items: start;
  gap: 0.3rem;
}

.document-preview-copy strong,
.document-preview-copy small {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.document-preview-copy strong {
  color: #344258;
  font-size: 0.78rem;
  font-weight: 650;
}

.document-preview-copy small {
  color: #778397;
  font-size: 0.68rem;
}

.document-open-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  margin-top: 0.15rem;
  padding: 0.4rem 0.6rem;
  border: 1px solid #cbded4;
  border-radius: 6px;
  background: #f5faf7;
  color: #28664e;
  font: inherit;
  font-size: 0.68rem;
  font-weight: 600;
  text-decoration: none;
}

.document-open-button:hover {
  border-color: #95bba7;
  background: #eaf4ee;
}

.document-open-button:focus-visible,
.document-thumbnail-button:focus-visible,
.zoom-close-button:focus-visible,
.zoom-controls button:focus-visible {
  outline: 3px solid #72a994;
  outline-offset: 2px;
}

.document-zoom-backdrop {
  position: fixed;
  z-index: 2000;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 1rem;
  background: rgb(16 27 40 / 78%);
}

.document-zoom-dialog {
  width: min(900px, 100%);
  max-height: calc(100vh - 2rem);
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  overflow: hidden;
  border: 1px solid #e5ebe8;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 20px 60px rgb(0 0 0 / 30%);
}

.document-zoom-header,
.document-zoom-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.85rem 1rem;
}

.document-zoom-header {
  border-bottom: 1px solid #e9edf1;
}

.document-zoom-header h2 {
  margin: 0;
  color: #344258;
  font-size: 0.95rem;
}

.document-zoom-header p {
  max-width: min(70vw, 36rem);
  margin: 0.25rem 0 0;
  overflow: hidden;
  color: #778397;
  font-size: 0.72rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.zoom-close-button,
.zoom-controls button {
  min-width: 2rem;
  min-height: 2rem;
  display: inline-grid;
  place-items: center;
  border: 1px solid #d9e2dd;
  border-radius: 6px;
  background: #fff;
  color: #344258;
  cursor: pointer;
}

.document-zoom-image-frame {
  min-height: 180px;
  display: grid;
  place-items: center;
  overflow: auto;
  padding: 1rem;
  background: #f2f4f5;
  touch-action: none;
}

.document-zoom-image-frame img {
  max-width: 100%;
  max-height: calc(100vh - 12rem);
  object-fit: contain;
  user-select: none;
  transition: transform 120ms ease;
}

.document-zoom-image-frame.is-zoomed {
  cursor: grab;
}

.document-zoom-image-frame.is-dragging {
  cursor: grabbing;
}

.document-zoom-image-frame.is-dragging img {
  transition: none;
}

.document-zoom-footer {
  flex-wrap: wrap;
  border-top: 1px solid #e9edf1;
}

.zoom-controls {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  color: #46566b;
  font-size: 0.75rem;
}

.zoom-controls button:disabled {
  color: #aab3bd;
  cursor: not-allowed;
}

.zoom-controls .zoom-reset-button {
  width: auto;
  padding: 0 0.5rem;
  font-size: 0.68rem;
}

.document-unavailable {
  grid-column: 1 / -1;
  margin: 0;
  color: #778397;
  font-size: 0.72rem;
}

.document-load-error {
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  color: #954343;
  font-size: 0.72rem;
}

.document-load-error button {
  padding: 0.35rem 0.55rem;
  border: 1px solid #e8caca;
  border-radius: 5px;
  background: #fff;
  color: #954343;
  font: inherit;
  cursor: pointer;
}

@media (max-width: 480px) {
  .document-preview {
    grid-template-columns: 88px minmax(0, 1fr);
  }

  .document-thumbnail-button,
  .document-file-icon {
    width: 88px;
    height: 76px;
  }

  .document-zoom-backdrop {
    padding: 0.5rem;
  }

  .document-zoom-dialog {
    max-height: calc(100vh - 1rem);
  }
}
</style>
