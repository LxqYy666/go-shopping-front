import { createRouter, createWebHashHistory } from 'vue-router'
import MainView from '@/layout/shopping/MainView.vue'
import RecommendView from '@/layout/shopping/RecommendView.vue'
import SearchView from '@/layout/shopping/SearchView.vue'
import AdminView from '@/layout/admin/AdminView.vue'
import CategoryView from '@/layout/admin/CategoryView.vue'
import ProductView from '@/layout/admin/ProductView.vue'
import UserView from '@/layout/admin/UserView.vue'
import OrderView from '@/layout/admin/OrderView.vue'

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
    }
  ],
})

export default router
