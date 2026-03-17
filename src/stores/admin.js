import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { categories, orders, products, users } from '@/mock/shopData'

function clone(data) {
  return JSON.parse(JSON.stringify(data))
}

function nextId(list) {
  if (list.length === 0) {
    return 1
  }
  return Math.max(...list.map((item) => Number(item.id) || 0)) + 1
}

export const useAdminStore = defineStore('admin', () => {
  const categoryList = ref(clone(categories))
  const productList = ref(clone(products))
  const userList = ref(clone(users))
  const orderList = ref(clone(orders))

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

  const dashboardStats = computed(() => {
    return {
      categoryCount: categoryList.value.length,
      productCount: productList.value.length,
      activeUserCount: userList.value.filter((item) => item.status === 'active').length,
      orderCount: orderList.value.length,
      gmv: orderList.value.reduce((sum, item) => sum + Number(item.total_amount || 0), 0),
    }
  })

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

  return {
    categoryList,
    productList,
    userList,
    orderList,
    productsWithCategory,
    ordersWithRelations,
    dashboardStats,
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
