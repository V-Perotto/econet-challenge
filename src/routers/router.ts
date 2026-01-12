import { createRouter, createWebHistory } from 'vue-router'

import CompanyFormView from '@/views/CompanyFormView.vue'
import CompanyListView from '@/views/CompanyListView.vue'
import CompanyDetailsView from '@/views/CompanyDetailsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'companies', component: CompanyListView },
    { path: '/company/create', name: 'company-create', component: CompanyFormView },
    { path: '/company/:id/edit', name: 'company-edit', component: CompanyFormView },
    { path: '/company/:id/details', name: 'company-details', component: CompanyDetailsView },
  ],
})

export default router;