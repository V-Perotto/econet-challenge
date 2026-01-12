<script setup lang="ts">
import { reactive, ref, watch, type PropType } from 'vue';
import { UserPlus, X } from 'lucide-vue-next';
import apiClient from '../plugins/ApiClient';
import { useToast } from 'vue-toastification';
import { RolesEnum } from '@/enums/RoleEnum';

const toast = useToast()

const props = defineProps({
  show: Boolean,
  companyId: {
    type: [String] as PropType<string>,
    required: true
  }
});

const emit = defineEmits(['close', 'saved']);
const isSaving = ref(false);

const form = reactive({
  name: '',
  email: '',
  role: '' as RolesEnum | '',
  companyId: props.companyId
});

const errors = reactive({
  name: '',
  email: '',
  role: ''
});

const validateEmail = (email: string): boolean => { 
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

const validateRole = (role: string): boolean => {
  return Object.values(RolesEnum).includes(role as RolesEnum);
};

const validateForm = () => {
  let isValid = true;
  errors.name = '';
  errors.email = '';
  errors.role = '';

  if (!form.name.trim()) {
    errors.name = 'O nome é obrigatório.';
    isValid = false;
  }

  if (!validateEmail(form.email)) {
    errors.email = 'Email inválido.';
    isValid = false;
  }
  
  if (!validateRole(form.role)) {
    errors.role = 'Cargo inválido ou inexistente.';
    isValid = false;
  }

  return isValid;
};

const handleSubmit = async () => {
  if (!validateForm()) return;

  isSaving.value = true;
  try {
    await apiClient.post('/users', form);
    toast.success('Usuário cadastrado com sucesso!');
    emit('saved');
    emit('close');
  } catch (error) {
    toast.error("Erro ao cadastrar usuário. Verifique sua conexão.");
  } finally {
    isSaving.value = false;
  }
};

watch(() => form.name, (newValue) => {
  if (newValue.trim().length > 0) {
    errors.name = '';
  } else {
    errors.name = 'O nome é obrigatório.';
  }
});

watch(() => form.email, (newValue) => {
  if (newValue.length === 0) {
    errors.email = 'O e-mail é obrigatório.';
  } else if (!validateEmail(newValue)) {
    errors.email = 'Email inválido.';
  } else {
    errors.email = '';
  }
});

watch(() => form.role, (newValue) => {
  if (validateRole(newValue)) {
    errors.role = '';
  }
});

watch(() => props.show, (isOpening) => {
  if (!isOpening) {
    Object.assign(form, { name: '', email: '', role: '' });
    Object.assign(errors, { name: '', email: '', role: '' });
  }
});
</script>

<template>
  <div class="user-modal-root">
    <Transition v-if="show" name="fade" appear>
      <div class="modal-backdrop" @click="emit('close')"></div>
    </Transition>

    <Transition v-if="show" name="pop" appear>
      <div class="modal-wrapper modal d-block" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content border-0 shadow-lg">
            <header class="modal-header border-bottom-0 pb-0">
              <h5 class="modal-title fw-bold d-flex align-items-center gap-2">
                <UserPlus class="text-primary" :size="20" />
                Novo Usuário
              </h5>
              <button 
                type="button" 
                class="btn-close shadow-none" 
                @click="emit('close')"
                :disabled="isSaving"
              >
              </button>
            </header>

            <form @submit.prevent="handleSubmit">
              <div class="modal-body py-4">
                <div class="mb-3">
                  <label for="userName" class="form-label fw-semibold">
                    Nome Completo <span class="text-danger">*</span>
                  </label>
                  <input 
                    id="userName"
                    v-model="form.name" 
                    type="text"
                    class="form-control" 
                    :class="{ 'is-invalid': errors.name }"
                    placeholder="Ex: João Silva"
                    :disabled="isSaving"
                  />
                  <Transition name="error-slide">
                    <div v-if="errors.name" class="invalid-feedback">{{ errors.name }}</div>
                  </Transition>
                </div>

                <div class="mb-3">
                  <label for="userEmail" class="form-label fw-semibold">
                    E-mail <span class="text-danger">*</span>
                  </label>
                  <input 
                    id="userEmail"
                    v-model="form.email" 
                    type="email" 
                    class="form-control"
                    :class="{ 'is-invalid': errors.email }"
                    placeholder="joao.silva@empresa.com"
                    :disabled="isSaving"
                  />
                  <Transition name="error-slide">
                    <div v-if="errors.email" class="invalid-feedback">{{ errors.email }}</div>
                  </Transition>
                </div>

                <div class="mb-0">
                  <label for="userRole" class="form-label fw-semibold">
                    Cargo <span class="text-danger">*</span>
                  </label>
                  <select 
                    id="userRole" 
                    class="form-select" 
                    v-model="form.role" 
                    :class="{ 'is-invalid': errors.role }"
                    :disabled="isSaving"
                  >
                    <option value="" disabled selected>Selecione um cargo</option>
                    <option v-for="(label, key) in RolesEnum" :key="key" :value="label">
                      {{ label }}
                    </option>
                  </select>
                  <Transition name="error-slide">
                    <div v-if="errors.role" class="invalid-feedback">{{ errors.role }}</div>
                  </Transition>
                </div>
              </div>

              <footer class="modal-footer border-top-0 pt-0">
                <button 
                  type="button" 
                  class="btn btn-light px-4" 
                  @click="emit('close')"
                  :disabled="isSaving"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  class="btn btn-primary px-3 d-flex align-items-center gap-2" 
                  :disabled="isSaving">
                  <span v-if="isSaving" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  <UserPlus v-else :size="18" />
                  <span>{{ isSaving ? 'Salvando...' : 'Cadastrar Usuário' }}</span>
                </button>
              </footer>
            </form>
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
  width: 100%;
  max-width: 500px;
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
  transform: scale(0.8) translateY(-20px);
}

.error-slide-enter-active, .error-slide-leave-active {
  transition: all 0.3s ease-out;
}

.error-slide-enter-from, .error-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
  margin-bottom: -20px;
}

.invalid-feedback {
  display: block; 
}
</style>