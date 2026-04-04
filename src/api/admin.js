import request from '@/utils/request'

export function getCategoryListApi() {
  return request.get('/admin/category/list')
}

export function getProductListApi() {
  return request.get('/admin/product/list')
}

export function getUserListApi() {
  return request.get('/admin/user/list')
}

export function addCategoryApi(payload) {
  return request.post('/admin/category/add', payload)
}
