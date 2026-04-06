<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { SwitchButton } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

const menus = [
  { label: '个人信息', path: '/profile/info' },
  { label: '我的订单', path: '/profile/order' },
]

const activeMenu = computed(() => route.path)
const username = computed(() => localStorage.getItem('username') || '用户')

function handleMenuSelect(path) {
  router.push(path)
}

async function handleLogout() {
  try {
    await ElMessageBox.confirm('确定要退出登录吗？', '退出确认', {
      type: 'warning',
      confirmButtonText: '退出',
      cancelButtonText: '取消',
    })
    
    // 清除本地存储
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    localStorage.removeItem('email')
    localStorage.removeItem('role')
    localStorage.removeItem('userId')
    localStorage.removeItem('avatar')
    
    ElMessage.success('已退出登录')
    router.push('/auth/login')
  } catch {
    // 用户取消
  }
}
</script>

<template>
  <div class="profile-layout">
    <aside class="profile-aside">
      <h2>个人中心</h2>
      <div class="user-welcome">
        <span>欢迎，{{ username }}</span>
      </div>
      <el-menu
        :default-active="activeMenu"
        class="profile-menu"
        @select="handleMenuSelect"
      >
        <el-menu-item v-for="item in menus" :key="item.path" :index="item.path">
          {{ item.label }}
        </el-menu-item>
      </el-menu>
      <div class="menu-footer">
        <el-button 
          type="danger" 
          size="small" 
          :icon="SwitchButton"
          @click="handleLogout"
          style="width: 100%"
        >
          退出登录
        </el-button>
      </div>
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

.user-welcome {
  padding: 8px 12px;
  background: #f5f7fa;
  border-radius: 8px;
  margin-bottom: 12px;
  color: #606266;
  font-size: 14px;
}

.profile-menu {
  border-right: none;
  margin-bottom: 12px;
}

.menu-footer {
  padding-top: 12px;
  border-top: 1px solid #e4e7ed;
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
