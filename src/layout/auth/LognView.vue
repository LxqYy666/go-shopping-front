<script setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { loginApi } from '@/api/auth'

const router = useRouter()
const formRef = ref()
const loading = ref(false)

const form = reactive({
	username: '',
	password: '',
	remember: true,
})

const rules = {
	username: [
		{ required: true, message: '请输入用户名', trigger: 'blur' },
		{ min: 3, max: 16, message: '用户名长度需在 3-16 位', trigger: 'blur' },
	],
	password: [
		{ required: true, message: '请输入密码', trigger: 'blur' },
		{ min: 6, max: 20, message: '密码长度需在 6-20 位', trigger: 'blur' },
	],
}

function goRegister() {
	router.push('/auth/register')
}

function goShopping() {
	router.push('/shopping')
}

function resolveRole(data) {
	return data?.role || data?.data?.role || data?.user?.role || data?.data?.user?.role || ''
}

function redirectByRole(role) {
	const normalizedRole = String(role || '').toLowerCase()
	if (normalizedRole === 'admin') {
		router.push('/admin')
		return
	}
	goShopping()
}

function resolveUser(data) {
	return data?.user || data?.data?.user || {}
}

async function submit() {
	if (!formRef.value) return

	const isValid = await formRef.value.validate().catch(() => false)
	if (!isValid) return

	loading.value = true
	try {
		const data = await loginApi({
			username: form.username,
			password: form.password,
			remember: form.remember,
		})

		if (data?.data.token) {
			localStorage.setItem('token', data.data.token)
		}

		const role = resolveRole(data)
		if (role) {
			localStorage.setItem('role', role)
		}

		const user = resolveUser(data)
		const userId = Number(user?.id || data?.user_id || data?.data?.user_id)
		if (Number.isFinite(userId) && userId > 0) {
			localStorage.setItem('userId', String(userId))
		}
		localStorage.setItem('username', user?.username || form.username)
		if (user?.email) {
			localStorage.setItem('email', user.email)
		}
		if (user?.avatar) {
			localStorage.setItem('avatar', user.avatar)
		}

		ElMessage.success(data?.message || `欢迎回来，${form.username}`)
		redirectByRole(role)
	} catch {
		// Error toast is handled in response interceptor.
	} finally {
		loading.value = false
	}
}
</script>

<template>
	<div class="auth-form-wrap">
		<h2>登录账号</h2>
		<p class="sub-title">继续你的购物旅程，精选好物正在等你。</p>

		<el-form ref="formRef" :model="form" :rules="rules" label-position="top" size="large">
			<el-form-item label="用户名" prop="username">
				<el-input v-model="form.username" placeholder="请输入用户名" clearable />
			</el-form-item>

			<el-form-item label="密码" prop="password">
				<el-input v-model="form.password" type="password" show-password placeholder="请输入密码" />
			</el-form-item>

			<div class="inline-row">
				<el-checkbox v-model="form.remember">7天内免登录</el-checkbox>
				<el-button link type="primary" @click="goRegister">没有账号？去注册</el-button>
			</div>

			<el-button type="primary" class="submit-btn" :loading="loading" @click="submit">立即登录</el-button>
		</el-form>
	</div>
</template>

<style scoped>
.auth-form-wrap h2 {
	margin: 0;
	color: #1d3445;
	font-size: clamp(24px, 2vw, 30px);
}

.sub-title {
	margin: 8px 0 20px;
	color: #6f8595;
}

.inline-row {
	margin-top: 2px;
	margin-bottom: 18px;
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.submit-btn {
	width: 100%;
	height: 44px;
	border-radius: 10px;
}
</style>
