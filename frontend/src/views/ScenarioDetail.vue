<template>
  <div class="scenario-detail">
    <!-- 面包屑导航 -->
    <div class="breadcrumb-bar">
      <div class="page-container">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">
            <el-icon style="vertical-align: middle; margin-right: 4px;"><HomeFilled /></el-icon>
            首页
          </el-breadcrumb-item>
          <el-breadcrumb-item>{{ scenario.name || '场景详情' }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>

    <!-- 场景不存在：404 -->
    <div v-if="notFound" class="page-container not-found">
      <el-result
        icon="error"
        title="场景未找到"
        sub-title="您访问的场景不存在或已被删除"
      >
        <template #extra>
          <el-button type="primary" @click="router.push('/')">返回首页</el-button>
        </template>
      </el-result>
    </div>

    <template v-else>
      <!-- 场景 Hero 区域 -->
      <div class="scenario-hero" :style="heroStyle">
        <div class="hero-overlay"></div>
        <div class="page-container hero-content">
          <div class="hero-main">
            <div class="hero-icon">
              <el-icon :size="48" color="#F5B800">
                <component :is="safeScenarioIcon" />
              </el-icon>
            </div>
            <div class="hero-text">
              <h1 class="hero-title">{{ scenario.name }}</h1>
              <p class="hero-desc">{{ scenario.description || '暂无描述' }}</p>
              <div class="hero-meta">
                <el-tag type="warning" effect="dark" size="small">
                  <el-icon style="margin-right: 4px;"><Collection /></el-icon>
                  {{ skills.length }} 个技能
                </el-tag>
                <el-tag v-if="scenario.tags && parsedTags.length > 0" v-for="tag in parsedTags.slice(0, 3)" :key="tag" effect="plain" size="small">
                  {{ tag }}
                </el-tag>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="page-container">
        <!-- 技能列表 -->
        <div class="skills-section">
          <h2 class="whut-title">本场景包含的技能</h2>

          <!-- 空状态 -->
          <div v-if="skills.length === 0 && !loading" class="empty-state">
            <el-empty description="该场景下暂无技能" />
          </div>

          <!-- 技能卡片网格 -->
          <el-row :gutter="20" v-else>
            <el-col
              v-for="skill in skills"
              :key="skill.id"
              :xs="24"
              :sm="12"
              :md="8"
              :lg="6"
              style="margin-bottom: 20px;"
            >
              <el-card
                class="skill-card card-shadow"
                :class="{ 'skill-card-active': activeSkillId === skill.id }"
                :body-style="{ padding: '0px' }"
              >
                <div class="skill-card-header" :style="skillCardHeaderStyle(skill)">
                  <div class="skill-card-icon">
                    <span class="icon-text">{{ safeSkillIcon(skill.icon) }}</span>
                  </div>
                </div>
                <div class="skill-card-body">
                  <h3 class="skill-card-title" :title="skill.name">{{ skill.name }}</h3>
                  <p class="skill-card-desc" :title="skill.description">{{ skill.description || '暂无描述' }}</p>
                  <div class="skill-card-footer">
                    <span class="skill-code">{{ skill.code }}</span>
                    <el-button
                      type="primary"
                      size="small"
                      @click="showSkillPpt(skill)"
                    >
                      <el-icon style="margin-right: 4px;"><ArrowRight /></el-icon>
                      查看PPT教程
                    </el-button>
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>

          <!-- 内联PPT查看器 -->
          <div v-if="activeSkillId !== null" class="inline-ppt-section">
            <div class="ppt-section-header" @click="togglePptSection">
              <div class="ppt-section-title">
                <el-icon :size="20"><Monitor /></el-icon>
                <span>{{ activeSkillName }} - PPT教程</span>
              </div>
              <el-button type="text" class="ppt-toggle-btn">
                <el-icon :size="18">
                  <component :is="pptExpanded ? ArrowLeft : ArrowRight" />
                </el-icon>
                {{ pptExpanded ? '收起PPT' : '展开PPT' }}
              </el-button>
            </div>
            <transition name="slide">
              <div v-if="pptExpanded" class="ppt-section-body">
                <div v-if="pptSlides.length > 0">
                  <PptViewer
                    :slides="pptSlides"
                    :skill-id="activeSkillId"
                    :initial-progress="0"
                  />
                </div>
                <el-card v-else class="card-shadow" style="min-height:200px;display:flex;align-items:center;justify-content:center">
                  <el-empty description="该技能暂无幻灯片内容" />
                </el-card>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getScenarioById } from '@/api/scenarios'
