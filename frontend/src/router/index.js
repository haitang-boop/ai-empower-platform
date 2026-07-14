import { createRouter, createWebHashHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/SidebarLayout.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/views/Home.vue'),
        meta: { title: '首页' }
      },
      {
        path: 'scenario/:id',
        name: 'ScenarioDetail',
        component: () => import('@/views/ScenarioDetail.vue'),
        meta: { title: '场景详情' }
      },
      {
        path: 'skill/:id',
        name: 'SkillViewer',
        component: () => import('@/views/SkillViewer.vue'),
        meta: { title: '技能学习' }
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('@/views/Profile.vue'),
        meta: { title: '个人中心', requiresAuth: true }
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'LoginView',
        component: () => import('@/views/Login.vue'),
        meta: { title: '登录' }
      }
    ]
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'RegisterView',
        component: () => import('@/views/Register.vue'),
        meta: { title: '注册' }
      }
    ]
  },
  {
    path: '/admin',
    component: () => import('@/layouts/AdminLayout.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      {
        path: 'scenarios',
        name: 'ScenarioManage',
        component: () => import('@/views/admin/ScenarioManage.vue'),
        meta: { title: '场景管理' }
      },
      {
        path: 'skills',
        name: 'SkillManage',
        component: () => import('@/views/admin/SkillManage.vue'),
        meta: { title: '技能管理' }
      },
      {
        path: 'ppt/:id',
        name: 'PptEdit',
        component: () => import('@/views/admin/PptEdit.vue'),
        meta: { title: 'PPT编辑' }
      },
      {
        path: 'users',
        name: 'UserManage',
        component: () => import('@/views/admin/UserManage.vue'),
        meta: { title: '用户管理' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? `${to.meta.title} - 研岸保研AI赋能PPT教程平台` : '研岸保研AI赋能PPT教程平台'

  const userStore = useUserStore()
  const token = localStorage.getItem('token')

  if (to.meta.requiresAuth && !token) {
    next({ name: 'LoginView', query: { redirect: to.fullPath } })
    return
  }

  if (to.meta.requiresAdmin && userStore.user?.role !== 'admin') {
    next({ name: 'Home' })
    return
  }

  next()
})

export default router
