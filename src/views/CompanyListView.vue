<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import type { ICompany } from '@/interfaces/ICompany';
import { useToast } from 'vue-toastification'

const toast = useToast()
const router = useRouter();

const companies = ref<Array<ICompany> | null>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const currentPage = ref(1);

const loadCompanies = async (page = 1) => {
  loading.value = true;
  error.value = null;
  
  try {
    const response = await axios.get(`http://localhost:3000/companies?_page=${page}&_limit=5`);
    companies.value = response.data;
    currentPage.value = page;
  } catch (err) {
    error.value = "Não foi possível carregar a lista de empresas. Verifique sua conexão.";
    toast.error(error.value);
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const changePage = (newPage: number) => {
  loadCompanies(newPage);
};

const deleteCompany = async (id: number) => {
  if (confirm("Tem certeza que deseja excluir esta empresa?")) {
    try {
      await axios.delete(`http://localhost:3000/companies/${id}`);
      loadCompanies(currentPage.value);
    } catch (err) {
      toast.error("Erro ao excluir empresa.");
    }
  }
};

const viewDetails = (id: number) => router.push(`/company/${id}`);
const editCompany = (id: number) => router.push(`/company/edit/${id}`);

const formatCNPJ = (val: string) => {
  return val.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
};

onMounted(() => loadCompanies());
</script>

<template>
  <div class="container">
    <div class="header">
      <h1>Empresas</h1>
      <button class="btn-primary" @click="$router.push('/empresas/novo')">
        Nova Empresa
      </button>
    </div>

    <div v-if="error" class="error-banner">
      <p>{{ error }}</p>
      <button @click="loadCompanies">Tentar Novamente</button>
    </div>

    <div class="table-container">
      <table v-if="!loading">
        <thead>
          <tr>
            <th>Nome</th>
            <th>CNPJ</th>
            <th>Status</th>
            <th class="actions">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="company in companies" :key="company.id">
            <td>{{ company.name }}</td>
            <td>{{ formatCNPJ(company.cnpj) }}</td>
            <td>
              <span :class="['badge', company.active ? 'active' : 'inactive']">
                {{ company.active ? 'Ativa' : 'Inativa' }}
              </span>
            </td>
            <td class="actions">
              <button @click="viewDetails(company.id)" title="Visualizar">👁️</button>
              <button @click="editCompany(company.id)" title="Editar">✏️</button>
              <button @click="deleteCompany(company.id)" title="Excluir" class="btn-delete">🗑️</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-else class="loading-state">
        <div class="spinner"></div>
        <p>Carregando empresas...</p>
      </div>
    </div>

    <div class="pagination">
      <button :disabled="currentPage === 1" @click="changePage(currentPage - 1)">
        Anterior
      </button>
      <span>Página {{ currentPage }}</span>
      <button @click="changePage(currentPage + 1)"> Próxima </button>
    </div>
  </div>
</template>