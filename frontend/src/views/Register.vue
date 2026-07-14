<template>
  <div class="register-page">
    <div class="register-container">
      <div class="register-left">
        <div class="left-content">
          <h1>加入我们</h1>
          <p>开启AI赋能的PPT学习之旅</p>
          <ul class="benefits">
            <li><el-icon>Check</el-icon> 免费学习所有基础技能教程</li>
            <li><el-icon>Check</el-icon> AI生成PPT内容</li>
            <li><el-icon>Check</el-icon> 记录学习进度</li>
            <li><el-icon>Check</el-icon> 收藏喜欢的教程</li>
          </ul>
        </div>
      </div>
      <div class="register-right">
        <div class="form-wrapper">
          <h2>用户注册</h2>
          <p class="subtitle">创建新账号，开始你的学习之旅</p>
          <el-form
            ref="formRef"
            :model="form"
            :rules="rules"
            label-position="top"
          >
            <el-form-item label="用户名" prop="username">
              <el-input
                v-model="form.username"
                placeholder="请输入用户名"
                prefix-icon="User"
                size="large"
              />
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input
                v-model="form.email"
                type="email"
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
              />
            </el-form-item>
            <el-form-item label="确认密码" prop="confirmPassword">
              <el-input
                v-model="form.confirmPassword"
                type="password"
                placeholder="请再次输入密码"
                prefix-icon="Lock"
                size="large"
                show-password
              />
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                size="large"
                :loading="loading"
                @click="handleRegister"
                style="width:100%"
              >
                注册
              </el-button>
            </el-form-item>
          </el-form>
          <div class="form-footer">
            <span>已有账号？</span>
            <el-link type="warning" @click="router.push('/login')">立即登录</el-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'
import { Check } from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()
const loading = ref(false)
const formRef = ref(null)

const validateConfirmPassword = (rule, value, callback) => {
  if (value !== form.password) {
    callback(new Error('两次输入密码不一致'))
  } else {
    callback()
  }
}

const form = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在3-20个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在6-20个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ]
}

async function handleRegister() {
  if (!formRef.value) return
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  loading.value = true
  try {
    await userStore.doRegister({
      username: form.username,
      email: form.email,
      password: form.password
    })
    ElMessage.success('注册成功')
    router.push('/login')
  } catch (error) {
    ElMessage.error(error.message || '注册失败')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #003D7A 0%, #1a5a96 100%);
}

.register-container {
  display: flex;
  width: 900px;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
}

.register-left {
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

.benefits {
  list-style: none;
  padding: 0;
}

.benefits li {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
  line-height: 1.5;
}

.register-right {
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
  .register-container {
    flex-direction: column;
    width: 90%;
  }
  .register-left {
    width: 100%;
    padding: 30px 20px;
  }
}
</style>