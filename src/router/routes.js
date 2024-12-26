const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', 
        component: () => import('pages/MainPage.vue') 
      },
      { path: '/login', 
        component: () => import('components/LoginPage.vue') 
      },
      { 
        path: '/tester', 
        component: () => import('pages/TesterDashboard.vue'),
        // meta: { requiresAuth: true, role: 'tester' }
      },
      { 
        path: '/admin', 
        component: () => import('pages/AdminDashboard.vue'),
        // meta: { requiresAuth: true, role: 'admin' }
      },
      { 
        path: '/developer', 
        component: () => import('pages/DeveloperDashboard.vue'),
        // meta: { requiresAuth: true, role: 'developer' }
      },
    ]
  },
  

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]
//added extra
// router.beforeEach((to, from, next) => {
//   const userStore = useUserStore();
  
//   if (to.meta.requiresAuth && !userStore.currentUser) {
//     next('/login');
//   } else if (to.meta.role && userStore.currentUser.role !== to.meta.role) {
//     next('/login');
//   } else {
//     next();
//   }
// });
export default routes
