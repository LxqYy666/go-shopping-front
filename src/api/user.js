import request from '@/utils/request'

// 购物车
export function getCartApi() {
  return request.get('/user/cart')
}

export function addToCartApi(payload) {
  return request.post('/user/cart', payload)
}

export function updateCartApi(id, payload) {
  return request.put(`/user/cart/${id}`, payload)
}

export function deleteCartApi(id) {
  return request.delete(`/user/cart/${id}`)
}

// 订单
export function createOrderApi(payload) {
  return request.post('/user/order', payload)
}

export function getUserOrdersApi() {
  return request.get('/user/orders')
}

// 用户信息
export function getUserInfoApi() {
  return request.get('/user/info')
}
