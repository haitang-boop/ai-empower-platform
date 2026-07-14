<template>
  <div class="admin-layout">
    <el-container>
      <el-aside width="220px">
        <div class="admin-logo">
          <el-icon :size="24" color="#F5B800">
            <Setting />
          </el-icon>
          <span>管理后台</span>
        </div>
        <el-menu
          :default-active="$route.path"
          :router="true"
          background-color="#003D7A"
          text-color="#ffffff"
          active-text-color="#F5B800"
        >
          <el-menu-item index="/admin/scenarios">
            <el-icon><Grid /></el-icon>
            <span>场景管理</span>
          </el-menu-item>
          <el-menu-item index="/admin/skills">
            <el-icon><Collection /></el-icon>
            <span>技能管理</span>
          </el-menu-item>
          <el-menu-item index="/admin/users">
            <el-icon><UserFilled /></el-icon>
            <span>用户管理</span>
          </el-menu-item>
        </el-menu>
        <div class="back-home">
          <el-button type="warning" @click="router.push('/')" size="small">
            <el-icon><HomeFilled /></el-icon>
            返回首页
          </el-button>
        </div>
      </el-aside>
      <el-container>
        <el-header class="admin-header">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/admin' }">管理后台</el-breadcrumb-item>
            <el-breadcrumb-item>{{ $route.meta.title }}</el-breadcrumb-item>
          </el-breadcrumb>
          <div class="admin-user">
            <el-dropdown @command="handleCommand">
              <span class="user-dropdown">
                <el-avatar :size="32">{{ userStore.username }}</el-avatar>
                <span class="ml-2">{{ userStore.username }}</span>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="home">返回首页</el-dropdown-item>
                  <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-header>
        <el-main class="admin-main">
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { Setting, Grid, Collection, UserFilled, HomeFilled } from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()

function handleCommand(command) {
  if (command === 'logout') {
    userStore.logout()
    router.push('/')
  } else if (command === 'home') {
    router.push('/')
  }
}
</script>

<style scoped>
.admin-layout {
  min-height: 100vh;
}

.el-aside {
  background-color: #003D7A;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.admin-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  height: 70px;
  color: white;
  font-size: 18px;
  font-weight: bold;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.el-menu {
  border-right: none;
  flex: 1;
}

.back-home {
  padding: 15px;
  text-align: center;
}

.admin-header {
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  border-bottom: 1px solid #e6e6e6;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.admin-main {
  background-color: #f5f5f5;
  min-height: calc(100vh - 60px);
}

.user-dropdown {
  display: flex;
  align-items: center;
  cursor: pointer;
}
</style>