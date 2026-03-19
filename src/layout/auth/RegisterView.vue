<script setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { registerApi } from '@/api/auth'

const router = useRouter()
const formRef = ref()
const loading = ref(false)

const form = reactive({
	username: '',
	phone: '',
	email: '',
	password: '',
	confirmPassword: '',
	agree: false,
})

const validateConfirm = (rule, value, callback) => {
	if (!value) {
		callback(new Error('请再次输入密码'))
		return
	}
	if (value !== form.password) {
		callback(new Error('两次输入的密码不一致'))
		return
	}
	callback()
}

const validateAgree = (rule, value, callback) => {
	if (!value) {
		callback(new Error('请先同意协议'))
		return
	}
	callback()
}

const rules = {
	username: [
		{ required: true, message: '请输入用户名', trigger: 'blur' },
		{ min: 3, max: 16, message: '用户名长度需在 3-16 位', trigger: 'blur' },
	],
	email: [
		{ required: true, message: '请输入邮箱', trigger: 'blur' },
		{ type: 'email', message: '邮箱格式不正确', trigger: 'blur' },
	],
	password: [
		{ required: true, message: '请输入密码', trigger: 'blur' },
		{ min: 6, max: 20, message: '密码长度需在 6-20 位', trigger: 'blur' },
	],
	confirmPassword: [{ validator: validateConfirm, trigger: 'blur' }],
	agree: [{ validator: validateAgree, trigger: 'change' }],
}

function goLogin() {
	router.push('/auth/login')
}

async function submit() {
	if (!formRef.value) return

	const isValid = await formRef.value.validate().catch(() => false)
	if (!isValid) return

	loading.value = true
	try {
		const data = await registerApi({
			username: form.username,
			email: form.email,
			password: form.password,
		})

		ElMessage.success(data?.message || '注册成功，请登录')
		goLogin()
	} catch {
		// Error toast is handled in response interceptor.
	} finally {
		loading.value = false
	}
}
</script>

<template>
	<div class="auth-form-wrap">
		<h2>创建账号</h2>
		<p class="sub-title">加入我们，开启省心、顺滑的在线购物体验。</p>

		<el-form ref="formRef" :model="form" :rules="rules" label-position="top" size="large">
			<div class="grid-2">
				<el-form-item label="用户名" prop="username">
					<el-input v-model="form.username" placeholder="3-16位用户名" clearable />
				</el-form-item>
			</div>

			<el-form-item label="邮箱" prop="email">
				<el-input v-model="form.email" placeholder="请输入邮箱" clearable />
			</el-form-item>

			<div class="grid-2">
				<el-form-item label="密码" prop="password">
					<el-input v-model="form.password" type="password" show-password placeholder="请输入密码" />
				</el-form-item>

				<el-form-item label="确认密码" prop="confirmPassword">
					<el-input
						v-model="form.confirmPassword"
						type="password"
						show-password
						placeholder="请再次输入密码"
					/>
				</el-form-item>
			</div>

			<el-form-item prop="agree">
				<el-checkbox v-model="form.agree">我已阅读并同意《用户协议》与《隐私政策》</el-checkbox>
			</el-form-item>

			<div class="actions">
				<el-button @click="goLogin">已有账号</el-button>
				<el-button type="primary" :loading="loading" @click="submit">立即注册</el-button>
			</div>
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

.grid-2 {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 12px;
}

.actions {
	margin-top: 8px;
	display: flex;
	justify-content: flex-end;
	gap: 10px;
}

@media (max-width: 768px) {
	.grid-2 {
		grid-template-columns: 1fr;
		gap: 0;
	}

	.actions {
		justify-content: stretch;
	}

	.actions .el-button {
		flex: 1;
	}
}
</style>
