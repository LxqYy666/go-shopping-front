<script setup>
import HeaderView from './component/HeaderView.vue';
import FooterView from './component/FooterView.vue';
import { ref } from 'vue';

const isLoggedIn = ref(false);
const username = ref('张三');
const cartCount = ref(2);

function handleLogin() {
  isLoggedIn.value = true;
}

function handleCartClick() {
  console.log('购物车点击事件');
}

</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <HeaderView
          :is-logged-in="isLoggedIn"
          :username="username"
          :cart-count="cartCount"
          @login="handleLogin"
          @cart-click="handleCartClick"
        />
      </el-header>
      <el-main>
        <RouterView/>
      </el-main>
      <el-footer>
        <FooterView />
      </el-footer>
    </el-container>
  </div>
</template>

<style scoped>
.common-layout {
  min-height: 100vh;
}

:deep(.el-container) {
  min-height: 100vh;
}

:deep(.el-footer) {
  height: auto;
  padding: 0;
}

</style>