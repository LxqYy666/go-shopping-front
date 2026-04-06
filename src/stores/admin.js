import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { 
  addCategoryApi, 
  getUserListApi,
  getOrderListApi,
  addProductApi,
  updateProductApi,
  deleteProductApi,
  updateOrderApi
} from '@/api/admin'
import { useProductStore } from './product'

function nextId(list) {
  if (list.length === 0) {
    return 1
  }
  return Math.max(...list.map((item) => Number(item.id) || 0)) + 1
}

function normalizeUserList(response) {
  if (Array.isArray(response)) {
    return response
  }
  if (Array.isArray(response?.data)) {
    return response.data
  }
  if (Array.isArray(response?.rows)) {
    return response.rows
  }
  if (Array.isArray(response?.list)) {
    return response.list
  }
  if (Array.isArray(response?.data?.list)) {
    return response.data.list
  }
  return null
}

function normalizeOrderList(response) {
  if (Array.isArray(response)) {
    return response
  }
  if (Array.isArray(response?.data)) {
    return response.data
  }
  if (Array.isArray(response?.rows)) {
    return response.rows
  }
  if (Array.isArray(response?.list)) {
    return response.list
  }
  if (Array.isArray(response?.data?.list)) {
    return response.data.list
  }
  return null
}

export const useAdminStore = defineStore('admin', () => {
  const productStore = useProductStore()
  const userList = ref([])
  const orderList = ref([])

  const categoryList = computed(() => productStore.categoryList)
  const productList = computed(() => productStore.productList)
  const categoryMap = computed(() => productStore.categoryMap)
  const productMap = computed(() => productStore.productMap)
  const productsWithCategory = computed(() => productStore.productsWithCategory)

  const userMap = computed(() => {
    return userList.value.reduce((acc, item) => {
      acc[item.id] = item
      return acc
    }, {})
  })

  const ordersWithRelations = computed(() => {
    return orderList.value.map((order) => ({
      ...order,
      user: userMap.value[order.user_id] || null,
      items: (order.items || []).map((item) => ({
        ...item,
        product: productMap.value[item.product_id] || null,
      })),
    }))
  })

  const dashboardStats = computed(() => {
    return {
      categoryCount: categoryList.value.length,
      productCount: productList.value.length,
      activeUserCount: userList.value.filter((item) => item.status === 'active').length,
      orderCount: orderList.value.length,
      gmv: orderList.value.reduce((sum, item) => sum + Number(item.total_amount || 0), 0),
    }
  })

  async function fetchCategoryList() {
    return await productStore.fetchCategoryList()
  }

  async function createCategory(payload) {
    await addCategoryApi(payload)
    await fetchCategoryList()
    return categoryList.value
  }

  async function fetchProductList() {
    return await productStore.fetchProductList()
  }

  async function fetchUserList() {
    const response = await getUserListApi()
    const remoteList = normalizeUserList(response)
    if (Array.isArray(remoteList)) {
      userList.value = remoteList.map((item) => ({
        id: Number(item.id),
        username: item.username || '',
        email: item.email || '',
        avatar: item.avatar || '',
        role: item.role || 'user',
        status: item.status || 'active',
        created_at: item.created_at || '',
        orders_count:item.orders_count || 0
      }))
    }
    return userList.value
  }

  async function fetchOrderList() {
    const response = await getOrderListApi()
    const remoteList = normalizeOrderList(response)
    if (Array.isArray(remoteList)) {
      orderList.value = remoteList.map((item) => ({
        id: Number(item.id),
        user_id: Number(item.user_id),
        total_amount: Number(item.total_amount) || 0,
        status: item.status || 'pending',
        receiver_addr: item.receiver_addr || '',
        receiver_name: item.receiver_name || '',
        receiver_phone: item.receiver_phone || '',
        remark: item.remark || '',
        created_at: item.created_at || '',
        user: item.user || null,
        items: Array.isArray(item.items) ? item.items.map((orderItem) => ({
          id: Number(orderItem.id),
          product_id: Number(orderItem.product_id),
          quantity: Number(orderItem.quantity) || 0,
          total_price: Number(orderItem.total_price) || 0,
          product: orderItem.product || null,
        })) : [],
      }))
    }
    return orderList.value
  }

  function addCategory(payload) {
    const newCategory = {
      id: nextId(categoryList.value),
      name: payload.name,
    }
    productStore.categoryList.value.push(newCategory)
  }

  function updateCategory(id, payload) {
    const idx = categoryList.value.findIndex((item) => item.id === id)
    if (idx === -1) {
      return false
    }
    productStore.categoryList.value[idx] = { ...categoryList.value[idx], ...payload }
    return true
  }

  function removeCategory(id) {
    const usingCount = productList.value.filter((item) => item.category_id === id).length
    if (usingCount > 0) {
      return { ok: false, message: '该分类下还有商品，请先处理商品后再删除。' }
    }
    productStore.categoryList.value = categoryList.value.filter((item) => item.id !== id)
    return { ok: true }
  }

  function addProduct(payload) {
    const newProduct = {
      id: nextId(productList.value),
      category_id: payload.category_id,
      name: payload.name,
      desc: payload.desc || '',
      price: Number(payload.price) || 0,
      stock: Number(payload.stock) || 0,
      image_url: payload.image_url || '',
      sold_count: Number(payload.sold_count) || 0,
      status: payload.status || 'on',
    }
    productStore.productList.push(newProduct)
    // 同步到后端
    addProductApi(payload).catch(console.error)
  }

  function updateProduct(id, payload) {
    const idx = productList.value.findIndex((item) => item.id === id)
    if (idx === -1) {
      return false
    }
    productStore.productList.value[idx] = {
      ...productList.value[idx],
      ...payload,
      price: Number(payload.price ?? productList.value[idx].price),
      stock: Number(payload.stock ?? productList.value[idx].stock),
      sold_count: Number(payload.sold_count ?? productList.value[idx].sold_count),
    }
    // 同步到后端
    updateProductApi(id, payload).catch(console.error)
    return true
  }

  function removeProduct(id) {
    productStore.productList.value = productList.value.filter((item) => item.id !== id)
    orderList.value = orderList.value.map((order) => ({
      ...order,
      items: (order.items || []).filter((item) => item.product_id !== id),
    }))
    // 同步到后端
    deleteProductApi(id).catch(console.error)
  }

  function updateUser(id, payload) {
    const idx = userList.value.findIndex((item) => item.id === id)
    if (idx === -1) {
      return false
    }
    userList.value[idx] = { ...userList.value[idx], ...payload }
    return true
  }

  function addUser(payload) {
    userList.value.push({
      id: nextId(userList.value),
      username: payload.username,
      email: payload.email,
      avatar: payload.avatar || '',
      role: payload.role || 'user',
      status: payload.status || 'active',
      created_at: payload.created_at || new Date().toLocaleString('zh-CN', { hour12: false }),
    })
  }

  function updateOrder(id, payload) {
    const idx = orderList.value.findIndex((item) => item.id === id)
    if (idx === -1) {
      return false
    }
    orderList.value[idx] = { ...orderList.value[idx], ...payload }
    // 同步到后端
    updateOrderApi(id, payload).catch(console.error)
    return true
  }

  return {
    categoryList,
    productList,
    userList,
    orderList,
    categoryMap,
    productMap,
    userMap,
    productsWithCategory,
    ordersWithRelations,
    dashboardStats,
    fetchCategoryList,
    fetchProductList,
    fetchUserList,
    fetchOrderList,
    createCategory,
    addCategory,
    updateCategory,
    removeCategory,
    addProduct,
    updateProduct,
    removeProduct,
    addUser,
    updateUser,
    updateOrder,
  }
})
