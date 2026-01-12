<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ArrowLeft, UserPlus, Trash2, Building2, Users } from 'lucide-vue-next';
import apiClient from '../plugins/ApiClient';
import UserModal from '@/components/UserModal.vue';
import { useToast } from 'vue-toastification'
import type { ICompany } from '@/interfaces/ICompany';
import type { IUser } from '@/interfaces/IUser';
import CompanyUserDeleteModal from '@/components/CompanyUserDeleteModal.vue';

const toast = useToast();
const route = useRoute();
const router = useRouter();

const isDeleteModalOpen = ref(false);
const userIdToDelete = ref<string | null>(null);
const isDeleting = ref(false);

const companyId = computed(() => {
  const id = route.params.id;
  return Array.isArray(id) ? String(id[0]) : String(id);
});
const company = ref<ICompany | null>(null);
const users = ref<Array<IUser>>([]);
const loading = ref(true);
const showModal = ref(false);

const fetchData = async () => {
  loading.value = true;
  try {
    const id = companyId.value;
    console.log("id", id);
    
    const [companyRes, usersRes] = await Promise.all([
      apiClient.get(`/companies/${id}`),
      apiClient.get(`/users?companyId=${id}`)
    ]);

    company.value = companyRes.data;
    users.value = usersRes.data;
  } catch (err) {
    toast.error("Erro ao carregar os dados da empresa e usuários.");
    toast.info('Redirecionando para a página principal...')
    setTimeout(() => router.push('/'), 2000);
  } finally {
    loading.value = false;
  }
};

const openDeleteUserModal = (id: string) => {
  userIdToDelete.value = id;
  isDeleteModalOpen.value = true;
};

const confirmDeleteUser = async () => {
  if (!userIdToDelete.value) return;

  isDeleting.value = true;
  try {
    await apiClient.delete(`/users/${userIdToDelete.value}`);
    toast.success("Usuário removido com sucesso.");
    await fetchData(); // Recarrega a lista de usuários
  } catch (err) {
    toast.error("Erro ao remover usuário.");
  } finally {
    isDeleting.value = false;
    isDeleteModalOpen.value = false;
    userIdToDelete.value = null;
  }
};

const formatCNPJ = (val: string) => {
  return val.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
};

onMounted(fetchData);
</script>

<template>
  <div class="container mt-5 mb-5">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb mb-1">
            <li class="breadcrumb-item"><a href="#" @click.prevent="router.push('/')">Empresas</a></li>
            <li class="breadcrumb-item active">Detalhes</li>
          </ol>
        </nav>
        <h2 class="fw-bold d-flex align-items-center gap-2">
          <Building2 class="text-primary" /> Informações da Empresa
        </h2>
      </div>
      <button class="btn btn-outline-secondary d-flex align-items-center gap-2" @click="router.push('/')">
        <ArrowLeft :size="18" /> Voltar
      </button>
    </div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
      <p class="mt-2 text-muted">Carregando detalhes...</p>
    </div>

    <template v-else>
      <div v-if="company" class="card shadow-sm border-1 mb-5">
        <div class="card-body p-4">
          <div class="row align-items-center">
            <div class="col-md-8">
              <h3 class="card-title fw-bold text-primary mb-3">{{ company.name }}</h3>
              <div class="d-flex gap-4">
                <p class="mb-0"><strong>CNPJ:</strong> {{ formatCNPJ(company.cnpj) }}</p>
                <p class="mb-0">
                  <strong>Status: </strong> 
                  <span :class="['badge rounded-pill', company.active ? 'bg-success' : 'bg-secondary']">
                    {{ company.active ? 'Ativa' : 'Inativa' }}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="section-header d-flex justify-content-between align-items-center mb-3">
        <h4 class="fw-bold d-flex align-items-center gap-2">
          <Users :size="22" /> Usuários Vinculados
        </h4>
        <button class="btn btn-primary d-flex align-items-center gap-2" @click="showModal = true">
          <UserPlus :size="18" /> Adicionar Usuário
        </button>
      </div>

      <div class="card shadow-sm border-1">
        <div class="table-responsive py-1">
          <table class="table table-hover align-middle mb-0">
            <thead class="table-light">
              <tr>
                <th class="ps-4">Nome</th>
                <th>E-mail</th>
                <th>Cargo</th>
                <th class="text-end pe-4">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user.id">
                <td class="ps-4 fw-medium">{{ user.name }}</td>
                <td>{{ user.email }}</td>
                <td>
                  <span class="badge bg-light text-dark border">{{ user.role }}</span>
                </td>
                <td class="text-end pe-4">
                  <button 
                    title="Remover Usuário"
                    class="btn btn-outline-danger btn-sm border-1" 
                    @click="openDeleteUserModal(user.id)" 
                  >
                    <Trash2 :size="18" />
                  </button>
                </td>
              </tr>
              <tr v-if="users.length === 0">
                <td colspan="4" class="text-center py-5 text-muted">
                  <p class="mb-0">Nenhum usuário vinculado a esta empresa.</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>

    <UserModal 
      v-if="showModal && companyId" 
      :show="showModal"
      :companyId="companyId" 
      @saved="fetchData"
      @close="showModal = false" 
    />

    <CompanyUserDeleteModal 
      :show="isDeleteModalOpen"
      :loading="isDeleting"
      title="Excluir Usuário"
      message="Tem certeza que deseja excluir este usuário?"
      @confirm="confirmDeleteUser"
      @cancel="isDeleteModalOpen = false"
    />
  </div>
</template>

<style scoped>
.container {
  max-width: 1000px;
}

.table thead th {
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.8rem;
  letter-spacing: 0.5px;
}

.breadcrumb-item a {
  text-decoration: none;
  color: #6c757d;
}
</style>