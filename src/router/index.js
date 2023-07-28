import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/inicio',
    name: 'inicio',
    component: () => import('../views/InicioView.vue')
  },
  {
    path: '/analisis-actual',
    name: 'analisisA',
    component: () => import('../views/AnalisisActual.vue')
  },
  {
    path: '/analisis-inversiones',
    name: 'analisisI',
    component: () => import('../views/AnalisisInversiones.vue')
  },
  {
    path: '/editar',
    name: 'editar',
    component: () => import('../views/EdicionView.vue')
  },
  {
    path: '/nueva-compra',
    name: 'nuevacompra',
    component: () => import('../views/NewCompra.vue')
  },
  {
    path: '/nueva-venta',
    name: 'nuevaventa',
    component: () => import('../views/NewVenta.vue')
  },
  {
    path: '/historial',
    name: 'historial',
    component: () => import('../views/HistorialView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
