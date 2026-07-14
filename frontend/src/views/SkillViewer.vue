<template>
  <div class="skill-viewer">
    <div class="page-container">
      <el-page-header @back="router.back" :content="skill.name" />

      <el-row :gutter="20" style="margin-top:20px">
        <!-- 左侧内容 -->
        <el-col :span="16">
          <!-- PPT查看器 -->
          <div v-if="slides.length > 0">
            <PptViewer
              :slides="slides"
              :skill-id="skillId"
              :initial-progress="progress"
              @progress-change="onProgressChange"
            />
          </div>
          <el-card v-else class="card-shadow" style="min-height:300px;display:flex;align-items:center;justify-content:center">
            <el-empty description="该技能暂无幻灯片内容" />
          </el-card>

          <!-- 技能详情 -->
          <el-card class="card-shadow" style="margin-top:20px">
            <template #header>
              <div class="skill-detail-header">
                <h3>技能详情</h3>
                <div>
                  <el-button
                    :type="isFavorited ? 'warning' : 'default'"
                    :icon="isFavorited ? 'StarFilled' : 'Star'"
                    @click="toggleFavorite"
                    size="small"
                  >
                    {{ isFavorited ? '已收藏' : '收藏' }}
                  </el-button>
                </div>
              </div>
            </template>
            <div class="skill-info">
              <el-descriptions :column="2" border>
                <el-descriptions-item label="技能名称">{{ skill.name }}</el-descriptions-item>
                <el-descriptions-item label="技能编号">{{ skill.code }}</el-descriptions-item>
                <el-descriptions-item label="描述" :span="2">{{ skill.description }}</el-descriptions-item>
              </el-descriptions>
            </div>
          </el-card>
        </el-col>

        <!-- 右侧边栏 -->
        <el-col :span="8">
          <el-card class="card-shadow">
            <template #header>
              <h4>学习进度</h4>
            </template>
            <el-progress
              type="circle"
              :percentage="progressPercent"
              :color="customColors"
              :width="180"
            />
            <p style="text-align:center;margin-top:15px;color:#666">
              已完成 {{ currentSlide }} / {{ totalSlides }} 页
            </p>
          </el-card>

          <el-card class="card-shadow" style="margin-top:20px">
            <template #header>
              <h4>相关技能</h4>
            </template>
            <div class="related-skills">
              <div
                v-for="item in relatedSkills"
                :key="item.id"
                class="related-item"
                @click="router.push(`/skill/${item.id}`)"
              >
                <span class="related-title">{{ item.name }}</span>
                <span class="related-code">{{ item.code }}</span>
              </div>
              <el-empty v-if="relatedSkills.length === 0" description="暂无相关技能" :image-size="60" />
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getSkillById, favoriteSkill, getFavorites, getLearningHistory } from '@/api/skills'
import { getSlides } from '@/api/ppt'
import { getSkillsByScenario } from '@/api/skills'
import { ElMessage } from 'element-plus'
import PptViewer from '@/components/PptViewer.vue'

const route = useRoute()
const router = useRouter()
const skillId = computed(() => route.params.id)

const skill = ref({})
const slides = ref([])
const isFavorited = ref(false)
const progress = ref(0)
const currentSlide = ref(0)
const totalSlides = ref(0)
const relatedSkills = ref([])

const progressPercent = computed(() => {
  if (totalSlides.value === 0) return 0
  return Math.round((currentSlide.value / totalSlides.value) * 100)
})

const customColors = [
  { color: '#003D7A', percentage: 20 },
  { color: '#F5B800', percentage: 100 }
]

const levelType = computed(() => {
  const map = { '初级': 'success', '中级': 'warning', '高级': 'danger' }
  return map[skill.value.level] || 'info'
})

async function fetchSkill() {
  try {
    const res = await getSkillById(skillId.value)
    skill.value = res.data
    if (skill.value.scenario_id) {
      fetchRelatedSkills(skill.value.scenario_id)
    }
  } catch (error) {
    ElMessage.error('获取技能信息失败')
  }
}

async function fetchSlides() {
  try {
    const res = await getSlides(skillId.value)
    slides.value = res.data || []
    totalSlides.value = slides.value.length
  } catch (error) {
    console.error('获取幻灯片失败', error)
  }
}

async function fetchRelatedSkills(scenarioId) {
  try {
    const res = await getSkillsByScenario(scenarioId)
    relatedSkills.value = (res.data || []).filter(s => s.id !== Number(skillId.value)).slice(0, 5)
  } catch (error) {
    console.error('获取相关技能失败', error)
  }
}

async function fetchFavorites() {
  try {
    const res = await getFavorites()
    const favs = res.data || []
    isFavorited.value = favs.some(f => f.id === Number(skillId.value) || f.skill_id === Number(skillId.value))
  } catch (error) {
    console.error('获取收藏状态失败', error)
  }
}

async function fetchProgress() {
  try {
    const res = await getLearningHistory()
    const history = res.data || []
    const record = history.find(h => h.skill_id === Number(skillId.value))
    if (record) {
      currentSlide.value = record.current_slide || 0
      progress.value = record.progress || 0
    }
  } catch (error) {
    console.error('获取学习进度失败', error)
  }
}

async function toggleFavorite() {
  try {
    await favoriteSkill(skillId.value)
    isFavorited.value = !isFavorited.value
    ElMessage.success(isFavorited.value ? '收藏成功' : '已取消收藏')
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

function onProgressChange(data) {
  currentSlide.value = data.currentSlide + 1
  totalSlides.value = data.total
}

onMounted(() => {
  fetchSkill()
  fetchSlides()
  fetchFavorites()
  fetchProgress()
})
</script>

<style scoped>
.skill-viewer {
  padding-bottom: 40px;
}

.skill-detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.skill-detail-header h3 {
  color: #003D7A;
}

.related-skills {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.related-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
}

.related-item:hover {
  background: #f0f7ff;
}

.related-title {
  font-size: 14px;
  color: #003D7A;
}
</style>