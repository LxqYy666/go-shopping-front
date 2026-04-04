<script setup>
import { computed, onMounted, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { useAdminStore } from '@/stores/admin'

const adminStore = useAdminStore()

const form = reactive({
  username: '',
  email: '',
  avatar: '',
})

const currentUser = computed(() => adminStore.currentUser)

function fillForm() {
  const user = adminStore.ensureCurrentUser()
  if (!user) {
    return
  }
  form.username = user.username || ''
  form.email = user.email || ''
  form.avatar = user.avatar || ''
}

function saveProfile() {
  if (!form.username.trim()) {
    ElMessage.warning('请填写用户名')
    return
  }
  if (!form.email.trim()) {
    ElMessage.warning('请填写邮箱')
    return
  }

  const saved = adminStore.saveCurrentUserProfile({
    username: form.username.trim(),
    email: form.email.trim(),
    avatar: form.avatar.trim(),
  })

  if (!saved) {
    ElMessage.warning('请先登录后再完善资料')
    return
  }

  ElMessage.success('个人信息已保存')
}

onMounted(() => {
  fillForm()
})
</script>

<template>
  <section class="profile-panel">
    <div class="panel-head">
      <h3>个人信息管理</h3>
      <el-tag type="success" v-if="currentUser">已登录</el-tag>
      <el-tag type="info" v-else>未登录</el-tag>
    </div>

    <el-form label-width="90px" class="profile-form">
      <el-form-item label="用户名">
        <el-input v-model="form.username" placeholder="请输入用户名" />
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="form.email" placeholder="请输入邮箱" />
      </el-form-item>
      <el-form-item label="头像">
        <el-input v-model="form.avatar" placeholder="https://..." />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveProfile">保存信息</el-button>
      </el-form-item>
    </el-form>
  </section>
</template>

<style scoped>
.profile-panel {
  border-radius: 14px;
  border: 1px solid #d8e1e8;
  background: #ffffff;
  padding: 16px;
}

.panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.panel-head h3 {
  margin: 0;
  font-size: 18px;
  color: #1f2933;
}

.profile-form {
  max-width: 560px;
}
</style>
