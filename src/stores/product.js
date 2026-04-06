import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { getCategoryListApi, getProductListApi } from '@/api/admin'

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

export const useProductStore = defineStore('product', () => {
  const categoryList = ref([])
  const productList = ref([])

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

  const productsWithCategory = computed(() => {
    return productList.value.map((item) => ({
      ...item,
      category: categoryMap.value[item.category_id] || null,
    }))
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

  return {
    categoryList,
    productList,
    categoryMap,
    productMap,
    productsWithCategory,
    fetchCategoryList,
    fetchProductList,
  }
})
