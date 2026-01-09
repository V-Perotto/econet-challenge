<script setup lang="ts">
import { reactive, ref } from 'vue';
import axios from 'axios';
import { useToast } from 'vue-toastification'

const toast = useToast()

const props = defineProps({
  companyId: {
    type: [String, Number],
    required: true
  }
});

const emit = defineEmits(['close', 'saved']);
const isSaving = ref(false);

const form = reactive({
  name: '',
  email: '',
  role: '',
  companyId: props.companyId
});

const handleSubmit = async () => {
  isSaving.value = true;
  try {
    await axios.post('http://localhost:3000/users', form);
    toast.success('Usuário salvo!');
    emit('saved');
    emit('close');
  } catch (error) {
    console.error("Erro ao salvar usuário:", error);
    toast.error("Ocorreu um erro ao cadastrar o usuário. Verifique se a API está rodando.");
  } finally {
    isSaving.value = false;
  }
};
</script>

<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-container">
      <header class="modal-header">
        <h2>Adicionar Novo Usuário</h2>
        <button class="close-btn" @click="$emit('close')">&times;</button>
      </header>

      <form @submit.prevent="handleSubmit">
        <div class="modal-body">
          <div class="form-group">
            <label for="userName">Nome Completo*</label>
            <input 
              id="userName"
              v-model="form.name" 
              type="text" 
              placeholder="Digite o nome do usuário"
              required
            />
          </div>

          <div class="form-group">
            <label for="userEmail">E-mail*</label>
            <input 
              id="userEmail"
              v-model="form.email" 
              type="email" 
              placeholder="exemplo@email.com"
              required
            />
          </div>

          <div class="form-group">
            <label for="userRole">Cargo*</label>
            <select id="userRole" v-model="form.role" required>
              <option value="" disabled>Selecione um cargo</option>
              <option value="Admin">Administrador</option>
              <option value="Gerente">Gerente</option>
              <option value="Operador">Operador</option>
              <option value="Analista">Analista</option>
            </select>
          </div>
        </div>

        <footer class="modal-footer">
          <button type="button" class="btn-cancel" @click="$emit('close')">
            Cancelar
          </button>
          <button type="submit" class="btn-save" :disabled="isSaving">
            {{ isSaving ? 'Salvando...' : 'Cadastrar Usuário' }}
          </button>
        </footer>
      </form>
    </div>
  </div>
</template>