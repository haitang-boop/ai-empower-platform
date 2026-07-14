<template>
  <div class="main-layout">
    <el-container>
      <el-header class="header" height="70px">
        <div class="logo" @click="router.push('/')" style="cursor: pointer;">
          <el-icon :size="30" color="#F5B800">
            <Monitor />
          </el-icon>
          <div class="logo-brand">
            <span class="logo-main">AI赋能</span>
            <span class="logo-sub">大学生技能平台</span>
          </div>
        </div>
        <div class="nav-menu">
          <el-menu
            :default-active="$route.path"
            mode="horizontal"
            :router="true"
            background-color="#003D7A"
            text-color="#ffffff"
            active-text-color="#F5B800"
          >
            <el-menu-item index="/">
              <el-icon><HomeFilled /></el-icon>首页
            </el-menu-item>
            <el-sub-menu index="/scenarios">
              <template #title>
                <el-icon><FolderOpened /></el-icon>学习场景
              </template>
              <el-menu-item
                v-for="s in scenarios"
                :key="s.id"
                :index="`/scenario/${s.id}`"
              >
                {{ s.name }}
              </el-menu-item>
            </el-sub-menu>
            <template v-if="userStore.isLoggedIn">
              <el-menu-item index="/profile">个人中心</el-menu-item>
              <el-menu-item v-if="userStore.isAdmin" index="/admin/scenarios">管理后台</el-menu-item>
            </template>
          </el-menu>
        </div>
        <div class="user-info">
          <template v-if="userStore.isLoggedIn">
            <el-dropdown @command="handleCommand">
              <span class="user-dropdown">
                <el-avatar :size="36" :src="userStore.avatar" :text="userStore.username"></el-avatar>
                <span class="username ml-2">{{ userStore.username }}</span>
                <el-icon class="el-icon--right">
                  <arrow-down />
                </el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="profile">个人中心</el-dropdown-item>
                  <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
          <template v-else>
            <el-button type="primary" @click="router.push('/login')">登录</el-button>
            <el-button type="warning" @click="router.push('/register')">注册</el-button>
          </template>
        </div>
      </el-header>
      <el-main>
        <router-view />
      </el-main>
      <el-footer class="footer">
        <div class="footer-content">
          <p>研岸保研 © {{ year }} AI赋能大学生技能PPT教程平台</p>
        </div>
      </el-footer>
    </el-container>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { getScenarios } from '@/api/scenarios'
import { ElMessage } from 'element-plus'
import {
  Monitor,
  ArrowDown,
  HomeFilled,
  FolderOpened
} from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()
const year = new Date().getFullYear()
const scenarios = ref([])

function handleCommand(command) {
  if (command === 'logout') {
    userStore.logout()
    router.push('/')
  } else if (command === 'profile') {
    router.push('/profile')
  }
}

async function fetchScenarios() {
  try {
    const res = await getScenarios()
    scenarios.value = res.data || []
  } catch (error) {
    console.error('获取场景列表失败', error)
  }
}

onMounted(() => {
  fetchScenarios()
})
</script>

<style scoped>
.main-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background-color: #003D7A;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 70px !important;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  color: white;
  font-size: 20px;
  font-weight: bold;
}

.logo-brand {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}
.logo-main {
  color: white;
  font-size: 18px;
  font-weight: bold;
}
.logo-sub {
  color: rgba(255,255,255,0.75);
  font-size: 11px;
  font-weight: normal;
  letter-spacing: 1px;
}

.nav-menu {
  flex: 1;
  margin: 0 30px;
}

.nav-menu .el-menu {
  border-bottom: none;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-dropdown {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: white;
}

.username {
  color: white;
}

.footer {
  background-color: #003D7A;
  color: #fff;
  padding: 0;
}

.footer-content {
  text-align: center;
  padding: 20px;
}
</style>