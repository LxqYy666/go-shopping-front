import request from '@/utils/request'

export function loginApi(payload) {
	return request.post('/public/login', payload)
}

export function registerApi(payload) {
	return request.post('/public/register', payload)
}
