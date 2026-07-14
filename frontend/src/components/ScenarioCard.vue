<template>
  <el-card class="scenario-card card-shadow" :body-style="{ padding: '0px' }" @click="goToScenario">
    <div class="scenario-header">
      <div class="scenario-icon">
        <el-icon :size="32" color="#F5B800">
          <component :is="scenario.icon || 'FolderOpened'" />
        </el-icon>
      </div>
      <div class="scenario-info">
        <h3 class="scenario-title">{{ scenario.name }}</h3>
        <span class="scenario-count">
          {{ scenario.skill_count || 0 }} 个技能
        </span>
      </div>
    </div>
    <div class="scenario-body">
      <p>{{ scenario.description || '暂无描述' }}</p>
    </div>
    <div class="scenario-footer">
      <el-tag
        v-for="tag in tags"
        :key="tag"
        size="small"
        class="mr-1"
        effect="plain"
      >
        {{ tag }}
      </el-tag>
    </div>
  </el-card>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { FolderOpened } from '@element-plus/icons-vue'

const props = defineProps({
  scenario: {
    type: Object,
    required: true
  }
})

const tags = computed(() => {
  if (props.scenario.tags) {
    return typeof props.scenario.tags === 'string'
      ? JSON.parse(props.scenario.tags)
      : props.scenario.tags
  }
  return []
})

const router = useRouter()

function goToScenario() {
  router.push(`/scenario/${props.scenario.id}`)
}
</script>

<style scoped>
.scenario-card {
  cursor: pointer;
  transition: all 0.3s ease;
}

.scenario-card:hover {
  transform: translateY(-4px);
}

.scenario-header {
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  background: linear-gradient(135deg, #003D7A, #1a5a96);
  color: white;
}

.scenario-icon {
  width: 56px;
  height: 56px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.scenario-title {
  font-size: 18px;
  margin-bottom: 4px;
}

.scenario-count {
  font-size: 13px;
  opacity: 0.8;
}

.scenario-body {
  padding: 16px 20px;
  color: #666;
  font-size: 14px;
  min-height: 50px;
}

.scenario-footer {
  padding: 10px 20px 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}
</style>