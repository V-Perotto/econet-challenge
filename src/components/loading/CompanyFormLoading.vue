<template>
  <div class="row g-3">
    <div class="col-md-8">
      <label for="name" class="form-label fw-semibold">Nome da Empresa <span class="text-danger">*</span></label>
      <div class="input-placeholder placeholder rounded bg-secondary col-12 h3"></div>
    </div>
    <div class="col-md-4">
      <label for="cnpj" class="form-label fw-semibold">CNPJ <span class="text-danger">*</span></label>
      <div class="input-placeholder placeholder rounded bg-secondary col-12 h3"></div>
    </div>
    <div class="col-12 mt-4">
      <div class="d-flex gap-2">
        <label class="form-check-label fw-semibold" for="status">Status da Empresa</label>
        <span class="placeholder rounded col-1 bg-primary"></span>
        <span class="placeholder rounded col-1 bg-success"></span>
      </div>
    </div>
    <hr class="my-4 text-muted opacity-25">
    <div class="col-12 mt-1">
      <div class="input-placeholder btn btn-primary disabled placeholder rounded col-12 h3"></div>
    </div>
  </div>
</template>
<style scoped>
.input-placeholder {
  height: 48px; 
  border-radius: 6px;
}
</style>