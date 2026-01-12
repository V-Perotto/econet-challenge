<template>
  <table class="table mb-0">
    <thead class="table-light">
      <tr>
        <th class="ps-4">Nome</th>
        <th>CNPJ</th>
        <th class="text-end pe-4">Status</th>
        <th class="text-end pe-4">Ações</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="i in 5" :key="i" class="placeholder-glow">
        <td class="ps-4">
          <span class="placeholder rounded col-8 bg-secondary"></span>
        </td>
        <td>
          <span class="placeholder rounded col-12 bg-secondary"></span>
        </td>
        <td class="text-end">
          <span class="placeholder rounded col-3 bg-success"></span>
        </td>
        <td class="text-end pe-4">
          <span class="placeholder rounded col-2 bg-light"></span>
          <span class="placeholder rounded col-2 bg-light"></span>
          <span class="placeholder rounded col-2 bg-danger"></span>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
.table thead th {
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.9rem;
  letter-spacing: 0.5px;
}
</style>