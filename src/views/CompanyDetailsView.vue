<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import UserModal from '@/components/UserModal.vue';
import { useToast } from 'vue-toastification'
import type { ICompany } from '@/interfaces/ICompany';
import type { IUser } from '@/interfaces/IUser';

const toast = useToast()

const route = useRoute();
const companyId = route.params.id;
const company = ref<ICompany | null>(null);
const users = ref<Array<IUser> | null>([]);
const showModal = ref(false);

const fetchData = async () => {
  try {
    const [companyRes, usersRes] = await Promise.all([
      axios.get(`http://localhost:3000/companies/${companyId}`),
      axios.get(`http://localhost:3000/users?companyId=${companyId}`)
    ]);
    company.value = companyRes.data;
    users.value = usersRes.data;
  } catch (err) {
    toast.error("Erro ao carregar dados.");
  }
};

const removeUser = async (userId: number) => {
  if (confirm("Deseja remover este usuário?")) {
    try {
      await axios.delete(`http://localhost:3000/users/${userId}`);
      toast.success("Usuário removido.");
      fetchData();
    } catch (err) {
      toast.error("Erro ao remover usuário.");
    }
  }
};

onMounted(fetchData);
</script>

<template>
  <div class="container">
    <header class="header">
      <button class="btn-back" @click="$router.push('/')">Voltar</button>
      <h1>Detalhes da Empresa</h1>
    </header>

    <section v-if="company" class="card info-card">
      <h2>{{ company.name }}</h2>
      <p><strong>CNPJ:</strong> {{ company.cnpj }}</p>
      <p>
        <strong>Status:</strong> 
        <span :class="['badge', company.active ? 'active' : 'inactive']">
          {{ company.active ? 'Ativa' : 'Inativa' }}
        </span>
      </p>
    </section>

    <section class="users-section">
      <div class="section-header">
        <h3>Usuários Vinculados</h3>
        <button class="btn-primary" @click="showModal = true">+ Adicionar Usuário</button>
      </div>

      <table class="user-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>E-mail</th>
            <th>Cargo</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.role }}</td>
            <td>
              <button class="btn-remove" @click="removeUser(user.id)">Remover</button>
            </td>
          </tr>
          <tr v-if="users && users.length === 0">
            <td colspan="4" class="empty-state">Nenhum usuário vinculado.</td>
          </tr>
        </tbody>
      </table>
    </section>

    <UserModal 
      v-if="showModal" 
      :companyId="companyId" 
      @close="showModal = false" 
      @saved="fetchData"
    />
  </div>
</template>