<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-left">
        <div class="left-content">
          <h1>AI赋能PPT教程</h1>
          <p>研岸保研 · 技能学习平台</p>
          <div class="features">
            <div class="feature-item">
              <el-icon :size="24"><DataAnalysis /></el-icon>
              <span>AI智能生成PPT</span>
            </div>
            <div class="feature-item">
              <el-icon :size="24"><Collection /></el-icon>
              <span>丰富技能场景</span>
            </div>
            <div class="feature-item">
              <el-icon :size="24"><Files /></el-icon>
              <span>海量模板资源</span>
            </div>
          </div>
        </div>
      </div>
      <div class="login-right">
        <div class="form-wrapper">
          <h2>欢迎登录</h2>
          <p class="subtitle">登录您的账号以继续学习</p>
          <el-form
            ref="formRef"
            :model="form"
            :rules="rules"
            label-position="top"
            @submit.prevent="handleLogin"
          >
            <el-form-item label="邮箱" prop="email">
              <el-input
                v-model="form.email"
                placeholder="请输入邮箱"
                prefix-icon="Message"
                size="large"
              />
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input
                v-model="form.password"
                type="password"
                placeholder="请输入密码"
                prefix-icon="Lock"
                size="large"
                show-password
                @keyup.enter="handleLogin"
              />
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                size="large"
                :loading="loading"
                @click="handleLogin"
                style="width:100%"
              >
                登录
              </el-button>
            </el-form-item>
          </el-form>
          <div class="form-footer">
            <span>还没有账号？</span>
            <el-link type="warning" @click="router.push('/register')">立即注册</el-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'
import { DataAnalysis, Collection, Files, Message } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const loading = ref(false)
const formRef = ref(null)

const form = reactive({
  email: '',
  password: ''
})

const rules = {
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在6-20个字符', trigger: 'blur' }
  ]
}

async function handleLogin() {
  if (!formRef.value) return
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  loading.value = true
  try {
    await userStore.doLogin(form)
    ElMessage.success('登录成功')
    const redirect = route.query.redirect || '/'
    router.push(redirect)
  } catch (error) {
    ElMessage.error(error.message || '登录失败')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #003D7A 0%, #1a5a96 100%);
}

.login-container {
  display: flex;
  width: 900px;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
}

.login-left {
  width: 380px;
  background: linear-gradient(135deg, #003D7A, #1a5a96);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.left-content h1 {
  font-size: 28px;
  margin-bottom: 10px;
}

.left-content p {
  opacity: 0.8;
  margin-bottom: 30px;
}

.features {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 15px;
}

.login-right {
  flex: 1;
  padding: 50px 40px;
}

.form-wrapper h2 {
  font-size: 26px;
  color: #003D7A;
  margin-bottom: 8px;
}

.subtitle {
  color: #999;
  margin-bottom: 30px;
}

.form-footer {
  text-align: center;
  margin-top: 20px;
  color: #666;
}

@media (max-width: 768px) {
  .login-container {
    flex-direction: column;
    width: 90%;
  }
  .login-left {
    width: 100%;
    padding: 30px 20px;
  }
}
</style>