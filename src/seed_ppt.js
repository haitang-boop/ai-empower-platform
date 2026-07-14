const { pool } = require('./config/db');

// 18个技能的基础信息
const skills = [
  { id: 1, name: '文献检索与综述', tools: ['ChatGPT','Semantic Scholar','Elicit','Consensus'] },
  { id: 2, name: '论文写作辅助', tools: ['ChatGPT','Claude','DeepSeek','Grammarly'] },
  { id: 3, name: '数据分析与可视化', tools: ['ChatGPT Code Interpreter','Julius AI','通义千问'] },
  { id: 4, name: 'PPT智能生成', tools: ['Gamma','Beautiful.ai','Tome','通义千问'] },
  { id: 5, name: 'AI绘画与设计', tools: ['Midjourney','Stable Diffusion','DALL-E','文心一格'] },
  { id: 6, name: '代码生成与调试', tools: ['GitHub Copilot','Cursor','ChatGPT','Claude'] },
  { id: 7, name: '外语学习与翻译', tools: ['DeepL','ChatGPT','Claude','豆包'] },
  { id: 8, name: '知识图谱构建', tools: ['Notion AI','Obsidian','ChatGPT','Miro AI'] },
  { id: 9, name: '面试模拟与辅导', tools: ['ChatGPT','Claude','通义千问','Kimi'] },
  { id: 10, name: '短视频脚本创作', tools: ['ChatGPT','剪映AI','Kimi','通义千问'] },
  { id: 11, name: '简历优化与求职', tools: ['ChatGPT','Claude','Kimi','DeepSeek'] },
  { id: 12, name: '思维导图与头脑风暴', tools: ['ChatGPT','Miro AI','Xmind AI','Claude'] },
  { id: 13, name: '数学建模与计算', tools: ['Wolfram Alpha','ChatGPT','Claude','DeepSeek'] },
  { id: 14, name: '时间管理与规划', tools: ['Notion AI','ChatGPT','Claude','Todoist AI'] },
  { id: 15, name: '信息检索与事实核查', tools: ['Perplexity','ChatGPT','Kimi','天工AI'] },
  { id: 16, name: '学术海报与图表制作', tools: ['Canva AI','ChatGPT','通义万相','Adobe Firefly'] },
  { id: 17, name: '项目申报书撰写', tools: ['ChatGPT','Claude','DeepSeek','通义千问'] },
  { id: 18, name: '语音合成与识别', tools: ['剪映AI','讯飞星火','Whisper','ElevenLabs'] },
];

