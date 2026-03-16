import { createRouter, createWebHashHistory } from 'vue-router'
import MainView from '@/layout/shopping/MainView.vue'
import RecommendView from '@/layout/shopping/RecommendView.vue'
import SearchView from '@/layout/shopping/SearchView.vue'

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
    }
  ],
})

export default router
