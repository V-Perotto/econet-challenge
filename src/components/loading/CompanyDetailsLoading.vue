<script lang="ts">  
import { Users } from 'lucide-vue-next'
</script>
<template>
  <div class="card shadow-sm border-1 mb-5 placeholder-glow">
    <div class="card-body p-4">
      <div class="col-md-4 mb-3">
        <span class="placeholder rounded bg-primary col-12 h3"></span>
      </div>
      <div class="d-flex gap-2">
        <strong>CNPJ:</strong><span class="placeholder rounded bg-secondary col-2"></span>
        <strong>Status:</strong><span class="placeholder rounded bg-success col-1"></span>
      </div>
    </div>
  </div>

  <div class="section-header d-flex justify-content-between align-items-center mb-3">
    <h4 class="fw-bold d-flex align-items-center gap-2">
      <Users :size="22" /> Usuários Vinculados
    </h4>
    <button class="btn btn-primary disabled placeholder rounded col-2"></button>
  </div>

  <div class="card shadow-sm border-1">
    <div class="table-responsive">
      <table class="table mb-0">
        <thead class="table-light">
          <tr>
            <th class="ps-4">Nome</th>
            <th>E-mail</th>
            <th class="text-center pe-4">Cargo</th>
            <th class="text-end pe-4">Ações</th>
          </tr>
        </thead>
        <tbody class="placeholder-glow">
          <tr v-for="i in 5" :key="i">
            <td class="ps-4"><span class="placeholder rounded bg-secondary col-8"></span></td>
            <td><span class="placeholder rounded bg-secondary col-10"></span></td>
            <td class="text-center"><span class="placeholder rounded bg-dark col-6"></span></td>
            <td class="text-end pe-4"><span class="placeholder rounded bg-danger col-2"></span></td>
          </tr>
        </tbody>
      </table>
    </div>
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
</style>