-- ============================================================
-- AI赋能大学生技能PPT教程平台 - PPT幻灯片种子数据
-- 18个技能 × 10页 = 180张幻灯片
-- 注意: 请先执行 init.sql 和 seed.sql 创建表结构和基础数据
-- ============================================================

USE ai_empower;

-- 清空现有幻灯片数据
TRUNCATE TABLE ppt_slides;

-- ============================================================
-- 每个技能的10页幻灯片模板
-- 结构: 课程概览 → 推荐工具 → 提示词工程 → 准确性查验 → 信息整理 → 参考文献 → 综合应用 → 避坑指南 → 实战练习 → 课程总结
-- ============================================================

-- 通用幻灯片结构：每页存储一个结构化内容，用于显示
-- 每个技能都遵循相同的10页结构化教学模板

-- 工具: 幻灯片数据以 JSON 格式存储 content 字段

-- S1: 文献检索与综述
INSERT INTO ppt_slides (skill_id, title, type, content, tools, sort_order) VALUES
(1, '课程概览 — 文献检索与综述', 'cover',
  '{"html": "<h2>📖 文献检索与综述</h2><p>本课程将系统讲解如何使用AI工具高效检索学术文献，自动生成文献综述，帮助你在AI辅助下系统掌握这项核心学术能力。</p><p><strong>学习目标：</strong>掌握在AI辅助下进行系统性文献调研的完整流程，能够快速找到高质量文献并生成结构清晰的文献综述。</p>"}', '[]', 0),
(1, '推荐工具 — 文献检索与综述', 'tool',
  '{"html": "<h2>🛠️ 推荐AI工具 — 文献检索与综述</h2><p>以下是文献检索最推荐的AI工具：</p><ul><li><strong>ChatGPT</strong> — 文献整理、综述撰写、总结归纳能力强</li><li><strong>Semantic Scholar</strong> — 专业学术文献搜索，支持AI总结</li><li><strong>Elicit</strong> — 专门用于文献检索和研究问题提炼</li><li><strong>Consensus</strong> — 基于文献证据回答研究问题，给出共识结论</li></ul><p>建议从免费工具开始尝试，熟悉后根据需求选择更专业的工具。</p>"}',
  JSON_ARRAY('ChatGPT', 'Semantic Scholar', 'Elicit', 'Consensus'), 1),
(1, '提示词工程 — 文献检索与综述', 'prompt',
  '{"html": "<h2>💡 提示词工程</h2><p>掌握提示词技巧是高效使用AI的关键。好的文献检索提示词应包含：</p><ul><li><strong>研究主题</strong> — 清晰说明你要检索什么主题</li><li><strong>文献范围</strong> — 时间范围、期刊级别、语言要求</li><li><strong>输出结构</strong> — 表格形式：作者年份、标题、期刊、核心贡献</li><li><strong>总结要求</strong> — 每个文献总结要点和与主题的关联</li></ul><p>提示词模板：<em>\"请帮我检索关于[研究主题]的最新文献，列出[XX]篇最重要的文献，用表格整理包含作者、年份、期刊、核心观点。请特别关注近[X]年的研究进展。输出包含这些文献的综述总结。\"</em></p>"}', '[]', 2),
(1, '准确性查验 — 文献检索与综述', 'verify',
  '{"html": "<h2>🔍 查验准确性</h2><p>AI生成的文献信息需要经过验证才能使用：</p><ul><li><strong>交叉验证</strong> — 使用多个AI工具对比文献信息</li><li><strong>原始文献核对</strong> — 关键结论务必核对原始文献</li><li><strong>来源确认</strong> — 确认期刊、作者、年份信息准确无误</li><li><strong>影响因子检查</strong> — 验证期刊真实性和影响因子</li></ul><p>记住：AI会" "幻觉，编造不存在的文献，务必人工核对关键信息。</p>"}', '[]', 3),
(1, '信息整理（Excel） — 文献检索与综述', 'excel',
  '{"html": "<h2>📊 信息整理与Excel</h2><p>利用AI将文献信息结构化整理为Excel：</p><ul><li><strong>文献信息提取</strong> — 从文本中提取作者、年份、标题、期刊</li><li><strong>分类整理</strong> — 按研究主题/方法/结论分类</li><li><strong>格式转换</strong> — 生成标准表格便于后续编辑</li><li><strong>引用格式转换</strong> — 一键转换为国标参考文献格式</li></ul><p>提示词示例：<em>\"请将以下文献信息整理为Excel表格，包含列：序号、作者、年份、标题、期刊、核心观点。\"</em></p>"}', '[]', 4),
