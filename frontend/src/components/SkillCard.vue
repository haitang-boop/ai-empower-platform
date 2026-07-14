<template>
  <el-card class="skill-card card-shadow" :body-style="{ padding: '0px' }" @click="goToSkill">
    <div class="card-image">
      <span class="skill-icon-text">{{ skill.icon || '📚' }}</span>
    </div>
    <div class="card-body">
      <h3 class="card-title">{{ skill.name }}</h3>
      <p class="card-desc">{{ skill.description || '暂无描述' }}</p>
      <div class="card-footer">
        <span class="skill-code-badge">{{ skill.code }}</span>
        <el-button type="primary" size="small" @click.stop="goToSkill">
          开始学习
        </el-button>
      </div>
    </div>
  </el-card>
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  skill: { type: Object, required: true }
})

const router = useRouter()

function goToSkill() {
  router.push(`/skill/${props.skill.id}`)
}
</script>

<style scoped>
.skill-card {
  cursor: pointer;
  transition: all 0.3s ease;
}

.skill-card:hover {
  transform: translateY(-4px);
}

.card-image {
  position: relative;
  height: 120px;
  overflow: hidden;
  background: linear-gradient(135deg, #003D7A, #1a5a96);
  display: flex;
  align-items: center;
  justify-content: center;
}

.skill-icon-text {
  font-size: 48px;
  color: #F5B800;
}

.card-badge {
  position: absolute;
  top: 10px;
  right: 10px;
}

.card-body {
  padding: 16px;
}

.card-title {
  font-size: 16px;
  font-weight: bold;
  color: #003D7A;
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-desc {
  font-size: 13px;
  color: #666;
  height: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  margin-bottom: 12px;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.skill-code-badge {
  font-size: 12px;
  color: #F5B800;
  font-weight: bold;
  background: rgba(0, 61, 122, 0.1);
  padding: 2px 8px;
  border-radius: 4px;
}
</style>