<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useCartStore } from '@/stores/cart'
import { useProductStore } from '@/stores/product'

const router = useRouter()
const cartStore = useCartStore()
const productStore = useProductStore()
const loading = ref(false)
const checkoutDialogVisible = ref(false)
const orderForm = ref({
  receiver_name: '',
  receiver_phone: '',
  receiver_addr: '',
  remark: '',
})

const isAllSelected = computed(() => {
  return cartStore.cartItems.length > 0 && 
         cartStore.selectedIds.length === cartStore.cartItems.length
})

const hasSelectedItems = computed(() => {
  return cartStore.selectedIds.length > 0
})

async function loadData() {
  loading.value = true
  try {
    await Promise.all([
      cartStore.fetchCart(),
      productStore.fetchProductList(),
    ])
  } finally {
    loading.value = false
  }
}

function handleSelectAll() {
  cartStore.toggleSelectAll()
}

function handleSelect(item) {
  cartStore.toggleSelect(item.id)
}

async function handleQuantityChange(item, newQuantity) {
  if (newQuantity < 1) {
    return
  }
  if (item.product && newQuantity > item.product.stock) {
    ElMessage.warning('库存不足')
    return
  }
  
  try {
    await cartStore.updateCartItem(item.id, newQuantity)
    ElMessage.success('更新成功')
  } catch (error) {
    ElMessage.error('更新失败')
  }
}

