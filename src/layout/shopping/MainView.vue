<script setup>
import HeaderView from './component/HeaderView.vue';
import FooterView from './component/FooterView.vue';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAdminStore } from '@/stores/admin';

const router = useRouter();
const adminStore = useAdminStore();
const isLoggedIn = computed(() => Boolean(localStorage.getItem('token')));
const username = computed(() => localStorage.getItem('username') || '');
const cartCount = ref(2);
const selectedCategory = ref(0);

function handleLogin() {
  router.push('/auth/login');
}

function handleCartClick() {
  console.log('购物车点击事件');
}

const quickCategories = computed(() => [
  { id: 0, name: '全部推荐' },
  ...adminStore.categoryList,
]);

onMounted(() => {
  adminStore.fetchCategoryList();
  adminStore.fetchProductList();
});

</script>

<template>
  <div class="shopping-layout">
    <el-container>
      <el-header class="main-header">
        <HeaderView
          :is-logged-in="isLoggedIn"
          :username="username"
          :cart-count="cartCount"
          @login="handleLogin"
          @cart-click="handleCartClick"
        />
      </el-header>
      <el-main class="main-content">

        <RouterView :selected-category="selectedCategory"/>
      </el-main>
      <el-footer>
        <FooterView />
      </el-footer>
    </el-container>
  </div>
</template>

<style scoped>
.shopping-layout {
  min-height: 100vh;
  background: radial-gradient(circle at 12% 20%, #fff8ea 0%, #f8fbff 42%, #effaf1 100%);
}

:deep(.el-container) {
  min-height: 100vh;
}

.main-header {
  padding: 0;
}

.main-content {
  padding: 16px;
  display: grid;
  gap: 16px;
}

.category-tabs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.cat-tag {
  cursor: pointer;
}

:deep(.el-footer) {
  height: auto;
  padding: 0;
}

@media (max-width: 768px) {
  .main-content {
    padding: 12px;
  }
}

</style>