// 10页幻灯片的模板生成器
function generateSlides(skill) {
  const pages = [
    {
      title: `课程概览 — ${skill.name}`,
      type: 'cover',
      html: `<h2>${skill.name}</h2><p>本课程将系统讲解${skill.name}的核心方法和AI辅助技巧，帮助你高效掌握这项能力。</p><p><strong>学习目标：</strong>理解${skill.name}的基本原理，熟练使用推荐AI工具完成实际任务。</p>`
    },
    {
      title: `推荐工具 — ${skill.name}`,
      type: 'tool',
      html: `<h2>推荐AI工具 — ${skill.name}</h2><p>以下是该领域最推荐的AI工具：</p><ul>${skill.tools.map(t => `<li><strong>${t}</strong></li>`).join('')}</ul><p>建议从免费工具开始尝试，根据实际需求选择最适合的工具组合。</p>`
    },
    {
      title: `提示词工程 — ${skill.name}`,
      type: 'prompt',
      html: `<h2>提示词工程</h2><p>掌握提示词技巧是高效使用AI的关键。好的提示词应包含：</p><ul><li><strong>任务目标</strong> — 清晰说明你要完成什么任务</li><li><strong>背景信息</strong> — 提供必要的上下文和约束条件</li><li><strong>输出格式</strong> — 说明期望的结果形式和结构</li><li><strong>质量要求</strong> — 明确内容深度、风格、字数等要求</li></ul><p>提示词模板：<em>"请帮我[任务目标]，背景是[背景信息]，输出格式要求[格式]，质量要求[要求]。"</em></p>`
    },
    {
      title: `准确性查验 — ${skill.name}`,
      type: 'verify',
      html: `<h2>查验准确性</h2><p>AI生成的内容需要经过验证才能使用：</p><ul><li><strong>事实核查</strong> — 关键数据、结论、引用是否准确</li><li><strong>逻辑检查</strong> — 论证过程是否通顺合理</li><li><strong>交叉验证</strong> — 使用多个工具对比结果</li><li><strong>人工审核</strong> — 核心内容务必人工确认</li></ul><p>记住：AI可能出现"幻觉"，编造不存在的信息，务必人工核对关键内容。</p>`
    },
    {
      title: `信息整理 — ${skill.name}`,
      type: 'excel',
      html: `<h2>信息整理与结构化</h2><p>利用AI将信息结构化整理：</p><ul><li><strong>内容提取</strong> — 从文本中提取关键信息</li><li><strong>分类整理</strong> — 按主题/类型/重要性分类</li><li><strong>格式转换</strong> — 生成表格、列表、思维导图等</li><li><strong>汇总输出</strong> — 整合为多维度总结</li></ul><p>提示词示例：<em>"请将以下内容整理为结构化表格，包含关键信息列。"</em></p>`
    },
    {
      title: `参考文献 — ${skill.name}`,
      type: 'ref',
      html: `<h2>参考文献（GB/T 7714国标格式）</h2><p>使用AI生成符合国标格式的参考文献：</p><ul><li><strong>期刊论文</strong> — 作者. 题名[J]. 刊名, 年, 卷(期): 页码.</li><li><strong>图书</strong> — 作者. 书名[M]. 出版地: 出版社, 年.</li><li><strong>学位论文</strong> — 作者. 题名[D]. 保存地点: 保存单位, 年.</li><li><strong>网络资源</strong> — 作者. 题名[EB/OL]. (发布日期)[引用日期]. URL.</li></ul><p>提示词示例：<em>"请将以下文献列表转换为GB/T 7714-2015国标格式。"</em></p>`
    },
    {
      title: `综合应用 — ${skill.name}`,
      type: 'apply',
      html: `<h2>综合应用</h2><p>完整的工作流程：</p><ol><li>明确任务目标和需求范围</li><li>选择合适的AI工具组合</li><li>编写精准提示词获取初稿</li><li>交叉验证关键信息准确性</li><li>结构化整理输出结果</li><li>人工审核修改完善</li></ol><p>通过这个完整流程，你可以高效完成${skill.name}相关工作。</p>`
    },
    {
      title: `避坑指南 — ${skill.name}`,
      type: 'pitfall',
      html: `<h2>避坑指南</h2><p>使用AI进行${skill.name}时的常见问题：</p><ul><li><strong>信息编造</strong> — AI可能生成虚假或不准确的内容</li><li><strong>内容过时</strong> — AI知识有截止日期，最新信息可能缺失</li><li><strong>过度依赖</strong> — 不要让AI替代你的思考和判断</li><li><strong>版权风险</strong> — 使用AI生成内容需遵守相关规范</li><li><strong>隐私泄露</strong> — 不要在公共AI工具中输入敏感信息</li></ul>`
    },
    {
      title: `实战练习 — ${skill.name}`,
      type: 'practice',
      html: `<h2>实战练习</h2><p>完成以下练习巩固所学：</p><ol><li><strong>基础练习</strong> — 使用推荐工具完成一个简单的${skill.name}任务</li><li><strong>进阶练习</strong> — 尝试优化提示词，比较不同提示词的效果差异</li><li><strong>挑战练习</strong> — 综合运用多个工具，完成一个完整的实际项目</li></ol><p>通过完整练习掌握从理论到实践的全过程。</p>`
    },
    {
      title: `课程总结 — ${skill.name}`,
      type: 'summary',
      html: `<h2>${skill.name} — 课程总结</h2><p><strong>核心要点回顾：</strong></p><ul><li>选择合适的AI工具组合效果最佳</li><li>提示词要包含目标、背景、格式、要求四个要素</li><li>AI生成的内容必须经过人工验证和修改</li><li>结构化整理让信息更便于后续使用</li><li>遵守学术规范和使用规范，合理合法使用AI</li></ul><p>系统化的${skill.name}能力结合AI辅助，可以大幅提升你的学习和工作效率！</p>`
    }
  ];

  return pages.map((page, idx) => ({
    skill_id: skill.id,
    title: page.title,
    type: page.type,
    content: JSON.stringify({ html: page.html }),
    tools: JSON.stringify(idx === 1 ? skill.tools : []),
    sort_order: idx
  }));
}

async function seed() {
  const conn = await pool.getConnection();
  try {
    await conn.query('TRUNCATE TABLE ppt_slides');
    console.log('已清空 ppt_slides 表');

    let total = 0;
    for (const skill of skills) {
      const slides = generateSlides(skill);
      for (const slide of slides) {
        await conn.query(
          'INSERT INTO ppt_slides (skill_id, title, type, content, tools, sort_order) VALUES (?, ?, ?, ?, ?, ?)',
          [slide.skill_id, slide.title, slide.type, slide.content, slide.tools, slide.sort_order]
        );
        total++;
      }
      console.log(`技能 ${skill.id} (${skill.name}) - ${slides.length} 页幻灯片已插入`);
    }

    console.log(`\n总计插入 ${total} 张幻灯片`);
  } catch (err) {
    console.error('插入失败:', err);
  } finally {
    conn.release();
    pool.end();
  }
}

seed();