import { getSkillsByScenario } from '@/api/skills'
import { getSlides } from '@/api/ppt'
import { ElLoading, ElMessage } from 'element-plus'
import PptViewer from '@/components/PptViewer.vue'
import {
  HomeFilled,
  FolderOpened,
  Collection,
  Document,
  DataAnalysis,
  Reading,
  Monitor,
  Picture,
  VideoCamera,
  Microphone,
  EditPen,
  Grid,
  ArrowRight,
  ArrowLeft,
  Warning
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const scenarioId = computed(() => route.params.id)

const scenario = ref({})
const skills = ref([])
const loading = ref(false)
const notFound = ref(false)

// 内联PPT相关状态
const activeSkillId = ref(null)
const activeSkillName = ref('')
const pptSlides = ref([])
const pptExpanded = ref(true)

// 可用的图标映射，确保不引用不存在的图标
const availableIcons = {
  FolderOpened,
  Collection,
  Document,
  DataAnalysis,
  Reading,
  Monitor,
  Picture,
  VideoCamera,
  Microphone,
  EditPen,
  Grid,
  Warning,
  ArrowRight,
  ArrowLeft,
  HomeFilled
}

const safeScenarioIcon = computed(() => {
  const iconName = scenario.value.icon
  if (iconName && availableIcons[iconName]) {
    return availableIcons[iconName]
  }
  return FolderOpened
})

function safeSkillIcon(icon) {
  if (icon && typeof icon === 'string' && icon.trim().length > 0) {
    return icon
  }
  return '📚'
}

const heroStyle = computed(() => {
  const color = scenario.value.color || '#003D7A'
  return {
    background: `linear-gradient(135deg, ${color} 0%, #1a5a96 100%)`
  }
})

const parsedTags = computed(() => {
  if (!scenario.value.tags) return []
  try {
    return typeof scenario.value.tags === 'string'
      ? JSON.parse(scenario.value.tags)
      : scenario.value.tags
  } catch {
    return []
  }
})

// 为不同技能卡片分配不同的装饰色
const skillHeaderColors = ['#003D7A', '#00B4D8', '#009688', '#F59E0B', '#E11D48', '#1a5a96']

function skillCardHeaderStyle(skill) {
  const index = (skill.id || 0) % skillHeaderColors.length
  const color = skillHeaderColors[index]
  return {
    background: `linear-gradient(135deg, ${color}, ${adjustColorBrightness(color, 20)})`
  }
}

// 简单的颜色亮度调整
function adjustColorBrightness(hex, percent) {
  const num = parseInt(hex.replace('#', ''), 16)
  const amt = Math.round(2.55 * percent)
  const R = Math.min(255, (num >> 16) + amt)
  const G = Math.min(255, ((num >> 8) & 0x00FF) + amt)
  const B = Math.min(255, (num & 0x0000FF) + amt)
  return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)
}

async function showSkillPpt(skill) {
  // 如果点击同一个技能，切换展开/收起
  if (activeSkillId.value === skill.id) {
    togglePptSection()
    return
  }

  activeSkillId.value = skill.id
  activeSkillName.value = skill.name
  pptSlides.value = []
  pptExpanded.value = true

  try {
    const res = await getSlides(skill.id)
    pptSlides.value = res.data || []
  } catch (error) {
    console.error('获取幻灯片失败', error)
    ElMessage.error('获取幻灯片失败')
  }

  // 滚动到PPT区域
  nextTick(() => {
    const el = document.querySelector('.inline-ppt-section')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  })
}

function togglePptSection() {
  pptExpanded.value = !pptExpanded.value
}

async function fetchScenario() {
  try {
    const res = await getScenarioById(scenarioId.value)
    if (res.data) {
      scenario.value = res.data
      document.title = `${scenario.value.name} - 研岸保研AI赋能PPT教程平台`
    } else {
      notFound.value = true
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      notFound.value = true
    } else {
      ElMessage.error('获取场景信息失败')
    }
  }
}