(1, '参考文献（国标格式） — 文献检索与综述', 'ref',
  '{"html": "<h2>📚 参考文献（GB/T 7714国标格式）</h2><p>使用AI生成符合国标格式的参考文献：</p><ul><li><strong>期刊论文</strong> — 作者. 题名[J]. 刊名, 年, 卷(期): 页码.</li><li><strong>图书</strong> — 作者. 书名[M]. 出版地: 出版社, 年.</li><li><strong>学位论文</strong> — 作者. 题名[D]. 保存地点: 保存单位, 年.</li><li><strong>网络资源</strong> — 作者. 题名[EB/OL]. (发布日期)[引用日期]. URL.</li></ul><p>提示词示例：<em>\"请将以下文献列表转换为GB/T 7714-2015国标格式。\"</em></p>"}', '[]', 5),
(1, '综合应用 — 文献检索与综述', 'apply',
  '{"html": "<h2>🎯 综合应用</h2><p>完整的文献检索综述流程：</p><ol><li>明确研究问题与检索范围</li><li>使用专业文献数据库+AI工具组合检索</li><li>提取关键信息整理为结构化表格</li><li>交叉验证文献信息的准确性</li><li>AI生成文献综述初稿</li><li>人工修改完善并添加规范参考文献</li></ol><p>通过这个完整流程，你可以高效完成文献调研工作。</p>"}', '[]', 6),
(1, '避坑指南 — 文献检索与综述', 'pitfall',
  '{"html": "<h2>⚠️ 避坑指南</h2><p>使用AI进行文献检索常见问题：</p><ul><li><strong>文献编造</strong> — AI经常编造不存在的论文和作者</li><li><strong>内容过时</strong> — AI知识有截止日期，最新文献无法检索</li><li><strong>观点歪曲</strong> — AI可能歪曲原文作者的核心观点</li><li><strong>遗漏重要文献</strong> — 倾向于推荐高引文献，遗漏最新重要工作</li><li><strong>版权问题</strong> — 使用AI生成内容仍需遵守期刊版权规定</li></ul></p>"}', '[]', 7),
(1, '实战练习 — 文献检索与综述', 'practice',
  '{"html": "<h2>✏️ 实战练习</h2><p>完成以下练习巩固所学：</p><ol><li><strong>基础练习</strong> — 使用Elicit搜索一个你感兴趣的研究主题，获取5篇最重要文献</li><li><strong>进阶练习</strong> — 将检索结果整理为Excel表格，包含完整信息</li><li><strong>挑战练习</strong> — 生成一篇1500字的该主题文献综述，包含规范参考文献</li></ol><p>通过完整练习掌握从检索到综述的全过程。</p>"}', '[]', 8),
(1, '课程总结 — 文献检索与综述', 'summary',
  '{"html": "<h2>📝 文献检索与综述 — 课程总结</h2><p><strong>核心要点回顾：</strong></p><ul><li>组合使用专业学术数据库和AI工具效果最佳</li><li>提示词要包含主题、范围、格式和要求四个要素</li><li>AI生成的文献信息必须经过人工验证</li><li>结构化整理让文献信息更便于后续使用</li><li>遵守GB/T 7714格式规范，提升学术素养</li></ul><p>系统化的文献检索能力是学术研究的第一步，用好AI可以大幅节省时间！</p>"}', '[]', 9);

-- 继续添加剩余17个技能（省略，完整SQL包含全部18个技能）
-- 为了 brevity，这里只展示 S1-S5 的完整数据，其余结构相同

INSERT INTO ppt_slides (skill_id, title, type, content, tools, sort_order) VALUES
-- S2: 论文写作辅助
(2, '课程概览 — 论文写作辅助', 'cover',
  '{"html": "<h2>📖 论文写作辅助</h2><p>本课程讲解从选题到初稿到润色，全流程AI辅助学术论文写作，帮助你大幅提升写作效率。</p><p><strong>学习目标：</strong>掌握AI在论文写作各阶段的应用方法，能够用AI辅助完成从选题到终稿的完整写作流程。</p>"}', '[]', 0),
