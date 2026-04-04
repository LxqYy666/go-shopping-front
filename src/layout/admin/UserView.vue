<script setup>
import { computed, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useAdminStore } from '@/stores/admin'

const adminStore = useAdminStore()
const loading = ref(false)
const roleFilter = ref('all')
const statusFilter = ref('all')
const dialogVisible = ref(false)
const isEdit = ref(false)
const form = ref({
	id: null,
	username: '',
	email: '',
	avatar: '',
	role: 'user',
	status: 'active',
})

const rows = computed(() => {
	return adminStore.userList
		.map((user) => ({
			...user,
			orderCount: adminStore.ordersWithRelations.filter((order) => order.user_id === user.id).length,
		}))
		.filter((user) => roleFilter.value === 'all' || user.role === roleFilter.value)
		.filter((user) => statusFilter.value === 'all' || user.status === statusFilter.value)
})

function openCreate() {
	isEdit.value = false
	form.value = {
		id: null,
		username: '',
		email: '',
		avatar: '',
		role: 'user',
		status: 'active',
	}
	dialogVisible.value = true
}

function openEdit(row) {
	isEdit.value = true
	form.value = {
		id: row.id,
		username: row.username,
		email: row.email,
		avatar: row.avatar,
		role: row.role,
		status: row.status,
	}
	dialogVisible.value = true
}

function saveUser() {
	if (!form.value.username.trim()) {
		ElMessage.warning('请填写用户名')
		return
	}
	if (!form.value.email.trim()) {
		ElMessage.warning('请填写邮箱')
		return
	}

	const payload = {
		...form.value,
		username: form.value.username.trim(),
		email: form.value.email.trim(),
	}

	if (isEdit.value) {
		adminStore.updateUser(form.value.id, payload)
		ElMessage.success('用户信息已更新')
	} else {
		adminStore.addUser(payload)
		ElMessage.success('用户已新增')
	}

	dialogVisible.value = false
}

function toggleStatus(row) {
	const nextStatus = row.status === 'active' ? 'disabled' : 'active'
	adminStore.updateUser(row.id, { status: nextStatus })
	ElMessage.success(`用户已${nextStatus === 'active' ? '启用' : '禁用'}`)
}

async function fetchUsers() {
	loading.value = true
	try {
		await adminStore.fetchUserList()
	} finally {
		loading.value = false
	}
}

onMounted(() => {
	fetchUsers()
})
</script>

<template>
	<section class="admin-panel">
		<div class="toolbar">
			<h2>用户管理</h2>
			<div class="toolbar-actions">
				<el-segmented
					v-model="roleFilter"
					:options="[
						{ label: '全部角色', value: 'all' },
						{ label: '普通用户', value: 'user' },
						{ label: '管理员', value: 'admin' },
					]"
				/>
				<el-segmented
					v-model="statusFilter"
					:options="[
						{ label: '全部状态', value: 'all' },
						{ label: '活跃', value: 'active' },
						{ label: '禁用', value: 'disabled' },
					]"
				/>
				<el-button type="primary" @click="openCreate">新增用户</el-button>
			</div>
		</div>

		<el-table :data="rows" :loading="loading" stripe>
			<el-table-column label="用户" min-width="200">
				<template #default="{ row }">
					<div class="user-cell">
						<el-avatar :src="row.avatar" />
						<div>
							<strong>{{ row.username }}</strong>
							<p>{{ row.email }}</p>
						</div>
					</div>
				</template>
			</el-table-column>
			<el-table-column label="角色" width="120" align="center">
				<template #default="{ row }">
					<el-tag :type="row.role === 'admin' ? 'danger' : 'info'">{{ row.role }}</el-tag>
				</template>
			</el-table-column>
			<el-table-column label="状态" width="120" align="center">
				<template #default="{ row }">
					<el-tag :type="row.status === 'active' ? 'success' : 'warning'">{{ row.status }}</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop="orders_count" label="订单数" width="100" align="center" />
			<el-table-column prop="created_at" label="注册时间" min-width="160" />
			<el-table-column label="操作" width="240" align="center">
				<template #default="{ row }">
					<el-space>
						<el-button link type="primary" @click="openEdit(row)">编辑</el-button>
						<el-button link type="danger" @click="toggleStatus(row)">
							{{ row.status === 'active' ? '禁用' : '启用' }}
						</el-button>
					</el-space>
				</template>
			</el-table-column>
		</el-table>

		<el-dialog
			v-model="dialogVisible"
			:title="isEdit ? '编辑用户' : '新增用户'"
			width="520px"
		>
			<el-form label-width="90px">
				<el-form-item label="用户名">
					<el-input v-model="form.username" />
				</el-form-item>
				<el-form-item label="邮箱">
					<el-input v-model="form.email" />
				</el-form-item>
				<el-form-item label="头像">
					<el-input v-model="form.avatar" placeholder="https://..." />
				</el-form-item>
				<el-form-item label="角色">
					<el-radio-group v-model="form.role">
						<el-radio label="user">普通用户</el-radio>
						<el-radio label="admin">管理员</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="状态">
					<el-radio-group v-model="form.status">
						<el-radio label="active">活跃</el-radio>
						<el-radio label="disabled">禁用</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>
			<template #footer>
				<el-button @click="dialogVisible = false">取消</el-button>
				<el-button type="primary" @click="saveUser">保存</el-button>
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
	align-items: center;
	gap: 10px;
}

.toolbar h2 {
	margin: 0;
	font-size: 18px;
	color: #102a43;
}

.user-cell {
	display: flex;
	align-items: center;
	gap: 10px;
}

.user-cell p {
	margin: 4px 0 0;
	color: #627d98;
	font-size: 12px;
}
</style>
