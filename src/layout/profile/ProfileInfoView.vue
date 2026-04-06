<script setup>
import { computed, onMounted, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const form = reactive({
  username: '',
  email: '',
  avatar: '',
})

const currentUser = computed(() => userStore.currentUser)

function fillForm() {
  const user = currentUser.value
  if (!user) {
    return
  }
  form.username = user.username || ''
  form.email = user.email || ''
  form.avatar = user.avatar || ''
}

async function saveProfile() {
  if (!form.username.trim()) {
    ElMessage.warning('请填写用户名')
    return
  }
  if (!form.email.trim()) {
    ElMessage.warning('请填写邮箱')
    return
  }

  try {
    userStore.updateUserInfo({
      username: form.username.trim(),
      email: form.email.trim(),
      avatar: form.avatar.trim(),
    })
    ElMessage.success('个人信息已保存')
  } catch (error) {
    ElMessage.error('保存失败')
  }
}

onMounted(async () => {
  try {
    await userStore.fetchUserInfo()
  } catch (error) {
    console.error('获取用户信息失败', error)
  }
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