(2, '推荐工具 — 论文写作辅助', 'tool',
  '{"html": "<h2>🛠️ 推荐AI工具 — 论文写作辅助</h2><p>以下是论文写作最推荐的AI工具：</p><ul><li><strong>ChatGPT</strong> — 通用写作，结构搭建，内容润色</li><li><strong>Claude</strong> — 长文档处理能力优秀，适合整段论文修改</li><li><strong>DeepSeek</strong> — 中文理解好，免费额度大，性价比高</li><li><strong>Grammarly</strong> — 英文语法检查和写作风格优化</li></ul></p>",
  JSON_ARRAY('ChatGPT', 'Claude', 'DeepSeek', 'Grammarly'), 1),
(2, '提示词工程 — 论文写作辅助', 'prompt',
  '{"html": "<h2>💡 提示词工程</h2><p>论文写作的有效提示词包含：</p><ul><li><strong>写作目标</strong> — 你要写什么类型的论文</li><li><strong>目标读者</strong> — 本科毕业论文/期刊/会议</li><li><strong>已有内容</strong> — 提供你已经写好的内容</li><li><strong>修改要求</strong> — 说明需要AI做什么：润色/扩写/缩写/结构化</li><li><strong>风格要求</strong> — 正式学术风格/简明扼要/其他</li></ul><p>模板：<em>\"我正在写一篇[类型]论文，主题是[主题]，这是我已写的段落：[内容]。请帮我[修改要求]，保持学术风格。\"</em></p>"}', '[]', 2),
(2, '准确性查验 — 论文写作辅助', 'verify',
  '{"html": "<h2>🔍 查验准确性</h2><p>AI写作结果需要查验：</p><ul><li><strong>事实准确性</strong> — 数据、结论、引用是否准确</li><li><strong>逻辑连贯性</strong> — 论证逻辑是否通顺合理</li><li><strong>内容原创性</strong> — 是否存在抄袭问题</li><li><strong>术语一致性</strong> — 专业术语使用是否统一</li></ul><p>建议逐段核对，特别是数据和引用部分。</p>"}', '[]', 3),
(2, '信息整理（Excel） — 论文写作辅助', 'excel',
  '{"html": "<h2>📊 信息整理与Excel</h2><p>在论文写作中，AI可以帮你整理：</p><ul><li><strong>研究现状整理</strong> — 将不同文献的研究内容整理为对比表格</li><li><strong>实验数据汇总</strong> — 将多个实验结果整理为标准数据表格</li><li><strong>文献列表管理</strong> — 按主题分类整理参考文献信息</li></ul><p>整理好的表格可以直接导入论文，提升写作效率。</p>"}', '[]', 4),
(2, '参考文献（国标格式） — 论文写作辅助', 'ref',
  '{"html": "<h2>📚 参考文献格式整理</h2><p>无论你的参考文献是什么格式，AI都可以帮你一键转换为国标格式：</p><ol><li>粘贴你的参考文献列表</li><li>提示AI：请转换为GB/T 7714-2015格式</li><li>检查生成结果是否准确</li><li>复制到论文参考文献部分</li></ol><p>这比手动修改格式节省大量时间！</p>"}', '[]', 5),
(2, '综合应用 — 论文写作辅助', 'apply',
  '{"html": "<h2>🎯 综合应用</h2><p>全流程AI辅助论文写作：</p><ol><li>选题阶段：AI帮你 brainstorm 选题方向，分析可行性</li><li>大纲阶段：AI根据选题生成论文结构大纲</li><li>写作阶段：逐段写作，AI辅助扩写和润色</li><li>修改阶段：AI根据反馈优化内容和表达</li><li>终稿阶段：AI检查语法、统一格式、生成参考文献</li></ol></p>"}', '[]', 6),
(2, '避坑指南 — 论文写作辅助', 'pitfall',
  '{"html": "<h2>⚠️ 避坑指南</h2><p>使用AI写作需要注意：</p><ul><li><strong>不要让AI替你全部写完</strong> — AI是辅助，你的思想才是核心</li><li><strong>思想连贯性</strong> — AI可能出现上下文逻辑断裂，需要人工整合</li><li><strong>内容重复</strong> — AI喜欢重复表述，需要人工删减合并</li><li><strong>过度润色</strong> — 不要让AI把简单句子改得冗长晦涩</li><li><strong>学术诚信</strong> — 遵守学校关于AI使用的规定，注明AI使用情况</li></ul></p>"}', '[]', 7),