async function fetchSkills() {
  try {
    const res = await getSkillsByScenario(scenarioId.value)
    skills.value = res.data || []
  } catch (error) {
    console.error('获取技能列表失败', error)
    ElMessage.error('获取技能列表失败')
  }
}

async function init() {
  loading.value = true
  const loadingInstance = ElLoading.service({
    lock: true,
    text: '加载中...',
    background: 'rgba(255, 255, 255, 0.7)'
  })

  try {
    await fetchScenario()
    if (!notFound.value) {
      await fetchSkills()
    }
  } finally {
    loading.value = false
    loadingInstance.close()
  }
}

onMounted(() => {
  init()
})

// 监听场景ID变化，切换场景时重新加载数据
watch(scenarioId, (newId, oldId) => {
  if (newId && newId !== oldId) {
    // 重置PPT状态
    activeSkillId.value = null
    activeSkillName.value = ''
    pptSlides.value = []
    notFound.value = false
    init()
  }
})

</script>

<style scoped>
.scenario-detail {
  min-height: 100vh;
  padding-bottom: 60px;
}

/* 面包屑栏 */
.breadcrumb-bar {
  background: #fff;
  border-bottom: 1px solid #ebeef5;
  padding: 16px 0;
}

/* Hero 区域 */
.scenario-hero {
  position: relative;
  padding: 60px 0;
  color: white;
  overflow: hidden;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 80% 20%, rgba(245, 184, 0, 0.15), transparent 50%);
}

.hero-content {
  position: relative;
  z-index: 1;
}

.hero-main {
  display: flex;
  align-items: flex-start;
  gap: 24px;
}

.hero-icon {
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.hero-title {
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 12px;
}

.hero-desc {
  font-size: 16px;
  opacity: 0.9;
  line-height: 1.6;
  margin-bottom: 16px;
  max-width: 700px;
}

.hero-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

/* 技能区域 */
.skills-section {
  margin-top: 40px;
}

.empty-state {
  padding: 60px 0;
}

/* 技能卡片 */
.skill-card {
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 8px;
  overflow: hidden;
}

.skill-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 8px 24px rgba(0, 61, 122, 0.18);
}

.skill-card-active {
  border: 2px solid #F5B800;
  box-shadow: 0 0 0 2px rgba(245, 184, 0, 0.25);
}

.skill-card-header {
  height: 110px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.skill-card-icon {
  width: 56px;
  height: 56px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-text {
  font-size: 28px;
  line-height: 1;
}

.skill-card-body {
  padding: 16px;
}

.skill-card-title {
  font-size: 16px;
  font-weight: bold;
  color: #003D7A;
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.skill-card-desc {
  font-size: 13px;
  color: #666;
  height: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  margin-bottom: 12px;
  line-height: 1.5;
}

.skill-card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.skill-code {
  font-size: 12px;
  color: #F5B800;
  font-weight: bold;
  background: rgba(0, 61, 122, 0.08);
  padding: 3px 10px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
}

/* 内联PPT区域 */
.inline-ppt-section {
  margin-top: 40px;
  border: 1px solid #e6e6e6;
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.ppt-section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background: linear-gradient(135deg, #003D7A 0%, #1a5a96 100%);
  color: white;
  cursor: pointer;
  user-select: none;
}

.ppt-section-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  font-weight: 600;
}

.ppt-toggle-btn {
  color: #ffffff !important;
  display: flex;
  align-items: center;
  gap: 6px;
}

.ppt-section-body {
  padding: 20px;
}

/* 展开/收起动画 */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
  max-height: 800px;
  overflow: hidden;
}

.slide-enter-from,
.slide-leave-to {
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
  opacity: 0;
}

/* 404 页面 */
.not-found {
  padding: 80px 0;
}

/* 响应式 */
@media (max-width: 768px) {
  .hero-main {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .hero-title {
    font-size: 24px;
  }

  .hero-desc {
    font-size: 14px;
  }

  .hero-meta {
    justify-content: center;
  }

  .skills-section {
    margin-top: 24px;
  }

  .ppt-section-header {
    padding: 12px 16px;
  }

  .ppt-section-title {
    font-size: 14px;
  }
}
</style>
