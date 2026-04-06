<script setup>
import { computed, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useAdminStore } from '@/stores/admin'

const adminStore = useAdminStore()
const statusFilter = ref('all')
const keyword = ref('')
const detailVisible = ref(false)
const currentOrder = ref(null)

const statusTagType = {
  pending: 'warning',
  paid: 'primary',
  shipped: 'success',
  completed: 'info',
}

const filteredOrders = computed(() => {
  return adminStore.ordersWithRelations.filter((item) => {
    const statusMatch = statusFilter.value === 'all' || item.status === statusFilter.value
    const text = `${item.id}${item.user?.username || ''}${item.receiver_name}${item.receiver_phone}`
    const keywordMatch = text.toLowerCase().includes(keyword.value.toLowerCase())
    return statusMatch && keywordMatch
  })
})

function calcItemCount(order) {
  return order.items.reduce((sum, item) => sum + item.quantity, 0)
}

function updateOrderStatus(order, status) {
  adminStore.updateOrder(order.id, { status })
  ElMessage.success('订单状态已更新')
}

function openDetail(order) {
  currentOrder.value = order
  detailVisible.value = true
}

onMounted(() => {
  adminStore.fetchOrderList()
  adminStore.fetchUserList()
  adminStore.fetchProductList()
})
</script>

<template>
  <section class="admin-panel">
    <div class="toolbar">
      <h2>订单管理</h2>
      <div class="toolbar-actions">
        <el-input
          v-model="keyword"
          placeholder="搜索订单号 / 用户 / 收货人"
          clearable
          style="width: 240px"
        />
        <el-radio-group v-model="statusFilter" size="small">
          <el-radio-button label="all">全部</el-radio-button>
          <el-radio-button label="pending">待支付</el-radio-button>
          <el-radio-button label="paid">已支付</el-radio-button>
          <el-radio-button label="shipped">已发货</el-radio-button>
          <el-radio-button label="completed">已完成</el-radio-button>
        </el-radio-group>
      </div>
    </div>

    <el-table :data="filteredOrders" stripe>
      <el-table-column prop="id" label="订单号" width="100" />
      <el-table-column label="用户" min-width="140">
        <template #default="{ row }">
          {{ row.user?.username || '未知用户' }}
        </template>
      </el-table-column>
      <el-table-column label="收货信息" min-width="220">
        <template #default="{ row }">
          <div>{{ row.receiver_name }} {{ row.receiver_phone }}</div>
          <small>{{ row.receiver_addr }}</small>
        </template>
      </el-table-column>
      <el-table-column label="商品明细" min-width="220">
        <template #default="{ row }">
          <div v-for="item in row.items" :key="item.id" class="order-item">
            <span>{{ item.product?.name || '商品已下架' }}</span>
            <b>x{{ item.quantity }}</b>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="件数" width="80" align="center">
        <template #default="{ row }">{{ calcItemCount(row) }}</template>
      </el-table-column>
      <el-table-column label="总金额" width="120">
        <template #default="{ row }">¥{{ row.total_amount.toFixed(2) }}</template>
      </el-table-column>
      <el-table-column label="状态" width="100" align="center">
        <template #default="{ row }">
          <el-tag :type="statusTagType[row.status] || 'info'">{{ row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="260" align="center">
        <template #default="{ row }">
          <el-space>
            <el-select
              :model-value="row.status"
              style="width: 120px"
              size="small"
              @change="(value) => updateOrderStatus(row, value)"
            >
              <el-option label="pending" value="pending" />
              <el-option label="paid" value="paid" />
              <el-option label="shipped" value="shipped" />
              <el-option label="completed" value="completed" />
            </el-select>
            <el-button link type="primary" @click="openDetail(row)">详情</el-button>
          </el-space>
        </template>
      </el-table-column>
    </el-table>

    <el-drawer v-model="detailVisible" title="订单详情" size="420px">
      <template v-if="currentOrder">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="订单号">#{{ currentOrder.id }}</el-descriptions-item>
          <el-descriptions-item label="用户">
            {{ currentOrder.user?.username || '未知用户' }}
          </el-descriptions-item>
          <el-descriptions-item label="收货人">
            {{ currentOrder.receiver_name }} {{ currentOrder.receiver_phone }}
          </el-descriptions-item>
          <el-descriptions-item label="收货地址">
            {{ currentOrder.receiver_addr }}
          </el-descriptions-item>
          <el-descriptions-item label="备注">
            {{ currentOrder.remark || '无' }}
          </el-descriptions-item>
          <el-descriptions-item label="金额">
            ¥{{ currentOrder.total_amount.toFixed(2) }}
          </el-descriptions-item>
        </el-descriptions>

        <h4 class="drawer-title">商品明细</h4>
        <ul class="drawer-items">
          <li v-for="item in currentOrder.items" :key="item.id">
            <span>{{ item.product?.name || '商品已下架' }}</span>
            <b>x{{ item.quantity }}</b>
          </li>
        </ul>
      </template>
    </el-drawer>
  </section>
</template>

<style scoped>
.admin-panel {
  border-radius: 14px;
  border: 1px solid #d9e2ec;
  background: #ffffff;
  padding: 16px;
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.toolbar-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.toolbar h2 {
  margin: 0;
  font-size: 18px;
  color: #102a43;
}

.order-item {
  display: flex;
  justify-content: space-between;
  gap: 8px;
}

small {
  color: #829ab1;
}

.drawer-title {
  margin: 16px 0 10px;
  color: #334e68;
}

.drawer-items {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 8px;
}

.drawer-items li {
  display: flex;
  justify-content: space-between;
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid #d9e2ec;
}
</style>