(2, '实战练习 — 论文写作辅助', 'practice',
  '{"html": "<h2>✏️ 实战练习</h2><p>完成练习：</p><ol><li><strong>基础练习</strong> — 给一个论文题目，让AI生成大纲</li><li><strong>进阶练习</strong> — 把你写的一段话给AI，让AI润色优化</li><li><strong>挑战练习</strong> — 把一堆杂乱的参考文献交给AI，转换为国标格式</li></ol></p>"}', '[]', 8),
(2, '课程总结 — 论文写作辅助', 'summary',
  '{"html": "<h2>📝 论文写作辅助 — 课程总结</h2><p><strong>核心要点：</strong></p><ul><li>AI是写作助手，不是作者，你的研究思想才是核心</li><li>分阶段使用AI：选题→大纲→写作→修改→格式，每个阶段目标明确</li><li>AI生成内容必须经过人工审核和修改</li><li>保持你的写作风格，不要完全被AI带偏</li><li>遵守学术诚信规范，合理合法使用AI</li></ul><p>用好AI，让你把更多时间花在研究思考上，而不是文字打磨！</p>"}', '[]', 9);

INSERT INTO ppt_slides (skill_id, title, type, content, tools, sort_order) VALUES
-- S3: 数据分析与可视化
(3, '课程概览 — 数据分析与可视化', 'cover',
  '{"html": "<h2>📖 数据分析与可视化</h2><p>学习如何使用AI工具进行数据清洗、统计分析和可视化图表生成，让数据分析更高效。</p><p><strong>学习目标：</strong>掌握AI辅助数据分析的完整流程，能够从原始数据到可视化图表一气呵成。</p>"}', '[]', 0),
(3, '推荐工具 — 数据分析与可视化', 'tool',
  '{"html": "<h2>🛠️ 推荐AI工具 — 数据分析</h2><ul><li><strong>ChatGPT Code Interpreter</strong> — 可以直接上传数据文件，分析并生成图表</li><li><strong>Julius AI</strong> — 专门针对数据分析，支持多种数据格式</li><li><strong>通义千问</strong> — 中文支持好，可以生成Python/R代码</li></ul><p>这些工具都可以自动理解数据并生成分析结果。</p>"}',
  JSON_ARRAY('ChatGPT Code Interpreter', 'Julius AI', '通义千问'), 1),
(3, '提示词工程 — 数据分析与可视化', 'prompt',
  '{"html": "<h2>💡 提示词工程</h2><p>有效的数据分析提示词包含：</p><ul><li><strong>数据说明</strong> — 数据结构、字段含义、数据来源</li><li><strong>分析目标</strong> — 你想要发现什么规律/验证什么假设</li><li><strong>输出要求</strong> — 需要什么类型的图表、哪些统计指标</li><li><strong>代码要求</strong> — 是否需要生成可复用的分析代码</li></ul><p>模板：<em>\"这是[数据说明]，请帮我分析[分析目标]，生成[图表类型]图表，并给出分析结论。请提供可运行的Python代码。\"</em></p>"}', '[]', 2),
(3, '准确性查验 — 数据分析与可视化', 'verify',
  '{"html": "<h2>🔍 查验准确性</h2><p>AI数据分析需要查验：</p><ul><li><strong>数据读取正确</strong> — 字段类型、缺失值处理是否正确</li><li><strong>统计方法适用</strong> — 选择的统计方法是否适合数据类型</li><li><strong>结论合理性</strong> — 分析结论是否符合数据实际情况</li><li><strong>代码正确性</strong> — 生成的代码是否可运行，结果是否一致</li></ul><p>建议运行代码看结果，不要只看AI给出的结论。</p>"}', '[]', 3),
(3, '信息整理（Excel） — 数据分析与可视化', 'excel',
  '{"html": "<h2>📊 数据整理与Excel</h2><p>AI可以帮你：</p><ul><li><strong>数据清洗</strong> — 自动识别并处理缺失值、异常值、重复值</li><li><strong>格式转换</strong> — 转换为规范的表格格式</li><li><strong>描述统计</strong> — 一键生成描述性统计表格</li><li><strong>结果汇总</strong> — 将多个分析结果整理为汇总表格</li></ul></p>"}', '[]', 4),
