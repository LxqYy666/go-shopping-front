<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { User, SwitchButton, UserFilled, ShoppingCart } from '@element-plus/icons-vue'

const props = defineProps({
	isLoggedIn: {
		type: Boolean,
		default: false,
	},
	username: {
		type: String,
		default: '',
	},
	cartCount: {
		type: Number,
		default: 0,
	},
	logoText: {
		type: String,
		default: 'GO SHOPPING',
	},
})

const emit = defineEmits(['login', 'cart-click'])
const route = useRoute()
const router = useRouter()

const navs = computed(() => {
	const list = [
		{ label: '首页推荐', to: '/shopping/recommend' },
		{ label: '商品搜索', to: '/shopping/search' },
	]
	if (props.isLoggedIn) {
		list.push({ label: '个人中心', to: '/profile/info' })
	}
	if ((localStorage.getItem('role') || '').toLowerCase() === 'admin') {
		list.push({ label: '后台管理', to: '/admin' })
	}
	return list
})

const displayName = computed(() => {
	if (props.isLoggedIn && props.username) {
		return props.username
	}
	return '请登录'
})

function handleUserClick() {
	if (!props.isLoggedIn) {
		emit('login')
		return
	}
	router.push('/profile/info')
}

function handleCartClick() {
	emit('cart-click')
}

function isNavActive(path) {
	if (path.startsWith('/profile')) {
		return route.path.startsWith('/profile')
	}
	return route.path.startsWith(path)
}

async function handleLogout() {
	try {
		await ElMessageBox.confirm('确定要退出登录吗？', '退出确认', {
			type: 'warning',
			confirmButtonText: '退出',
			cancelButtonText: '取消',
		})
		
		// 清除本地存储
		localStorage.removeItem('token')
		localStorage.removeItem('username')
		localStorage.removeItem('email')
		localStorage.removeItem('role')
		localStorage.removeItem('userId')
		localStorage.removeItem('avatar')
		
		ElMessage.success('已退出登录')
		router.push('/auth/login')
	} catch {
		// 用户取消
	}
}

function handleGoProfile() {
	router.push('/profile/info')
}
</script>

<template>
	<div class="header-wrap">
		<div class="brand-area">
			<div class="brand-mark">GS</div>
			<span class="brand-text">{{ logoText }}</span>
		</div>

		<nav class="nav-area">
			<RouterLink
				v-for="item in navs"
				:key="item.to"
				:to="item.to"
				:class="['nav-link', isNavActive(item.to) ? 'active' : '']"
			>
				{{ item.label }}
			</RouterLink>
		</nav>

		<div class="action-area">
			<el-dropdown v-if="isLoggedIn" trigger="click">
				<button class="user-entry" type="button">
					<el-icon><UserFilled /></el-icon>
					<span>{{ displayName }}</span>
				</button>
				<template #dropdown>
					<el-dropdown-menu>
						<el-dropdown-item :icon="User" @click="handleGoProfile">
							个人中心
						</el-dropdown-item>
						<el-dropdown-item :icon="SwitchButton" divided @click="handleLogout">
							退出登录
						</el-dropdown-item>
					</el-dropdown-menu>
				</template>
			</el-dropdown>

			<button v-else class="user-entry" type="button" @click="handleUserClick">
				{{ displayName }}
			</button>

			<button class="cart-entry" type="button" @click="handleCartClick">
				<el-badge :value="cartCount" :max="99" class="cart-badge">
					<el-icon><ShoppingCart /></el-icon>
					<span class="cart-text">购物车</span>
				</el-badge>
			</button>
		</div>
	</div>
</template>

<style scoped>
.header-wrap {
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 16px;
	border-bottom: 1px solid #ebeef5;
	background: #ffffff;
}

.brand-area {
	display: flex;
	align-items: center;
	gap: 10px;
}

.brand-mark {
	width: 34px;
	height: 34px;
	border-radius: 50%;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	font-size: 13px;
	font-weight: 700;
	color: #ffffff;
	background: #409eff;
}

.brand-text {
	font-size: 16px;
	font-weight: 700;
	color: #303133;
}

.action-area {
	display: flex;
	align-items: center;
	gap: 16px;
}

.nav-area {
	display: flex;
	gap: 14px;
}

.nav-link {
	text-decoration: none;
	color: #52606d;
	font-size: 14px;
	padding: 4px 6px;
	border-radius: 6px;
}

.nav-link:hover,
.nav-link.active {
	color: #0f766e;
	background: #e6fffa;
}

.user-entry,
.cart-entry {
	border: none;
	background: transparent;
	padding: 6px 12px;
	border-radius: 6px;
	color: #606266;
	cursor: pointer;
	font-size: 14px;
	display: flex;
	align-items: center;
	gap: 6px;
}

.user-entry:hover,
.cart-entry:hover {
	background: #f5f7fa;
	color: #409eff;
}

.cart-badge {
	display: flex;
	align-items: center;
	gap: 6px;
}

.cart-text {
	color: inherit;
}

@media (max-width: 768px) {
	.nav-area {
		display: none;
	}
}
</style>