async function handleRemove(item) {
  try {
    await ElMessageBox.confirm(`确定删除"${item.product?.name || '该商品'}"？`, '删除确认', {
      type: 'warning',
      confirmButtonText: '删除',
      cancelButtonText: '取消',
    })
    await cartStore.removeCartItem(item.id)
    ElMessage.success('删除成功')
  } catch (error) {
    // 用户取消或删除失败
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}


async function handleRemoveSelected() {
  if (!hasSelectedItems.value) {
    ElMessage.warning('请选择要删除的商品')
    return
  }

  try {
    await ElMessageBox.confirm(`确定删除选中的 ${cartStore.selectedIds.length} 件商品？`, '批量删除', {
      type: 'warning',
      confirmButtonText: '删除',
      cancelButtonText: '取消',
    })
    
    const deletePromises = cartStore.selectedIds.map((id) => cartStore.removeCartItem(id))
    await Promise.all(deletePromises)
    ElMessage.success('删除成功')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

function handleCheckout() {
  if (!hasSelectedItems.value) {
    ElMessage.warning('请选择要结算的商品')
    return
  }

  // 检查库存
  for (const item of cartStore.selectedItems) {
    if (!item.product) {
      ElMessage.error('商品信息不完整')
      return
    }
    if (item.product.stock < item.quantity) {
      ElMessage.error(`商品 ${item.product.name} 库存不足`)
      return
    }
  }

  orderForm.value = {
    receiver_name: localStorage.getItem('username') || '',
    receiver_phone: '',
    receiver_addr: '',
    remark: '',
  }
  checkoutDialogVisible.value = true
}

async function submitOrder() {
  if (!orderForm.value.receiver_name.trim()) {
    ElMessage.warning('请输入收货人姓名')
    return
  }
  if (!orderForm.value.receiver_phone.trim()) {
    ElMessage.warning('请输入收货人电话')
    return
  }
  if (!orderForm.value.receiver_addr.trim()) {
    ElMessage.warning('请输入收货地址')
    return
  }

  try {
    await cartStore.createOrder(orderForm.value)
    ElMessage.success('订单创建成功')
    checkoutDialogVisible.value = false
    router.push('/profile/order')
  } catch (error) {
    ElMessage.error(error.response?.data?.message || '订单创建失败')
  }
}

function goShopping() {
  router.push('/shopping/recommend')
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <div class="cart-page">
    <div class="cart-container">
      <div class="cart-header">
        <h2>购物车</h2>
        <el-tag v-if="cartStore.cartItems.length > 0" type="info">
          共 {{ cartStore.cartItems.length }} 件商品
        </el-tag>
      </div>

      <div v-if="loading" class="loading-state">
        <el-skeleton :rows="3" animated />
      </div>

      <div v-else-if="cartStore.cartItems.length === 0" class="empty-state">
        <el-empty description="购物车是空的">
          <el-button type="primary" @click="goShopping">去逛逛</el-button>
        </el-empty>
      </div>

      <div v-else class="cart-content">
        <div class="cart-list">
          <div class="cart-list-header">
            <el-checkbox 
              :model-value="isAllSelected" 
              @change="handleSelectAll"
            >
              全选
            </el-checkbox>
            <span class="header-label">商品信息</span>
            <span class="header-label">单价</span>
            <span class="header-label">数量</span>
            <span class="header-label">小计</span>
            <span class="header-label">操作</span>
          </div>

          <div 
            v-for="item in cartStore.cartItemsWithProduct" 
            :key="item.id" 
            class="cart-item"
          >
            <el-checkbox 
              :model-value="cartStore.selectedIds.includes(item.id)"
              @change="handleSelect(item)"
            />
            
            <div class="item-info">
              <img 
                :src="item.product?.image_url || '/placeholder.png'" 
                :alt="item.product?.name"
                class="item-image"
              />
              <div class="item-details">
                <div class="item-name">{{ item.product?.name || '商品已下架' }}</div>
                <div class="item-desc">{{ item.product?.desc }}</div>
              </div>
            </div>

            <div class="item-price">
              ¥{{ item.product?.price?.toFixed(2) || '0.00' }}
            </div>

            <div class="item-quantity">
              <el-input-number
                :model-value="item.quantity"
                :min="1"
                :max="item.product?.stock || 999"
                size="small"
                @change="(val) => handleQuantityChange(item, val)"
              />
              <div class="stock-hint">库存: {{ item.product?.stock || 0 }}</div>
            </div>

            <div class="item-subtotal">
              ¥{{ ((item.product?.price || 0) * item.quantity).toFixed(2) }}
            </div>

            <div class="item-actions">
              <el-button link type="danger" @click="handleRemove(item)">删除</el-button>
            </div>
          </div>
        </div>

        <div class="cart-footer">
          <div class="footer-left">
            <el-checkbox 
              :model-value="isAllSelected" 
              @change="handleSelectAll"
            >
              全选
            </el-checkbox>
            <el-button link @click="handleRemoveSelected">删除选中</el-button>
          </div>

          <div class="footer-right">
            <div class="summary">
              <span class="summary-label">
                已选 <strong>{{ cartStore.selectedIds.length }}</strong> 件商品
              </span>
              <span class="summary-total">
                合计: <strong class="total-price">¥{{ cartStore.totalAmount.toFixed(2) }}</strong>
              </span>
            </div>
            <el-button 
              type="primary" 
              size="large"
              :disabled="!hasSelectedItems"
              @click="handleCheckout"
            >
              结算
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 结算对话框 -->
    <el-dialog
      v-model="checkoutDialogVisible"
      title="确认订单"
      width="560px"
    >
      <div class="checkout-summary">
        <h4>商品清单</h4>
        <div class="checkout-items">
          <div 
            v-for="item in cartStore.selectedItems" 
            :key="item.id"
            class="checkout-item"
          >
            <span>{{ item.product?.name }}</span>
            <span>x{{ item.quantity }}</span>
            <span>¥{{ ((item.product?.price || 0) * item.quantity).toFixed(2) }}</span>
          </div>
        </div>
        <div class="checkout-total">
          <span>总计:</span>
          <strong>¥{{ cartStore.totalAmount.toFixed(2) }}</strong>
        </div>
      </div>

      <el-form :model="orderForm" label-width="100px" class="order-form">
        <el-form-item label="收货人" required>
          <el-input v-model="orderForm.receiver_name" placeholder="请输入收货人姓名" />
        </el-form-item>
        <el-form-item label="联系电话" required>
          <el-input v-model="orderForm.receiver_phone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="收货地址" required>
          <el-input 
            v-model="orderForm.receiver_addr" 
            type="textarea"
            :rows="3"
            placeholder="请输入详细收货地址"
          />
        </el-form-item>
        <el-form-item label="订单备注">
          <el-input 
            v-model="orderForm.remark" 
            type="textarea"
            :rows="2"
            placeholder="选填，可以告诉我们您的特殊需求"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="checkoutDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitOrder">提交订单</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.cart-page {
  min-height: 100vh;
  background: #f5f7fa;
  padding: 20px;
}

.cart-container {
  max-width: 1200px;
  margin: 0 auto;
  background: #ffffff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.cart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e4e7ed;
}

.cart-header h2 {
  margin: 0;
  font-size: 24px;
  color: #102a43;
}

.loading-state,
.empty-state {
  padding: 60px 0;
}

.cart-list-header {
  display: grid;
  grid-template-columns: 40px 1fr 120px 180px 120px 80px;
  gap: 16px;
  align-items: center;
  padding: 12px 16px;
  background: #f5f7fa;
  border-radius: 8px;
  margin-bottom: 12px;
  font-weight: 500;
  color: #606266;
}

.header-label {
  text-align: center;
}

.cart-item {
  display: grid;
  grid-template-columns: 40px 1fr 120px 180px 120px 80px;
  gap: 16px;
  align-items: center;
  padding: 16px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  margin-bottom: 12px;
  transition: all 0.3s;
}

.cart-item:hover {
  border-color: #409eff;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.1);
}

.item-info {
  display: flex;
  gap: 12px;
  align-items: center;
}

.item-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
}

.item-details {
  flex: 1;
}

.item-name {
  font-size: 15px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 4px;
}

.item-desc {
  font-size: 13px;
  color: #909399;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-price,
.item-subtotal {
  text-align: center;
  font-size: 16px;
  color: #f56c6c;
  font-weight: 500;
}

.item-quantity {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stock-hint {
  font-size: 12px;
  color: #909399;
}

.item-actions {
  text-align: center;
}

.cart-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 16px;
  border-top: 2px solid #e4e7ed;
  margin-top: 12px;
}

.footer-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.footer-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.summary {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.summary-label {
  font-size: 14px;
  color: #606266;
}

.summary-total {
  font-size: 16px;
  color: #303133;
}

.total-price {
  font-size: 24px;
  color: #f56c6c;
  margin-left: 8px;
}

.checkout-summary {
  margin-bottom: 20px;
}

.checkout-summary h4 {
  margin: 0 0 12px 0;
  color: #303133;
}

.checkout-items {
  background: #f5f7fa;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 12px;
}

.checkout-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 14px;
  color: #606266;
}

.checkout-item span:first-child {
  flex: 1;
}

.checkout-item span:nth-child(2) {
  margin: 0 20px;
}

.checkout-total {
  display: flex;
  justify-content: space-between;
  padding: 12px;
  font-size: 16px;
  background: #fff9e6;
  border-radius: 8px;
}

.checkout-total strong {
  color: #f56c6c;
  font-size: 20px;
}

.order-form {
  margin-top: 20px;
}

@media (max-width: 768px) {
  .cart-list-header,
  .cart-item {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .cart-footer {
    flex-direction: column;
    gap: 16px;
  }

  .footer-right {
    width: 100%;
    flex-direction: column;
  }
}
</style>
