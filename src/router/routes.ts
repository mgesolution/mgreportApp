/* eslint-disable @typescript-eslint/no-unused-vars */
import { RouteConfig } from 'vue-router'

const routes: RouteConfig[] = [
  {
    path: '/',
    redirect: '/dashboard',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: 'dashboard', component: () => import('pages/Index.vue'), name: 'dashboard-page' }]
  },
  {
    path: '/koneksi',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Koneksi/Koneksi.vue'), name: 'koneksi-page' },
      {
        path: 'new',
        component: () => import('pages/Koneksi/KoneksiInsert.vue'),
        name: 'koneksi-insert-page',
        props: route => ({
          paramID: 0
        })
      },
      {
        path: ':id',
        component: () => import('pages/Koneksi/KoneksiInsert.vue'),
        name: 'koneksi-edit-page',
        props: route => ({
          paramID: route.params.id
        })
      }
    ]
  },
  {
    path: '/generate-report',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/GenerateReport/GenerateReport.vue'), name: 'generate-report-page' }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
