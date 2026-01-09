<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const router = useRouter();
const isEditing = computed(() => !!route.params.id);

const form = reactive({
  name: '',
  cnpj: '',
  active: true
});

const errors = reactive({
  name: '',
  cnpj: ''
});

const feedback = reactive({
  message: '',
  type: '' 
});

const isSubmitting = ref(false);

const validateCNPJ = (cnpj: string) => {
  const cleanCnpj = cnpj.replace(/[^\d]+/g, '');
  if (cleanCnpj.length !== 14) return false;
  return true;
};

const validateForm = () => {
  let isValid = true;
  errors.name = '';
  errors.cnpj = '';

  if (!form.name.trim()) {
    errors.name = 'O nome é obrigatório';
    isValid = false;
  }

  if (!validateCNPJ(form.cnpj)) {
    errors.cnpj = 'CNPJ inválido (deve conter 14 dígitos)';
    isValid = false;
  }

  return isValid;
};

const handleSubmit = async () => {
  if (!validateForm()) return;

  isSubmitting.value = true;
  feedback.message = '';

  try {
    if (isEditing.value) {
      await axios.put(`http://localhost:3000/companies/${route.params.id}`, form);
      feedback.message = 'Empresa atualizada com sucesso!';
    } else {
      await axios.post('http://localhost:3000/companies', form);
      feedback.message = 'Empresa cadastrada com sucesso!';
    }
    feedback.type = 'success';
    
    setTimeout(() => router.push('/'), 2000);
  } catch (err) {
    feedback.message = 'Erro ao salvar. Verifique o servidor.';
    feedback.type = 'error';
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(async () => {
  if (isEditing.value) {
    try {
      const response = await axios.get(`http://localhost:3000/companies/${route.params.id}`);
      Object.assign(form, response.data);
    } catch (err) {
      feedback.message = 'Erro ao carregar dados da empresa.';
      feedback.type = 'error';
    }
  }
});
</script>

<template>
  <div class="container">
    <header class="form-header">
      <h1>{{ isEditing ? 'Editar Empresa' : 'Nova Empresa' }}</h1>
      <button class="btn-secondary" @click="$router.push('/')">Voltar</button>
    </header>

    <form @submit.prevent="handleSubmit" class="form-card">
      <div class="form-group">
        <label for="name">Nome da Empresa*</label>
        <input 
          id="name"
          v-model="form.name"
          type="text"
          placeholder="Ex: Minha Empresa LTDA"
          :class="{ 'input-error': errors.name }"
        />
        <span v-if="errors.name" class="error-text">{{ errors.name }}</span>
      </div>

      <div class="form-group">
        <label for="cnpj">CNPJ*</label>
        <input 
          id="cnpj"
          v-model="form.cnpj"
          type="text"
          placeholder="00.000.000/0000-00"
          v-maska="'##.###.###/####-##'"
          :class="{ 'input-error': errors.cnpj }"
        />
        <span v-if="errors.cnpj" class="error-text">{{ errors.cnpj }}</span>
      </div>

      <div class="form-group">
        <label>Status</label>
        <div class="toggle-container">
          <input type="checkbox" id="status" v-model="form.active" />
          <label for="status">{{ form.active ? 'Ativa' : 'Inativa' }}</label>
        </div>
      </div>

      <div class="form-actions">
        <button type="submit" class="btn-success" :disabled="isSubmitting">
          {{ isSubmitting ? 'Salvando...' : 'Salvar Empresa' }}
        </button>
      </div>

      <p v-if="feedback.message" :class="['feedback', feedback.type]">
        {{ feedback.message }}
      </p>
    </form>
  </div>
</template>