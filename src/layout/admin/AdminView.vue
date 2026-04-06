<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Box, Grid, List, User, SwitchButton } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useAdminStore } from '@/stores/admin'

const route = useRoute()
const router = useRouter()
const adminStore = useAdminStore()

const activeMenu = computed(() => route.path)

const menus = [
  { path: '/admin/category', label: '分类管理', icon: Grid },
  { path: '/admin/product', label: '商品管理', icon: Box },
  { path: '/admin/user', label: '用户管理', icon: User },
  { path: '/admin/order', label: '订单管理', icon: List },
]

const topCards = computed(() => [
  { label: '分类总数', value: adminStore.dashboardStats.categoryCount },
  { label: '商品总数', value: adminStore.dashboardStats.productCount },
  { label: '活跃用户', value: adminStore.dashboardStats.activeUserCount },
  { label: '订单总数', value: adminStore.dashboardStats.orderCount },
])

const username = computed(() => localStorage.getItem('username') || '管理员')

function handleMenuSelect(index) {
  router.push(index)
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
  <div class="admin-layout">
    <el-container>
      <el-aside width="240px" class="admin-aside">
        <div class="brand">
          <h1>GO SHOPPING</h1>
          <p>后台管理中心</p>
        </div>

        <el-menu
          :default-active="activeMenu"
          class="admin-menu"
          @select="handleMenuSelect"
        >
          <el-menu-item
            v-for="item in menus"
            :key="item.path"
            :index="item.path"
          >
            <el-icon><component :is="item.icon" /></el-icon>
            <span>{{ item.label }}</span>
          </el-menu-item>
        </el-menu>

        <div class="menu-footer">
          <div class="user-info">
            <el-icon><User /></el-icon>
            <span>{{ username }}</span>
          </div>
        </div>
      </el-aside>

      <el-container>
        <el-header class="admin-header">
          <div>
            <strong>运营看板</strong>
            <p>围绕模型字段构建：分类、商品、用户、订单</p>
          </div>
          <div class="header-actions">
            <el-tag type="warning">GMV ¥{{ adminStore.dashboardStats.gmv.toFixed(2) }}</el-tag>
            <el-button
              type="danger"
              size="small"
              :icon="SwitchButton"
              @click="handleLogout"
            >
              退出登录
            </el-button>
          </div>
        </el-header>

        <el-main class="admin-main">
          <div class="top-cards">
            <div v-for="card in topCards" :key="card.label" class="card-item">
              <span>{{ card.label }}</span>
              <strong>{{ card.value }}</strong>
            </div>
          </div>
          <RouterView />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped>
.admin-layout {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f4ea 0%, #ecf5ff 60%, #f6efe8 100%);
}

.admin-aside {
  min-height: 100vh;
  background: #102a43;
  color: #f0f4f8;
  border-right: 1px solid #0b1f33;
}

.brand {
  padding: 26px 22px 16px;
}

.brand h1 {
  margin: 0;
  font-size: 18px;
  letter-spacing: 1px;
}

.brand p {
  margin: 6px 0 0;
  color: #9fb3c8;
  font-size: 13px;
}

.admin-menu {
  border-right: none;
  background: transparent;
}

:deep(.admin-menu .el-menu-item) {
  color: #d9e2ec;
}

:deep(.admin-menu .el-menu-item.is-active) {
  background: #1f4f7a;
  color: #ffffff;
}

.menu-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.1);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #d9e2ec;
  font-size: 14px;
}

.admin-header {
  height: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px 12px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.admin-header p {
  margin: 6px 0 0;
  color: #486581;
  font-size: 13px;
}

.admin-main {
  padding: 0 24px 24px;
}

.top-cards {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 16px;
}

.card-item {
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.86);
  border: 1px solid #d9e2ec;
  padding: 12px 14px;
  display: grid;
  gap: 8px;
}

.card-item span {
  color: #486581;
  font-size: 12px;
}

.card-item strong {
  font-size: 22px;
  color: #102a43;
}

@media (max-width: 960px) {
  .top-cards {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .admin-aside {
    width: 200px !important;
  }

  .header-actions {
    width: 100%;
    justify-content: flex-end;
    margin-top: 10px;
  }

  .admin-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>