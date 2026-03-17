<script setup>
import HeaderView from './component/HeaderView.vue';
import FooterView from './component/FooterView.vue';
import { ref } from 'vue';
import { categories, ordersWithRelations } from '@/mock/shopData';

const isLoggedIn = ref(false);
const username = ref('张三');
const cartCount = ref(2);
const selectedCategory = ref(0);

function handleLogin() {
  isLoggedIn.value = true;
}

function handleCartClick() {
  console.log('购物车点击事件');
}

const myOrders = ordersWithRelations.filter((item) => item.user_id === 1);

const quickCategories = [
  { id: 0, name: '全部推荐' },
  ...categories,
];

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
        <section class="hero">
          <div>
            <h1>每天上新，品质好货直达</h1>
            <p>围绕 Category/Product/Order/User 模型，展示完整商城流程。</p>
          </div>
          <el-button type="primary" size="large" @click="$router.push('/admin')">进入管理后台</el-button>
        </section>

        <section class="category-tabs">
          <el-tag
            v-for="item in quickCategories"
            :key="item.id"
            :type="selectedCategory === item.id ? 'success' : 'info'"
            class="cat-tag"
            effect="plain"
            @click="selectedCategory = item.id"
          >
            {{ item.name }}
          </el-tag>
        </section>

        <RouterView :selected-category="selectedCategory"/>

        <section class="order-section">
          <div class="section-head">
            <h2>我的订单</h2>
            <el-tag>{{ myOrders.length }} 笔</el-tag>
          </div>
          <div class="order-grid">
            <article v-for="order in myOrders" :key="order.id" class="order-card">
              <header>
                <strong>#{{ order.id }}</strong>
                <el-tag size="small">{{ order.status }}</el-tag>
              </header>
              <p>收货人：{{ order.receiver_name }} {{ order.receiver_phone }}</p>
              <p>地址：{{ order.receiver_addr }}</p>
              <footer>
                <span>{{ order.items.length }} 件商品</span>
                <b>¥{{ order.total_amount.toFixed(2) }}</b>
              </footer>
            </article>
          </div>
        </section>
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

.hero {
  border-radius: 16px;
  padding: 18px;
  background: linear-gradient(120deg, #f17a3c 0%, #f9a03f 38%, #ffd166 100%);
  color: #312100;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.hero h1 {
  margin: 0;
}

.hero p {
  margin: 8px 0 0;
}

.category-tabs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.cat-tag {
  cursor: pointer;
}

.order-section {
  border-radius: 16px;
  border: 1px solid #d8e1e8;
  background: rgba(255, 255, 255, 0.9);
  padding: 14px;
}

.section-head {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.section-head h2 {
  margin: 0;
  font-size: 18px;
}

.order-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 10px;
}

.order-card {
  background: #fffef8;
  border: 1px solid #f6e8bf;
  border-radius: 12px;
  padding: 12px;
}

.order-card header,
.order-card footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.order-card p {
  margin: 8px 0;
  color: #5c6b73;
  font-size: 13px;
}

:deep(.el-footer) {
  height: auto;
  padding: 0;
}

@media (max-width: 768px) {
  .hero {
    flex-direction: column;
    align-items: flex-start;
  }
}

</style>