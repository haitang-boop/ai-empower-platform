<template>
  <div class="ppt-edit">
    <div class="page-header">
      <h3>PPT幻灯片编辑 - {{ ppt?.title || skill?.title }}</h3>
      <el-button type="primary" @click="addSlide">
        <el-icon><Plus /></el-icon> 添加幻灯片
      </el-button>
    </div>

    <el-row :gutter="20">
      <el-col :span="6">
        <el-card class="card-shadow">
          <template #header>
            <h4>幻灯片导航</h4>
          </template>
          <div class="slide-list">
            <div
              v-for="(slide, index) in slides"
              :key="slide.id"
              class="slide-item"
              :class="{ active: index === activeIndex, deleted: slide.deleted }"
              draggable="true"
              @dragstart="handleDragStart($event, index)"
              @dragover.prevent="handleDragOver($event, index)"
              @drop="handleDrop(index)"
            >
              <div class="slide-actions">
                <el-icon><Rank /></el-icon>
              </div>
              <div class="slide-info" @click="selectSlide(index)">
                <span class="slide-num">{{ index + 1 }}</span>
                <span class="slide-title">{{ slide.title || '未命名' }}</span>
              </div>
              <el-button
                class="slide-delete"
                type="danger"
                icon="Delete"
                circle
                size="small"
                @click="confirmDeleteSlide(index)"
              />
            </div>
          </div>

          <div v-if="slides.length === 0" class="empty">
            <el-empty description="暂无幻灯片，请添加新幻灯片" />
          </div>
          <div v-if="pptId">
            <el-divider />
            <el-button type="success" @click="saveOrder" :loading="savingOrder">保存排序</el-button>
          </div>
        </el-card>
      </el-col>

      <el-col :span="18">
        <el-card class="card-shadow editor-card">
          <template #header>
            <h4>幻灯片内容编辑</h4>
            <span class="text-muted">正在编辑第 {{ activeIndex + 1 }} 页</span>
          </template>
          <div v-if="currentSlide">
            <el-form :model="slideForm" label-width="80px">
              <el-form-item label="幻灯片标题">
                <el-input v-model="slideForm.title" placeholder="请输入幻灯片标题" />
              </el-form-item>
              <el-form-item label="内容">
                <el-input
                  v-model="slideForm.content"
                  type="textarea"
                  :rows="12"
                  placeholder="支持HTML格式"
                />
                <div class="hint">可以使用HTML标签来设置内容格式</div>
              </el-form-item>
              <el-form-item label="备注">
                <el-input
                  v-model="slideForm.notes"
                  type="textarea"
                  :rows="3"
                  placeholder="讲师备注"
                />
              </el-form-item>
            </el-form>
            <div class="form-actions">
              <el-button type="primary" @click="saveCurrentSlide" :loading="saving">保存</el-button>
              <el-button @click="generateContent" :loading="generating">AI生成内容</el-button>
            </div>
          </div>
          <div v-else class="empty">
            <el-empty description="请选择左侧幻灯片或添加新幻灯片" />
          </div>
        </el-card>

        <el-card class="card-shadow" style="margin-top:20px">
          <template #header>
            <h4>PPT基本信息</h4>
          </template>
          <el-form :model="pptForm" label-width="80px">
            <el-form-item label="PPT标题">
              <el-input v-model="pptForm.title" />
            </el-form-item>
            <el-form-item label="技能">
              <span v-if="skill">{{ skill.title }}</span>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="savePptInfo" :loading="saving">保存PPT信息</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>

    <!-- AI生成对话框 -->
    <el-dialog v-model="aiDialogVisible" title="AI生成幻灯片内容" width="600px">
      <el-form label-width="80px">
        <el-form-item label="主题">
          <el-input v-model="aiPrompt" placeholder="请描述你希望生成的幻灯片内容" />
        </el-form-item>
        <el-form-item label="大纲要求">
          <el-input
            v-model="aiOutline"
            type="textarea"
            :rows="3"
            placeholder="说明需要包含哪些要点"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="aiDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="doGenerate" :loading="generating">生成</el-button>
      </template>
    </el-dialog>

    <!-- 删除确认 -->
    <el-dialog v-model="deleteDialogVisible" title="确认删除" width="400px">
      <p>确定要删除这张幻灯片吗？删除后无法恢复。</p>
      <template #footer>
        <el-button @click="deleteDialogVisible = false">取消</el-button>
        <el-button type="danger" @click="deleteCurrentSlide">删除</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import {
  getPptBySkill,
  getPptById,
  updatePpt,
  createPpt,
  getSlides,
  createSlide,
  updateSlide,
  deleteSlide,
  reorderSlides
} from '@/api/ppt'
import { getSkillById } from '@/api/skills'
import { generateSlide } from '@/api/models'
import { ElMessage } from 'element-plus'
import { Plus, Rank, Delete } from '@element-plus/icons-vue'

const route = useRoute()
const pptId = computed(() => route.params.id)
const skillId = computed(() => route.params.id)

const ppt = ref(null)
const skill = ref(null)
const slides = ref([])
const activeIndex = ref(0)
const activeSlideId = ref(null)
const dialogVisible = ref(false)
const aiDialogVisible = ref(false)
const deleteDialogVisible = ref(false)
const saving = ref(false)
const savingOrder = ref(false)
const generating = ref(false)
const dragIndex = ref(null)

const aiPrompt = ref('')
const aiOutline = ref('')

const currentSlide = computed(() => slides.value[activeIndex.value])

