<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const menus = [
  { label: '个人信息', path: '/profile/info' },
  { label: '我的订单', path: '/profile/order' },
]

const activeMenu = computed(() => route.path)

function handleMenuSelect(path) {
  router.push(path)
}
</script>

<template>
  <div class="profile-layout">
    <aside class="profile-aside">
      <h2>个人中心</h2>
      <el-menu
        :default-active="activeMenu"
        class="profile-menu"
        @select="handleMenuSelect"
      >
        <el-menu-item v-for="item in menus" :key="item.path" :index="item.path">
          {{ item.label }}
        </el-menu-item>
      </el-menu>
    </aside>

    <main class="profile-main">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.profile-layout {
  display: grid;
  grid-template-columns: 220px minmax(0, 1fr);
  gap: 14px;
}

.profile-aside {
  border-radius: 14px;
  border: 1px solid #d8e1e8;
  background: #ffffff;
  padding: 14px;
  height: fit-content;
}

.profile-aside h2 {
  margin: 0 0 12px;
  font-size: 18px;
  color: #1f2933;
}

.profile-menu {
  border-right: none;
}

.profile-main {
  min-width: 0;
}

@media (max-width: 900px) {
  .profile-layout {
    grid-template-columns: 1fr;
  }
}
</style>
