<script setup>
const quickLinks = [
	{ label: '关于我们', href: '#' },
	{ label: '帮助中心', href: '#' },
	{ label: '配送说明', href: '#' },
	{ label: '售后服务', href: '#' },
]
</script>

<template>
	<footer class="site-footer">
		<div class="footer-top">
			<div class="brand-block">
				<div class="brand-logo">GS</div>
				<div>
					<h3>GO SHOPPING</h3>
					<p>把更好的商品和更快的服务带给你</p>
				</div>
			</div>

			<nav class="footer-nav" aria-label="底部导航">
				<a v-for="item in quickLinks" :key="item.label" :href="item.href">
					{{ item.label }}
				</a>
			</nav>

			<div class="contact-block">
				<p>客服热线：400-800-2026</p>
				<p>服务时间：09:00 - 21:00</p>
			</div>
		</div>

		<div class="footer-bottom">
			<span>ICP备案号：粤ICP备20260001号</span>
			<span>Copyright © 2026 GO SHOPPING. All Rights Reserved.</span>
		</div>
	</footer>
</template>

<style scoped>
.site-footer {
	background: #1f2937;
	color: #e5e7eb;
	padding: 20px 16px 14px;
	border-radius: 10px 10px 0 0;
}

.footer-top {
	display: grid;
	grid-template-columns: 1.4fr 1fr 1fr;
	gap: 16px;
	align-items: start;
	padding-bottom: 14px;
	border-bottom: 1px solid rgba(255, 255, 255, 0.15);
}

.brand-block {
	display: flex;
	gap: 12px;
	align-items: center;
}

.brand-logo {
	width: 36px;
	height: 36px;
	border-radius: 50%;
	background: #22c55e;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	font-weight: 700;
	color: #0b1f14;
}

.brand-block h3 {
	margin: 0;
	font-size: 16px;
	color: #ffffff;
}

.brand-block p {
	margin: 4px 0 0;
	color: #cbd5e1;
	font-size: 13px;
}

.footer-nav {
	display: grid;
	gap: 6px;
}

.footer-nav a {
	color: #cbd5e1;
	text-decoration: none;
	width: fit-content;
}

.footer-nav a:hover {
	color: #ffffff;
}

.contact-block p {
	margin: 0 0 6px;
	font-size: 13px;
}

.footer-bottom {
	margin-top: 12px;
	display: flex;
	justify-content: space-between;
	gap: 10px;
	flex-wrap: wrap;
	font-size: 12px;
	color: #94a3b8;
}

@media (max-width: 768px) {
	.footer-top {
		grid-template-columns: 1fr;
	}
}
</style>