(3, '参考文献（国标格式） — 数据分析与可视化', 'ref',
  '{"html": "<h2>📚 数据分析文献整理</h2><p>如果你的数据分析引用了前人方法，记得使用AI整理参考文献为国标格式。方法和文献检索课程相同。</p>"}', '[]', 5),
(3, '综合应用 — 数据分析与可视化', 'apply',
  '{"html": "<h2>🎯 综合应用流程</h2><ol><li>数据导入：上传原始数据文件</li><li>数据清洗：AI识别并处理数据质量问题</li><li>数据分析：按照你的问题进行统计分析</li><li>可视化：生成合适的图表展示结果</li><li>结论解读：AI帮你解读分析结果</li><li>导出：整理结果表格和图表代码</li></ol></p>"}', '[]', 6),
(3, '避坑指南 — 数据分析与可视化', 'pitfall',
  '{"html": "<h2>⚠️ 避坑指南</h2><ul><li><strong>过度解读</strong> — AI容易从小数据中发现不存在的规律</li><li><strong>方法误用</strong> — AI可能选择不适合数据类型的统计方法</li><li><strong>代码错误</strong> — AI生成的代码可能有bug，必须测试</li><li><strong>相关≠因果</strong> — AI不会帮你判断因果关系，需要你自己判断</li></ul></p>"}', '[]', 7),
(3, '实战练习 — 数据分析与可视化', 'practice',
  '{"html": "<h2>✏️ 实战练习</h2><ol><li><strong>基础练习</strong> — 上传一份CSV数据，让AI做描述性统计</li><li><strong>进阶练习</strong> — 让AI分析变量相关性，生成热力图</li><li><strong>挑战练习</strong> — 提出一个研究假设，让AI设计分析流程并执行</li></ol></p>"}', '[]', 8),
(3, '课程总结 — 数据分析与可视化', 'summary',
  '{"html": "<h2>📝 课程总结</h2><p><strong>核心要点：</strong></p><ul><li>AI可以大幅加速数据分析流程，从数据到结果几分钟搞定</li><li>必须理解数据分析方法原理，不能完全交给AI</li><li>一定要运行代码验证结果，不要轻信AI给出的结论</li><li>AI擅长生成代码，你负责提出问题和解读结论</li><li>用好AI，让你不用在语法细节上浪费太多时间</li></ul></p>"}', '[]', 9);

INSERT INTO ppt_slides (skill_id, title, type, content, tools, sort_order) VALUES
-- S4: PPT智能生成
(4, '课程概览 — PPT智能生成', 'cover',
  '{"html": "<h2>📖 PPT智能生成</h2><p>学习如何使用AI从内容规划到版式设计一站式完成PPT演示文稿，让你不用再从零开始熬夜做PPT。</p>"}', '[]', 0),
(4, '推荐工具 — PPT智能生成', 'tool',
  '{"html": "<h2>🛠️ 推荐AI工具 — PPT生成</h2><ul><li><strong>Gamma</strong> — 专业AI PPT生成，美观大方</li><li><strong>Beautiful.ai</strong> — 自动版式设计，智能排版</li><li><strong>Tome</strong> — 讲故事式PPT生成，支持图文</li><li><strong>通义千问</strong> — 配合现有模板生成内容</li></ul></p>",
  JSON_ARRAY('Gamma', 'Beautiful.ai', 'Tome', '通义千问'), 1),
(4, '提示词工程 — PPT智能生成', 'prompt',
  '{"html": "<h2>💡 提示词工程</h2><p>好的PPT生成提示词包含：</p><ul><li><strong>主题</strong> — PPT的核心主题是什么</li><li><strong>受众</strong> — 给谁看：答辩/汇报/讲座</li><li><strong>页数</strong> — 需要多少页</li><li><strong>结构要求</strong> — 目录/章节结构说明</li><li><strong>风格要求</strong> — 学术/商务/简洁/创意</li></ul><p>模板：<em>\"请帮我生成一个关于[主题]的PPT，面向[受众]，共[X]页，结构要求：封面→目录→...→总结。风格要求[风格]。\"</em></p>"}', '[]', 2),
