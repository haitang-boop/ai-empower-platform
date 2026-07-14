<template>
  <div class="home">
    <!-- 总体概述区域 -->
    <section class="overview-section">
      <div class="page-container">
        <div class="overview-header">
          <el-icon :size="40" color="#F5B800"><Monitor /></el-icon>
          <h1 class="overview-title">AI赋能大学生技能学习指南</h1>
          <p class="overview-subtitle">理解AI、善用AI、驾驭AI —— 在智能时代成就更好的自己</p>
        </div>
        <el-row :gutter="24" class="overview-cards">
          <el-col :xs="24" :sm="12" :lg="6">
            <div class="overview-card card-blue">
              <div class="ov-icon">🚀</div>
              <h3>AI发展历程</h3>
              <p>从早期的专家系统到深度学习，再到如今的生成式AI大模型，人工智能技术正在以指数级速度发展。ChatGPT、Claude等大语言模型的出现，标志着AI已从"专用工具"迈向"通用智能助手"的新阶段。</p>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :lg="6">
            <div class="overview-card card-cyan">
              <div class="ov-icon">⚖️</div>
              <h3>学术诚信规范</h3>
              <p>AI是辅助学习的工具，不是替代思考的手段。使用AI时须遵守：①不直接提交AI生成的内容作为原创作业；②对AI输出的事实信息进行交叉验证；③在学术作品中明确标注AI辅助的范围与方式。</p>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :lg="6">
            <div class="overview-card card-teal">
              <div class="ov-icon">🛡️</div>
              <h3>信息核实原则</h3>
              <p>大语言模型可能出现"幻觉"现象（生成看似合理但实际错误的信息）。关键数据、文献引用、专业结论必须通过权威数据库、原始文献或官方网站进行二次验证，确保信息准确可靠。</p>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :lg="6">
            <div class="overview-card card-amber">
              <div class="ov-icon">💡</div>
              <h3>合理使用策略</h3>
              <p>高效使用AI的关键在于"精准提问"。学会运用提示词工程（Prompt Engineering），将复杂任务拆解为清晰步骤，充分发挥AI在信息整理、思路启发、格式规范等方面的辅助价值。</p>
            </div>
          </el-col>
        </el-row>
        <div class="overview-banner">
          <div class="ob-left">
            <h2>平台能力框架</h2>
            <p>本课程涵盖<strong>10大学习场景</strong>、<strong>18项核心技能</strong>，每个技能均配备完整的PPT教程。从学术科研到程序开发，从竞赛双创到求职面试，全方位提升你的AI应用能力。</p>
            <div class="ob-tags">
              <el-tag type="primary" effect="dark">文献检索</el-tag>
              <el-tag type="success" effect="dark">论文写作</el-tag>
              <el-tag type="warning" effect="dark">数据分析</el-tag>
              <el-tag type="danger" effect="dark">PPT生成</el-tag>
              <el-tag type="info" effect="dark">代码辅助</el-tag>
              <el-tag type="primary" effect="dark">面试模拟</el-tag>
            </div>
          </div>
          <div class="ob-right">
            <div class="stats-mini">
              <div class="sm-item">
                <span class="sm-num">10</span>
                <span class="sm-label">学习场景</span>
              </div>
              <div class="sm-item">
                <span class="sm-num">18</span>
                <span class="sm-label">核心技能</span>
              </div>
              <div class="sm-item">
                <span class="sm-num">180</span>
                <span class="sm-label">PPT页数</span>
              </div>
              <div class="sm-item">
                <span class="sm-num">∞</span>
                <span class="sm-label">成长可能</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { Monitor } from '@element-plus/icons-vue'
</script>

<style scoped>
/* 总体概述区域 */
.overview-section {
  background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
  padding: 50px 0 30px;
}

.overview-header {
  text-align: center;
  margin-bottom: 40px;
}

.overview-title {
  font-size: 32px;
  font-weight: bold;
  color: #003D7A;
  margin: 12px 0 8px;
}

.overview-subtitle {
  font-size: 16px;
  color: #666;
}

.overview-cards {
  margin-bottom: 40px;
}

.overview-card {
  background: #fff;
  border-radius: 12px;
  padding: 24px 20px;
  height: 100%;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  border-top: 4px solid transparent;
  transition: all 0.3s ease;
}

.overview-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
}

.overview-card.card-blue { border-top-color: #003D7A; }
.overview-card.card-cyan { border-top-color: #00B4D8; }
.overview-card.card-teal { border-top-color: #009688; }
.overview-card.card-amber { border-top-color: #F59E0B; }

.overview-card h3 {
  font-size: 18px;
  font-weight: bold;
  color: #003D7A;
  margin: 12px 0 10px;
}

.overview-card p {
  font-size: 13px;
  color: #555;
  line-height: 1.7;
}

.ov-icon {
  font-size: 32px;
  line-height: 1;
}

/* 平台能力框架横幅 */
.overview-banner {
  background: linear-gradient(135deg, #003D7A 0%, #1a5a96 100%);
  border-radius: 16px;
  padding: 40px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 40px;
  position: relative;
  overflow: hidden;
}

.overview-banner::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 80% 50%, rgba(245, 184, 0, 0.12), transparent 50%);
}

.ob-left {
  flex: 1;
  position: relative;
  z-index: 1;
}

.ob-left h2 {
  font-size: 24px;
  margin-bottom: 12px;
  font-weight: bold;
}

.ob-left p {
  font-size: 14px;
  opacity: 0.9;
  line-height: 1.7;
  margin-bottom: 16px;
}

.ob-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.ob-right {
  position: relative;
  z-index: 1;
}

.stats-mini {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  min-width: 200px;
}

.sm-item {
  text-align: center;
  background: rgba(255,255,255,0.12);
  border-radius: 10px;
  padding: 14px 10px;
  backdrop-filter: blur(4px);
}

.sm-num {
  display: block;
  font-size: 28px;
  font-weight: bold;
  color: #F5B800;
  line-height: 1;
}

.sm-label {
  display: block;
  font-size: 12px;
  opacity: 0.8;
  margin-top: 4px;
}

@media (max-width: 768px) {
  .overview-banner {
    flex-direction: column;
    padding: 24px;
  }
  .overview-title {
    font-size: 24px;
  }
  .stats-mini {
    min-width: auto;
    width: 100%;
  }
}
</style>
