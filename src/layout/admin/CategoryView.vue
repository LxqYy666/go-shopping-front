<script setup>
import { computed, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useAdminStore } from '@/stores/admin'

const adminStore = useAdminStore()
const keyword = ref('')
const dialogVisible = ref(false)
const isEdit = ref(false)
const form = ref({
  id: null,
  name: '',
})

const rows = computed(() =>
	adminStore.categoryList
		.map((category) => {
			const categoryProducts = adminStore.productsWithCategory.filter(
				(item) => item.category_id === category.id,
			)
			return {
				...category,
				productCount: categoryProducts.length,
				onlineCount: categoryProducts.filter((item) => item.status === 'on').length,
			}
		})
		.filter((item) => item.name.toLowerCase().includes(keyword.value.toLowerCase())),
)

function openCreate() {
	isEdit.value = false
	form.value = { id: null, name: '' }
	dialogVisible.value = true
}

function openEdit(row) {
	isEdit.value = true
	form.value = { id: row.id, name: row.name }
	dialogVisible.value = true
}

function saveCategory() {
	if (!form.value.name.trim()) {
		ElMessage.warning('请填写分类名称')
		return
	}

	if (isEdit.value) {
		adminStore.updateCategory(form.value.id, { name: form.value.name.trim() })
		ElMessage.success('分类已更新')
	} else {
		adminStore.addCategory({ name: form.value.name.trim() })
		ElMessage.success('分类已新增')
	}

	dialogVisible.value = false
}

async function removeCategory(row) {
	try {
		await ElMessageBox.confirm(`确定删除分类“${row.name}”？`, '删除确认', {
			type: 'warning',
			confirmButtonText: '删除',
			cancelButtonText: '取消',
		})
		const result = adminStore.removeCategory(row.id)
		if (!result.ok) {
			ElMessage.error(result.message)
			return
		}
		ElMessage.success('分类已删除')
	} catch {
		// ignore cancel
	}
}
</script>

<template>
	<section class="admin-panel">
		<div class="toolbar">
			<h2>分类管理</h2>
			<div class="toolbar-actions">
				<el-input
					v-model="keyword"
					placeholder="输入分类名筛选"
					clearable
					style="max-width: 260px"
				/>
				<el-button type="primary" @click="openCreate">新增分类</el-button>
			</div>
		</div>

		<el-table :data="rows" stripe>
			<el-table-column prop="id" label="分类 ID" width="100" />
			<el-table-column prop="name" label="分类名称" min-width="160" />
			<el-table-column prop="productCount" label="商品数量" width="120" />
			<el-table-column label="上架中" width="120">
				<template #default="{ row }">
					<el-tag type="success">{{ row.onlineCount }}</el-tag>
				</template>
			</el-table-column>
			<el-table-column label="说明" min-width="260">
				<template #default="{ row }">
					按 Category.Products 关系显示当前分类下商品数据
				</template>
			</el-table-column>
			<el-table-column label="操作" width="180" align="center">
				<template #default="{ row }">
					<el-space>
						<el-button link type="primary" @click="openEdit(row)">编辑</el-button>
						<el-button link type="danger" @click="removeCategory(row)">删除</el-button>
					</el-space>
				</template>
			</el-table-column>
		</el-table>

		<el-dialog
			v-model="dialogVisible"
			:title="isEdit ? '编辑分类' : '新增分类'"
			width="420px"
		>
			<el-form label-width="90px">
				<el-form-item label="分类名称">
					<el-input v-model="form.name" placeholder="如：乳品烘焙" />
				</el-form-item>
			</el-form>
			<template #footer>
				<el-button @click="dialogVisible = false">取消</el-button>
				<el-button type="primary" @click="saveCategory">保存</el-button>
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
}

.toolbar-actions {
	display: flex;
	gap: 10px;
}

.toolbar h2 {
	margin: 0;
	font-size: 18px;
	color: #102a43;
}
</style>