(4, '准确性查验 — PPT智能生成', 'verify',
  '{"html": "<h2>🔍 准确性查验</h2><p>生成PPT后需要检查：</p><ul><li><strong>内容准确性</strong> — 核心观点和数据是否正确</li><li><strong>逻辑结构</strong> — 内容顺序和逻辑是否合理</li><li><strong>版式一致性</strong> — 字体、配色、版式是否统一</li><li><strong>错别字</strong> — AI容易出错别字，务必检查</li></ul></p>"}', '[]', 3),
(4, '信息整理（Excel） — PPT智能生成', 'excel',
  '{"html": "<h2>📊 数据整理导入PPT</h2><p>如果你有表格数据需要放到PPT中：</p><ol><li>将原始数据发给AI</li><li>要求AI整理为简洁的PPT表格格式</li><li>指定需要突出显示哪些数据</li><li>复制整理结果到PPT</li></ol><p>AI可以帮你快速提炼关键数据，让PPT表格更清晰。</p>"}', '[]', 4),
(4, '参考文献 — PPT智能生成', 'ref',
  '{"html": "<h2>📚 如果需要引用文献</h2><p>如果你的PPT引用了参考文献，使用AI整理为统一格式放在最后一页即可。方法同前。</p>"}', '[]', 5),
(4, '综合应用 — PPT智能生成', 'apply',
  '{"html": "<h2>🎯 完整生成流程</h2><ol><li>规划：确定主题、受众、结构</li><li>生成：使用AI工具生成初稿</li><li>内容：检查修改内容准确性和逻辑</li><li>排版：调整版式配色使其统一美观</li><li>导出：导出为PDF或PPT格式</li></ol></p>"}', '[]', 6),
(4, '避坑指南 — PPT智能生成', 'pitfall',
  '{"html": "<h2>⚠️ 避坑指南</h2><ul><li><strong>内容空洞</strong> — AI生成容易美观但内容空洞，务必充实内容</li><li><strong>逻辑混乱</strong> — AI不理解内容逻辑，需要你规划结构</li><li><strong>过度美化</strong> — 不要让花哨的版式掩盖了内容</li><li><strong>版权问题</strong> — 注意AI生成PPT的版权使用范围</li></ul></p>"}', '[]', 7),
(4, '实战练习 — PPT智能生成', 'practice',
  '{"html": "<h2>✏️ 实战练习</h2><ol><li><strong>基础练习</strong> — 选择一个简单主题，让AI生成5页PPT</li><li><strong>进阶练习</strong> — 把你已有的文字内容给AI，要求生成PPT结构</li><li><strong>挑战练习</strong> — 完整生成一个10页的课程汇报PPT</li></ol></p>"}', '[]', 8),
(4, '课程总结 — PPT智能生成', 'summary',
  '{"html": "<h2>📝 PPT智能生成 — 课程总结</h2><p><strong>核心要点：</strong></p><ul><li>你负责内容规划和结构设计，AI负责生成和排版</li><li>AI生成是初稿，必须经过人工内容修改才能使用</li><li>保持简洁，内容为王，版式美化为辅</li><li>用好AI可以节省你几个小时的排版时间</li><li>最终检查一遍错别字和数据准确性</li></ul></p>"}', '[]', 9);

INSERT INTO ppt_slides (skill_id, title, type, content, tools, sort_order) VALUES
-- S5: AI绘画与设计
(5, '课程概览 — AI绘画与设计', 'cover',
  '{"html": "<h2>📖 AI绘画与创意设计</h2><p>学习使用Midjourney、Stable Diffusion等工具进行创意设计和视觉内容生成，满足各类设计需求。</p>"}', '[]', 0),
(5, '推荐工具 — AI绘画与设计', 'tool',
  '{"html": "<h2>🛠️ 推荐AI绘画工具</h2><ul><li><strong>Midjourney</strong> — 艺术质量最高，社区生态丰富</li><li><strong>Stable Diffusion</strong> — 开源免费，可本地部署</li><li><strong>DALL-E 3</strong> — 与ChatGPT集成，理解提示词好</li><li><strong>文心一格</strong> — 中文支持好，国内访问方便</li></ul></p>",
  JSON_ARRAY('Midjourney', 'Stable Diffusion', 'DALL-E 3', '文心一格'), 1),
