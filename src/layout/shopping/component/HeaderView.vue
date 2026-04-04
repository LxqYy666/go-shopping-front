<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

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
			<button class="user-entry" type="button" @click="handleUserClick">
				{{ displayName }}
			</button>

			<button class="cart-entry" type="button" @click="handleCartClick">
				<el-badge :value="cartCount" :max="99" class="cart-badge">
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
	padding: 6px 8px;
	border-radius: 6px;
	color: #606266;
	cursor: pointer;
	font-size: 14px;
}

.user-entry:hover,
.cart-entry:hover {
	background: #f5f7fa;
	color: #409eff;
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