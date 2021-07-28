import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'list',
    component:()=> import('@/views/components-list.vue')
  },

]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