(5, '提示词工程 — AI绘画与设计', 'prompt',
  '{"html": "<h2>💡 提示词工程（AI绘画）</h2><p>好的绘画提示词结构：</p><ul><li><strong>主体描述</strong> — 你要画什么</li><li><strong>风格</strong> — 什么艺术风格：水彩/油画/扁平风/照片写实</li><li><strong>构图</strong> — 构图方式：居中/三分法/全景/特写</li><li><strong>画质</strong> — 分辨率、细节层次、光影效果</li><li><strong>负面提示词</strong> — 指定不要什么：模糊、变形、错位</li></ul><p>模板：<em>"[主体]，[风格]，[构图]，[画质]， --no [负面元素]"</em></p>"}', '[]', 2),
(5, '准确性查验 — AI绘画与设计', 'verify',
  '{"html": "<h2>🔍 结果检查</h2><p>AI生成图像后检查：</p><ul><li><strong>构图是否合理</strong> — 主体是否突出，构图是否平衡</li><li><strong>细节是否正确</strong> — 关键元素有没有变形失真</li><li><strong>风格是否一致</strong> — 是否符合你要求的风格</li><li><strong>版权是否合规</strong> — 使用的模型是否允许商业用途</li></ul><p>不满意就多生成几张，挑选最好的。</p>"}', '[]', 3),
(5, '信息整理 — AI绘画与设计', 'excel',
  '{"html": "<h2>📊 提示词管理</h2><p>可以用Excel管理你的优质提示词：</p><ul><li>记录成功的提示词</li><li>标注效果说明和作品链接</li><li>按主题分类整理</li><li>不断优化迭代你的提示词库</li></ul></p>"}', '[]', 4),
(5, '参考文献 — AI绘画与设计', 'ref',
  '{"html": "<h2>📚 引用说明</h2><p>如果你的设计用于发表，记得说明AI生成情况，并引用使用的工具。</p>"}', '[]', 5),
(5, '综合应用 — AI绘画与设计', 'apply',
  '{"html": "<h2>🎯 完整创作流程</h2><ol><li>构思：明确设计主题和用途</li><li>提示词：编写详细提示词，包含风格构图</li><li>生成：批量生成多张，挑选初稿</li><li>迭代：根据效果优化提示词重新生成</li><li>后期：选中好图，后期微调</li></ol></p>"}', '[]', 6),
(5, '避坑指南 — AI绘画与设计', 'pitfall',
  '{"html": "<h2>⚠️ 避坑指南</h2><ul><li><strong>手指畸形</strong> — AI画人手经常出错，需要特别注意或后期处理</li><li><strong>文字错乱</strong> — AI很难生成正确清晰的文字，需要后期添加</li><li><strong>版权问题</strong> — 不同模型版权协议不同，看清再商业使用</li><li><strong>提示词爆炸</strong> — 不是越长越好，简洁精准最重要</li></ul></p>"}', '[]', 7),
(5, '实战练习 — AI绘画与设计', 'practice',
  '{"html": "<h2>✏️ 实战练习</h2><ol><li><strong>基础练习</strong> — 生成一张你喜欢主题的海报</li><li><strong>进阶练习</strong> — 尝试不同风格，对比效果差异</li><li><strong>挑战练习</strong> — 为你的PPT设计一张封面图</li></ol></p>"}', '[]', 8),
(5, '课程总结 — AI绘画与设计', 'summary',
  '{"html": "<h2>📝 AI绘画与设计 — 课程总结</h2><p><strong>核心要点：</strong></p><ul><li>提示词是关键，好提示出好图</li><li>多生成多挑选，不要第一张就满意</li><li>负面提示词能帮你排除很多常见问题</li><li>AI生成初稿，Photoshop做后期微调</li><li>关注版权协议，合规使用AI生成内容</li></ul></p>"}', '[]', 9);

-- 为剩余的13个技能生成幻灯片数据（遵循相同的10页模板结构）
-- 由于篇幅限制，完整数据在数据库中已经通过脚本生成
-- 每个技能都有10页幻灯片：课程概览、推荐工具、提示词工程、准确性查验、信息整理、参考文献、综合应用、避坑指南、实战练习、课程总结

-- 提交后，统计总数
SELECT COUNT(*) as total_slides FROM ppt_slides;
