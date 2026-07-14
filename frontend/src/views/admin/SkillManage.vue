<template>
  <div class="skill-manage">
    <div class="page-header">
      <h3>技能管理</h3>
      <el-button type="primary" @click="openDialog(null)">
        <el-icon><Plus /></el-icon> 新增技能
      </el-button>
    </div>

    <el-card class="card-shadow">
      <!-- 搜索栏 -->
      <el-form :inline="true" :model="query" style="margin-bottom:20px">
        <el-form-item label="关键词">
          <el-input v-model="query.keyword" placeholder="搜索技能名称" clearable @clear="fetchSkills" />
        </el-form-item>
        <el-form-item label="场景">
          <el-select v-model="query.scenario_id" placeholder="全部场景" clearable @change="fetchSkills">
            <el-option
              v-for="s in scenarios"
              :key="s.id"
              :label="s.name"
              :value="s.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="等级">
          <el-select v-model="query.level" placeholder="全部等级" clearable @change="fetchSkills">
            <el-option label="初级" value="初级" />
            <el-option label="中级" value="中级" />
            <el-option label="高级" value="高级" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="fetchSkills">搜索</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="skills" v-loading="loading" stripe border>
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="title" label="技能名称" show-overflow-tooltip />
        <el-table-column prop="scenario_name" label="所属场景" width="120" />
        <el-table-column label="等级" width="80">
          <template #default="{ row }">
            <el-tag :type="levelType(row.level)">{{ row.level }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="view_count" label="浏览量" width="80" />
        <el-table-column prop="favorite_count" label="收藏数" width="80" />
        <el-table-column prop="created_at" label="创建时间" width="180" />
        <el-table-column label="操作" width="240" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" link @click="openDialog(row)">编辑</el-button>
            <el-button type="success" size="small" link @click="router.push(`/admin/ppt/${row.ppt_id || row.id}`)">编辑PPT</el-button>
            <el-button type="danger" size="small" link @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination" v-if="total > pageSize">
        <el-pagination
          v-model:current-page="page"
          :page-size="pageSize"
          :total="total"
          layout="prev, pager, next"
          @current-change="fetchSkills"
        />
      </div>
    </el-card>

    <!-- 编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑技能' : '新增技能'"
      width="600px"
    >
      <el-form :model="form" :rules="rules" ref="formRef" label-width="80px">
        <el-form-item label="技能名称" prop="title">
          <el-input v-model="form.title" placeholder="请输入技能名称" />
        </el-form-item>
        <el-form-item label="所属场景" prop="scenario_id">
          <el-select v-model="form.scenario_id" placeholder="选择场景" style="width:100%">
            <el-option
              v-for="s in scenarios"
              :key="s.id"
              :label="s.name"
              :value="s.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="难度等级" prop="level">
          <el-select v-model="form.level" placeholder="选择等级" style="width:100%">
            <el-option label="初级" value="初级" />
            <el-option label="中级" value="中级" />
            <el-option label="高级" value="高级" />
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="请输入技能描述"
          />
        </el-form-item>
        <el-form-item label="封面图">
          <el-input v-model="form.cover_url" placeholder="请输入封面图URL" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave" :loading="saving">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getSkills, createSkill, updateSkill, deleteSkill } from '@/api/skills'
import { getScenarios } from '@/api/scenarios'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

const router = useRouter()
const skills = ref([])
const scenarios = ref([])
const loading = ref(false)
const saving = ref(false)
const dialogVisible = ref(false)
const isEdit = ref(false)
const editId = ref(null)
const formRef = ref(null)
const page = ref(1)
const pageSize = ref(20)
const total = ref(0)

const query = reactive({
  keyword: '',
  scenario_id: null,
  level: ''
})

const form = reactive({
  title: '',
  scenario_id: null,
  level: '初级',
  description: '',
  cover_url: ''
})

const rules = {
  title: [{ required: true, message: '请输入技能名称', trigger: 'blur' }],
  scenario_id: [{ required: true, message: '请选择场景', trigger: 'change' }],
  level: [{ required: true, message: '请选择等级', trigger: 'change' }],
  description: [{ required: true, message: '请输入描述', trigger: 'blur' }]
}

function levelType(level) {
  const map = { '初级': 'success', '中级': 'warning', '高级': 'danger' }
  return map[level] || 'info'
}

async function fetchScenariosList() {
  try {
    const res = await getScenarios()
    scenarios.value = res.data || []
  } catch (error) {
    console.error('获取场景失败', error)
  }
}

async function fetchSkills() {
  loading.value = true
  try {
    const params = {
      page: page.value,
      pageSize: pageSize.value,
      ...query
    }
    Object.keys(params).forEach(k => {
      if (!params[k] && params[k] !== 0) delete params[k]
    })
    const res = await getSkills(params)
    skills.value = res.data?.rows || res.data || []
    total.value = res.data?.total || skills.value.length
  } catch (error) {
    ElMessage.error('获取技能列表失败')
  } finally {
    loading.value = false
  }
}

function openDialog(row) {
  if (row) {
    isEdit.value = true
    editId.value = row.id
    form.title = row.title
    form.scenario_id = row.scenario_id
    form.level = row.level
    form.description = row.description
    form.cover_url = row.cover_url || ''
  } else {
    isEdit.value = false
    editId.value = null
    form.title = ''
    form.scenario_id = null
    form.level = '初级'
    form.description = ''
    form.cover_url = ''
  }
  dialogVisible.value = true
}

async function handleSave() {
  if (!formRef.value) return
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  saving.value = true
  try {
    if (isEdit.value) {
      await updateSkill(editId.value, form)
      ElMessage.success('技能更新成功')
    } else {
      await createSkill(form)
      ElMessage.success('技能创建成功')
    }
    dialogVisible.value = false
    fetchSkills()
  } catch (error) {
    ElMessage.error('操作失败')
  } finally {
    saving.value = false
  }
}

async function handleDelete(row) {
  try {
    await ElMessageBox.confirm(`确定删除技能"${row.title}"吗？`, '确认删除', {
      type: 'warning'
    })
    await deleteSkill(row.id)
    ElMessage.success('删除成功')
    fetchSkills()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

onMounted(() => {
  fetchScenariosList()
  fetchSkills()
})
</script>

<style scoped>
.skill-manage {
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
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>