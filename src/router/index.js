import { createRouter, createWebHashHistory } from 'vue-router'
import MainView from '@/layout/shopping/MainView.vue'
import RecommendView from '@/layout/shopping/RecommendView.vue'
import SearchView from '@/layout/shopping/SearchView.vue'
import AdminView from '@/layout/admin/AdminView.vue'
import CategoryView from '@/layout/admin/CategoryView.vue'
import ProductView from '@/layout/admin/ProductView.vue'
import UserView from '@/layout/admin/UserView.vue'
import OrderView from '@/layout/admin/OrderView.vue'
import AuthView from '@/layout/auth/AuthView.vue'
import LognView from '@/layout/auth/LognView.vue'
import RegisterView from '@/layout/auth/RegisterView.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path:"/",
      redirect:"/shopping",
    },
    {
      path:"/shopping",
      component:MainView,
      redirect:"/shopping/recommend",
      children:[
        {
          path:"recommend",
          component: RecommendView
        },
        {
          path:"search",
          component:SearchView
        }
      ]
    },
    {
      path:"/admin",
      component:AdminView,
      redirect: '/admin/category',
      children:[
        {
          path: 'category',
          component: CategoryView,
        },
        {
          path: 'product',
          component: ProductView,
        },
        {
          path: 'user',
          component: UserView,
        },
        {
          path: 'order',
          component: OrderView,
        },
      ]
    },
    {
      path: '/auth',
      component: AuthView,
      redirect: '/auth/login',
      children: [
        {
          path: 'login',
          component: LognView,
        },
        {
          path: 'register',
          component: RegisterView,
        },
      ],
    }
  ],
})

export default router
