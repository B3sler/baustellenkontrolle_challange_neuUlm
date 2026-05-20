import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/sb/baustellen' },

    // Sachbearbeiter
    {
      path: '/sb/baustellen',
      component: () => import('../views/sachbearbeiter/BaustellenListView.vue'),
    },
    {
      path: '/sb/baustellen/:id',
      component: () => import('../views/sachbearbeiter/BaustellenDetailView.vue'),
    },
    {
      path: '/sb/maengel',
      component: () => import('../views/sachbearbeiter/MaengelListView.vue'),
    },
    {
      path: '/sb/karte',
      component: () => import('../views/sachbearbeiter/KarteView.vue'),
    },

    // Bauleiter
    {
      path: '/bl/projects',
      component: () => import('../views/bauleiter/ProjectList.vue'),
    },
    {
      path: '/bl/projects/:id',
      component: () => import('../views/bauleiter/ProjectDetail.vue'),
    },
    {
      path: '/bl/anleitung',
      component: () => import('../views/bauleiter/AnleitungView.vue'),
    },

    // Passant
    {
      path: '/pa/report',
      component: () => import('../views/passant/DefectReportView.vue'),
    },
    {
      path: '/pa/meldungen',
      component: () => import('../views/passant/MeldungenView.vue'),
    },
    {
      path: '/pa/karte',
      component: () => import('../views/passant/PassantKarteView.vue'),
    },
    {
      path: '/pa/anleitung',
      component: () => import('../views/passant/AnleitungView.vue'),
    },

    // 404 fallback
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

export default router
