import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { getUserInfoApi, getUserOrdersApi } from '@/api/user'

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

export const useUserStore = defineStore('user', () => {
  const userInfo = ref(null)
  const orderList = ref([])
  const productMap = ref({})
  const categoryMap = ref({})

  const currentUserId = computed(() => {
    const raw = Number(localStorage.getItem('userId'))
    return Number.isFinite(raw) && raw > 0 ? raw : 0
  })

  const currentUser = computed(() => {
    if (userInfo.value) {
      return userInfo.value
    }
    const username = (localStorage.getItem('username') || '').trim()
    const email = localStorage.getItem('email') || ''
    const avatar = localStorage.getItem('avatar') || ''
    const role = localStorage.getItem('role') || 'user'
    
    if (username) {
      return {
        id: currentUserId.value,
        username,
        email,
        avatar,
        role,
      }
    }
    return null
  })

  const ordersWithRelations = computed(() => {
    return orderList.value.map((order) => ({
      ...order,
      items: (order.items || []).map((item) => ({
        ...item,
        product: productMap.value[item.product_id] || item.product || null,
        category: item.product?.category_id 
          ? categoryMap.value[item.product.category_id] 
          : null,
      })),
    }))
  })

  async function fetchUserInfo() {
    try {
      const response = await getUserInfoApi()
      const data = response?.data || response
      if (data) {
        userInfo.value = {
          id: Number(data.id),
          username: data.username || '',
          email: data.email || '',
          avatar: data.avatar || '',
          role: data.role || 'user',
          status: data.status || 'active',
          created_at: data.created_at || '',
        }
        if (userInfo.value.id) {
          localStorage.setItem('userId', String(userInfo.value.id))
        }
        if (userInfo.value.username) {
          localStorage.setItem('username', userInfo.value.username)
        }
        if (userInfo.value.email) {
          localStorage.setItem('email', userInfo.value.email)
        }
        if (userInfo.value.avatar) {
          localStorage.setItem('avatar', userInfo.value.avatar)
        }
        if (userInfo.value.role) {
          localStorage.setItem('role', userInfo.value.role)
        }
      }
      return userInfo.value
    } catch (error) {
      console.error('获取用户信息失败:', error)
      throw error
    }
  }

  async function fetchUserOrders() {
    try {
      const response = await getUserOrdersApi()
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
          items: Array.isArray(item.items) ? item.items.map((orderItem) => ({
            id: Number(orderItem.id),
            product_id: Number(orderItem.product_id),
            quantity: Number(orderItem.quantity) || 0,
            total_price: Number(orderItem.total_price) || 0,
            product: orderItem.product || null,
          })) : [],
        }))
        
        // 构建产品和分类映射
        const newProductMap = {}
        const newCategoryMap = {}
        orderList.value.forEach(order => {
          order.items.forEach(item => {
            if (item.product) {
              newProductMap[item.product_id] = item.product
              if (item.product.category) {
                newCategoryMap[item.product.category_id] = item.product.category
              }
            }
          })
        })
        productMap.value = newProductMap
        categoryMap.value = newCategoryMap
      }
      return orderList.value
    } catch (error) {
      console.error('获取用户订单失败:', error)
      throw error
    }
  }

  function updateUserInfo(payload) {
    if (userInfo.value) {
      userInfo.value = {
        ...userInfo.value,
        ...payload,
      }
    } else {
      userInfo.value = {
        id: currentUserId.value,
        username: payload.username || '',
        email: payload.email || '',
        avatar: payload.avatar || '',
        role: payload.role || 'user',
        status: 'active',
      }
    }
    
    if (payload.username) {
      localStorage.setItem('username', payload.username)
    }
    if (payload.email) {
      localStorage.setItem('email', payload.email)
    }
    if (payload.avatar !== undefined) {
      localStorage.setItem('avatar', payload.avatar)
    }
    
    return userInfo.value
  }

  function clearUserData() {
    userInfo.value = null
    orderList.value = []
    productMap.value = {}
    categoryMap.value = {}
  }

  return {
    userInfo,
    orderList,
    currentUserId,
    currentUser,
    ordersWithRelations,
    fetchUserInfo,
    fetchUserOrders,
    updateUserInfo,
    clearUserData,
  }
})
