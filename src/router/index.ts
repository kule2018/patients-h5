import { useUserStore } from '@/stores'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { createRouter, createWebHistory } from 'vue-router'

// 插件配置  颜色修改
NProgress.configure({
  showSpinner: false
})

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', component: () => import('@/views/Login/index.vue') },
    {
      path: '/user/patient',
      meta: { title: '家庭档案' },
      component: () => import('@/views/User/PatientPage.vue')
    },
    {
      path: '/',
      component: () => import('@/views/Layout/index.vue'),
      redirect: '/home',
      children: [
        {
          path: '/home',
          component: () => import('@/views/Home/index.vue'),
          meta: { title: '首页' }
        },
        {
          path: '/article',
          component: () => import('@/views/Article/index.vue'),
          meta: {
            title: '健康百科'
          }
        },
        {
          path: '/notify',
          component: () => import('@/views/Notify/index.vue'),
          meta: {
            title: '消息通知'
          }
        },
        {
          path: '/user',
          component: () => import('@/views/User/index.vue'),
          meta: {
            title: '个人中心 '
          }
        }
      ]
    }
  ]
})

// 访问权限控制
router.beforeEach((to) => {
  NProgress.start()
  // 用户仓库
  const store = useUserStore()
  // 不需要登录的页面，白名单
  const whiteList = ['/login', '/register']
  // 如果没有登录且不在白名单内，去登录
  if (!store.user?.token && !whiteList.includes(to.path)) return '/login'
})

// TODO 修改标题放 后置守卫 ，切换路由完成后修改标题
router.afterEach((to) => {
  document.title = `${to.meta.title || ''}-优衣问诊`
  NProgress.done()
})

export default router
