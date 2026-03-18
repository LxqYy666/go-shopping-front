<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const isLoginPage = computed(() => route.path.includes('/auth/login'))

function goLogin() {
	router.push('/auth/login')
}

function goRegister() {
	router.push('/auth/register')
}
</script>

<template>
	<div class="auth-shell">
		<div class="grain" />
		<section class="auth-card">
			<aside class="brand-panel">
				<p class="badge">GO SHOPPING</p>
				<h1>欢迎来到好物星球</h1>
				<p class="intro">登录或注册后可查看订单、收藏商品并体验完整商城流程。</p>
				<div class="tips">
					<div>
						<strong>极速登录</strong>
						<span>输入账号密码，立即开逛</span>
					</div>
					<div>
						<strong>新人礼券</strong>
						<span>注册即可领取新用户专享优惠</span>
					</div>
				</div>
			</aside>

			<main class="form-panel">
				<div class="switcher">
					<button :class="['switch-btn', { active: isLoginPage }]" @click="goLogin">登录</button>
					<button :class="['switch-btn', { active: !isLoginPage }]" @click="goRegister">注册</button>
				</div>
				<RouterView />
			</main>
		</section>
	</div>
</template>

<style scoped>
.auth-shell {
	min-height: 100vh;
	display: grid;
	place-items: center;
	padding: 20px;
	background:
		radial-gradient(circle at 15% 15%, rgba(255, 214, 153, 0.7), transparent 45%),
		radial-gradient(circle at 82% 88%, rgba(132, 221, 190, 0.6), transparent 40%),
		linear-gradient(135deg, #f9fbff 0%, #fff6ea 48%, #ecfff4 100%);
	position: relative;
	overflow: hidden;
}

.grain {
	position: absolute;
	inset: 0;
	pointer-events: none;
	background-image: linear-gradient(rgba(0, 0, 0, 0.02) 1px, transparent 1px),
		linear-gradient(90deg, rgba(0, 0, 0, 0.02) 1px, transparent 1px);
	background-size: 24px 24px;
}

.auth-card {
	width: min(980px, 100%);
	min-height: 620px;
	border-radius: 24px;
	overflow: hidden;
	display: grid;
	grid-template-columns: 1fr 1fr;
	background: rgba(255, 255, 255, 0.88);
	border: 1px solid rgba(255, 255, 255, 0.9);
	box-shadow: 0 28px 50px rgba(18, 34, 48, 0.18);
	backdrop-filter: blur(12px);
	position: relative;
	z-index: 1;
}

.brand-panel {
	background: linear-gradient(160deg, #ff9a4d 0%, #ff7e4d 46%, #ff617a 100%);
	color: #2f1300;
	padding: 44px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	gap: 18px;
}

.badge {
	width: fit-content;
	margin: 0;
	font-size: 12px;
	letter-spacing: 2px;
	padding: 6px 10px;
	border-radius: 999px;
	background: rgba(255, 255, 255, 0.7);
}

.brand-panel h1 {
	margin: 0;
	font-size: clamp(28px, 3.2vw, 40px);
	line-height: 1.25;
}

.intro {
	margin: 0;
	color: rgba(31, 16, 6, 0.8);
	line-height: 1.7;
}

.tips {
	display: grid;
	gap: 12px;
}

.tips > div {
	border-radius: 14px;
	padding: 12px;
	background: rgba(255, 245, 228, 0.55);
	border: 1px solid rgba(255, 255, 255, 0.45);
}

.tips strong,
.tips span {
	display: block;
}

.tips span {
	margin-top: 4px;
	color: rgba(50, 25, 9, 0.78);
	font-size: 14px;
}

.form-panel {
	padding: 38px;
	display: grid;
	align-content: center;
	gap: 20px;
}

.switcher {
	width: fit-content;
	border-radius: 999px;
	background: #f2f6fb;
	border: 1px solid #dde7f2;
	padding: 4px;
	display: flex;
	gap: 2px;
}

.switch-btn {
	border: 0;
	height: 36px;
	min-width: 92px;
	border-radius: 999px;
	cursor: pointer;
	background: transparent;
	color: #47637a;
	font-size: 14px;
	transition: all 0.2s ease;
}

.switch-btn.active {
	color: #0f3a5a;
	background: white;
	box-shadow: 0 6px 14px rgba(15, 58, 90, 0.15);
}

@media (max-width: 900px) {
	.auth-card {
		grid-template-columns: 1fr;
		min-height: auto;
	}

	.brand-panel {
		padding: 30px;
	}

	.form-panel {
		padding: 28px;
	}
}
</style>
