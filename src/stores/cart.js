import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { 
  getCartApi, 
  addToCartApi, 
  updateCartApi, 
  deleteCartApi,
  createOrderApi 
} from '@/api/user'
import { useProductStore } from './product'

export const useCartStore = defineStore('cart', () => {
  const cartItems = ref([])
  const selectedIds = ref([])
  const productStore = useProductStore()

  const cartItemsWithProduct = computed(() => {
    return cartItems.value.map((item) => ({
      ...item,
      product: item.product || productStore.productMap[item.product_id] || null,
    }))
  })

  const selectedItems = computed(() => {
    return cartItemsWithProduct.value.filter((item) => selectedIds.value.includes(item.id))
  })

  const totalAmount = computed(() => {
    return selectedItems.value.reduce((sum, item) => {
      const price = item.product?.price || 0
      return sum + price * item.quantity
    }, 0)
  })

  const totalQuantity = computed(() => {
    return selectedItems.value.reduce((sum, item) => sum + item.quantity, 0)
  })

  const allCartQuantity = computed(() => {
    return cartItems.value.reduce((sum, item) => sum + item.quantity, 0)
  })

  async function fetchCart() {
    try {
      const response = await getCartApi()
      const data = response?.data || response
      if (Array.isArray(data)) {
        cartItems.value = data.map((item) => ({
          id: Number(item.id),
          product_id: Number(item.product_id),
          quantity: Number(item.quantity),
          product: item.product || null,
        }))
      }
      return cartItems.value
    } catch (error) {
      console.error('获取购物车失败:', error)
      throw error
    }
  }

  async function addToCart(productId, quantity = 1) {
    try {
      await addToCartApi({ product_id: productId, quantity })
      await fetchCart()
    } catch (error) {
      console.error('添加到购物车失败:', error)
      throw error
    }
  }

  async function updateCartItem(cartId, quantity) {
    try {
      await updateCartApi(cartId, { quantity })
      const item = cartItems.value.find((item) => item.id === cartId)
      if (item) {
        item.quantity = quantity
      }
    } catch (error) {
      console.error('更新购物车失败:', error)
      throw error
    }
  }

  async function removeCartItem(cartId) {
    try {
      await deleteCartApi(cartId)
      cartItems.value = cartItems.value.filter((item) => item.id !== cartId)
      selectedIds.value = selectedIds.value.filter((id) => id !== cartId)
    } catch (error) {
      console.error('删除购物车项失败:', error)
      throw error
    }
  }

  async function createOrder(orderInfo) {
    try {
      await createOrderApi(orderInfo)
      // 下单成功后清空购物车
      await fetchCart()
      selectedIds.value = []
    } catch (error) {
      console.error('创建订单失败:', error)
      throw error
    }
  }

  function toggleSelect(cartId) {
    const index = selectedIds.value.indexOf(cartId)
    if (index > -1) {
      selectedIds.value.splice(index, 1)
    } else {
      selectedIds.value.push(cartId)
    }
  }

  function toggleSelectAll() {
    if (selectedIds.value.length === cartItems.value.length) {
      selectedIds.value = []
    } else {
      selectedIds.value = cartItems.value.map((item) => item.id)
    }
  }

  function clearSelection() {
    selectedIds.value = []
  }

  return {
    cartItems,
    cartItemsWithProduct,
    selectedIds,
    selectedItems,
    totalAmount,
    totalQuantity,
    allCartQuantity,
    fetchCart,
    addToCart,
    updateCartItem,
    removeCartItem,
    createOrder,
    toggleSelect,
    toggleSelectAll,
    clearSelection,
  }
})
