<script setup lang="ts">
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, Save, SquarePen, PlusCircle } from 'lucide-vue-next'
import apiClient from '../plugins/ApiClient'
import { vMaska } from 'maska/vue'
import { useToast } from 'vue-toastification'
import CompanyFormLoading from '@/components/loading/CompanyFormLoading.vue'

const toast = useToast()
const route = useRoute()
const router = useRouter()
const isEditing = computed(() => !!route.params.id)
const loading = ref(false)

const form = reactive({
  name: '',
  cnpj: '',
  active: true,
})

const errors = reactive({
  name: '',
  cnpj: '',
})

const isSubmitting = ref(false)

const validateCNPJ = (cnpj: string): boolean => {
  const cleanCnpj = cnpj.replace(/[^\d]+/g, '')

  if (cleanCnpj.length !== 14 || /^(\d)\1+$/.test(cleanCnpj)) return false

  const size = cleanCnpj.length - 2
  const numbers = cleanCnpj.substring(0, size)
  const digits = cleanCnpj.substring(size)

  const calculateDigit = (num: string, weightStart: number) => {
    let sum = 0
    let weight = weightStart
    for (let i = num.length; i >= 1; i--) {
      sum += parseInt(num.charAt(num.length - i)) * weight--
      if (weight < 2) weight = 9
    }
    const result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
    return result
  }

  const digit1 = calculateDigit(numbers, 5)
  const digit2 = calculateDigit(numbers + digit1, 6)

  return (
    digit1 === parseInt(digits.charAt(0)) &&
    digit2 === parseInt(digits.charAt(1))
  )
}

const validateForm = () => {
  let isValid = true
  errors.name = ''
  errors.cnpj = ''

  if (!form.name.trim()) {
    errors.name = 'O nome é obrigatório'
    isValid = false
  }

  if (!validateCNPJ(form.cnpj)) {
    errors.cnpj = 'CNPJ inválido ou inexistente'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) return

  isSubmitting.value = true

  try {
    const payload = { ...form, cnpj: form.cnpj.replace(/[^\d]+/g, '') }

    if (isEditing.value) {
      await apiClient.put(`/companies/${route.params.id}`, payload)
      toast.success('Empresa atualizada com sucesso!')
    } else {
      await apiClient.post('/companies', payload)
      toast.success('Empresa cadastrada com sucesso!')
    }

    toast.info('Redirecionando para a página principal...')
    setTimeout(() => router.push('/'), 2000)
  } catch (err) {
    toast.error('Erro ao salvar. Verifique a conexão com o servidor.')
  } finally {
    isSubmitting.value = false
  }
}

watch(
  () => route.params.id,
  newId => {
    if (!newId) {
      Object.assign(form, { name: '', cnpj: '', active: true })
    }
  },
)

watch(
  () => form.name,
  newValue => {
    if (newValue.trim().length > 0) {
      errors.name = ''
    } else {
      errors.name = 'O nome é obrigatório.'
    }
  },
)

watch(
  () => form.cnpj,
  newValue => {
    if (newValue.length === 0) {
      errors.cnpj = 'O CNPJ é obrigatório.'
    } else if (!validateCNPJ(newValue)) {
      errors.cnpj = 'CNPJ inválido ou inexistente.'
    } else {
      errors.cnpj = ''
    }
  },
)

onMounted(async () => {
  if (isEditing.value) {
    loading.value = true
    try {
      const id = Array.isArray(route.params.id)
        ? route.params.id[0]
        : route.params.id
      const response = await apiClient.get(`/companies/${id}`)
      Object.assign(form, response.data)
    } catch (err) {
      toast.error('Erro ao carregar dados da empresa.')
      toast.info('Redirecionando para a página principal...')
      setTimeout(() => router.push('/'), 2000)
    } finally {
      setTimeout(() => {
        loading.value = false
      }, 500)
    }
  }
})
</script>

<template>
  <div class="container mt-5">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb mb-1">
            <li class="breadcrumb-item">
              <a href="#" @click.prevent="router.push('/')">Empresas</a>
            </li>
            <li class="breadcrumb-item active">
              {{ isEditing ? 'Edição' : 'Cadastro' }}
            </li>
          </ol>
        </nav>
        <h2 class="fw-bold d-flex align-items-center gap-2">
          <component
            :is="isEditing ? SquarePen : PlusCircle"
            :size="26"
            class="text-primary"
          />
          {{ isEditing ? 'Editar Empresa' : 'Nova Empresa' }}
        </h2>
      </div>
      <button
        class="btn btn-outline-secondary d-flex align-items-center gap-2"
        @click="router.push('/')"
      >
        <ArrowLeft :size="18" /> Voltar
      </button>
    </div>

    <div class="card shadow-sm border-1">
      <div class="card-body p-4">
        <div v-if="loading" class="placeholder-glow">
          <CompanyFormLoading />
        </div>
        <form v-else @submit.prevent="handleSubmit">
          <div class="row g-3">
            <div class="col-md-8">
              <label for="name" class="form-label fw-semibold"
                >Nome da Empresa <span class="text-danger">*</span></label
              >
              <input
                id="name"
                v-model="form.name"
                type="text"
                class="form-control form-control-lg"
                :class="{ 'is-invalid': errors.name }"
                placeholder="Ex: Minha Empresa LTDA"
              />
              <Transition name="error-slide">
                <div v-if="errors.name" class="invalid-feedback">
                  {{ errors.name }}
                </div>
              </Transition>
            </div>

            <div class="col-md-4">
              <label for="cnpj" class="form-label fw-semibold"
                >CNPJ <span class="text-danger">*</span></label
              >
              <input
                id="cnpj"
                v-model="form.cnpj"
                v-maska="'##.###.###/####-##'"
                type="text"
                class="form-control form-control-lg"
                :class="{ 'is-invalid': errors.cnpj }"
                placeholder="00.000.000/0000-00"
              />
              <Transition name="error-slide">
                <div v-if="errors.cnpj" class="invalid-feedback">
                  {{ errors.cnpj }}
                </div>
              </Transition>
            </div>

            <div class="col-12 mt-4">
              <div
                class="form-check form-switch p-0 d-flex align-items-center gap-3"
              >
                <label class="form-check-label fw-semibold" for="status"
                  >Status da Empresa</label
                >
                <input
                  class="form-check-input ms-0"
                  type="checkbox"
                  role="switch"
                  id="status"
                  v-model="form.active"
                  style="width: 2.5em; height: 1.25em; cursor: pointer"
                />
                <span :class="form.active ? 'text-success' : 'text-muted'">
                  {{ form.active ? 'Ativa' : 'Inativa' }}
                </span>
              </div>
            </div>

            <hr class="my-4 text-muted opacity-25" />

            <div class="col-12 mt-1">
              <button
                type="submit"
                class="btn btn-primary btn-lg w-100 d-flex align-items-center justify-content-center gap-2 shadow-sm"
                :disabled="isSubmitting"
              >
                <Save v-if="!isSubmitting" :size="20" />
                <span v-else class="spinner-border spinner-border-sm"></span>
                {{ isEditing ? 'Atualizar Empresa' : 'Salvar Empresa' }}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 900px;
}
.card {
  border-radius: 12px;
}
.form-control:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.1);
}
.breadcrumb-item a {
  text-decoration: none;
  color: #6c757d;
}
.breadcrumb-item a:hover {
  text-decoration: underline;
}

.error-slide-enter-active,
.error-slide-leave-active {
  transition: all 0.3s ease-out;
}
.error-slide-enter-from,
.error-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
  margin-bottom: -20px;
}

.invalid-feedback {
  display: block;
}
</style>
