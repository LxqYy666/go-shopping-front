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

export function addProductApi(payload) {
  return request.post('/admin/product/add', payload)
}

export function updateProductApi(id, payload) {
  return request.put(`/admin/product/${id}`, payload)
}

export function deleteProductApi(id) {
  return request.delete(`/admin/product/${id}`)
}

export function getOrderListApi() {
  return request.get('/admin/order/list')
}

export function updateOrderApi(id, payload) {
  return request.put(`/admin/order/${id}`, payload)
}
