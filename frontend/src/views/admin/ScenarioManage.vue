<template>
  <div class="scenario-manage">
    <div class="page-header">
      <h3>场景管理</h3>
      <el-button type="primary" @click="openDialog(null)">
        <el-icon><Plus /></el-icon> 新增场景
      </el-button>
    </div>

    <el-card class="card-shadow">
      <el-table :data="scenarios" v-loading="loading" stripe border>
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="name" label="场景名称" />
        <el-table-column prop="description" label="描述" show-overflow-tooltip />
        <el-table-column prop="icon" label="图标" width="80" />
        <el-table-column prop="skill_count" label="技能数" width="80" />
        <el-table-column prop="created_at" label="创建时间" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" link @click="openDialog(row)">编辑</el-button>
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
          @current-change="fetchScenarios"
        />
      </div>
    </el-card>

    <!-- 编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑场景' : '新增场景'"
      width="500px"
    >
      <el-form :model="form" :rules="rules" ref="formRef" label-width="80px">
        <el-form-item label="场景名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入场景名称" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="请输入场景描述"
          />
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-input v-model="form.icon" placeholder="请输入Element图标名称" />
        </el-form-item>
        <el-form-item label="标签" prop="tags">
          <el-input v-model="tagsInput" placeholder="多个标签用逗号分隔" />
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
import { getScenarios, createScenario, updateScenario, deleteScenario } from '@/api/scenarios'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

const scenarios = ref([])
const loading = ref(false)
const saving = ref(false)
const dialogVisible = ref(false)
const isEdit = ref(false)
const editId = ref(null)
const formRef = ref(null)
const tagsInput = ref('')
const page = ref(1)
const pageSize = ref(20)
const total = ref(0)

const form = reactive({
  name: '',
  description: '',
  icon: '',
  tags: ''
})

const rules = {
  name: [{ required: true, message: '请输入场景名称', trigger: 'blur' }],
  description: [{ required: true, message: '请输入场景描述', trigger: 'blur' }]
}

async function fetchScenarios() {
  loading.value = true
  try {
    const res = await getScenarios({ page: page.value, pageSize: pageSize.value })
    scenarios.value = res.data?.rows || res.data || []
    total.value = res.data?.total || scenarios.value.length
  } catch (error) {
    ElMessage.error('获取场景列表失败')
  } finally {
    loading.value = false
  }
}

function openDialog(row) {
  if (row) {
    isEdit.value = true
    editId.value = row.id
    form.name = row.name
    form.description = row.description
    form.icon = row.icon || ''
    tagsInput.value = Array.isArray(row.tags) ? row.tags.join(',') : (typeof row.tags === 'string' ? row.tags : '')
  } else {
    isEdit.value = false
    editId.value = null
    form.name = ''
    form.description = ''
    form.icon = ''
    tagsInput.value = ''
  }
  dialogVisible.value = true
}

async function handleSave() {
  if (!formRef.value) return
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  saving.value = true
  const data = {
    ...form,
    tags: tagsInput.value.split(',').map(t => t.trim()).filter(Boolean)
  }
  try {
    if (isEdit.value) {
      await updateScenario(editId.value, data)
      ElMessage.success('场景更新成功')
    } else {
      await createScenario(data)
      ElMessage.success('场景创建成功')
    }
    dialogVisible.value = false
    fetchScenarios()
  } catch (error) {
    ElMessage.error('操作失败')
  } finally {
    saving.value = false
  }
}

async function handleDelete(row) {
  try {
    await ElMessageBox.confirm(`确定删除场景"${row.name}"吗？`, '确认删除', {
      type: 'warning'
    })
    await deleteScenario(row.id)
    ElMessage.success('删除成功')
    fetchScenarios()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

onMounted(() => {
  fetchScenarios()
})
</script>

<style scoped>
.scenario-manage {
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