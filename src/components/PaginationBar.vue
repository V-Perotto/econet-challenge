<script setup lang="ts">
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';
import { VueAwesomePaginate } from "vue-awesome-paginate";

interface Props {
  totalItems: number;
  itemsPerPage: number;
  maxPagesShown?: number;
}

const props = withDefaults(defineProps<Props>(), {
  maxPagesShown: 3
});

const currentPage = defineModel<number>({ default: 1 });

const emit = defineEmits(['change']);

const onClickHandler = (page: number) => {
  emit('change', page);
};
</script>

<template>
  <div class="d-flex justify-content-center mt-4">
    <vue-awesome-paginate
      :total-items="props.totalItems"
      :items-per-page="props.itemsPerPage"
      :max-pages-shown="props.maxPagesShown"
      v-model="currentPage"
      :on-click="onClickHandler"
    >
      <template #prev-button>
        <ChevronLeft :size="16" />
      </template>
      <template #next-button>
        <ChevronRight :size="16" />
      </template>
    </vue-awesome-paginate>
  </div>
</template>

<style>
.pagination-container {
  display: flex;
  column-gap: 10px;
  list-style-type: none;
  padding: 0;
  margin: 0;
}
.paginate-buttons {
  height: 35px;
  min-width: 35px;
  padding: 0 8px;
  border-radius: 8px;
  cursor: pointer;
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  color: #212529;
  transition: all 0.2s ease-in-out;
}
.paginate-buttons:hover {
  background-color: #e9ecef;
  border-color: #adb5bd;
}
.active-page {
  background-color: #0d6efd;
  border-color: #0d6efd;
  color: white;
}
.active-page:hover {
  background-color: #0b5ed7;
}
.disabled-paginate-buttons {
  opacity: 0.5;
  cursor: not-allowed;
  color: #adb5bd;
  background-color: #f8f9fa;
}
</style>