const pptForm = reactive({
  title: '',
  skill_id: null
})

const slideForm = reactive({
  title: '',
  content: '',
  notes: ''
})

async function fetchData() {
  try {
    // 根据skillId获取ppt
    let res = await getPptBySkill(pptId.value)
    if (res.data && Array.isArray(res.data.slides)) {
      ppt.value = res.data.ppt
      slides.value = res.data.slides
    } else if (Array.isArray(res.data)) {
      slides.value = res.data
    } else {
      ppt.value = res.data
      const slideRes = await getSlides(pptId.value)
      slides.value = slideRes.data || []
    }

    // 获取skill信息
    const skillRes = await getSkillById(pptId.value)
    skill.value = skillRes.data
    pptForm.title = ppt.value?.title || skill.value.title
    pptForm.skill_id = Number(pptId.value)
  } catch (error) {
    ElMessage.error('获取数据失败')
    console.error(error)
  }
}

function selectSlide(index) {
  activeIndex.value = index
  if (currentSlide.value) {
    activeSlideId.value = currentSlide.value.id
    slideForm.title = currentSlide.value.title
    slideForm.content = currentSlide.value.content
    slideForm.notes = currentSlide.value.notes || ''
  }
}

async function addSlide() {
  saving.value = true
  try {
    const res = await createSlide(pptId.value, {
      title: '新幻灯片',
      content: '<p>请编辑幻灯片内容</p>',
      notes: ''
    })
    slides.value.push(res.data)
    selectSlide(slides.value.length - 1)
    ElMessage.success('添加成功')
  } catch (error) {
    ElMessage.error('添加失败')
  } finally {
    saving.value = false
  }
}

function confirmDeleteSlide(index) {
  activeIndex.value = index
  deleteDialogVisible.value = true
}

async function deleteCurrentSlide() {
  if (!currentSlide.value) return
  saving.value = true
  try {
    await deleteSlide(pptId.value, currentSlide.value.id)
    slides.value.splice(activeIndex.value, 1)
    deleteDialogVisible.value = false
    if (slides.value.length > 0) {
      selectSlide(Math.max(0, activeIndex.value - 1))
    } else {
      activeIndex.value = 0
    }
    ElMessage.success('删除成功')
  } catch (error) {
    ElMessage.error('删除失败')
  } finally {
    saving.value = false
  }
}

async function saveCurrentSlide() {
  if (!currentSlide.value) return
  saving.value = true
  try {
    await updateSlide(pptId.value, currentSlide.value.id, slideForm)
    Object.assign(slides.value[activeIndex.value], slideForm)
    ElMessage.success('保存成功')
  } catch (error) {
    ElMessage.error('保存失败')
  } finally {
    saving.value = false
  }
}

async function savePptInfo() {
  saving.value = true
  try {
    if (ppt.value?.id) {
      await updatePpt(ppt.value.id, pptForm)
    } else {
      await createPpt(pptForm)
    }
    ElMessage.success('保存成功')
  } catch (error) {
    ElMessage.error('保存失败')
  } finally {
    saving.value = false
  }
}

function handleDragStart(e, index) {
  dragIndex.value = index
}

function handleDragOver(e, index) {
  e.dataTransfer.dropEffect = 'move'
}

function handleDrop(toIndex) {
  if (dragIndex.value === toIndex) return
  const arr = [...slides.value]
  const [removed] = arr.splice(dragIndex.value, 1)
  arr.splice(toIndex, 0, removed)
  slides.value = arr
  dragIndex.value = null
}

async function saveOrder() {
  savingOrder.value = true
  const orderData = {
    order: slides.value.map((s, i) => ({ id: s.id, position: i }))
  }
  try {
    await reorderSlides(pptId.value, orderData)
    ElMessage.success('排序保存成功')
  } catch (error) {
    ElMessage.error('保存排序失败')
  } finally {
    savingOrder.value = false
  }
}

async function generateContent() {
  if (!currentSlide.value) {
    aiDialogVisible.value = true
    return
  }
  aiPrompt.value = currentSlide.value.title || ''
  aiDialogVisible.value = true
}

async function doGenerate() {
  generating.value = true
  try {
    const res = await generateSlide({
      prompt: aiPrompt.value,
      outline: aiOutline.value
    })
    slideForm.content = res.data.content
    ElMessage.success('生成成功')
    aiDialogVisible.value = false
  } catch (error) {
    ElMessage.error('生成失败')
  } finally {
    generating.value = false
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.ppt-edit {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h3 {
  color: #003D7A;
  margin: 0;
}

.slide-list {
  max-height: 600px;
  overflow-y: auto;
}

.slide-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 8px;
  margin-bottom: 8px;
  border: 2px solid #e6e6e6;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
  transition: all 0.2s;
}

.slide-item:hover {
  border-color: #003D7A;
}

.slide-item.active {
  border-color: #F5B800;
  background: #fff8e1;
}

.slide-num {
  width: 26px;
  height: 26px;
  border-radius: 4px;
  background: #003D7A;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  flex-shrink: 0;
}

.slide-title {
  font-size: 14px;
  color: #333;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.slide-delete {
  opacity: 0;
  transition: opacity 0.2s;
}

.slide-item:hover .slide-delete {
  opacity: 1;
}

.empty {
  padding: 30px 0;
}

.hint {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.form-actions {
  display: flex;
  gap: 12px;
}

.editor-card .el-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text-muted {
  color: #999;
  font-size: 13px;
}
</style>