<script setup lang="ts">
import { AlertTriangle } from 'lucide-vue-next';

defineProps<{
  show: boolean;
  title?: string;
  message?: string;
  loading?: boolean;
}>();

const emit = defineEmits(['confirm', 'cancel']);
</script>

<template>
  <div class="user-modal-root">
    <Transition name="fade" appear>
      <div v-if="show" class="modal-backdrop" @click="emit('cancel')"></div>
    </Transition>
    
    <Transition name="pop" appear>
      <div 
        v-if="show" 
        class="modal-wrapper modal d-block" 
        tabindex="-1" 
        role="dialog"
      >
        <div class="modal-dialog modal-dialog-centered" role="document">
          <div class="modal-content border-0 shadow-lg">
            <div class="modal-body p-4 text-center">
              <div class="mb-3 text-danger">
                <AlertTriangle :size="48" />
              </div>
              <h4 class="fw-bold">{{ title || 'Confirmar Exclusão' }}</h4>
              <p class="text-muted">{{ message || 'Tem certeza que deseja realizar esta ação? Esta operação não pode ser desfeita.' }}</p>
              
              <div class="d-flex gap-2 justify-content-center mt-4">
                <button 
                  type="button" 
                  class="btn btn-light px-4" 
                  @click="emit('cancel')"
                  :disabled="loading"
                >
                  Cancelar
                </button>
                <button 
                  type="button" 
                  class="btn btn-danger px-4 d-flex align-items-center gap-2" 
                  @click="emit('confirm')"
                  :disabled="loading"
                >
                  <span v-if="loading" class="spinner-border spinner-border-sm"></span>
                  {{ loading ? 'Excluindo...' : 'Sim, Excluir' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.user-modal-root {
  position: fixed;
  z-index: 1100;
}

.modal-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1110;
  pointer-events: none;
}

.modal {
  z-index: 1055;
}

.modal-content {
  border-radius: 16px;
}

.modal-dialog {
  pointer-events: auto;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
  z-index: 1050;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.pop-enter-active, .pop-leave-active {
  transition: transform 0.3s cubic-bezier(0.35, 1.50, 0.65, 1), opacity 0.3s ease;
}
.pop-enter-from, .pop-leave-to {
  opacity: 0;
  transform: scale(0.8) translateY(10px);
}
</style>