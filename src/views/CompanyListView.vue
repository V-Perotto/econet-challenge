<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import {
  Plus,
  Eye,
  Pencil,
  Trash2,
  Building2,
  RefreshCcw,
} from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import apiClient from '../plugins/ApiClient'
import type { ICompany } from '@/interfaces/ICompany'
import { useToast } from 'vue-toastification'
import PaginationBar from '@/components/PaginationBar.vue'
import CompanyDeleteModal from '@/components/CompanyDeleteModal.vue'
import CompanyListLoading from '@/components/loading/CompanyListLoading.vue'

const toast = useToast()
const router = useRouter()

const companies = ref<Array<ICompany>>([])
const loading = ref(false)
const error = ref<string | null>(null)

const currentPage = ref(1)
const totalItems = ref(0)
const itemsPerPage = 15

const isDeleteModalOpen = ref(false)
const companyIdToDelete = ref<string | null>(null)
const isDeleting = ref(false)

const loadCompanies = async (page: number) => {
  const pageNumber = typeof page === 'number' ? page : 1
  loading.value = true
  error.value = ''

  const startTime = Date.now()

  try {
    const response = await apiClient.get('/companies', {
      params: {
        _page: pageNumber,
        _per_page: itemsPerPage,
      },
    })

    const duration = Date.now() - startTime
    const minDelay = 500

    if (duration < minDelay) {
      await new Promise(resolve => setTimeout(resolve, minDelay - duration))
    }

    const { items, data } = response.data
    totalItems.value = items
    companies.value = data
    currentPage.value = pageNumber
  } catch (err) {
    error.value =
      'Não foi possível carregar a lista de empresas. Verifique sua conexão.'
    toast.error(error.value)
    console.error(err)
  } finally {
    loading.value = false
  }
}

const openDeleteModal = (id: string) => {
  companyIdToDelete.value = id
  isDeleteModalOpen.value = true
}

const confirmDelete = async () => {
  if (!companyIdToDelete.value) return

  isDeleting.value = true
  try {
    await apiClient.delete(`/companies/${companyIdToDelete.value}`)
    toast.success('Empresa removida com sucesso!')
    await loadCompanies(currentPage.value)
  } catch (err) {
    toast.error('Erro ao excluir empresa.')
  } finally {
    isDeleting.value = false
    isDeleteModalOpen.value = false
    companyIdToDelete.value = null
  }
}

const viewDetails = (id: string) => router.push(`/company/${id}/details`)
const editCompany = (id: string) => router.push(`/company/${id}/edit`)

const formatCNPJ = (val: string) => {
  return val.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
}

onMounted(() => loadCompanies(currentPage.value))

watch(currentPage, newPage => {
  if (companies.value && companies.value.length > 0) loadCompanies(newPage)
})
</script>

<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1><Building2 :size="34" /> Empresas</h1>
      <button class="btn btn-primary" @click="$router.push('/company/create')">
        <Plus :size="24" /> Nova Empresa
      </button>
    </div>

    <div
      v-if="error"
      class="alert alert-danger d-flex justify-content-between align-items-center"
      role="alert"
    >
      <div class="mb-0">
        <p class="mb-0">{{ error }}</p>
      </div>
      <button class="btn btn-danger" @click="() => loadCompanies(currentPage)">
        <RefreshCcw :size="20" /> Tentar Novamente
      </button>
    </div>

    <div class="table-responsive card shadow-sm">
      <table class="table table-hover mb-0" v-if="!loading">
        <thead class="table-light">
          <tr>
            <th class="ps-4">Nome</th>
            <th>CNPJ</th>
            <th>Status</th>
            <th class="text-end pe-4">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="company in companies" :key="company.id">
            <td>{{ company.name }}</td>
            <td>{{ formatCNPJ(company.cnpj) }}</td>
            <td>
              <span
                :class="[
                  'badge',
                  company.active ? 'bg-success' : 'bg-secondary',
                ]"
              >
                {{ company.active ? 'Ativa' : 'Inativa' }}
              </span>
            </td>
            <td class="text-end">
              <button
                class="btn btn-light"
                @click="viewDetails(company.id)"
                title="Visualizar"
              >
                <Eye :size="20" />
              </button>
              <button
                class="btn btn-light mx-2"
                @click="editCompany(company.id)"
                title="Editar"
              >
                <Pencil :size="20" />
              </button>
              <button
                class="btn btn-outline-danger"
                @click="openDeleteModal(company.id)"
                title="Excluir"
              >
                <Trash2 :size="20" />
              </button>
            </td>
          </tr>
          <tr v-if="companies.length === 0">
            <td colspan="4" class="text-center py-5 text-muted">
              <p class="mb-0">Nenhuma empresa existente.</p>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-else class="table-responsive">
        <CompanyListLoading />
      </div>
    </div>

    <CompanyDeleteModal
      :show="isDeleteModalOpen"
      :loading="isDeleting"
      title="Excluir Empresa"
      message="Tem certeza que deseja excluir esta empresa? Todos os usuários vinculados também serão afetados."
      @confirm="confirmDelete"
      @cancel="isDeleteModalOpen = false"
    />

    <PaginationBar
      v-if="totalItems > itemsPerPage"
      v-model="currentPage"
      :total-items="totalItems"
      :items-per-page="itemsPerPage"
      @change="page => loadCompanies(page)"
    />
  </div>
</template>

<style scoped>
.table thead th {
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.9rem;
  letter-spacing: 0.5px;
}
</style>
