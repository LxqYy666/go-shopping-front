<script setup>
import { computed } from 'vue'

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

const displayName = computed(() => {
	if (props.isLoggedIn && props.username) {
		return props.username
	}
	return '请登录'
})

function handleUserClick() {
	if (!props.isLoggedIn) {
		emit('login')
	}
}

function handleCartClick() {
	emit('cart-click')
}
</script>

<template>
	<div class="header-wrap">
		<div class="brand-area">
			<div class="brand-mark">GS</div>
			<span class="brand-text">{{ logoText }}</span>
		</div>

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
</style>