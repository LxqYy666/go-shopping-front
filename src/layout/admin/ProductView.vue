<script setup>
import { computed, onMounted, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useAdminStore } from '@/stores/admin'

const adminStore = useAdminStore()
const statusFilter = ref('all')
const categoryFilter = ref(0)
const loading = ref(false)
const dialogVisible = ref(false)
const isEdit = ref(false)
const form = ref({
	id: null,
	category_id: 0,
	name: '',
	desc: '',
	price: 0,
	stock: 0,
	image_url: '',
	sold_count: 0,
	status: 'on',
})

const categoryOptions = computed(() => [{ id: 0, name: '全部分类' }, ...adminStore.categoryList])

const rows = computed(() => {
	return adminStore.productsWithCategory.filter((item) => {
		const matchStatus = statusFilter.value === 'all' || item.status === statusFilter.value
		const matchCategory = categoryFilter.value === 0 || item.category_id === categoryFilter.value
		return matchStatus && matchCategory
	})
})

function openCreate() {
	if (adminStore.categoryList.length === 0) {
		ElMessage.warning('请先新增分类')
		return
	}

	isEdit.value = false
	form.value = {
		id: null,
		category_id: adminStore.categoryList[0].id,
		name: '',
		desc: '',
		price: 0,
		stock: 0,
		image_url: '',
		sold_count: 0,
		status: 'on',
	}
	dialogVisible.value = true
}

function openEdit(row) {
	isEdit.value = true
	form.value = {
		id: row.id,
		category_id: row.category_id,
		name: row.name,
		desc: row.desc,
		price: row.price,
		stock: row.stock,
		image_url: row.image_url,
		sold_count: row.sold_count,
		status: row.status,
	}
	dialogVisible.value = true
}

function saveProduct() {
	if (!form.value.name.trim()) {
		ElMessage.warning('请填写商品名称')
		return
	}
	if (!form.value.category_id) {
		ElMessage.warning('请选择分类')
		return
	}

	const payload = {
		...form.value,
		name: form.value.name.trim(),
	}

	if (isEdit.value) {
		adminStore.updateProduct(form.value.id, payload)
		ElMessage.success('商品已更新')
	} else {
		adminStore.addProduct(payload)
		ElMessage.success('商品已新增')
	}

	dialogVisible.value = false
}

async function removeProduct(row) {
	try {
		await ElMessageBox.confirm(`确定删除商品“${row.name}”？`, '删除确认', {
			type: 'warning',
			confirmButtonText: '删除',
			cancelButtonText: '取消',
		})
		adminStore.removeProduct(row.id)
		ElMessage.success('商品已删除')
	} catch {
		// ignore cancel
	}
}

function toggleStatus(row) {
	const nextStatus = row.status === 'on' ? 'off' : 'on'
	adminStore.updateProduct(row.id, { status: nextStatus })
	ElMessage.success(`商品已${nextStatus === 'on' ? '上架' : '下架'}`)
}

async function fetchProducts() {
	loading.value = true
	try {
		await Promise.all([adminStore.fetchCategoryList(), adminStore.fetchProductList()])
	} finally {
		loading.value = false
	}
}

onMounted(() => {
	fetchProducts()
})
</script>

<template>
	<section class="admin-panel">
		<div class="toolbar">
			<h2>商品管理</h2>
			<div class="toolbar-actions">
				<div class="filters">
				<el-select v-model="categoryFilter" style="width: 140px">
					<el-option
						v-for="option in categoryOptions"
						:key="option.id"
						:label="option.name"
						:value="option.id"
					/>
				</el-select>
				<el-radio-group v-model="statusFilter" size="small">
					<el-radio-button label="all">全部</el-radio-button>
					<el-radio-button label="on">上架</el-radio-button>
					<el-radio-button label="off">下架</el-radio-button>
				</el-radio-group>
				</div>
				<el-button type="primary" @click="openCreate">新增商品</el-button>
			</div>
		</div>

		<el-table :data="rows" :loading="loading" stripe>
			<el-table-column label="商品" min-width="260">
				<template #default="{ row }">
					<div class="product-cell">
						<img :src="row.image_url" :alt="row.name" />
						<div>
							<strong>{{ row.name }}</strong>
							<p>{{ row.desc }}</p>
						</div>
					</div>
				</template>
			</el-table-column>
			<el-table-column label="分类" min-width="120">
				<template #default="{ row }">{{ row.category?.name }}</template>
			</el-table-column>
			<el-table-column label="价格" width="140">
				<template #default="{ row }">¥{{ row.price.toFixed(2) }}</template>
			</el-table-column>
			<el-table-column prop="stock" label="库存" width="100" />
			<el-table-column prop="sold_count" label="销量" width="100" />
			<el-table-column label="状态" width="100" align="center">
				<template #default="{ row }">
					<el-tag :type="row.status === 'on' ? 'success' : 'info'">{{ row.status }}</el-tag>
				</template>
			</el-table-column>
			<el-table-column label="操作" width="220" align="center">
				<template #default="{ row }">
					<el-space>
						<el-button link type="primary" @click="openEdit(row)">编辑</el-button>
						<el-button link type="warning" @click="toggleStatus(row)">
							{{ row.status === 'on' ? '下架' : '上架' }}
						</el-button>
						<el-button link type="danger" @click="removeProduct(row)">删除</el-button>
					</el-space>
				</template>
			</el-table-column>
		</el-table>

		<el-dialog
			v-model="dialogVisible"
			:title="isEdit ? '编辑商品' : '新增商品'"
			width="620px"
		>
			<el-form label-width="96px" class="product-form">
				<el-form-item label="分类">
					<el-select v-model="form.category_id" style="width: 100%">
						<el-option
							v-for="option in adminStore.categoryList"
							:key="option.id"
							:label="option.name"
							:value="option.id"
						/>
					</el-select>
				</el-form-item>
				<el-form-item label="商品名称">
					<el-input v-model="form.name" />
				</el-form-item>
				<el-form-item label="商品描述">
					<el-input v-model="form.desc" type="textarea" :rows="3" />
				</el-form-item>
				<el-form-item label="图片地址">
					<el-input v-model="form.image_url" placeholder="https://..." />
				</el-form-item>
				<el-row :gutter="10">
					<el-col :span="10">
						<el-form-item label="价格">
							<el-input-number v-model="form.price" :min="0" :precision="2" style="width: 100%" />
						</el-form-item>
					</el-col>
					<el-col :span="10">
						<el-form-item label="库存">
							<el-input-number v-model="form.stock" :min="0" style="width: 100%" />
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<template #footer>
				<el-button @click="dialogVisible = false">取消</el-button>
				<el-button type="primary" @click="saveProduct">保存</el-button>
			</template>
		</el-dialog>
	</section>
</template>

<style scoped>
.admin-panel {
	border-radius: 14px;
	border: 1px solid #d9e2ec;
	background: #ffffff;
	padding: 16px;
}

.toolbar {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 14px;
	gap: 12px;
}

.toolbar-actions {
	display: flex;
	align-items: center;
	gap: 10px;
}

.toolbar h2 {
	margin: 0;
	font-size: 18px;
	color: #102a43;
}

.filters {
	display: flex;
	gap: 10px;
}

.product-cell {
	display: flex;
	gap: 10px;
	align-items: center;
}

.product-cell img {
	width: 56px;
	height: 56px;
	border-radius: 8px;
	object-fit: cover;
}

.product-cell p {
	margin: 4px 0 0;
	color: #627d98;
	font-size: 12px;
}
</style>
