<template>
  <div class="sidebar-layout">
    <aside class="sidebar" :class="{ collapsed: isCollapsed }">
      <div class="sidebar-header">
        <div class="sidebar-logo" v-show="!isCollapsed">
          <el-icon :size="28" color="#F5B800"><Monitor /></el-icon>
          <span class="logo-text">研岸保研</span>
        </div>
        <div class="sidebar-logo-collapsed" v-show="isCollapsed">
          <el-icon :size="24" color="#F5B800"><Monitor /></el-icon>
        </div>
        <el-button
          class="toggle-btn"
          :icon="isCollapsed ? Expand : Fold"
          type="text"
          color="#ffffff"
          @click="toggleSidebar"
        />
      </div>

      <nav class="sidebar-nav">
        <div
          class="nav-item"
          v-for="scenario in scenarios"
          :key="scenario.id"
          :class="{ active: isActiveScenario(scenario.id) }"
          @click="navigateToScenario(scenario.id)"
        >
          <span class="nav-icon">{{ getScenarioEmoji(scenario.icon) }}</span>
          <span class="nav-label" v-show="!isCollapsed">{{ scenario.name }}</span>
        </div>
      </nav>
    </aside>

    <main class="main-content">
      <!-- 顶部工具栏 -->
      <header class="top-bar">
        <div class="top-bar-inner">
          <div class="top-bar-left">
            <el-icon :size="20" color="#003D7A"><Monitor /></el-icon>
            <span class="top-bar-title">研岸保研AI教程平台</span>
          </div>
          <div class="top-bar-right">
            <template v-if="userStore.isLoggedIn">
              <el-dropdown trigger="click" @command="handleCommand">
                <span class="user-info">
                  <el-avatar :size="32" :icon="UserFilled" style="background: #003D7A;" />
                  <span class="user-name">{{ userStore.username || '用户' }}</span>
                  <el-icon><ArrowDown /></el-icon>
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="profile">
                      <el-icon><User /></el-icon> 个人中心
                    </el-dropdown-item>
                    <el-dropdown-item command="logout" divided>
                      <el-icon><SwitchButton /></el-icon> 退出登录
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
            <template v-else>
              <el-button type="primary" size="small" @click="router.push('/login')">登录</el-button>
              <el-button size="small" @click="router.push('/register')">注册</el-button>
            </template>
          </div>
        </div>
      </header>
      <div class="page-body">
        <router-view />
      </div>
      <footer class="main-footer">
        研岸保研 &copy; {{ year }} AI赋能大学生技能PPT教程平台
      </footer>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getScenarios } from '@/api/scenarios'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'
import {
  Monitor,
  Expand,
  Fold,
  UserFilled,
  User,
  ArrowDown,
  SwitchButton
} from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const isCollapsed = ref(false)
const scenarios = ref([])
const year = new Date().getFullYear()

function handleCommand(command) {
  if (command === 'logout') {
    userStore.logout()
    router.push('/')
    ElMessage.success('已退出登录')
  } else if (command === 'profile') {
    router.push('/profile')
  }
}

const currentScenarioId = computed(() => {
  if (route.name === 'ScenarioDetail') {
    return Number(route.params.id)
  }
  return null
})

function isActiveScenario(id) {
  return currentScenarioId.value === id
}

function toggleSidebar() {
  isCollapsed.value = !isCollapsed.value
}

function navigateToScenario(id) {
  router.push(`/scenario/${id}`)
}

// 将英文 icon 映射为 emoji
const iconEmojiMap = {
  academic: '📚',
  competition: '🏆',
  exam: '📝',
  defense: '🎤',
  office: '💼',
  coding: '💻',
  growth: '🌱',
  furtherstudy: '🎓',
  internship: '🏢',
  social: '🤝'
}

function getScenarioEmoji(icon) {
  return iconEmojiMap[icon] || '📁'
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
.sidebar-layout {
  display: flex;
  min-height: 100vh;
}

/* 侧边栏 */
.sidebar {
  width: 280px;
  background-color: #003D7A;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  flex-shrink: 0;
  position: relative;
}

.sidebar.collapsed {
  width: 60px;
}

/* 侧边栏头部 */
.sidebar-header {
  display: flex;
  align-items: center;
  padding: 16px 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  min-height: 64px;
  gap: 8px;
  overflow: hidden;
}

.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

.sidebar-logo-collapsed {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
}

.logo-text {
  font-size: 18px;
  font-weight: bold;
  color: #ffffff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.toggle-btn {
  color: #ffffff !important;
  flex-shrink: 0;
  min-width: 32px;
}

.sidebar.collapsed .toggle-btn {
  margin: 0 auto;
}

/* 导航列表 */
.sidebar-nav {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-left: 3px solid transparent;
  white-space: nowrap;
  overflow: hidden;
}

.sidebar.collapsed .nav-item {
  justify-content: center;
  padding: 12px 8px;
  border-left: none;
}

.nav-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-item.active {
  background-color: rgba(245, 184, 0, 0.15);
  border-left-color: #F5B800;
}

.sidebar.collapsed .nav-item.active {
  border-left: none;
  border-bottom: 2px solid #F5B800;
  border-radius: 4px;
}

.nav-icon {
  font-size: 20px;
  flex-shrink: 0;
  width: 28px;
  text-align: center;
}

.nav-label {
  font-size: 14px;
  color: #ffffff;
  opacity: 0.85;
  overflow: hidden;
  text-overflow: ellipsis;
}

.nav-item.active .nav-label {
  color: #F5B800;
  opacity: 1;
  font-weight: 600;
}

/* 滚动条美化 */
.sidebar-nav::-webkit-scrollbar {
  width: 4px;
}

.sidebar-nav::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar-nav::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
}

.sidebar-nav::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* 主内容区 */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  overflow: hidden;
  min-width: 0;
}

/* 顶部工具栏 */
.top-bar {
  height: 56px;
  background: #fff;
  border-bottom: 1px solid #e8e8e8;
  flex-shrink: 0;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
}

.top-bar-inner {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
}

.top-bar-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.top-bar-title {
  font-size: 16px;
  font-weight: 600;
  color: #003D7A;
  white-space: nowrap;
}

.top-bar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: background 0.2s;
}

.user-info:hover {
  background: #f5f5f5;
}

.user-name {
  font-size: 14px;
  color: #333;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 页面主体 */
.page-body {
  flex: 1;
  overflow-y: auto;
}

/* Footer */
.main-footer {
  text-align: center;
  padding: 16px;
  font-size: 13px;
  color: #999;
  border-top: 1px solid #f0f0f0;
  background: #fafafa;
  flex-shrink: 0;
}

/* 响应式 */
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    z-index: 1000;
    box-shadow: 2px 0 12px rgba(0, 0, 0, 0.3);
  }

  .sidebar.collapsed {
    width: 60px;
  }

  .main-content {
    margin-left: 60px;
  }
}
</style>
