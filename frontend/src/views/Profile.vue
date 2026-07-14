<template>
  <div class="profile">
    <div class="page-container">
      <h2 class="whut-title">个人中心</h2>

      <el-row :gutter="20">
        <!-- 左侧个人信息 -->
        <el-col :span="8">
          <el-card class="card-shadow">
            <div class="profile-header">
              <el-avatar :size="80" :src="userStore.avatar">
                {{ userStore.username }}
              </el-avatar>
              <h3>{{ userStore.username }}</h3>
              <el-tag :type="userStore.isAdmin ? 'danger' : 'primary'">
                {{ userStore.isAdmin ? '管理员' : '普通用户' }}
              </el-tag>
            </div>
            <el-divider />
            <div class="profile-info">
              <div class="info-item">
                <el-icon><Message /></el-icon>
                <span>{{ user.email || '未设置' }}</span>
              </div>
              <div class="info-item">
                <el-icon><Calendar /></el-icon>
                <span>注册时间：{{ user.created_at || '未知' }}</span>
              </div>
            </div>
            <el-divider />
            <el-button type="primary" @click="showEditDialog = true" style="width:100%">
              修改资料
            </el-button>
            <el-button style="width:100%;margin-top:10px" @click="showPasswordDialog = true">
              修改密码
            </el-button>
          </el-card>
        </el-col>

        <!-- 右侧内容 -->
        <el-col :span="16">
          <!-- 学习统计 -->
          <el-card class="card-shadow" style="margin-bottom:20px">
            <template #header>
              <h4>学习统计</h4>
            </template>
            <el-row :gutter="20">
              <el-col :span="6" v-for="stat in learningStats" :key="stat.label">
                <div class="stat-block">
                  <span class="stat-num" :style="{ color: stat.color }">{{ stat.value }}</span>
                  <span class="stat-label">{{ stat.label }}</span>
                </div>
              </el-col>
            </el-row>
          </el-card>

          <!-- 学习记录 -->
          <el-card class="card-shadow" style="margin-bottom:20px">
            <template #header>
              <div class="card-header">
                <h4>学习记录</h4>
                <el-button type="primary" link @click="fetchHistory">刷新</el-button>
              </div>
            </template>
            <el-table :data="history" v-loading="historyLoading" empty-text="暂无学习记录">
              <el-table-column prop="skill_title" label="技能名称" />
              <el-table-column prop="progress" label="学习进度" width="200">
                <template #default="{ row }">
                  <el-progress
                    :percentage="row.progress || 0"
                    :color="customColors"
                    :stroke-width="8"
                  />
                </template>
              </el-table-column>
              <el-table-column prop="updated_at" label="最近学习" width="180" />
              <el-table-column label="操作" width="100">
                <template #default="{ row }">
                  <el-button type="primary" size="small" link @click="router.push(`/skill/${row.skill_id}`)">
                    继续学习
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>

          <!-- 我的收藏 -->
          <el-card class="card-shadow">
            <template #header>
              <div class="card-header">
                <h4>我的收藏</h4>
                <el-button type="primary" link @click="fetchFavorites">刷新</el-button>
              </div>
            </template>
            <div v-if="favorites.length === 0 && !favLoading" class="empty-state">
              <el-empty description="暂无收藏" />
            </div>
            <el-row :gutter="16" v-else>
              <el-col :span="12" v-for="item in favorites" :key="item.id" style="margin-bottom:16px">
                <el-card shadow="hover" class="fav-card" @click="router.push(`/skill/${item.id || item.skill_id}`)">
                  <div class="fav-content">
                    <span class="fav-title">{{ item.title || item.skill_title }}</span>
                    <el-tag size="small" type="warning">{{ item.level || '中级' }}</el-tag>
                  </div>
                </el-card>
              </el-col>
            </el-row>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 编辑资料对话框 -->
    <el-dialog v-model="showEditDialog" title="修改资料" width="500px">
      <el-form :model="profileForm" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="profileForm.username" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="profileForm.email" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showEditDialog = false">取消</el-button>
        <el-button type="primary" @click="updateProfile" :loading="saving">保存</el-button>
      </template>
    </el-dialog>

    <!-- 修改密码对话框 -->
    <el-dialog v-model="showPasswordDialog" title="修改密码" width="500px">
      <el-form :model="passwordForm" label-width="100px">
        <el-form-item label="当前密码">
          <el-input v-model="passwordForm.oldPassword" type="password" show-password />
        </el-form-item>
        <el-form-item label="新密码">
          <el-input v-model="passwordForm.newPassword" type="password" show-password />
        </el-form-item>
        <el-form-item label="确认新密码">
          <el-input v-model="passwordForm.confirmPassword" type="password" show-password />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showPasswordDialog = false">取消</el-button>
        <el-button type="primary" @click="changePassword" :loading="saving">确认修改</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { getFavorites, getLearningHistory } from '@/api/skills'
