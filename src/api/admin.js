import request from '@/utils/request'

export function getCategoryListApi() {
  return request.get('/admin/category/list')
}

export function addCategoryApi(payload) {
  return request.post('/admin/category/add', payload)
}
