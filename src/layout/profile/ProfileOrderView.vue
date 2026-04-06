<script setup>
import { computed, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const statusFilter = ref('all')
const detailVisible = ref(false)
const currentOrder = ref(null)

const statusTagType = {
  pending: 'warning',
  paid: 'primary',
  shipped: 'success',
  completed: 'info',
  cancelled: 'danger',
}

const rows = computed(() => {
  return userStore.ordersWithRelations.filter((item) => {
    return statusFilter.value === 'all' || item.status === statusFilter.value
  })
})

function canCancel(order) {
  return order.status === 'pending' || order.status === 'paid'
}

function cancelOrder(order) {
  if (!canCancel(order)) {
    ElMessage.warning('当前状态不可取消')
    return
  }
  // TODO: 调用取消订单API
  ElMessage.success('订单已取消')
}

function openDetail(order) {
  currentOrder.value = order
  detailVisible.value = true
}

function calcItemCount(order) {
  return (order.items || []).reduce((sum, item) => sum + Number(item.quantity || 0), 0)
}

onMounted(async () => {
  try {
    await userStore.fetchUserOrders()
  } catch (error) {
    console.error('获取订单失败', error)
  }

})
</script>

<template>
  <section class="profile-panel">
    <div class="panel-head">
      <h3>订单管理</h3>
      <el-radio-group v-model="statusFilter" size="small">
        <el-radio-button label="all">全部</el-radio-button>
        <el-radio-button label="pending">待支付</el-radio-button>
        <el-radio-button label="paid">已支付</el-radio-button>
        <el-radio-button label="shipped">已发货</el-radio-button>
        <el-radio-button label="completed">已完成</el-radio-button>
        <el-radio-button label="cancelled">已取消</el-radio-button>
      </el-radio-group>
    </div>

    <el-table :data="rows" stripe>
      <el-table-column prop="id" label="订单号" width="110" />
      <el-table-column label="商品件数" width="120" align="center">
        <template #default="{ row }">{{ calcItemCount(row) }}</template>
      </el-table-column>
      <el-table-column label="总金额" width="130">
        <template #default="{ row }">¥{{ Number(row.total_amount || 0).toFixed(2) }}</template>
      </el-table-column>
      <el-table-column label="收货信息" min-width="260">
        <template #default="{ row }">
          <div>{{ row.receiver_name }} {{ row.receiver_phone }}</div>
          <small>{{ row.receiver_addr }}</small>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="110" align="center">
        <template #default="{ row }">
          <el-tag :type="statusTagType[row.status] || 'info'">{{ row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" align="center">
        <template #default="{ row }">
          <el-space>
            <el-button link type="primary" @click="openDetail(row)">详情</el-button>
            <el-button link type="danger" :disabled="!canCancel(row)" @click="cancelOrder(row)">
              取消
            </el-button>
          </el-space>
        </template>
      </el-table-column>
    </el-table>

    <el-empty v-if="rows.length === 0" description="暂无订单" />

    <el-drawer v-model="detailVisible" title="订单详情" size="420px">
      <template v-if="currentOrder">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="订单号">#{{ currentOrder.id }}</el-descriptions-item>
          <el-descriptions-item label="收货人">
            {{ currentOrder.receiver_name }} {{ currentOrder.receiver_phone }}
          </el-descriptions-item>
          <el-descriptions-item label="收货地址">{{ currentOrder.receiver_addr }}</el-descriptions-item>
          <el-descriptions-item label="备注">{{ currentOrder.remark || '无' }}</el-descriptions-item>
          <el-descriptions-item label="金额">
            ¥{{ Number(currentOrder.total_amount || 0).toFixed(2) }}
          </el-descriptions-item>
        </el-descriptions>

        <h4 class="drawer-title">商品明细</h4>
        <ul class="drawer-items">
          <li v-for="item in currentOrder.items || []" :key="item.id">
            <span>{{ item.product?.name || '商品' }}</span>
            <b>x{{ item.quantity }}</b>
          </li>
        </ul>
      </template>
    </el-drawer>
  </section>
</template>

<style scoped>
.profile-panel {
  border-radius: 14px;
  border: 1px solid #d8e1e8;
  background: #ffffff;
  padding: 16px;
}

.panel-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  gap: 10px;
}

.panel-head h3 {
  margin: 0;
  font-size: 18px;
  color: #1f2933;
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
