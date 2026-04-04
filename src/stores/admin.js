import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { addCategoryApi, getCategoryListApi, getProductListApi, getUserListApi } from '@/api/admin'

function nextId(list) {
  if (list.length === 0) {
    return 1
  }
  return Math.max(...list.map((item) => Number(item.id) || 0)) + 1
}

function normalizeCategoryList(response) {
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

function normalizeProductList(response) {
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

export const useAdminStore = defineStore('admin', () => {
  const categoryList = ref([])
  const productList = ref([])
  const userList = ref([])
  const orderList = ref([])

  const currentUserId = computed(() => {
    const raw = Number(localStorage.getItem('userId'))
    return Number.isFinite(raw) && raw > 0 ? raw : 0
  })

  const categoryMap = computed(() => {
    return categoryList.value.reduce((acc, item) => {
      acc[item.id] = item
      return acc
    }, {})
  })

  const productMap = computed(() => {
    return productList.value.reduce((acc, item) => {
      acc[item.id] = item
      return acc
    }, {})
  })

  const userMap = computed(() => {
    return userList.value.reduce((acc, item) => {
      acc[item.id] = item
      return acc
    }, {})
  })

  const productsWithCategory = computed(() => {
    return productList.value.map((item) => ({
      ...item,
      category: categoryMap.value[item.category_id] || null,
    }))
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

  const currentUser = computed(() => {
    if (currentUserId.value) {
      const byId = userList.value.find((item) => item.id === currentUserId.value)
      if (byId) {
        return byId
      }
    }
    const loginName = (localStorage.getItem('username') || '').trim()
    if (loginName) {
      return userList.value.find((item) => item.username === loginName) || null
    }
    return null
  })

  const myOrders = computed(() => {
    if (!currentUser.value) {
      return []
    }
    return ordersWithRelations.value.filter((order) => order.user_id === currentUser.value.id)
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
    const response = await getCategoryListApi()
    const remoteList = normalizeCategoryList(response)
    if (Array.isArray(remoteList)) {
      categoryList.value = remoteList.map((item) => ({
        id: Number(item.id),
        name: item.name,
      }))
    }
    return categoryList.value
  }

  async function createCategory(payload) {
    await addCategoryApi(payload)
    await fetchCategoryList()
    return categoryList.value
  }

  async function fetchProductList() {
    const response = await getProductListApi()
    const remoteList = normalizeProductList(response)
    if (Array.isArray(remoteList)) {
      productList.value = remoteList.map((item) => ({
        id: Number(item.id),
        category_id: Number(item.category_id),
        name: item.name || '',
        desc: item.desc || '',
        price: Number(item.price) || 0,
        stock: Number(item.stock) || 0,
        image_url: item.image_url || '',
        sold_count: Number(item.sold_count) || 0,
        status: item.status || 'off',
      }))
    }
    return productList.value
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

  function addCategory(payload) {
    categoryList.value.push({
      id: nextId(categoryList.value),
      name: payload.name,
    })
  }

  function updateCategory(id, payload) {
    const idx = categoryList.value.findIndex((item) => item.id === id)
    if (idx === -1) {
      return false
    }
    categoryList.value[idx] = { ...categoryList.value[idx], ...payload }
    return true
  }

  function removeCategory(id) {
    const usingCount = productList.value.filter((item) => item.category_id === id).length
    if (usingCount > 0) {
      return { ok: false, message: '该分类下还有商品，请先处理商品后再删除。' }
    }
    categoryList.value = categoryList.value.filter((item) => item.id !== id)
    return { ok: true }
  }

  function addProduct(payload) {
    productList.value.push({
      id: nextId(productList.value),
      category_id: payload.category_id,
      name: payload.name,
      desc: payload.desc || '',
      price: Number(payload.price) || 0,
      stock: Number(payload.stock) || 0,
      image_url: payload.image_url || '',
      sold_count: Number(payload.sold_count) || 0,
      status: payload.status || 'on',
    })
  }

  function updateProduct(id, payload) {
    const idx = productList.value.findIndex((item) => item.id === id)
    if (idx === -1) {
      return false
    }
    productList.value[idx] = {
      ...productList.value[idx],
      ...payload,
      price: Number(payload.price ?? productList.value[idx].price),
      stock: Number(payload.stock ?? productList.value[idx].stock),
      sold_count: Number(payload.sold_count ?? productList.value[idx].sold_count),
    }
    return true
  }

  function removeProduct(id) {
    productList.value = productList.value.filter((item) => item.id !== id)
    orderList.value = orderList.value.map((order) => ({
      ...order,
      items: (order.items || []).filter((item) => item.product_id !== id),
    }))
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
    return true
  }

  function ensureCurrentUser() {
    if (currentUser.value) {
      return currentUser.value
    }

    const username = (localStorage.getItem('username') || '').trim()
    if (!username) {
      return null
    }

    const payload = {
      username,
      email: localStorage.getItem('email') || '',
      avatar: localStorage.getItem('avatar') || '',
      role: localStorage.getItem('role') || 'user',
      status: 'active',
    }
    addUser(payload)

    const createdUser = userList.value[userList.value.length - 1] || null
    if (createdUser) {
      localStorage.setItem('userId', String(createdUser.id))
    }
    return createdUser
  }

  function saveCurrentUserProfile(payload) {
    const user = ensureCurrentUser()
    if (!user) {
      return null
    }

    updateUser(user.id, {
      username: payload.username,
      email: payload.email,
      avatar: payload.avatar || '',
    })

    localStorage.setItem('username', payload.username)
    localStorage.setItem('email', payload.email)
    localStorage.setItem('avatar', payload.avatar || '')

    return userList.value.find((item) => item.id === user.id) || null
  }

  return {
    categoryList,
    productList,
    userList,
    orderList,
    currentUserId,
    currentUser,
    myOrders,
    productsWithCategory,
    ordersWithRelations,
    dashboardStats,
    fetchCategoryList,
    fetchProductList,
    fetchUserList,
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
    ensureCurrentUser,
    saveCurrentUserProfile,
  }
})
