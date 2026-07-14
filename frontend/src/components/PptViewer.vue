<template>
  <div class="ppt-viewer" tabindex="0" ref="viewerRef">
    <div class="ppt-controls">
      <el-button-group>
        <el-button :disabled="currentSlide <= 0" @click="prevSlide">
          <el-icon><ArrowLeft /></el-icon> 上一页
        </el-button>
        <el-button :disabled="currentSlide >= slides.length - 1" @click="nextSlide">
          下一页 <el-icon><ArrowRight /></el-icon>
        </el-button>
      </el-button-group>
      <span class="slide-info">
        {{ currentSlide + 1 }} / {{ slides.length }}
      </span>
      <div class="progress-info">
        <el-progress
          :percentage="progressPercent"
          :stroke-width="8"
          :color="customColors"
          style="width: 200px"
        />
        <el-tag type="warning" v-if="!saved">未保存</el-tag>
        <el-tag type="success" v-else>已保存</el-tag>
      </div>
    </div>

    <div class="slide-container">
      <transition name="slide-fade" mode="out-in">
        <div class="slide-content" :key="currentSlide">
          <template v-if="slides.length > 0">
            <div class="slide-title">{{ slides[currentSlide].title }}</div>
            <div class="slide-body" v-html="getSlideContentHtml(slides[currentSlide].content)"></div>
            <div class="slide-notes" v-if="slides[currentSlide].notes">
              <el-icon><EditPen /></el-icon>
              {{ slides[currentSlide].notes }}
            </div>
          </template>
          <template v-else>
            <div class="slide-empty">暂无幻灯片数据</div>
          </template>
        </div>
      </transition>
    </div>

    <div class="slide-thumbnails">
      <div
        v-for="(slide, index) in slides"
        :key="slide.id || index"
        class="thumbnail"
        :class="{ active: index === currentSlide }"
        @click="goToSlide(index)"
      >
        <span class="thumbnail-num">{{ index + 1 }}</span>
        <span class="thumbnail-title">{{ slide.title || '无标题' }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ArrowLeft, ArrowRight, EditPen } from '@element-plus/icons-vue'
import { saveProgress } from '@/api/skills'

const props = defineProps({
  slides: {
    type: Array,
    default: () => []
  },
  skillId: {
    type: [Number, String],
    default: null
  },
  initialProgress: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['progress-change'])

const viewerRef = ref(null)
const currentSlide = ref(0)
const saved = ref(true)
const customColors = [
  { color: '#003D7A', percentage: 20 },
  { color: '#F5B800', percentage: 100 }
]

const progressPercent = computed(() => {
  if (props.slides.length === 0) return 0
  return Math.round(((currentSlide.value + 1) / props.slides.length) * 100)
})

function prevSlide() {
  if (currentSlide.value > 0) {
    currentSlide.value--
    saved.value = false
  }
}

function nextSlide() {
  if (currentSlide.value < props.slides.length - 1) {
    currentSlide.value++
    saved.value = false
  }
}

function goToSlide(index) {
  currentSlide.value = index
  saved.value = false
}

// 解析幻灯片内容为HTML
function getSlideContentHtml(content) {
  if (!content) return '<p style="color:#999">暂无内容</p>'
  // 如果是字符串，直接返回
  if (typeof content === 'string') return content
  // 如果是JSON对象，解析结构化内容
  if (typeof content === 'object') {
    let html = ''
    if (content.html) return content.html
    if (content.text) html += `<p>${content.text}</p>`
    if (content.bullets && Array.isArray(content.bullets)) {
      html += '<ul>' + content.bullets.map(b => `<li>${b}</li>`).join('') + '</ul>'
    }
    if (content.sections && Array.isArray(content.sections)) {
      html += content.sections.map(s => {
        let sec = `<h3>${s.title || ''}</h3><p>${s.text || ''}</p>`
        if (s.bullets) sec += '<ul>' + s.bullets.map(b => `<li>${b}</li>`).join('') + '</ul>'
        return sec
      }).join('')
    }
    return html || '<p style="color:#999">暂无内容</p>'
  }
  return String(content)
}

async function doSaveProgress() {
  if (!props.skillId) return
  try {
    await saveProgress(props.skillId, {
      currentSlide: currentSlide.value,
      totalSlides: props.slides.length,
      completed: progressPercent.value
    })
    saved.value = true
    emit('progress-change', {
      currentSlide: currentSlide.value,
      total: props.slides.length,
      percent: progressPercent.value
    })
  } catch (error) {
    console.error('保存进度失败', error)
  }
}

// 键盘导航
function handleKeydown(e) {
  if (e.key === 'ArrowLeft') prevSlide()
  if (e.key === 'ArrowRight') nextSlide()
  if (e.key === 's' && e.ctrlKey) {
    e.preventDefault()
    doSaveProgress()
  }
}

// 自动保存进度（每30秒）
let autoSaveTimer = null
function startAutoSave() {
  autoSaveTimer = setInterval(() => {
    if (!saved.value) {
      doSaveProgress()
    }
  }, 30000)
}

function stopAutoSave() {
  if (autoSaveTimer) {
    clearInterval(autoSaveTimer)
    autoSaveTimer = null
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
  startAutoSave()
  if (props.initialProgress > 0) {
    const idx = Math.floor((props.initialProgress / 100) * props.slides.length)
    currentSlide.value = Math.min(idx, props.slides.length - 1)
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  stopAutoSave()
})
</script>

<style scoped>
.ppt-viewer {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  outline: none;
}

.ppt-controls {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 15px 20px;
  background: #f8f9fa;
  border-bottom: 1px solid #e6e6e6;
}

.slide-info {
  font-size: 16px;
  font-weight: bold;
  color: #003D7A;
}

.progress-info {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 10px;
}

.slide-container {
  padding: 20px;
  min-height: 500px;
  overflow-y: auto;
}

.slide-content {
  padding: 40px;
  display: flex;
  flex-direction: column;
}

.slide-title {
  font-size: 28px;
  font-weight: bold;
  color: #003D7A;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 3px solid #F5B800;
}

.slide-body {
  font-size: 16px;
  line-height: 1.8;
  color: #333;
  flex: 1;
}

.slide-notes {
  margin-top: 20px;
  padding: 10px 15px;
  background: #fff8e1;
  border-left: 4px solid #F5B800;
  color: #666;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.slide-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  color: #999;
  font-size: 18px;
}

/* 幻灯片切换过渡动画 */
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s ease-in;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.slide-thumbnails {
  display: flex;
  overflow-x: auto;
  padding: 10px 20px;
  background: #f0f0f0;
  gap: 8px;
}

.thumbnail {
  min-width: 120px;
  padding: 8px 12px;
  background: #fff;
  border: 2px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;
}

.thumbnail:hover {
  border-color: #003D7A;
}

.thumbnail.active {
  border-color: #F5B800;
  background: #fff8e1;
}

.thumbnail-num {
  background: #003D7A;
  color: #fff;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  flex-shrink: 0;
}

.thumbnail-title {
  font-size: 13px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