import { updateProfile, changePassword } from '@/api/user'
import { ElMessage } from 'element-plus'
import { Message, Calendar } from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()

const history = ref([])
const favorites = ref([])
const historyLoading = ref(false)
const favLoading = ref(false)
const showEditDialog = ref(false)
const showPasswordDialog = ref(false)
const saving = ref(false)

const user = computed(() => userStore.user || {})

const learningStats = [
  { label: '已学技能', value: 0, color: '#003D7A' },
  { label: '收藏技能', value: 0, color: '#F5B800' },
  { label: '幻灯片页', value: 0, color: '#1a5a96' },
  { label: '完成率', value: '0%', color: '#ffd24d' }
]

const customColors = [
  { color: '#003D7A', percentage: 20 },
  { color: '#F5B800', percentage: 100 }
]

const profileForm = reactive({
  username: '',
  email: ''
})

const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

async function fetchHistory() {
  historyLoading.value = true
  try {
    const res = await getLearningHistory()
    history.value = res.data || []
    learningStats[0].value = history.value.length
    const completed = history.value.filter(h => h.progress >= 100).length
    learningStats[3].value = history.value.length > 0
      ? Math.round((completed / history.value.length) * 100) + '%'
      : '0%'
  } catch (error) {
    console.error('获取学习记录失败', error)
  } finally {
    historyLoading.value = false
  }
}

async function fetchFavorites() {
  favLoading.value = true
  try {
    const res = await getFavorites()
    favorites.value = res.data || []
    learningStats[1].value = favorites.value.length
  } catch (error) {
    console.error('获取收藏失败', error)
  } finally {
    favLoading.value = false
  }
}

async function doUpdateProfile() {
  saving.value = true
  try {
    await updateProfile(profileForm)
    ElMessage.success('资料修改成功')
    showEditDialog.value = false
    await userStore.fetchUserInfo()
  } catch (error) {
    ElMessage.error('修改失败')
  } finally {
    saving.value = false
  }
}

async function doChangePassword() {
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    ElMessage.error('两次输入密码不一致')
    return
  }
  saving.value = true
  try {
    await changePassword({
      oldPassword: passwordForm.oldPassword,
      newPassword: passwordForm.newPassword
    })
    ElMessage.success('密码修改成功')
    showPasswordDialog.value = false
  } catch (error) {
    ElMessage.error('密码修改失败')
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  fetchHistory()
  fetchFavorites()
  if (user.value) {
    profileForm.username = user.value.username || ''
    profileForm.email = user.value.email || ''
  }
})
</script>

<style scoped>
.profile {
  padding-bottom: 40px;
}

.profile-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.profile-header h3 {
  color: #003D7A;
}

.profile-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
  font-size: 14px;
}

.stat-block {
  text-align: center;
  padding: 10px;
}

.stat-num {
  font-size: 28px;
  font-weight: bold;
  display: block;
}

.stat-label {
  font-size: 13px;
  color: #999;
  margin-top: 4px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h4 {
  margin: 0;
}

.fav-card {
  cursor: pointer;
}

.fav-card:hover {
  border-color: #003D7A;
}

.fav-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.fav-title {
  font-size: 14px;
  color: #003D7A;
  font-weight: 500;
}

.empty-state {
  padding: 30px 0;
}
</style>