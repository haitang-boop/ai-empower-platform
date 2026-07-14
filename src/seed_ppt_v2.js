const { pool } = require('./config/db');

// 每个技能的10页定制化内容
// 页面类型: cover/tool/method/prompt/case/verify/advanced/pitfall/practice/summary
const skillSlides = {
  1: { name: '文献检索与综述', tools: ['ChatGPT','Semantic Scholar','Elicit','Consensus'],
    pages: [
      { title: '课程概览 — 文献检索与综述', type: 'cover',
        html: '<h2>文献检索与综述</h2><p>本课程系统讲解如何利用AI工具高效检索学术文献、自动生成文献综述，帮助你掌握系统性文献调研方法。</p><p><strong>学习目标：</strong>能够独立完成从选题检索到综述撰写的全流程，快速定位高质量文献并提炼核心观点。</p>' },
      { title: '推荐工具 — 文献检索', type: 'tool',
        html: '<h2>文献检索推荐AI工具</h2><ul><li><strong>ChatGPT</strong> — 文献整理、综述框架搭建、核心观点提炼</li><li><strong>Semantic Scholar</strong> — 专业学术搜索，提供AI生成的论文摘要</li><li><strong>Elicit</strong> — 针对研究问题的文献智能检索与归纳</li><li><strong>Consensus</strong> — 基于文献证据回答科学问题，给出研究共识</li></ul><p>组合使用效果更佳：先用专业数据库检索，再用AI辅助整理分析。</p>' },
      { title: '检索策略与数据库选择', type: 'method',
        html: '<h2>检索策略设计</h2><p><strong>核心数据库：</strong></p><ul><li>中文：知网、万方、维普</li><li>英文：Web of Science、Scopus、PubMed、IEEE Xplore</li><li>预印本：arXiv、bioRxiv</li></ul><p><strong>检索技巧：</strong></p><ol><li>关键词组合：主题词 + 同义词 + 上位/下位词</li><li>布尔逻辑：AND缩小范围、OR扩大范围、NOT排除干扰</li><li>引文追踪：顺查（被引用）+ 逆查（参考文献）</li></ol>' },
      { title: '提示词工程 — 文献检索', type: 'prompt',
        html: '<h2>文献检索提示词模板</h2><p><strong>模板一：主题检索</strong></p><p><em>"请帮我检索关于[具体主题]的最新研究文献，要求：①近5年发表；②核心期刊/顶会；③列出作者、年份、期刊、核心贡献；④按研究方法分类整理。"</em></p><p><strong>模板二：综述生成</strong></p><p><em>"基于以下文献列表，请撰写一段800字的文献综述，要求：①按时间线梳理研究进展；②指出研究空白；③提出未来方向。"</em></p><p><strong>模板三：对比分析</strong></p><p><em>"请对比以下两篇文献的研究方法、实验设计和结论差异，用表格呈现。"</em></p>' },
      { title: '文献管理与笔记整理', type: 'case',
        html: '<h2>文献管理工具链</h2><p><strong>Zotero + AI 工作流：</strong></p><ol><li>浏览器插件一键保存文献到Zotero</li><li>AI生成每篇文献的「三句话摘要」</li><li>按研究主题建立分类文件夹</li><li>导出格式化参考文献列表</li></ol><p><strong>AI辅助笔记模板：</strong></p><ul><li>研究问题：本文解决什么问题？</li><li>方法创新：核心方法/技术路线</li><li>实验结论：关键数据与结论</li><li>个人评价：与你研究的关联度</li></ul>' },
      { title: '综述撰写方法论', type: 'advanced',
        html: '<h2>综述撰写的AI辅助策略</h2><p><strong>结构化框架：</strong></p><ol><li><strong>引言段</strong> — AI辅助：研究背景、问题定义、综述范围</li><li><strong>主体段</strong> — AI辅助：按主题/时间/方法分类梳理</li><li><strong>对比段</strong> — AI辅助：方法优劣对比表格</li><li><strong>展望段</strong> — AI辅助：研究趋势、开放问题</li></ol><p><strong>质量控制：</strong></p><ul><li>每段AI生成后人工核实关键文献</li><li>确保引用文献在数据库中真实存在</li><li>综述观点需有文献支撑，避免AI编造</li></ul>' },
      { title: '准确性查验 — 文献真伪', type: 'verify',
        html: '<h2>文献信息核查清单</h2><p><strong>必查项：</strong></p><ul><li><strong>文献真实性</strong> — 在Google Scholar/知网核实论文是否存在</li><li><strong>作者信息</strong> — 核对作者单位、发表年份</li><li><strong>期刊级别</strong> — 查询影响因子、中科院分区</li><li><strong>引用准确性</strong> — 核对原文表述是否与引用一致</li></ul><p><strong>AI常见错误：</strong></p><ul><li>编造不存在的论文（幻觉文献）</li><li>张冠李戴（把A的结论归到B身上）</li><li>年份错误（尤其是最新文献）</li></ul><p>核心原则：AI负责整理，你负责核实！</p>' },
      { title: '避坑指南 — 文献检索', type: 'pitfall',
        html: '<h2>文献检索常见陷阱</h2><ul><li><strong>过度依赖AI检索</strong> — AI知识有截止日期，最新文献需手动检索</li><li><strong>忽略灰色文献</strong> — 学位论文、技术报告、会议摘要也有价值</li><li><strong>检索词太窄</strong> — 导致遗漏相关研究，应使用同义词扩展</li><li><strong>只看高被引</strong> — 新发表的重要工作可能引用数还很低</li><li><strong>综述变成罗列</strong> — 缺乏批判性分析，只是堆砌文献</li><li><strong>引用二手文献</strong> — 尽量引用原始文献，避免转引</li></ul>' },
      { title: '实战练习 — 文献检索', type: 'practice',
        html: '<h2>实战练习</h2><p><strong>基础练习：</strong></p><p>选择一个你感兴趣的研究主题，使用Semantic Scholar检索10篇相关文献，用AI生成每篇的「三句话摘要」。</p><p><strong>进阶练习：</strong></p><p>基于上述10篇文献，让AI生成一段500字的主题综述，然后你逐条核实每句话是否有文献支撑。</p><p><strong>挑战练习：</strong></p><p>完成一篇完整的1500字文献综述，包含：引言→主题分类梳理→方法对比→研究展望。使用Zotero管理参考文献并导出国标格式。</p>' },
      { title: '课程总结 — 文献检索', type: 'summary',
        html: '<h2>文献检索与综述 — 核心要点</h2><ul><li><strong>工具组合</strong>：专业数据库 + AI辅助整理，效果最佳</li><li><strong>检索策略</strong>：关键词组合 + 布尔逻辑 + 引文追踪</li><li><strong>提示词设计</strong>：明确主题、时间范围、输出格式、分类要求</li><li><strong>质量底线</strong>：AI生成的文献信息必须人工核实真伪</li><li><strong>综述写作</strong>：结构化框架 + 批判性分析 + 规范引用</li></ul><p>文献检索是学术研究的第一步，用好AI可以大幅提高效率，但学术严谨性永远需要你亲自把关！</p>' }
    ]
  },

  2: { name: '论文写作辅助', tools: ['ChatGPT','Claude','DeepSeek','Grammarly'],
    pages: [
      { title: '课程概览 — 论文写作辅助', type: 'cover',
        html: '<h2>论文写作辅助</h2><p>从选题构思、大纲搭建、段落扩写到语言润色，全流程AI辅助学术论文写作，让写作效率翻倍。</p><p><strong>学习目标：</strong>掌握AI在论文各阶段的最佳应用方式，能够独立完成从大纲到终稿的高质量学术写作。</p>' },
      { title: '推荐工具 — 论文写作', type: 'tool',
        html: '<h2>论文写作推荐AI工具</h2><ul><li><strong>ChatGPT</strong> — 大纲生成、段落扩写、逻辑梳理通用性强</li><li><strong>Claude</strong> — 长文本处理能力优秀，适合整章修改</li><li><strong>DeepSeek</strong> — 中文理解深入，免费额度充足</li><li><strong>Grammarly</strong> — 英文语法检查、学术风格优化首选</li></ul><p><strong>搭配建议：</strong>中文论文用DeepSeek/ChatGPT，英文论文用Claude+Grammarly。</p>' },
      { title: '选题与大纲生成', type: 'method',
        html: '<h2>AI辅助选题与大纲</h2><p><strong>选题提示词模板：</strong></p><p><em>"我是[专业]专业的[年级]学生，想写一篇关于[大方向]的论文，请帮我 brainstorm 5个具体选题，要求：①有研究价值；②数据/资料可获取；③适合我的学术水平。每个选题附100字可行性说明。"</em></p><p><strong>大纲生成模板：</strong></p><p><em>"请为选题[具体题目]生成一份详细的论文大纲，要求：①符合学术论文规范；②包含引言、文献综述、方法、实验、结论；③每章列出3-5个小节；④标注每部分建议字数。"</em></p>' },
      { title: '段落扩写与内容生成', type: 'prompt',
        html: '<h2>段落扩写技巧</h2><p><strong>扩写提示词模板：</strong></p><p><em>"请将以下论点扩写成300字的学术段落，要求：①增加理论支撑；②补充具体例子；③保持学术风格；④逻辑清晰层层递进。论点：[你的论点]"</em></p><p><strong>内容生成策略：</strong></p><ul><li>先写核心观点，再让AI扩写支撑论据</li><li>提供参考文献列表，让AI基于文献生成综述段落</li><li>分多次生成，每次聚焦一个子论点</li><li>AI生成后人工精简，避免冗长</li></ul>' },
      { title: '学术润色与降重', type: 'case',
        html: '<h2>AI学术润色与降重技巧</h2><p><strong>润色提示词：</strong></p><p><em>"请润色以下段落，要求：①提升学术性和专业性；②优化句式结构；③统一术语使用；④保持原意不变。段落：[内容]"</em></p><p><strong>降重策略：</strong></p><ul><li>同义词替换：AI提供多种表述方式</li><li>句式重组：主动被动互换、长短句调整</li><li>逻辑重组：调整论证顺序</li><li>增加原创分析：在引用后加入自己的解读</li></ul><p><strong>注意：</strong>降重后务必通读，确保学术逻辑完整！</p>' },
      { title: '英文写作与语法检查', type: 'advanced',
        html: '<h2>英文论文写作优化</h2><p><strong>Grammarly深度使用：</strong></p><ul><li>Goals设置：选择 Academic + Formal + 目标期刊领域</li><li>逐句检查：不要一键接受所有修改</li><li>Clarity优化：简化冗长表达</li><li>Consistency检查：统一术语和缩写</li></ul><p><strong>AI辅助翻译润色：</strong></p><p><em>"请将以下中文内容翻译为学术英文，要求：①符合IEEE/SCI写作规范；②使用被动语态；③避免中式英语；④术语准确。"</em></p>' },
      { title: '查重应对与学术规范', type: 'verify',
        html: '<h2>学术规范与原创性保障</h2><p><strong>查重原理：</strong></p><ul><li>连续13字重复即标红（知网规则）</li><li>引用格式正确可降低重复率</li><li>表格、公式、参考文献不计入重复</li></ul><p><strong>合法降重方法：</strong></p><ul><li>理解后用自己的语言重新表述</li><li>增加原创分析、实验数据、图表</li><li>合理引用并规范标注</li><li>使用AI辅助改写，但需人工审核</li></ul><p><strong>红线警告：</strong>不要直接复制AI生成内容而不加修改，也不要让AI替你写核心创新点！</p>' },
      { title: '避坑指南 — 论文写作', type: 'pitfall',
        html: '<h2>论文写作常见陷阱</h2><ul><li><strong>AI代写核心内容</strong> — 创新点、实验设计、核心结论必须你自己写</li><li><strong>上下文不连贯</strong> — 逐段用AI生成容易导致逻辑断裂</li><li><strong>术语不统一</strong> — AI可能前后使用不同术语表达同一概念</li><li><strong>参考文献编造</strong> — AI会生成看似真实实则虚构的文献</li><li><strong>风格不一致</strong> — 不同AI生成的段落风格可能差异很大</li><li><strong>过度学术化</strong> — AI倾向于复杂句式，有时简洁更好</li></ul>' },
      { title: '实战练习 — 论文写作', type: 'practice',
        html: '<h2>实战练习</h2><p><strong>基础练习：</strong></p><p>给一个论文题目，用AI生成3种不同结构的大纲，对比优劣并选择最适合的一种。</p><p><strong>进阶练习：</strong></p><p>写一段200字的核心论点，让AI扩写成500字的完整段落，然后对比分析AI添加了哪些内容、哪些需要删减。</p><p><strong>挑战练习：</strong></p><p>完成一篇完整论文的「文献综述」章节：先检索15篇文献，用AI辅助撰写综述初稿，然后人工修改完善并导出国标格式参考文献。</p>' },
      { title: '课程总结 — 论文写作', type: 'summary',
        html: '<h2>论文写作辅助 — 核心要点</h2><ul><li><strong>AI是助手不是作者</strong>：你的研究思想、创新点、核心数据不可替代</li><li><strong>分阶段使用</strong>：选题→大纲→扩写→润色→降重，每阶段目标明确</li><li><strong>提示词要具体</strong>：提供背景、要求、格式、风格等完整信息</li><li><strong>人工审核是必需</strong>：AI生成内容必须逐段检查逻辑和准确性</li><li><strong>遵守学术诚信</strong>：了解学校AI使用规定，合理合法使用</li></ul><p>用好AI，让你把更多时间花在研究思考上，而不是文字打磨！</p>' }
    ]
  },

  3: { name: '数据分析与可视化', tools: ['ChatGPT Code Interpreter','Julius AI','通义千问'],
    pages: [
      { title: '课程概览 — 数据分析', type: 'cover',
        html: '<h2>数据分析与可视化</h2><p>学习使用AI工具进行数据清洗、统计分析、图表生成，让数据分析从繁琐变高效。</p><p><strong>学习目标：</strong>掌握AI辅助数据分析的完整流程，能够从原始数据到可视化报告一气呵成。</p>' },
      { title: '推荐工具 — 数据分析', type: 'tool',
        html: '<h2>数据分析推荐AI工具</h2><ul><li><strong>ChatGPT Code Interpreter</strong> — 直接上传数据文件，自动分析并生成图表</li><li><strong>Julius AI</strong> — 专门针对数据分析，支持CSV/Excel/JSON</li><li><strong>通义千问</strong> — 中文支持好，可生成Python/R分析代码</li></ul><p><strong>传统工具补充：</strong>Excel、Python(pandas/matplotlib)、R(ggplot2)、Tableau</p>' },
      { title: '数据清洗与预处理', type: 'method',
        html: '<h2>AI辅助数据清洗</h2><p><strong>常见数据问题：</strong></p><ul><li>缺失值：删除/填充/插值</li><li>异常值：箱线图法、3σ原则识别</li><li>重复值：去重处理</li><li>格式不一致：统一编码、日期格式</li></ul><p><strong>AI清洗提示词：</strong></p><p><em>"我有一份[数据描述]，存在[问题描述]，请帮我：①识别所有缺失值位置；②用[方法]处理缺失值；③检测异常值；④给出清洗后的数据摘要。"</em></p>' },
      { title: '统计分析方法论', type: 'prompt',
        html: '<h2>AI辅助统计分析</h2><p><strong>描述性统计：</strong></p><ul><li>集中趋势：均值、中位数、众数</li><li>离散程度：标准差、方差、极差</li><li>分布形态：偏度、峰度</li></ul><p><strong>推断性统计：</strong></p><ul><li>假设检验：t检验、卡方检验、ANOVA</li><li>相关性分析：Pearson、Spearman</li><li>回归分析：线性/逻辑回归</li></ul><p><strong>提示词模板：</strong></p><p><em>"请对以下数据进行[具体分析方法]，给出：①统计结果；②结果解读；③可视化图表；④Python代码。"</em></p>' },
      { title: '可视化图表生成', type: 'case',
        html: '<h2>数据可视化最佳实践</h2><p><strong>图表选择指南：</strong></p><ul><li>比较数据 → 柱状图/条形图</li><li>趋势变化 → 折线图/面积图</li><li>占比分布 → 饼图/环形图/堆叠图</li><li>相关性 → 散点图/热力图</li><li>地理分布 → 地图热力图</li></ul><p><strong>AI生成图表提示词：</strong></p><p><em>"请根据以下数据生成[图表类型]，要求：①配色专业美观；②标注关键数据点；③添加图例和标题；④给出matplotlib/plotly代码。"</em></p>' },
      { title: '分析代码生成与调试', type: 'advanced',
        html: '<h2>AI生成分析代码</h2><p><strong>Python数据分析代码模板：</strong></p><p style="background:#f5f5f5;padding:8px;border-radius:4px;font-size:12px;font-family:monospace;">import pandas as pd<br>import matplotlib.pyplot as plt<br><br># 数据读取<br>df = pd.read_csv(\'data.csv\')<br><br># 数据清洗<br>df = df.dropna()<br><br># 描述统计<br>print(df.describe())<br><br># 可视化<br>plt.figure(figsize=(10,6))<br>df[\'column\'].hist()<br>plt.show()</p><p><strong>AI代码辅助：</strong>提供数据结构描述，让AI生成完整分析代码，运行后根据报错让AI修复。</p>' },
      { title: '结果解读与报告撰写', type: 'verify',
        html: '<h2>数据分析结果验证</h2><p><strong>结果检查清单：</strong></p><ul><li><strong>统计方法适用</strong> — 检验前提条件是否满足（正态性、独立性）</li><li><strong>p值解读</strong> — p<0.05≠绝对真理，需结合效应量</li><li><strong>相关≠因果</strong> — AI不会帮你判断因果关系</li><li><strong>样本代表性</strong> — 分析结论是否可推广</li></ul><p><strong>报告撰写提示词：</strong></p><p><em>"基于以下分析结果，请撰写数据分析报告，包含：①研究目的；②数据来源；③分析方法；④主要发现；⑤结论建议。"</em></p>' },
      { title: '避坑指南 — 数据分析', type: 'pitfall',
        html: '<h2>数据分析常见陷阱</h2><ul><li><strong>方法误用</strong> — AI可能选择不适合数据类型的统计方法</li><li><strong>过度解读</strong> — 从小样本中发现不存在的规律</li><li><strong>代码bug</strong> — AI生成的代码可能有错误，必须测试运行</li><li><strong>忽略前提假设</strong> — 很多统计检验有前提条件（如正态性）</li><li><strong>可视化误导</strong> — 不当的坐标轴范围、颜色选择会误导结论</li><li><strong>数据泄露</strong> — 在训练前做了全局标准化等预处理</li></ul>' },
      { title: '实战练习 — 数据分析', type: 'practice',
        html: '<h2>实战练习</h2><p><strong>基础练习：</strong></p><p>上传一份CSV数据，让AI做描述性统计并生成数据分布直方图。</p><p><strong>进阶练习：</strong></p><p>分析两个变量的相关性，生成散点图和相关系数矩阵热力图。</p><p><strong>挑战练习：</strong></p><p>提出一个研究假设，让AI设计完整的分析流程（假设检验→统计方法选择→结果解读），并生成可运行的Python代码执行分析。</p>' },
      { title: '课程总结 — 数据分析', type: 'summary',
        html: '<h2>数据分析与可视化 — 核心要点</h2><ul><li><strong>AI加速但不替代</strong>：AI帮你生成代码和图表，你负责提出正确的问题</li><li><strong>方法原理要懂</strong>：必须理解所用统计方法的适用条件和局限</li><li><strong>运行验证是必需</strong>：AI生成的代码一定要跑一遍看结果</li><li><strong>图表要专业</strong>：选择合适的图表类型，配色美观，标注清晰</li><li><strong>结果要审慎</strong>：相关≠因果，显著≠重要，小心过度解读</li></ul><p>数据分析的核心是提出好问题，AI只是帮你更快找到答案的工具！</p>' }
    ]
  },

  4: { name: 'PPT智能生成', tools: ['Gamma','Beautiful.ai','Tome','通义千问'],
    pages: [
      { title: '课程概览 — PPT智能生成', type: 'cover',
        html: '<h2>PPT智能生成</h2><p>从内容规划、版式设计到演讲备注，AI一站式完成演示文稿，告别熬夜做PPT。</p><p><strong>学习目标：</strong>掌握AI生成PPT的完整工作流，能快速产出专业美观的演示文稿。</p>' },
      { title: '推荐工具 — PPT生成', type: 'tool',
        html: '<h2>PPT生成推荐AI工具</h2><ul><li><strong>Gamma</strong> — 输入主题自动生成完整PPT，设计美观</li><li><strong>Beautiful.ai</strong> — 智能排版，自动调整版式适配内容</li><li><strong>Tome</strong> — 故事化叙事PPT，支持图文混排</li><li><strong>通义千问</strong> — 中文场景优化，配合模板生成内容</li></ul><p><strong>传统工具AI化：</strong>WPS AI、Office Copilot、Canva Magic Design</p>' },
      { title: '内容规划与结构设计', type: 'method',
        html: '<h2>PPT内容规划方法论</h2><p><strong>结构框架（金字塔原理）：</strong></p><ol><li><strong>封面</strong> — 主题+副标题+作者+日期</li><li><strong>目录</strong> — 3-5个章节，逻辑递进</li><li><strong>背景/问题</strong> — 为什么做这个主题？</li><li><strong>核心内容</strong> — 每页一个观点，图文配合</li><li><strong>总结/展望</strong> — 核心结论+下一步计划</li></ol><p><strong>AI规划提示词：</strong></p><p><em>"我要做一个关于[主题]的PPT，面向[受众]，时长[X]分钟，请帮我设计内容大纲，要求每页一个核心观点，标注建议的视觉呈现方式。"</em></p>' },
      { title: '版式设计与视觉规范', type: 'prompt',
        html: '<h2>PPT版式设计原则</h2><p><strong>版式选择：</strong></p><ul><li>标题页 → 大图+居中标题</li><li>内容页 → 左文右图/上文下图</li><li>对比页 → 左右分栏</li><li>流程页 → 时间轴/步骤图</li><li>数据页 → 图表+结论</li></ul><p><strong>视觉规范：</strong></p><ul><li>配色：主色1个+辅色2个，不超过3种颜色</li><li>字体：标题28-36pt，正文18-24pt</li><li>留白：四周留足边距，不要填满</li><li>对齐：统一左对齐或居中对齐</li></ul>' },
      { title: '配色方案与品牌统一', type: 'case',
        html: '<h2>PPT配色与品牌规范</h2><p><strong>配色方案推荐：</strong></p><ul><li><strong>学术风</strong>：深蓝#003D7A + 金黄#F5B800 + 白色</li><li><strong>商务风</strong>：深灰#333333 + 橙色#FF6B35 + 浅灰</li><li><strong>科技风</strong>：黑色#1a1a2e + 青色#00d4aa + 紫色</li><li><strong>清新风</strong>：白色 + 薄荷绿#98D8C8 + 浅蓝</li></ul><p><strong>AI配色提示词：</strong></p><p><em>"请为[主题/行业]的PPT推荐一套配色方案，要求：①专业美观；②色值标注；③说明使用场景；④给出主色/辅色/强调色的具体应用位置。"</em></p>' },
      { title: '演讲备注与节奏把控', type: 'advanced',
        html: '<h2>演讲备注生成与演讲技巧</h2><p><strong>AI生成演讲备注：</strong></p><p><em>"请为以下PPT内容生成演讲备注，每页200字左右，包含：①开场白；②核心内容讲解；③过渡语。要求口语化，适合口头表达。"</em></p><p><strong>演讲节奏建议：</strong></p><ul><li>每分钟1-2页PPT</li><li>重点页停留更久，过渡页快速带过</li><li>每页只讲1个核心观点</li><li>用「问题→答案」结构吸引注意力</li></ul><p><strong>互动设计：</strong>在关键节点设置提问或投票环节</p>' },
      { title: '导出格式与兼容性', type: 'verify',
        html: '<h2>PPT导出与兼容性检查</h2><p><strong>导出格式选择：</strong></p><ul><li><strong>.pptx</strong> — 可编辑，兼容Office/WPS</li><li><strong>.pdf</strong> — 不可编辑，字体不丢失，适合发送</li><li><strong>.png/.jpg</strong> — 单页导出，适合社交媒体分享</li></ul><p><strong>兼容性检查清单：</strong></p><ul><li>字体是否嵌入？（特殊字体可能丢失）</li><li>动画效果是否过多？（可能卡顿）</li><li>图片分辨率是否足够？（投影要清晰）</li><li>文件大小是否合适？（邮件附件限制）</li></ul>' },
      { title: '避坑指南 — PPT制作', type: 'pitfall',
        html: '<h2>PPT制作常见陷阱</h2><ul><li><strong>内容空洞</strong> — 花里胡哨但缺乏实质内容，观众看完记不住</li><li><strong>文字堆砌</strong> — 大段文字直接粘贴，没人愿意读</li><li><strong>动画过度</strong> — 花哨动画分散注意力，显得不专业</li><li><strong>配色冲突</strong> — 高饱和度对比色刺眼，影响阅读</li><li><strong>字体混乱</strong> — 一页用3种以上字体，缺乏统一感</li><li><strong>图表误导</strong> — 坐标轴不从0开始、比例失调等</li></ul>' },
      { title: '实战练习 — PPT生成', type: 'practice',
        html: '<h2>实战练习</h2><p><strong>基础练习：</strong></p><p>选择一个简单主题，用Gamma或Beautiful.ai生成5页PPT初稿，评价其设计优缺点。</p><p><strong>进阶练习：</strong></p><p>把你已有的文字材料交给AI，要求生成PPT结构和每页要点，然后你在现有模板中排版。</p><p><strong>挑战练习：</strong></p><p>完整制作一个15页的课程汇报PPT：①AI生成大纲和内容；②选择配色和版式；③添加图表和数据；④导出PDF并检查兼容性。</p>' },
      { title: '课程总结 — PPT生成', type: 'summary',
        html: '<h2>PPT智能生成 — 核心要点</h2><ul><li><strong>内容为王</strong>：你负责内容规划和结构设计，AI辅助排版美化</li><li><strong>少即是多</strong>：每页1个观点，文字精简，视觉优先</li><li><strong>统一规范</strong>：配色、字体、版式全篇保持一致</li><li><strong>适配场景</strong>：学术/商务/演讲不同场景设计不同风格</li><li><strong>演讲配套</strong>：生成演讲备注，把控节奏和互动</li></ul><p>好的PPT是让观众记住你的观点，而不是你的动画！</p>' }
    ]
  },

  5: { name: 'AI绘画与设计', tools: ['Midjourney','Stable Diffusion','DALL-E','文心一格'],
    pages: [
      { title: '课程概览 — AI绘画与设计', type: 'cover',
        html: '<h2>AI绘画与创意设计</h2><p>学习使用Midjourney、Stable Diffusion等工具进行创意设计和视觉内容生成，让每个人都能成为设计师。</p><p><strong>学习目标：</strong>掌握AI绘画的核心技巧，能够独立完成海报、插画、概念设计等视觉创作。</p>' },
      { title: '推荐工具 — AI绘画', type: 'tool',
        html: '<h2>AI绘画工具对比</h2><ul><li><strong>Midjourney</strong> — 艺术质量最高，社区生态丰富，适合概念设计</li><li><strong>Stable Diffusion</strong> — 开源免费，可本地部署，可精细控制</li><li><strong>DALL-E 3</strong> — 与ChatGPT集成，理解提示词能力强</li><li><strong>文心一格</strong> — 中文支持好，国内访问方便，适合国风</li></ul><p><strong>选型建议：</strong>追求质量选Midjourney，追求可控选SD，追求便捷选DALL-E。</p>' },
      { title: '提示词结构与写法', type: 'method',
        html: '<h2>AI绘画提示词工程</h2><p><strong>标准提示词结构：</strong></p><p><code>[主体描述], [艺术风格], [构图方式], [光线氛围], [画质要求], [参考艺术家]</code></p><p><strong>各要素示例：</strong></p><ul><li><strong>主体</strong>：a futuristic city skyline at sunset</li><li><strong>风格</strong>：digital art, oil painting, anime style</li><li><strong>构图</strong>：wide angle, close-up, bird\'s eye view</li><li><strong>光线</strong>：soft lighting, dramatic shadows, golden hour</li><li><strong>画质</strong>：8k, highly detailed, masterpiece</li></ul>' },
      { title: '风格控制与参考图', type: 'prompt',
        html: '<h2>风格迁移与一致性控制</h2><p><strong>风格控制方法：</strong></p><ul><li><strong>风格词</strong>：cyberpunk, watercolor, minimalist, photorealistic</li><li><strong>艺术家参考</strong>：in the style of Studio Ghibli, by Van Gogh</li><li><strong>参考图</strong>：上传参考图+提示词描述（--sref参数）</li><li><strong>种子锁定</strong>：使用--seed参数保持风格一致</li></ul><p><strong>Midjourney风格参数：</strong></p><ul><li>--stylize 0-1000：艺术化程度</li><li>--chaos 0-100：多样性程度</li><li>--iw 0-2：参考图权重</li></ul>' },
      { title: '构图与光影技巧', type: 'case',
        html: '<h2>构图与光影专业技巧</h2><p><strong>构图方式：</strong></p><ul><li>三分法：主体放在交叉点上</li><li>对称构图：适合建筑、产品展示</li><li>引导线：用道路/河流引导视线</li><li>框架构图：用门窗等做画框</li></ul><p><strong>光影氛围词：</strong></p><ul><li>golden hour, blue hour, soft diffused light</li><li>volumetric lighting, god rays, rim lighting</li><li>moody atmosphere, ethereal glow, dramatic contrast</li></ul><p><strong>提示词示例：</strong><em>"wide angle shot of ancient Chinese temple, golden hour lighting, volumetric fog, highly detailed, 8k, in the style of traditional Chinese painting"</em></p>' },
      { title: '图像修复与后期处理', type: 'advanced',
        html: '<h2>AI图像后期处理工具</h2><p><strong>图像增强：</strong></p><ul><li><strong>Upscale</strong> — 超分辨率放大，提升清晰度</li><li><strong>Outpainting</strong> — 扩展画布，补充画面边缘</li><li><strong>Inpainting</strong> — 局部重绘，修复瑕疵</li></ul><p><strong>图像编辑：</strong></p><ul><li><strong>Photoshop AI</strong> — 生成式填充，智能修图</li><li><strong>Remove.bg</strong> — 一键抠图</li><li><strong>Topaz Gigapixel</strong> — 专业级图像放大</li></ul><p><strong>工作流：</strong>AI生成初稿 → 选择最佳结果 → 后期精修 → 导出成品</p>' },
      { title: '应用场景与版权规范', type: 'verify',
        html: '<h2>AI绘画应用场景与版权</h2><p><strong>适用场景：</strong></p><ul><li>社交媒体配图、公众号封面</li><li>PPT插图、海报设计</li><li>游戏概念设计、角色原画</li><li>电商产品展示、广告素材</li><li>个人创作、艺术探索</li></ul><p><strong>版权注意事项：</strong></p><ul><li>不同平台版权政策不同（Midjourney付费用户拥有商用权）</li><li>训练数据版权争议仍在发展中</li><li>建议：AI生成初稿+人工修改，增加原创性</li><li>发表时注明AI辅助创作</li></ul>' },
      { title: '避坑指南 — AI绘画', type: 'pitfall',
        html: '<h2>AI绘画常见陷阱</h2><ul><li><strong>手指畸形</strong> — AI画人手经常出错，需后期修复或规避</li><li><strong>文字乱码</strong> — AI几乎无法生成正确文字，需后期添加</li><li><strong>面部崩坏</strong> — 多人场景面部容易扭曲</li><li><strong>身体结构错误</strong> — 肢体数量、比例可能不对</li><li><strong>提示词爆炸</strong> — 不是越长越好，简洁精准最重要</li><li><strong>风格漂移</strong> — 同一提示词多次生成结果差异大</li></ul>' },
      { title: '实战练习 — AI绘画', type: 'practice',
        html: '<h2>实战练习</h2><p><strong>基础练习：</strong></p><p>用Midjourney或DALL-E生成一张你所在专业的主题海报，尝试3种不同风格对比效果。</p><p><strong>进阶练习：</strong></p><p>设计一个系列配图（封面+3张内页插图），使用相同seed和风格词保持一致性。</p><p><strong>挑战练习：</strong></p><p>为你的毕业设计/项目做一套完整的视觉物料：海报1张+插画3张+PPT封面1张，统一风格。</p>' },
      { title: '课程总结 — AI绘画', type: 'summary',
        html: '<h2>AI绘画与设计 — 核心要点</h2><ul><li><strong>提示词是关键</strong>：好提示=好结果，掌握结构、风格、参数</li><li><strong>多生成多挑选</strong>：批量出图选最佳，不要第一张就满足</li><li><strong>参数精细调</strong>：stylize、chaos、seed等参数大幅影响效果</li><li><strong>后期不可少</strong>：AI出初稿，PS做精修，尤其是文字和细节</li><li><strong>版权要合规</strong>：了解平台政策，注明AI辅助，规避风险</li></ul><p>AI绘画让每个人都能表达创意，但审美和创意想法永远是核心！</p>' }
    ]
  },

  6: { name: '代码生成与调试', tools: ['GitHub Copilot','Cursor','ChatGPT','Claude'],
    pages: [
      { title: '课程概览 — 代码生成与调试', type: 'cover',
        html: '<h2>代码生成与调试</h2><p>利用AI编程助手进行代码编写、审查、调试和重构，让编程效率倍增，Bug无所遁形。</p><p><strong>学习目标：</strong>掌握AI辅助编程的完整工作流，能够用AI加速开发、减少调试时间。</p>' },
      { title: '推荐工具 — 代码辅助', type: 'tool',
        html: '<h2>AI编程工具对比</h2><ul><li><strong>GitHub Copilot</strong> — 集成IDE，实时代码补全，支持多种语言</li><li><strong>Cursor</strong> — 基于VS Code，AI对话式编程，可编辑整个文件</li><li><strong>ChatGPT</strong> — 通用代码生成、解释、调试，不限语言</li><li><strong>Claude</strong> — 长代码分析能力强，适合代码审查</li></ul><p><strong>选型建议：</strong>日常开发用Copilot/Cursor，复杂问题用ChatGPT/Claude。</p>' },
      { title: '代码生成与补全技巧', type: 'method',
        html: '<h2>AI代码生成最佳实践</h2><p><strong>高效提示词：</strong></p><p><em>"请用Python编写一个[功能描述]，要求：①包含输入验证；②添加异常处理；③编写单元测试；④给出使用示例。"</em></p><p><strong>补全技巧：</strong></p><ul><li>写好函数名和注释，让AI理解意图</li><li>先写测试用例，再让AI实现功能（TDD）</li><li>提供示例输入输出，AI生成转换代码</li><li>逐步生成：先框架→再细节→最后优化</li></ul>' },
      { title: 'Bug调试与错误分析', type: 'prompt',
        html: '<h2>AI辅助调试方法</h2><p><strong>错误分析提示词：</strong></p><p><em>"我遇到了以下错误：[错误信息]。相关代码：[代码片段]。请帮我：①分析错误原因；②给出修复方案；③解释如何避免类似错误。"</em></p><p><strong>调试策略：</strong></p><ul><li>提供完整错误堆栈，不要只给最后一行</li><li>说明运行环境和依赖版本</li><li>提供最小可复现代码</li><li>让AI解释代码执行流程，帮助定位逻辑错误</li></ul>' },
      { title: '代码解释与重构', type: 'case',
        html: '<h2>代码理解与重构</h2><p><strong>代码解释提示词：</strong></p><p><em>"请解释以下代码的功能和工作原理，用中文回答，要求：①逐行注释；②说明设计思路；③指出潜在问题。"</em></p><p><strong>重构提示词：</strong></p><p><em>"请重构以下代码，要求：①提高可读性；②减少重复；③添加类型注解；④保持功能不变。"</em></p><p><strong>代码审查清单：</strong></p><ul><li>命名是否清晰？</li><li>函数是否过长？</li><li>是否有魔法数字？</li><li>异常处理是否完善？</li></ul>' },
      { title: '算法实现与优化', type: 'advanced',
        html: '<h2>AI辅助算法开发</h2><p><strong>算法实现提示词：</strong></p><p><em>"请用Python实现[算法名称]，要求：①时间/空间复杂度分析；②关键步骤注释；③提供测试用例；④与其他算法对比优劣。"</em></p><p><strong>性能优化：</strong></p><ul><li>让AI分析代码瓶颈</li><li>请求并行化/向量化优化方案</li><li>数据库查询优化建议</li><li>内存使用优化策略</li></ul><p><strong>注意：</strong>AI可能给出过时或错误算法，务必在LeetCode/教材中核实！</p>' },
      { title: '代码质量与安全性', type: 'verify',
        html: '<h2>代码质量与安全检查</h2><p><strong>安全检查清单：</strong></p><ul><li><strong>注入攻击</strong> — SQL注入、命令注入、XSS</li><li><strong>敏感信息</strong> — 硬编码密码、API密钥泄露</li><li><strong>权限控制</strong> — 越权访问、未授权操作</li><li><strong>输入验证</strong> — 边界检查、类型检查</li></ul><p><strong>安全审查提示词：</strong></p><p><em>"请审查以下代码的安全性，检查是否存在：SQL注入、XSS、敏感信息泄露、权限绕过等漏洞，并给出修复建议。"</em></p>' },
      { title: '避坑指南 — 代码辅助', type: 'pitfall',
        html: '<h2>AI编程常见陷阱</h2><ul><li><strong>盲目信任AI代码</strong> — AI可能生成有bug的代码，必须测试</li><li><strong>过时API</strong> — AI训练数据有截止日期，新API可能不认识</li><li><strong>性能陷阱</strong> — 看似正确的代码可能有严重性能问题</li><li><strong>安全漏洞</strong> — AI可能忽略安全最佳实践</li><li><strong>版权问题</strong> — 生成的代码可能与开源代码相似</li><li><strong>过度依赖</strong> — 长期使用AI可能弱化基础编程能力</li></ul>' },
      { title: '实战练习 — 代码辅助', type: 'practice',
        html: '<h2>实战练习</h2><p><strong>基础练习：</strong></p><p>描述一个简单功能（如文件批量重命名），让AI生成完整代码并测试运行。</p><p><strong>进阶练习：</strong></p><p>故意写一段有bug的代码，让AI找出所有问题并修复，对比你的发现和AI的发现。</p><p><strong>挑战练习：</strong></p><p>用AI辅助完成一个小项目：从需求描述→代码生成→调试修复→代码审查→性能优化，全程使用AI工具辅助。</p>' },
      { title: '课程总结 — 代码辅助', type: 'summary',
        html: '<h2>代码生成与调试 — 核心要点</h2><ul><li><strong>AI加速但不替代</strong>：你负责设计思路，AI负责代码实现</li><li><strong>提示词要具体</strong>：语言、功能、约束、测试要求说清楚</li><li><strong>测试是必须的</strong>：AI代码必须运行验证，不要盲信</li><li><strong>安全要审查</strong>：尤其注意注入、泄露、权限问题</li><li><strong>持续学习</strong>：AI是工具，编程基本功不能丢</li></ul><p>AI让编程更高效，但好的程序设计思维永远属于你！</p>' }
    ]
  },

  7: { name: '外语学习与翻译', tools: ['DeepL','ChatGPT','Claude','豆包'],
    pages: [
      { title: '课程概览 — 外语学习与翻译', type: 'cover',
        html: '<h2>外语学习与翻译</h2><p>AI驱动的个性化外语学习方案和精准翻译服务，让语言不再是障碍。</p><p><strong>学习目标：</strong>掌握AI辅助外语学习和专业翻译的方法，提升语言应用能力。</p>' },
      { title: '推荐工具 — 外语学习', type: 'tool',
        html: '<h2>外语学习推荐AI工具</h2><ul><li><strong>DeepL</strong> — 翻译质量最高的AI翻译器，支持多种语言</li><li><strong>ChatGPT</strong> — 对话练习、语法纠错、作文批改全能</li><li><strong>Claude</strong> — 长文本翻译和润色效果优秀</li><li><strong>豆包</strong> — 字节跳动出品，口语对话练习体验好</li></ul><p><strong>专项工具：</strong>Grammarly（语法检查）、Anki（AI生成记忆卡片）、ELSA Speak（发音纠正）</p>' },
      { title: '精准翻译技巧', type: 'method',
        html: '<h2>AI精准翻译方法</h2><p><strong>翻译提示词模板：</strong></p><p><em>"请将以下文本翻译为[目标语言]，要求：①保持学术/商务/口语风格；②专业术语准确；③语句通顺自然；④对不确定的术语给出备选翻译。原文：[内容]"</em></p><p><strong>提升翻译质量的技巧：</strong></p><ul><li>提供上下文背景（领域、受众、用途）</li><li>指定风格（正式/非正式/学术）</li><li>要求回译验证：中文→英文→中文</li><li>术语表：提供专业术语对照表</li></ul>' },
      { title: '语法纠错与写作提升', type: 'prompt',
        html: '<h2>AI语法纠错与写作提升</h2><p><strong>纠错提示词：</strong></p><p><em>"请检查以下英文段落的语法和表达问题，要求：①标出所有错误并说明原因；②给出修改建议；③整体评价语言水平；④给出提升建议。"</em></p><p><strong>写作提升策略：</strong></p><ul><li>逐句分析：让AI解释每个句子的问题</li><li>风格升级：要求AI提升学术性/简洁性</li><li>同义替换：丰富词汇表达</li><li>段落衔接：优化段落间过渡</li></ul>' },
      { title: '口语练习与对话模拟', type: 'case',
        html: '<h2>AI口语练习方法</h2><p><strong>角色扮演对话：</strong></p><p><em>"请扮演一位[角色]，和我用[语言]进行[场景]对话。要求：①语速适中；②纠正我的语法错误；③教我地道表达；④每次回复后给出语言点评。"</em></p><p><strong>口语练习场景：</strong></p><ul><li>面试英语：模拟外企面试问答</li><li>商务谈判：模拟价格/合同谈判</li><li>日常交流：机场、餐厅、购物</li><li>学术讨论：论文答辩、会议报告</li></ul><p><strong>发音辅助：</strong>使用语音输入功能练习口语</p>' },
      { title: '词汇记忆与阅读辅助', type: 'advanced',
        html: '<h2>AI辅助词汇与阅读</h2><p><strong>智能记忆卡片：</strong></p><p><em>"请为以下单词生成记忆卡片，包含：①词根词缀分析；②同义词/反义词；③例句（2个）；④记忆技巧。单词：[列表]"</em></p><p><strong>阅读理解辅助：</strong></p><ul><li>长文分段摘要：每段核心观点</li><li>难句解析：复杂句式拆解</li><li>背景知识补充：专业术语解释</li><li>思维导图：文章结构梳理</li></ul><p><strong>阅读材料推荐：</strong>让AI根据你的水平和兴趣推荐文章</p>' },
      { title: '学术翻译与润色', type: 'verify',
        html: '<h2>学术翻译质量把控</h2><p><strong>学术翻译要点：</strong></p><ul><li><strong>术语一致性</strong>：同一术语全文统一翻译</li><li><strong>句式规范</strong>：符合学术写作惯例（被动语态、名词化）</li><li><strong>逻辑衔接</strong>：保持原文论证逻辑</li><li><strong>格式规范</strong>：图表、公式、引用格式正确</li></ul><p><strong>质量验证：</strong></p><ul><li>回译验证：翻译后让AI译回原文对比</li><li>母语审校：如有条件请母语者审校</li><li>术语核对：对照学科术语标准</li></ul>' },
      { title: '避坑指南 — 外语学习', type: 'pitfall',
        html: '<h2>AI外语学习常见陷阱</h2><ul><li><strong>翻译腔</strong> — AI翻译可能过于直译，不够地道</li><li><strong>语境缺失</strong> — 同一词在不同语境翻译可能不同</li><li><strong>文化差异</strong> — AI可能忽略文化背景和表达习惯</li><li><strong>过度依赖</strong> — 长期依赖AI翻译可能弱化语言能力</li><li><strong>保密风险</strong> — 不要在公共AI工具中输入机密文件</li><li><strong>口语练习局限</strong> — AI无法完全替代真人对话练习</li></ul>' },
      { title: '实战练习 — 外语学习', type: 'practice',
        html: '<h2>实战练习</h2><p><strong>基础练习：</strong></p><p>选择一段中文摘要，分别用DeepL、ChatGPT、Claude翻译为英文，对比三个版本的优劣。</p><p><strong>进阶练习：</strong></p><p>写一段200字的英文自我介绍，让AI批改语法错误并润色，学习修改理由。</p><p><strong>挑战练习：</strong></p><p>模拟一次全英文的学术报告：用AI准备演讲稿→练习口语表达→让AI评价你的录音/文字稿。</p>' },
      { title: '课程总结 — 外语学习', type: 'summary',
        html: '<h2>外语学习与翻译 — 核心要点</h2><ul><li><strong>翻译要精准</strong>：提供上下文、风格、术语表，提升翻译质量</li><li><strong>学习要系统</strong>：词汇、语法、阅读、口语全面训练</li><li><strong>纠错要深入</strong>：不仅看结果，更要理解错误原因</li><li><strong>练习要实战</strong>：模拟真实场景，不要只做选择题</li><li><strong>工具要组合</strong>：翻译+纠错+对话+记忆，多工具配合</li></ul><p>AI是最好的语言陪练，但语言能力的提升最终靠持续练习！</p>' }
    ]
  },

  8: { name: '知识图谱构建', tools: ['Notion AI','Obsidian','ChatGPT','Miro AI'],
    pages: [
      { title: '课程概览 — 知识图谱构建', type: 'cover',
        html: '<h2>知识图谱构建</h2><p>利用AI工具构建个人知识体系，实现知识的结构化管理和智能检索，打造属于你的第二大脑。</p><p><strong>学习目标：</strong>建立系统化的个人知识管理系统，能够高效整理、关联和检索所学知识。</p>' },
      { title: '推荐工具 — 知识管理', type: 'tool',
        html: '<h2>知识管理推荐工具</h2><ul><li><strong>Notion AI</strong> — All-in-one知识库，AI辅助整理和总结</li><li><strong>Obsidian</strong> — 双向链接笔记，本地存储，隐私性强</li><li><strong>ChatGPT</strong> — 知识问答、概念解释、关联分析</li><li><strong>Miro AI</strong> — 可视化思维导图和知识图谱</li></ul><p><strong>选型建议：</strong>轻量用Notion，重度用Obsidian，可视化用Miro。</p>' },
      { title: '知识分类与标签体系', type: 'method',
        html: '<h2>知识体系构建方法</h2><p><strong>分类方法（PARA法）：</strong></p><ul><li><strong>P</strong>rojects — 当前正在进行的项目</li><li><strong>A</strong>reas — 持续关注的领域（学习/健康/职业）</li><li><strong>R</strong>esources — 感兴趣的主题素材</li><li><strong>A</strong>rchives — 已完成/不再活跃的内容</li></ul><p><strong>标签设计：</strong></p><ul><li>主题标签：#人工智能 #数据分析</li><li>类型标签：#论文 #笔记 #工具</li><li>状态标签：#待读 #进行中 #已完成</li><li>来源标签：#课程 #书籍 #论文</li></ul>' },
      { title: '双向链接与知识关联', type: 'prompt',
        html: '<h2>双向链接与知识网络</h2><p><strong>双向链接原理：</strong></p><p>在Obsidian中，[[笔记名称]]创建链接，自动建立知识关联图谱。</p><p><strong>AI辅助关联：</strong></p><p><em>"以下是我的几篇笔记摘要，请帮我：①找出它们之间的关联；②建议可以建立的双向链接；③发现知识盲区。"</em></p><p><strong>知识图谱可视化：</strong></p><ul><li>中心节点：核心主题</li><li>分支节点：子主题和概念</li><li>连线粗细：关联强度</li><li>颜色区分：不同知识领域</li></ul>' },
      { title: '思维导图与结构化思考', type: 'case',
        html: '<h2>AI辅助思维导图</h2><p><strong>生成提示词：</strong></p><p><em>"请将以下内容整理为思维导图结构，使用Markdown列表格式，要求：①层级清晰（3-4层）；②每节点 concise；③标注节点间关系。内容：[材料]"</em></p><p><strong>思维导图工具：</strong></p><ul><li>Xmind AI：AI一键生成思维导图</li><li>Miro：协作式白板思维导图</li><li>Markmap：Markdown转思维导图</li><li>Whimsical：快速绘制流程图和思维导图</li></ul>' },
      { title: '笔记整理与摘要生成', type: 'advanced',
        html: '<h2>AI笔记整理与知识提取</h2><p><strong>阅读笔记模板：</strong></p><ul><li>核心观点（1句话总结）</li><li>关键论据（3-5个支撑点）</li><li>个人思考（与你已有知识的关联）</li><li>行动项（如何应用）</li></ul><p><strong>AI摘要提示词：</strong></p><p><em>"请将以下长文整理为结构化笔记，包含：①核心观点；②关键概念定义；③重要数据/结论；④与我研究的关联建议。"</em></p><p><strong>定期回顾：</strong>设置每周回顾机制，用AI生成知识回顾卡片</p>' },
      { title: '知识检索与问答系统', type: 'verify',
        html: '<h2>个人知识库问答</h2><p><strong>构建方法：</strong></p><ol><li>收集所有笔记、文档、PDF到统一平台</li><li>使用AI建立索引（Notion AI / Obsidian Copilot）</li><li>通过自然语言提问检索知识</li></ol><p><strong>问答示例：</strong></p><p><em>"我在之前的学习中接触过哪些关于神经网络优化的方法？请列出并简要说明。"</em></p><p><strong>进阶：</strong>使用RAG（检索增强生成）技术，让AI基于你的知识库回答</p>' },
      { title: '避坑指南 — 知识管理', type: 'pitfall',
        html: '<h2>知识管理常见陷阱</h2><ul><li><strong>过度收集</strong> — 只收藏不整理，成了"数字囤积症"</li><li><strong>完美主义</strong> — 花太多时间设计分类体系而不产出</li><li><strong>工具焦虑</strong> — 频繁切换工具，笔记分散在各处</li><li><strong>缺乏回顾</strong> — 记完不看，知识无法内化</li><li><strong>AI幻觉</strong> — AI总结可能遗漏关键信息</li><li><strong>隐私风险</strong> — 敏感笔记上传到云端有泄露风险</li></ul>' },
      { title: '实战练习 — 知识管理', type: 'practice',
        html: '<h2>实战练习</h2><p><strong>基础练习：</strong></p><p>选择一门你正在学的课程，用AI辅助建立知识图谱，包含10个核心概念及关联。</p><p><strong>进阶练习：</strong></p><p>整理过去一个月的学习笔记，使用PARA法分类，建立双向链接，生成知识网络可视化图。</p><p><strong>挑战练习：</strong></p><p>建立一个个人知识库问答系统：上传课程笔记，测试用自然语言提问能否准确检索到相关知识。</p>' },
      { title: '课程总结 — 知识管理', type: 'summary',
        html: '<h2>知识图谱构建 — 核心要点</h2><ul><li><strong>分类要实用</strong>：PARA法或适合自己的体系，不要过度设计</li><li><strong>链接要主动</strong>：建立知识间的关联，形成网络而非孤岛</li><li><strong>回顾要定期</strong>：笔记的价值在于反复回顾和应用</li><li><strong>输出要倒逼</strong>：用写作、分享倒逼知识整理</li><li><strong>AI要辅助</strong>：AI帮你提取、关联、检索，你负责思考和应用</li></ul><p>知识管理的终极目标不是整理，而是让知识为你所用！</p>' }
    ]
  },

  9: { name: '面试模拟与辅导', tools: ['ChatGPT','Claude','通义千问','Kimi'],
    pages: [
      { title: '课程概览 — 面试模拟与辅导', type: 'cover',
        html: '<h2>面试模拟与辅导</h2><p>AI模拟面试官进行多场景面试练习，提供实时反馈和改进建议，助你从容应对各类面试。</p><p><strong>学习目标：</strong>掌握常见面试问题的回答策略，能够自信应对各类面试场景。</p>' },
      { title: '推荐工具 — 面试辅导', type: 'tool',
        html: '<h2>面试辅导推荐AI工具</h2><ul><li><strong>ChatGPT</strong> — 通用面试问答、自我介绍优化、简历分析</li><li><strong>Claude</strong> — 深度反馈和回答逻辑优化</li><li><strong>通义千问</strong> — 中文面试场景优化，国企/互联网面试</li><li><strong>Kimi</strong> — 长文本分析，可上传JD进行岗位匹配分析</li></ul><p><strong>专项工具：</strong>Yoodli（语音分析）、Interviewing.io（模拟面试平台）</p>' },
      { title: '自我介绍与开场白', type: 'method',
        html: '<h2>自我介绍黄金结构</h2><p><strong>3段式自我介绍：</strong></p><ol><li><strong>基本信息</strong>（10%）：姓名、学校、专业</li><li><strong>核心优势</strong>（60%）：2-3个亮点，用STAR法则简述</li><li><strong>求职动机</strong>（30%）：为什么应聘这个岗位/公司</li></ol><p><strong>AI优化提示词：</strong></p><p><em>"请帮我优化以下自我介绍，要求：①控制在2分钟以内；②突出与[岗位]的匹配度；③语言自信但不浮夸；④加一个吸引人的开场或结尾。"</em></p>' },
      { title: 'STAR法则与行为面试', type: 'prompt',
        html: '<h2>STAR法则回答技巧</h2><p><strong>STAR结构：</strong></p><ul><li><strong>S</strong>ituation — 背景：当时是什么情况？</li><li><strong>T</strong>ask — 任务：你的具体职责是什么？</li><li><strong>A</strong>ction — 行动：你做了什么？（重点）</li><li><strong>R</strong>esult — 结果：取得了什么成果？（量化）</li></ul><p><strong>常见行为面试题：</strong></p><ul><li>描述一次你克服困难的经历</li><li>举例说明你的团队协作能力</li><li>讲述一次你犯错的经历及如何弥补</li></ul><p><strong>提示词：</strong><em>"请用STAR法则帮我准备以下面试题的回答：[题目]。要求包含具体数据，控制在2分钟内。"</em></p>' },
      { title: '行业问题与专业面试', type: 'case',
        html: '<h2>专业面试准备策略</h2><p><strong>技术面试：</strong></p><ul><li>刷LeetCode/牛客网算法题</li><li>复习核心专业课知识</li><li>准备项目经历的深度追问</li></ul><p><strong>行业认知：</strong></p><ul><li>了解行业发展趋势和热点</li><li>熟悉目标公司的产品和业务</li><li>准备对行业问题的个人见解</li></ul><p><strong>AI辅助准备：</strong></p><p><em>"我应聘[公司]的[岗位]，请帮我：①列出可能的专业面试题；②生成参考答案要点；③分析该公司的业务特点和面试偏好。"</em></p>' },
      { title: '压力面试与刁钻问题', type: 'advanced',
        html: '<h2>压力面试应对策略</h2><p><strong>常见压力问题：</strong></p><ul><li>"你的最大缺点是什么？" → 说真实缺点+改进措施</li><li>"你为什么离开上一家公司？" → 正面表述，不抱怨</li><li>"你期望薪资多少？" → 给区间而非具体数字</li><li>"如果我们不录用你怎么办？" → 表达遗憾+积极态度</li></ul><p><strong>应对原则：</strong></p><ul><li>保持冷静，不要急于回答</li><li>将负面问题转化为展示优势的机会</li><li>用具体事例支撑你的回答</li></ul>' },
      { title: '面试复盘与持续提升', type: 'verify',
        html: '<h2>面试复盘方法论</h2><p><strong>复盘清单：</strong></p><ul><li>哪些问题回答得好？好在哪里？</li><li>哪些问题回答得不好？如何改进？</li><li>面试官的反馈关键词是什么？</li><li>有哪些问题没准备到？</li></ul><p><strong>AI复盘提示词：</strong></p><p><em>"以下是我刚刚面试的问答记录，请帮我复盘：①评价每个回答的优劣；②给出改进建议；③补充我遗漏的准备点；④预测下一轮可能的问题。"</em></p><p><strong>持续迭代：</strong>每次面试后更新你的「面试题库」</p>' },
      { title: '避坑指南 — 面试准备', type: 'pitfall',
        html: '<h2>面试常见陷阱</h2><ul><li><strong>背诵痕迹重</strong> — 像背书不像交流，面试官反感</li><li><strong>回答太空泛</strong> — 只说"我擅长沟通"，没有具体事例</li><li><strong>贬低前公司</strong> — 负面评价前雇主是大忌</li><li><strong>过度谦虚/自信</strong> — 把握好度，用事实说话</li><li><strong>不了解公司</strong> — 问「你们公司是做什么的」直接出局</li><li><strong>忽视非语言</strong> — 眼神、姿态、语速同样重要</li></ul>' },
      { title: '实战练习 — 面试模拟', type: 'practice',
        html: '<h2>实战练习</h2><p><strong>基础练习：</strong></p><p>让AI扮演面试官，进行一轮15分钟的模拟面试，面试后让AI给出详细评价。</p><p><strong>进阶练习：</strong></p><p>针对你最想去的一家公司，让AI生成20道预测面试题并准备答案，然后进行模拟面试。</p><p><strong>挑战练习：</strong></p><p>录制你的自我介绍视频，让AI分析你的语言表达、语速、内容结构，给出改进建议。</p>' },
      { title: '课程总结 — 面试辅导', type: 'summary',
        html: '<h2>面试模拟与辅导 — 核心要点</h2><ul><li><strong>准备要充分</strong>：STAR法则、自我介绍、公司研究缺一不可</li><li><strong>回答要具体</strong>：用数据和事例说话，不要空泛</li><li><strong>模拟要实战</strong>：AI模拟面试+录音复盘，反复迭代</li><li><strong>心态要平和</strong>：面试是双向选择，保持自信</li><li><strong>复盘要系统</strong>：每次面试后总结经验，持续优化</li></ul><p>面试能力是可以训练的，AI是你最好的陪练伙伴！</p>' }
    ]
  },

  10: { name: '短视频脚本创作', tools: ['ChatGPT','剪映AI','Kimi','通义千问'],
    pages: [
      { title: '课程概览 — 短视频脚本', type: 'cover',
        html: '<h2>短视频脚本创作</h2><p>AI辅助短视频创意策划、脚本编写和分镜头设计，从0到1打造爆款短视频内容。</p><p><strong>学习目标：</strong>掌握AI辅助短视频创作的完整流程，能够独立完成选题到脚本的全流程创作。</p>' },
      { title: '推荐工具 — 短视频创作', type: 'tool',
        html: '<h2>短视频创作推荐工具</h2><ul><li><strong>ChatGPT</strong> — 创意策划、脚本撰写、标题生成</li><li><strong>剪映AI</strong> — 一键成片、智能字幕、文案转视频</li><li><strong>Kimi</strong> — 长文本分析，适合知识类视频脚本</li><li><strong>通义千问</strong> — 中文场景优化，热点话题分析</li></ul><p><strong>其他工具：</strong>CapCut（剪辑）、Canva（封面）、巨量算数（热点分析）</p>' },
      { title: '选题策划与热点追踪', type: 'method',
        html: '<h2>AI辅助选题策划</h2><p><strong>选题方向：</strong></p><ul><li>知识科普：把专业知识通俗化</li><li>技能教学：手把手教一个小技能</li><li>经验分享：学习/求职/生活经验</li><li>热点解读：结合时事的专业视角</li></ul><p><strong>AI选题提示词：</strong></p><p><em>"我是[专业]专业学生，想做知识类短视频，请帮我 brainstorm 10个选题，要求：①有传播潜力；②与专业相关；③适合1-3分钟时长；④每个附一句话卖点。"</em></p>' },
      { title: '脚本结构与文案撰写', type: 'prompt',
        html: '<h2>短视频脚本结构</h2><p><strong>黄金3秒开头：</strong></p><ul><li>制造悬念："你知道吗？90%的人都不会..."</li><li>直接给价值："3分钟学会Python爬虫"</li><li>情绪共鸣："考研人最怕的5个陷阱"</li></ul><p><strong>正文结构（60秒为例）：</strong></p><ol><li>0-3秒：钩子（留住观众）</li><li>3-15秒：问题/背景（建立共鸣）</li><li>15-45秒：核心内容（干货输出）</li><li>45-55秒：总结/金句（加深记忆）</li><li>55-60秒：引导互动（点赞关注）</li></ol>' },
      { title: '分镜头设计与视觉规划', type: 'case',
        html: '<h2>分镜头脚本撰写</h2><p><strong>分镜要素：</strong></p><ul><li>镜号：第几个镜头</li><li>景别：远景/全景/中景/近景/特写</li><li>画面内容：拍摄什么</li><li>台词/字幕：说什么</li><li>时长：几秒</li><li>转场：切换方式</li></ul><p><strong>AI分镜提示词：</strong></p><p><em>"请将以下文案转化为分镜头脚本，要求：①标注景别和时长；②设计画面内容；③建议转场方式；④总时长控制在60秒。文案：[内容]"</em></p>' },
      { title: '字幕生成与封面设计', type: 'advanced',
        html: '<h2>字幕与封面优化</h2><p><strong>字幕技巧：</strong></p><ul><li>关键信息加粗/变色高亮</li><li>每行不超过12个字</li><li>配合节奏出现，不要一次性全出</li><li>重点数据放大显示</li></ul><p><strong>封面设计原则：</strong></p><ul><li>大标题：核心卖点，一眼看懂</li><li>人物表情：有情绪感染力</li><li>配色醒目：对比强烈但不刺眼</li><li>信息简洁：不要堆砌文字</li></ul><p><strong>AI封面提示词：</strong><em>"请为短视频[主题]设计3个封面方案，包含标题文案和视觉设计建议。"</em></p>' },
      { title: '数据分析与内容优化', type: 'verify',
        html: '<h2>短视频数据复盘</h2><p><strong>核心指标：</strong></p><ul><li>完播率：观众看到最后的比例（>30%为佳）</li><li>点赞率：点赞/播放（>3%为佳）</li><li>评论率：评论/播放（互动指标）</li><li>转发率：转发/播放（传播指标）</li></ul><p><strong>优化方向：</strong></p><ul><li>完播率低 → 优化开头钩子，压缩内容节奏</li><li>点赞率低 → 增加情绪价值或实用价值</li><li>评论率低 → 设置争议点或提问互动</li></ul>' },
      { title: '避坑指南 — 短视频创作', type: 'pitfall',
        html: '<h2>短视频创作常见陷阱</h2><ul><li><strong>开头不抓人</strong> — 前3秒没有钩子，观众直接划走</li><li><strong>内容太干</strong> — 全是知识点没有情绪，像上课</li><li><strong>节奏拖沓</strong> — 废话太多，信息密度低</li><li><strong>忽视版权</strong> — 音乐、字体、素材侵权</li><li><strong>盲目追热点</strong> — 与账号定位不符，粉丝不精准</li><li><strong>更新不稳定</strong> — 三天打鱼两天晒网</li></ul>' },
      { title: '实战练习 — 脚本创作', type: 'practice',
        html: '<h2>实战练习</h2><p><strong>基础练习：</strong></p><p>选择一个你擅长的小知识点，用AI生成一份60秒的短视频脚本，包含分镜头设计。</p><p><strong>进阶练习：</strong></p><p>为同一个主题生成3个不同风格的开头（悬念型/价值型/共鸣型），对比哪种更吸引你。</p><p><strong>挑战练习：</strong></p><p>完成一个完整短视频的创作流程：选题→脚本→分镜→拍摄→剪辑→发布，用AI辅助每个环节。</p>' },
      { title: '课程总结 — 短视频脚本', type: 'summary',
        html: '<h2>短视频脚本创作 — 核心要点</h2><ul><li><strong>开头定生死</strong>：前3秒必须有钩子，留住观众</li><li><strong>结构要清晰</strong>：钩子→问题→干货→总结→互动</li><li><strong>内容要有用</strong>：实用价值或情绪价值，至少占一个</li><li><strong>节奏要紧凑</strong>：信息密度高，废话全剪掉</li><li><strong>数据要复盘</strong>：根据完播率、点赞率持续优化</li></ul><p>短视频是内容+情绪+节奏的艺术，AI帮你搭框架，创意和表达靠自己！</p>' }
    ]
  },

  11: { name: '简历优化与求职', tools: ['ChatGPT','Claude','Kimi','DeepSeek'],
    pages: [
      { title: '课程概览 — 简历优化', type: 'cover',
        html: '<h2>简历优化与求职</h2><p>AI驱动的简历智能优化、岗位匹配分析和求职策略制定，让你的简历脱颖而出。</p><p><strong>学习目标：</strong>掌握打造高通过率简历的方法，提升求职竞争力。</p>' },
      { title: '推荐工具 — 简历优化', type: 'tool',
        html: '<h2>简历优化推荐工具</h2><ul><li><strong>ChatGPT</strong> — 简历内容优化、STAR描述改写</li><li><strong>Claude</strong> — 长文本分析，适合简历整体诊断</li><li><strong>Kimi</strong> — 可上传JD进行岗位匹配度分析</li><li><strong>DeepSeek</strong> — 中文简历优化，免费额度大</li></ul><p><strong>专业平台：</strong>超级简历、职徒简历、Canva（简历模板）</p>' },
      { title: '简历结构与内容框架', type: 'method',
        html: '<h2>高通过率简历结构</h2><p><strong>核心模块（1页为佳）：</strong></p><ol><li><strong>个人信息</strong>：姓名+电话+邮箱+求职意向</li><li><strong>教育背景</strong>：学校+专业+时间+核心课程/GPA</li><li><strong>实习/项目经历</strong>：2-3个，STAR法则描述</li><li><strong>技能证书</strong>：与岗位相关的技能和证书</li><li><strong>荣誉奖项</strong>：含金量高的奖项（选填）</li></ol><p><strong>排版原则：</strong></p><ul><li>一页纸原则（应届生）</li><li>重点前置，最近的经历放最前</li><li>量化成果，用数字说话</li></ul>' },
      { title: 'STAR法则描述经历', type: 'prompt',
        html: '<h2>经历描述STAR法则</h2><p><strong>STAR黄金公式：</strong></p><p><em>通过[Action]，实现了[Result]，提升了/降低了[数字]%的[指标]</em></p><p><strong>改写示例：</strong></p><p>❌ 差：负责公众号运营，发布文章。</p><p>✅ 好：独立运营学术公众号（S），负责内容策划与撰写（T），通过数据分析优化选题策略（A），3个月内粉丝从200增长至1500，单篇最高阅读量5000+（R）。</p><p><strong>AI优化提示词：</strong><em>"请将以下经历用STAR法则改写，要求量化成果、突出与[岗位]的匹配度。经历：[内容]"</em></p>' },
      { title: '岗位匹配度分析', type: 'case',
        html: '<h2>AI岗位匹配分析</h2><p><strong>JD分析方法：</strong></p><ol><li>提取JD中的关键词（技能要求、经验要求）</li><li>对照自己的简历，找出匹配点</li><li>补充缺失的技能/经验</li><li>在简历中突出匹配度高的部分</li></ol><p><strong>AI匹配提示词：</strong></p><p><em>"以下是我的简历和 target 岗位的JD，请帮我：①分析岗位核心要求；②评估我的匹配度；③指出简历需要强化的部分；④建议我补充什么技能/经历。"</em></p>' },
      { title: '投递策略与渠道选择', type: 'advanced',
        html: '<h2>高效投递策略</h2><p><strong>投递渠道优先级：</strong></p><ul><li>内推（成功率最高）</li><li>校招官网（正规渠道）</li><li>招聘平台（BOSS直聘、实习僧、智联）</li><li>公司官网/公众号</li></ul><p><strong>投递技巧：</strong></p><ul><li>不要海投：针对不同岗位微调简历</li><li>投递时间：周二到周四上午9-11点</li><li>跟进策略：投递后1周未回复可礼貌询问</li><li>投递记录：建立Excel追踪投递状态</li></ul>' },
      { title: '求职信与沟通话术', type: 'verify',
        html: '<h2>求职信撰写与沟通</h2><p><strong>求职信结构：</strong></p><ol><li>开头：说明应聘岗位和渠道</li><li>中间：3个匹配点（技能+经验+热情）</li><li>结尾：表达面试意愿和感谢</li></ol><p><strong>邮件沟通话术：</strong></p><p><em>"您好，我是[学校][专业]的[姓名]，在[渠道]看到贵司[岗位]的招聘信息。我有[X]年相关经验，擅长[技能1]和[技能2]，曾在[项目]中取得[成果]。附件是我的简历，期待有机会和您详聊。"</em></p>' },
      { title: '避坑指南 — 简历求职', type: 'pitfall',
        html: '<h2>简历求职常见陷阱</h2><ul><li><strong>一份简历投所有岗位</strong> — 不同岗位JD不同，简历要针对性调整</li><li><strong>经历描述空泛</strong> — "负责XX工作"没有说服力，要量化</li><li><strong>虚假信息</strong> — 夸大或编造经历，面试一问就露馅</li><li><strong>排版花哨</strong> — 过多颜色、图形分散注意力</li><li><strong>照片不当</strong> — 生活照、自拍都不合适</li><li><strong>忽视细节</strong> — 错别字、格式不统一、联系方式错误</li></ul>' },
      { title: '实战练习 — 简历优化', type: 'practice',
        html: '<h2>实战练习</h2><p><strong>基础练习：</strong></p><p>把你的现有简历交给AI诊断，获取优化建议，逐条修改。</p><p><strong>进阶练习：</strong></p><p>选择3个目标岗位，分别生成针对性版本简历，对比差异。</p><p><strong>挑战练习：</strong></p><p>模拟完整求职流程：优化简历→撰写求职信→模拟面试→复盘改进。</p>' },
      { title: '课程总结 — 简历求职', type: 'summary',
        html: '<h2>简历优化与求职 — 核心要点</h2><ul><li><strong>简历要量化</strong>：用STAR法则+数字描述成果</li><li><strong>投递要精准</strong>：针对岗位JD调整简历关键词</li><li><strong>渠道要多元</strong>：内推>校招>平台，多条腿走路</li><li><strong>细节要重视</strong>：排版、错别字、格式统一</li><li><strong>心态要稳</strong>：求职是概率游戏，持续优化</li></ul><p>好简历是敲门砖，但真正的竞争力来自你的真实能力和经历！</p>' }
    ]
  },

  12: { name: '思维导图与头脑风暴', tools: ['ChatGPT','Miro AI','Xmind AI','Claude'],
    pages: [
      { title: '课程概览 — 思维导图', type: 'cover',
        html: '<h2>思维导图与头脑风暴</h2><p>利用AI工具进行结构化思维整理、创意发散和方案策划，让思考更清晰、创意更丰富。</p><p><strong>学习目标：</strong>掌握思维导图和头脑风暴的系统方法，能够高效组织和表达复杂思想。</p>' },
      { title: '推荐工具 — 思维导图', type: 'tool',
        html: '<h2>思维导图推荐工具</h2><ul><li><strong>ChatGPT</strong> — 结构化输出、分类整理、逻辑梳理</li><li><strong>Miro AI</strong> — 协作式白板，AI生成思维导图</li><li><strong>Xmind AI</strong> — 专业思维导图软件，一键生成导图</li><li><strong>Claude</strong> — 深度分析，适合复杂问题拆解</li></ul><p><strong>其他工具：</strong>幕布（大纲转导图）、GitMind、ProcessOn</p>' },
      { title: '结构化思考方法', type: 'method',
        html: '<h2>MECE原则与结构化思考</h2><p><strong>MECE原则：</strong></p><p>Mutually Exclusive, Collectively Exhaustive（相互独立，完全穷尽）</p><p><strong>常用分类框架：</strong></p><ul><li><strong>二分法</strong>：问题→内部/外部原因</li><li><strong>过程法</strong>：按照时间/流程步骤分解</li><li><strong>要素法</strong>：按照组成部分分解</li><li><strong>矩阵法</strong>：重要/紧急四象限</li></ul><p><strong>AI辅助结构化：</strong></p><p><em>"请用MECE原则帮我分析[问题]，要求分类相互独立且完全穷尽。"</em></p>' },
      { title: '创意发散与收敛', type: 'prompt',
        html: '<h2>头脑风暴技巧</h2><p><strong>发散阶段（量变）：</strong></p><ul><li>设定时间限制（如10分钟）</li><li>不评判任何想法，全部记录</li><li>借助AI快速生成大量点子</li><li>跨界联想：借鉴其他领域的解决方案</li></ul><p><strong>收敛阶段（质变）：</strong></p><ul><li>分类整理所有想法</li><li>评估可行性、创新性、价值</li><li>投票或打分筛选</li><li>选出TOP 3深入展开</li></ul><p><strong>AI提示词：</strong><em>"请针对[问题]进行头脑风暴，生成20个创意方案，然后按可行性排序并选出前5个展开说明。"</em></p>' },
      { title: '问题拆解与方案设计', type: 'case',
        html: '<h2>复杂问题拆解方法</h2><p><strong>问题树分析法：</strong></p><ol><li>定义核心问题（树根）</li><li>分解为子问题（树枝）</li><li>继续拆解到可操作的粒度（树叶）</li><li>标注优先级和依赖关系</li></ol><p><strong>AI拆解提示词：</strong></p><p><em>"请将[复杂问题]拆解为问题树，要求：①3层深度；②每层3-5个分支；③标注每个子问题的优先级；④给出解决每个子问题的思路。"</em></p><p><strong>方案设计：</strong>对每个叶子节点生成解决方案，再整合为完整方案。</p>' },
      { title: '思维导图进阶技巧', type: 'advanced',
        html: '<h2>高阶思维导图技巧</h2><p><strong>进阶用法：</strong></p><ul><li><strong>概念图</strong>：用连线标注关系（因果关系、对比关系）</li><li><strong>鱼骨图</strong>：分析问题根因</li><li><strong>时间轴</strong>：项目规划、历史梳理</li><li><strong>组织结构图</strong>：团队分工、职责划分</li></ul><p><strong>美化原则：</strong></p><ul><li>主节点用图标区分</li><li>同层级用统一颜色</li><li>重点内容加粗/高亮</li><li>避免文字过多，关键词即可</li></ul>' },
      { title: '团队协作与会议应用', type: 'verify',
        html: '<h2>思维导图在团队协作中的应用</h2><p><strong>会议场景：</strong></p><ul><li>会前：用思维导图梳理议程</li><li>会中：实时记录讨论要点，可视化呈现</li><li>会后：整理决策和行动项</li></ul><p><strong>协作工具：</strong></p><ul><li>Miro：在线白板，多人实时协作</li><li>飞书文档：嵌入思维导图，关联文档</li><li>Notion：页面内嵌思维导图</li></ul><p><strong>AI会议纪要：</strong>将会议录音转文字后，用AI提取要点并生成思维导图。</p>' },
      { title: '避坑指南 — 思维导图', type: 'pitfall',
        html: '<h2>思维导图常见陷阱</h2><ul><li><strong>过度展开</strong> — 分支太多层级太深，反而看不清重点</li><li><strong>文字过多</strong> — 每个节点写一大段，失去导图意义</li><li><strong>缺乏关联</strong> — 节点之间孤立，没有体现知识关联</li><li><strong>形式大于内容</strong> — 花大量时间美化而忽略思考</li><li><strong>只画不用</strong> — 画完就存档，没有用于复习或行动</li><li><strong>照搬他人</strong> — 直接抄别人的导图，没有经过自己思考</li></ul>' },
      { title: '实战练习 — 思维导图', type: 'practice',
        html: '<h2>实战练习</h2><p><strong>基础练习：</strong></p><p>选择一个你正在学的知识点，用AI辅助生成思维导图，然后自己补充完善。</p><p><strong>进阶练习：</strong></p><p>针对一个实际问题（如"如何准备考研"），用问题树法拆解并生成完整思维导图。</p><p><strong>挑战练习：</strong></p><p>组织一次小组头脑风暴：用Miro白板+AI辅助，30分钟内针对一个课题产出20个创意并筛选出最佳方案。</p>' },
      { title: '课程总结 — 思维导图', type: 'summary',
        html: '<h2>思维导图与头脑风暴 — 核心要点</h2><ul><li><strong>结构要清晰</strong>：MECE原则，层级分明，逻辑递进</li><li><strong>内容要精炼</strong>：关键词而非长句，一看就懂</li><li><strong>创意要发散</strong>：先量变再质变，不评判任何想法</li><li><strong>问题要拆解</strong>：大问题拆成小问题，逐个击破</li><li><strong>成果要应用</strong>：导图不是目的，思考和行动才是</li></ul><p>思维导图是思考的脚手架，帮你搭好框架，内容还得自己填！</p>' }
    ]
  },

  13: { name: '数学建模与计算', tools: ['Wolfram Alpha','ChatGPT','Claude','DeepSeek'],
    pages: [
      { title: '课程概览 — 数学建模', type: 'cover',
        html: '<h2>数学建模与计算</h2><p>AI辅助数学建模、公式推导和复杂计算问题求解，让数学不再是你前进的障碍。</p><p><strong>学习目标：</strong>掌握AI辅助数学建模的方法，能够高效解决计算问题并验证结果。</p>' },
      { title: '推荐工具 — 数学建模', type: 'tool',
        html: '<h2>数学建模推荐工具</h2><ul><li><strong>Wolfram Alpha</strong> — 专业数学计算，符号运算、绘图、求解</li><li><strong>ChatGPT</strong> — 建模思路、公式推导、代码生成</li><li><strong>Claude</strong> — 长文本分析，适合复杂建模过程推导</li><li><strong>DeepSeek</strong> — 数学推理能力强，中文支持好</li></ul><p><strong>编程工具：</strong>Python（SciPy/NumPy/SymPy）、MATLAB、Mathematica</p>' },
      { title: '模型选择与问题分析', type: 'method',
        html: '<h2>数学建模问题分析</h2><p><strong>建模流程：</strong></p><ol><li><strong>问题理解</strong>：明确已知条件、求解目标、约束条件</li><li><strong>模型假设</strong>：简化现实问题，建立数学模型</li><li><strong>模型建立</strong>：选择适当的数学工具和方法</li><li><strong>模型求解</strong>：计算或编程实现</li><li><strong>模型验证</strong>：检验结果合理性</li></ol><p><strong>常见模型类型：</strong></p><ul><li>优化模型：线性规划、整数规划</li><li>预测模型：回归、时间序列、机器学习</li><li>评价模型：层次分析法、熵权法</li></ul>' },
      { title: '公式推导与符号计算', type: 'prompt',
        html: '<h2>AI辅助公式推导</h2><p><strong>推导提示词：</strong></p><p><em>"请推导[公式/定理]的完整过程，要求：①每一步标注依据；②解释关键变换的数学意义；③给出几何或物理直观解释。"</em></p><p><strong>符号计算工具：</strong></p><ul><li>Wolfram Alpha：输入公式直接求导/积分/化简</li><li>SymPy（Python）：免费开源符号计算库</li><li>MATLAB Symbolic Toolbox</li></ul><p><strong>验证方法：</strong>用不同工具验证同一结果，确保推导正确。</p>' },
      { title: '编程求解与数值计算', type: 'case',
        html: '<h2>AI辅助编程求解</h2><p><strong>代码生成提示词：</strong></p><p><em>"请用Python求解以下数学问题：[问题描述]。要求：①使用[库名]；②代码注释清晰；③输出结果可视化；④给出结果解读。"</em></p><p><strong>常用Python库：</strong></p><ul><li>NumPy：数值计算基础</li><li>SciPy：科学计算（优化、积分、插值）</li><li>SymPy：符号计算</li><li>Matplotlib：结果可视化</li><li>Pandas：数据处理</li></ul>' },
      { title: '结果验证与误差分析', type: 'advanced',
        html: '<h2>计算结果验证方法</h2><p><strong>验证策略：</strong></p><ul><li><strong>量纲检查</strong>：结果单位是否正确</li><li><strong>边界检验</strong>：极端情况下是否合理</li><li><strong>与已知解对比</strong>：特殊情况下是否有解析解</li><li><strong>数值稳定性</strong>：改变步长/精度，结果是否稳定</li></ul><p><strong>误差分析：</strong></p><ul><li>截断误差：数值方法的近似误差</li><li>舍入误差：计算机浮点数精度限制</li><li>模型误差：简化假设带来的偏差</li></ul>' },
      { title: '建模论文撰写', type: 'verify',
        html: '<h2>数学建模论文结构</h2><p><strong>标准结构：</strong></p><ol><li><strong>摘要</strong>：问题、方法、结果、结论（一页以内）</li><li><strong>问题重述</strong>：用自己的话描述问题</li><li><strong>模型假设</strong>：合理性说明</li><li><strong>符号说明</strong>：统一符号体系</li><li><strong>模型建立与求解</strong>：核心内容</li><li><strong>模型评价</strong>：优缺点分析</li></ol><p><strong>AI辅助：</strong>让AI检查论文逻辑是否完整，公式编号是否统一。</p>' },
      { title: '避坑指南 — 数学建模', type: 'pitfall',
        html: '<h2>数学建模常见陷阱</h2><ul><li><strong>模型过度复杂</strong> — 简单模型有时比复杂模型效果更好</li><li><strong>忽视假设合理性</strong> — 假设不现实导致模型失效</li><li><strong>数据错误</strong> — 输入数据有误，结果再好看也没用</li><li><strong>结果不验证</strong> — 不对结果进行合理性检验</li><li><strong>代码bug</strong> — AI生成的代码可能有逻辑错误</li><li><strong>抄袭代码</strong> — 比赛或作业中直接复制AI代码有风险</li></ul>' },
      { title: '实战练习 — 数学建模', type: 'practice',
        html: '<h2>实战练习</h2><p><strong>基础练习：</strong></p><p>选择一个简单优化问题，让AI辅助建立模型并生成求解代码。</p><p><strong>进阶练习：</strong></p><p>完成一道完整的数学建模题：从问题分析→模型建立→编程求解→结果验证→论文撰写。</p><p><strong>挑战练习：</strong></p><p>参加一次数学建模竞赛或模拟赛，全程使用AI工具辅助，赛后复盘AI帮助的边界和局限。</p>' },
      { title: '课程总结 — 数学建模', type: 'summary',
        html: '<h2>数学建模与计算 — 核心要点</h2><ul><li><strong>建模思路是关键</strong>：AI帮你计算，但模型设计靠你</li><li><strong>简化要合理</strong>：假设不能脱离现实，模型不能太复杂</li><li><strong>验证不可少</strong>：量纲、边界、稳定性三重检查</li><li><strong>代码要测试</strong>：AI代码务必运行验证</li><li><strong>论文要规范</strong>：结构完整、逻辑清晰、格式统一</li></ul><p>数学建模是艺术与科学的结合，AI是你的计算器，创意和判断力才是你的核心竞争力！</p>' }
    ]
  },

  14: { name: '时间管理与规划', tools: ['Notion AI','ChatGPT','Claude','Todoist AI'],
    pages: [
      { title: '课程概览 — 时间管理', type: 'cover',
        html: '<h2>时间管理与规划</h2><p>AI驱动的个人时间管理、任务优先级排序和学习计划制定，让你成为时间的主人。</p><p><strong>学习目标：</strong>建立科学的时间管理体系，提升学习和工作效率。</p>' },
      { title: '推荐工具 — 时间管理', type: 'tool',
        html: '<h2>时间管理推荐工具</h2><ul><li><strong>Notion AI</strong> — 智能日程规划、任务自动分类</li><li><strong>ChatGPT</strong> — 学习计划生成、时间分配建议</li><li><strong>Claude</strong> — 长期规划、目标拆解</li><li><strong>Todoist AI</strong> — 智能任务管理、优先级排序</li></ul><p><strong>经典工具：</strong>番茄ToDo、Forest（专注力）、滴答清单、飞书日历</p>' },
      { title: '目标设定与任务拆解', type: 'method',
        html: '<h2>SMART目标与任务拆解</h2><p><strong>SMART原则：</strong></p><ul><li><strong>S</strong>pecific — 具体：不要"学好英语"，要"背完雅思核心词汇"</li><li><strong>M</strong>easurable — 可衡量：量化指标，如"每天50个单词"</li><li><strong>A</strong>chievable — 可实现：目标要有挑战性但不过高</li><li><strong>R</strong>elevant — 相关：与长期目标一致</li><li><strong>T</strong>ime-bound — 时限：设定明确的deadline</li></ul><p><strong>AI拆解提示词：</strong></p><p><em>"我的目标是[目标]，deadline是[日期]，请帮我拆解为周计划和日计划，每天任务不超过3个。"</em></p>' },
      { title: '优先级排序与四象限法', type: 'prompt',
        html: '<h2>任务优先级管理</h2><p><strong>艾森豪威尔矩阵：</strong></p><ul><li><strong>重要且紧急</strong> → 立即做（截止日期临近的任务）</li><li><strong>重要不紧急</strong> → 计划做（长期目标、技能提升）</li><li><strong>紧急不重要</strong> → 委托做（琐事、干扰）</li><li><strong>不重要不紧急</strong> → 不做（刷短视频、无意义社交）</li></ul><p><strong>AI优先级提示词：</strong></p><p><em>"以下是我的任务列表，请帮我按四象限分类并给出执行顺序建议：[任务列表]"</em></p>' },
      { title: '番茄工作法与专注力', type: 'case',
        html: '<h2>番茄工作法深度实践</h2><p><strong>标准流程：</strong></p><ol><li>设定一个25分钟的计时器</li><li>专注做一件事，期间不做任何其他事</li><li>计时结束，休息5分钟</li><li>每4个番茄钟，休息15-30分钟</li></ol><p><strong>AI辅助专注：</strong></p><ul><li>让AI生成每日番茄钟计划</li><li>记录每个番茄钟的产出</li><li>分析高效时段和低效原因</li></ul><p><strong>进阶技巧：</strong>预估每个任务需要几个番茄钟，训练时间感知能力。</p>' },
      { title: '日程规划与习惯养成', type: 'advanced',
        html: '<h2>日程规划与习惯追踪</h2><p><strong>日程规划原则：</strong></p><ul><li>把最重要的事安排在精力最好的时段</li><li>预留缓冲时间（计划只排80%的时间）</li><li>固定时间做固定事，减少决策消耗</li></ul><p><strong>习惯养成（21天法则）：</strong></p><ul><li>选择1-2个核心习惯开始</li><li>设置提醒和打卡机制</li><li>设计奖励反馈</li><li>允许偶尔中断，不要完美主义</li></ul><p><strong>AI习惯提示词：</strong><em>"我想养成[习惯]，请帮我设计21天养成计划，包含每日具体行动和打卡表。"</em></p>' },
      { title: '复盘与持续优化', type: 'verify',
        html: '<h2>时间使用复盘方法</h2><p><strong>每日复盘（3分钟）：</strong></p><ul><li>今天完成了什么？</li><li>什么占用了最多时间？</li><li>明天最重要的3件事是什么？</li></ul><p><strong>周复盘（15分钟）：</strong></p><ul><li>本周目标完成度？</li><li>时间分配是否合理？</li><li>下周需要调整什么？</li></ul><p><strong>AI复盘提示词：</strong></p><p><em>"以下是我本周的时间记录和任务完成情况，请帮我分析：①时间使用效率；②改进建议；③下周优化方案。"</em></p>' },
      { title: '避坑指南 — 时间管理', type: 'pitfall',
        html: '<h2>时间管理常见陷阱</h2><ul><li><strong>计划过满</strong> — 排得太满没有缓冲，一个延误全盘乱</li><li><strong>完美主义</strong> — 花太多时间做计划而不行动</li><li><strong>多任务并行</strong> — 同时做多件事，效率反而更低</li><li><strong>拖延症</strong> — 用"准备"当借口一直不开始</li><li><strong>忽视休息</strong> — 不休息导致效率递减</li><li><strong>工具焦虑</strong> — 频繁换工具，时间花在学习工具上</li></ul>' },
      { title: '实战练习 — 时间管理', type: 'practice',
        html: '<h2>实战练习</h2><p><strong>基础练习：</strong></p><p>记录明天的时间使用情况（每半小时记录一次），用AI分析时间分配并提出优化建议。</p><p><strong>进阶练习：</strong></p><p>用AI生成一个月度学习计划，包含每周目标、每日任务和复盘模板。</p><p><strong>挑战练习：</strong></p><p>实践番茄工作法一周：每天记录番茄钟数量和产出，分析自己的高效时段和干扰源。</p>' },
      { title: '课程总结 — 时间管理', type: 'summary',
        html: '<h2>时间管理与规划 — 核心要点</h2><ul><li><strong>目标要SMART</strong>：具体、可衡量、可实现、相关、有时限</li><li><strong>优先级要清晰</strong>：四象限法，先做重要的事</li><li><strong>执行要专注</strong>：番茄工作法，一次只做一件事</li><li><strong>复盘要持续</strong>：每天3分钟，每周15分钟</li><li><strong>工具要简单</strong>：选一个好工具坚持用，不要频繁换</li></ul><p>时间管理的本质是精力管理，把最好的时间留给最重要的事！</p>' }
    ]
  },

  15: { name: '信息检索与事实核查', tools: ['Perplexity','ChatGPT','Kimi','天工AI'],
    pages: [
      { title: '课程概览 — 信息检索', type: 'cover',
        html: '<h2>信息检索与事实核查</h2><p>掌握AI工具进行多源信息检索、交叉验证和事实核查方法，在信息爆炸时代保持清醒判断。</p><p><strong>学习目标：</strong>建立系统化的信息检索和验证能力，能够识别虚假信息，做出基于事实的判断。</p>' },
      { title: '推荐工具 — 信息检索', type: 'tool',
        html: '<h2>信息检索推荐工具</h2><ul><li><strong>Perplexity</strong> — AI搜索引擎，提供带来源的问答</li><li><strong>ChatGPT</strong> — 多轮追问，深入挖掘信息</li><li><strong>Kimi</strong> — 长文本分析，适合深度调研</li><li><strong>天工AI</strong> — 国产搜索引擎，中文信息检索</li></ul><p><strong>传统工具：</strong>Google Scholar、百度学术、知乎、Wikipedia</p>' },
      { title: '搜索技巧与高级检索', type: 'method',
        html: '<h2>高效搜索技巧</h2><p><strong>搜索引擎高级语法：</strong></p><ul><li><code>"精确匹配"</code>：搜索完整短语</li><li><code>site:xxx.com</code>：限定网站搜索</li><li><code>filetype:pdf</code>：限定文件类型</li><li><code>intitle:关键词</code>：标题中包含关键词</li><li><code>-排除词</code>：排除特定内容</li></ul><p><strong>AI检索提示词：</strong></p><p><em>"请帮我检索关于[主题]的最新信息，要求：①提供多个来源；②标注发布时间；③区分事实和观点；④列出争议点。"</em></p>' },
      { title: '交叉验证与信源评估', type: 'prompt',
        html: '<h2>信息验证方法论</h2><p><strong>三角验证法：</strong></p><ol><li>从至少3个独立来源获取同一信息</li><li>对比各来源的表述是否一致</li><li>检查信息来源的可靠性和权威性</li></ol><p><strong>信源可信度评估：</strong></p><ul><li>权威机构 > 主流媒体 > 自媒体 > 匿名消息</li><li>一手来源 > 二手转述 > 三手传播</li><li>同行评审 > 预印本 > 博客文章</li></ul><p><strong>AI辅助验证：</strong></p><p><em>"以下是我找到的几个来源关于[事件]的说法，请帮我分析：①哪些说法一致；②哪些存在矛盾；③各来源的可信度如何。"</em></p>' },
      { title: '谣言识别与辟谣方法', type: 'case',
        html: '<h2>谣言识别 checklist</h2><p><strong>常见谣言特征：</strong></p><ul><li>情绪煽动：制造焦虑、愤怒、恐惧</li><li>信息模糊：没有时间、地点、来源</li><li>绝对化表述："100%有效""所有人都在用"</li><li>伪科学包装：滥用专业术语</li><li>盗用权威：伪造专家/机构背书</li></ul><p><strong>辟谣步骤：</strong></p><ol><li>反向搜索图片/视频（百度识图、Google Reverse Image）</li><li>查找官方/权威来源核实</li><li>使用事实核查网站（Snopes、FactCheck）</li><li>交叉验证关键信息</li></ol>' },
      { title: '信息整理与溯源追踪', type: 'advanced',
        html: '<h2>信息溯源与证据链</h2><p><strong>溯源追踪方法：</strong></p><ul><li>追溯信息最初发布来源</li><li>查看发布时间线</li><li>核实发布者身份和背景</li><li>检查信息是否被断章取义</li></ul><p><strong>证据链构建：</strong></p><ul><li>原始数据/文档</li><li>官方声明/报告</li><li>多方独立报道</li><li>专家分析评论</li></ul><p><strong>AI辅助：</strong>让AI帮你整理信息的时间线和来源脉络。</p>' },
      { title: '信息质量评估标准', type: 'verify',
        html: '<h2>信息质量评估框架</h2><p><strong>CRAAP测试：</strong></p><ul><li><strong>C</strong>urrency — 时效性：信息是否最新？</li><li><strong>R</strong>elevance — 相关性：是否与你需求相关？</li><li><strong>A</strong>uthority — 权威性：来源是否可信？</li><li><strong>A</strong>ccuracy — 准确性：是否有证据支持？</li><li><strong>P</strong>urpose — 目的性：是否存在偏见或利益？</li></ul><p><strong>AI评估提示词：</strong></p><p><em>"请用CRAAP框架评估以下信息的可靠性，并给出总体评分（1-5分）。"</em></p>' },
      { title: '避坑指南 — 信息检索', type: 'pitfall',
        html: '<h2>信息检索常见陷阱</h2><ul><li><strong>信息茧房</strong> — 只看算法推荐，视野越来越窄</li><li><strong>确认偏误</strong> — 只搜索支持自己观点的信息</li><li><strong>标题党误导</strong> — 不看原文只看标题</li><li><strong>过时信息</strong> — 引用的数据/政策已更新</li><li><strong>断章取义</strong> — 原文被截取后意思改变</li><li><strong>AI幻觉</strong> — AI可能编造不存在的信息</li></ul>' },
      { title: '实战练习 — 信息核查', type: 'practice',
        html: '<h2>实战练习</h2><p><strong>基础练习：</strong></p><p>选择一个最近的热点话题，用至少3个不同来源验证其核心事实，对比各来源的差异。</p><p><strong>进阶练习：</strong></p><p>找一条朋友圈/群聊中的"健康建议"，用CRAAP框架评估其可靠性，给出是否可信的结论。</p><p><strong>挑战练习：</strong></p><p>针对一个有争议的社会话题，收集正方和反方观点，用AI辅助整理双方论据和证据质量，形成客观的判断。</p>' },
      { title: '课程总结 — 信息检索', type: 'summary',
        html: '<h2>信息检索与事实核查 — 核心要点</h2><ul><li><strong>检索要全面</strong>：多个关键词、多个来源、多种渠道</li><li><strong>验证要交叉</strong>：三角验证，不轻信单一来源</li><li><strong>信源要评估</strong>：CRAAP框架，权威>专业>可靠</li><li><strong>谣言要识别</strong>：情绪煽动、信息模糊、绝对化是信号</li><li><strong>AI要核实</strong>：AI可能编造信息，关键事实必须人工验证</li></ul><p>在信息时代，检索和验证能力比记忆能力更重要！</p>' }
    ]
  },

  16: { name: '学术海报与图表制作', tools: ['Canva AI','ChatGPT','通义万相','Adobe Firefly'],
    pages: [
      { title: '课程概览 — 学术海报', type: 'cover',
        html: '<h2>学术海报与图表制作</h2><p>AI辅助学术海报设计、科研图表制作和数据可视化美化，让你的科研成果一眼吸睛。</p><p><strong>学习目标：</strong>掌握学术海报的设计规范和图表美化技巧，能够独立制作专业级的学术展示材料。</p>' },
      { title: '推荐工具 — 海报图表', type: 'tool',
        html: '<h2>学术海报与图表工具</h2><ul><li><strong>Canva AI</strong> — 海量模板，一键生成海报设计</li><li><strong>ChatGPT</strong> — 海报文案撰写、结构建议</li><li><strong>通义万相</strong> — AI生成配图和插图</li><li><strong>Adobe Firefly</strong> — 专业级图像生成和编辑</li></ul><p><strong>专业工具：</strong>PowerPoint、Illustrator、BioRender（生物图）、Plotly（交互图表）</p>' },
      { title: '海报布局与排版规范', type: 'method',
        html: '<h2>学术海报设计规范</h2><p><strong>标准结构（竖版A0）：</strong></p><ol><li><strong>标题区</strong>：论文标题+作者+单位（顶部居中）</li><li><strong>摘要区</strong>：研究背景+目的（左上）</li><li><strong>方法区</strong>：实验设计+技术路线（左中）</li><li><strong>结果区</strong>：数据+图表（中间主体）</li><li><strong>结论区</strong>：主要发现+意义（右下）</li><li><strong>致谢/引用</strong>：基金支持+参考文献（底部）</li></ol><p><strong>排版原则：</strong>从上到下、从左到右阅读流；重要内容放在视线上方。</p>' },
      { title: '图表美化与数据可视化', type: 'prompt',
        html: '<h2>科研图表美化原则</h2><p><strong>图表设计规范：</strong></p><ul><li>配色：学术蓝/灰为主，最多3种颜色</li><li>字体：中文宋体/黑体，英文Times/Arial</li><li>坐标轴：标注清晰，单位明确</li><li>图例：位置合理，不遮挡数据</li></ul><p><strong>AI图表优化提示词：</strong></p><p><em>"请优化以下图表设计，要求：①配色专业学术风；②字体大小统一；③去除多余网格线；④添加显著性标注。"</em></p>' },
      { title: '配色方案与视觉设计', type: 'case',
        html: '<h2>学术海报配色方案</h2><p><strong>推荐配色：</strong></p><ul><li><strong>经典学术</strong>：深蓝#1f4e79 + 浅蓝#bdd7ee + 白色</li><li><strong>清新自然</strong>：墨绿#2e7d32 + 浅绿#a5d6a7 + 白色</li><li><strong>现代简约</strong>：深灰#424242 + 橙色#ff9800 + 白色</li></ul><p><strong>设计原则：</strong></p><ul><li>背景用浅色，文字用深色</li><li>强调色不超过2个</li><li>留白充足，不要拥挤</li><li>图文比例约6:4</li></ul>' },
      { title: '插图绘制与图形规范', type: 'advanced',
        html: '<h2>科研插图绘制</h2><p><strong>插图类型：</strong></p><ul><li>机制图：展示研究原理和流程</li><li>流程图：实验步骤或算法流程</li><li>示意图：抽象概念可视化</li><li>照片：实验设备、样品照片</li></ul><p><strong>绘制工具：</strong></p><ul><li>BioRender：生命科学机制图首选</li><li>Adobe Illustrator：矢量图通用</li><li>PowerPoint：简单流程图</li><li>AI生成：概念示意图</li></ul><p><strong>规范：</strong>分辨率≥300dpi，矢量图优先，统一风格。</p>' },
      { title: '打印导出与展示技巧', type: 'verify',
        html: '<h2>海报打印与展示</h2><p><strong>导出规范：</strong></p><ul><li>格式：PDF（矢量图不丢失）</li><li>尺寸：按会议要求（通常A0 841×1189mm）</li><li>分辨率：≥300dpi</li><li>出血：四周留3-5mm安全边距</li><li>字体嵌入：防止字体丢失</li></ul><p><strong>展示技巧：</strong></p><ul><li>准备1分钟电梯演讲</li><li>准备3分钟详细讲解</li><li>准备常见问题的回答</li><li>带名片或二维码方便交流</li></ul>' },
      { title: '避坑指南 — 海报制作', type: 'pitfall',
        html: '<h2>学术海报常见陷阱</h2><ul><li><strong>文字太多</strong> — 海报不是论文，要图文结合</li><li><strong>字体太小</strong> — 1米外看不清，正文字号≥24pt</li><li><strong>图表模糊</strong> — 低分辨率图片打印后失真</li><li><strong>配色花哨</strong> — 学术海报要稳重，不要太鲜艳</li><li><strong>信息过载</strong> — 想放太多内容，反而没有重点</li><li><strong>缺乏亮点</strong> — 核心发现不突出，观众找不到重点</li></ul>' },
      { title: '实战练习 — 海报制作', type: 'practice',
        html: '<h2>实战练习</h2><p><strong>基础练习：</strong></p><p>选择一个简单主题，用Canva或PPT制作一页A3海报，练习基本排版和配色。</p><p><strong>进阶练习：</strong></p><p>基于一个实际研究项目，制作完整学术海报：包含摘要、方法、结果、结论四个板块。</p><p><strong>挑战练习：</strong></p><p>制作一个海报+配套图表包：1张主海报+3张数据图表+1张机制图，统一风格和配色。</p>' },
      { title: '课程总结 — 学术海报', type: 'summary',
        html: '<h2>学术海报与图表制作 — 核心要点</h2><ul><li><strong>结构要规范</strong>：标题→摘要→方法→结果→结论→引用</li><li><strong>图表要专业</strong>：配色学术、标注清晰、分辨率够</li><li><strong>文字要精简</strong>：关键词代替长句，图表说话</li><li><strong>视觉要统一</strong>：配色、字体、风格全篇一致</li><li><strong>核心要突出</strong>：最重要的发现放在最显眼位置</li></ul><p>好的学术海报让观众30秒get到你的核心贡献！</p>' }
    ]
  },

  17: { name: '项目申报书撰写', tools: ['ChatGPT','Claude','DeepSeek','通义千问'],
    pages: [
      { title: '课程概览 — 项目申报书', type: 'cover',
        html: '<h2>项目申报书撰写</h2><p>AI辅助科研项目申报书、双创计划书等申报材料的撰写，提高申报成功率。</p><p><strong>学习目标：</strong>掌握项目申报书的写作规范和技巧，能够独立完成高质量的申报材料。</p>' },
      { title: '推荐工具 — 申报书撰写', type: 'tool',
        html: '<h2>申报书撰写推荐工具</h2><ul><li><strong>ChatGPT</strong> — 内容生成、逻辑梳理、语言润色</li><li><strong>Claude</strong> — 长文本分析，适合申报书整体诊断</li><li><strong>DeepSeek</strong> — 中文写作优秀，适合国自然/社科申报</li><li><strong>通义千问</strong> — 政策理解好，适合政府项目申报</li></ul><p><strong>辅助工具：</strong>知网（文献支撑）、Grammarly（英文申报）、Excel（预算表）</p>' },
      { title: '申报书结构与写作要点', type: 'method',
        html: '<h2>申报书标准结构</h2><p><strong>核心模块：</strong></p><ol><li><strong>项目简介</strong>：300字概括，评审专家的第一印象</li><li><strong>研究背景</strong>：问题来源+国内外现状+研究空白</li><li><strong>研究目标</strong>：具体、可考核的目标（3-5个）</li><li><strong>研究内容</strong>：详细的技术路线和研究方案</li><li><strong>创新点</strong>：理论/方法/应用创新（至少2个）</li><li><strong>可行性</strong>：团队基础+条件保障+前期工作</li></ol>' },
      { title: '创新点提炼与包装', type: 'prompt',
        html: '<h2>创新点提炼技巧</h2><p><strong>创新点写作公式：</strong></p><p><em>首次/首次将[方法A]应用于[领域B]，解决了[问题C]，实现了[效果D]</em></p><p><strong>创新类型：</strong></p><ul><li>理论创新：提出新理论/模型/框架</li><li>方法创新：改进现有方法或提出新方法</li><li>应用创新：将成熟技术应用于新领域</li><li>集成创新：多技术融合产生新效果</li></ul><p><strong>AI提示词：</strong><em>"基于以下研究内容，请帮我提炼3个创新点，要求：①表述学术化；②突出原创性；③与现有研究形成对比。"</em></p>' },
      { title: '研究方案与技术路线', type: 'case',
        html: '<h2>技术路线设计</h2><p><strong>技术路线图要素：</strong></p><ul><li>阶段划分：准备期→实施期→总结期</li><li>任务分解：每个阶段的具体任务</li><li>时间节点：里程碑和检查点</li><li>成果产出：每个阶段的交付物</li></ul><p><strong>AI辅助设计：</strong></p><p><em>"请为以下研究内容设计技术路线图，要求：①用流程图形式描述；②标注每个阶段的时间安排；③说明阶段间的逻辑关系；④列出风险点和应对措施。"</em></p>' },
      { title: '预算编制与团队展示', type: 'advanced',
        html: '<h2>预算编制与团队介绍</h2><p><strong>预算编制原则：</strong></p><ul><li>合理合规：符合资助方的规定</li><li>实事求是：不虚高也不压缩</li><li>明细清晰：设备/材料/差旅/劳务分项列出</li></ul><p><strong>团队展示要点：</strong></p><ul><li>负责人：学术背景+相关成果</li><li>团队成员：分工明确，优势互补</li><li>合作单位：如有，说明合作基础</li></ul><p><strong>AI辅助：</strong>让AI检查预算比例是否合理，团队分工是否完整。</p>' },
      { title: '申报书质量检查', type: 'verify',
        html: '<h2>申报书自查清单</h2><p><strong>内容检查：</strong></p><ul><li>目标是否具体可考核？</li><li>创新点是否站得住脚？</li><li>技术路线是否可行？</li><li>预算是否合理？</li></ul><p><strong>形式检查：</strong></p><ul><li>字数是否符合要求？</li><li>格式是否规范？</li><li>参考文献是否完整？</li><li>有无错别字？</li></ul><p><strong>AI审查提示词：</strong><em>"请审查以下申报书，从逻辑性、创新性、可行性三个维度给出评分和改进建议。"</em></p>' },
      { title: '避坑指南 — 申报书', type: 'pitfall',
        html: '<h2>申报书常见陷阱</h2><ul><li><strong>目标太空泛</strong> — "深入研究""探索机制"不够具体</li><li><strong>创新点不新</strong> — 业内已有大量类似工作</li><li><strong>技术路线模糊</strong> — 说不清具体怎么做</li><li><strong>团队不相关</strong> — 成员背景与项目关联度低</li><li><strong>预算不合理</strong> — 明显偏高或偏低</li><li><strong>格式不规范</strong> — 不按要求填写，直接出局</li></ul>' },
      { title: '实战练习 — 申报书', type: 'practice',
        html: '<h2>实战练习</h2><p><strong>基础练习：</strong></p><p>选择一个研究方向，用AI辅助生成一份申报书的「项目简介」和「研究背景」部分。</p><p><strong>进阶练习：</strong></p><p>完整撰写一份大创/挑战杯申报书，包含所有核心模块，用AI辅助润色和逻辑检查。</p><p><strong>挑战练习：</strong></p><p>找一份真实的申报书模板，按要求完整填写所有内容，进行模拟评审并迭代优化。</p>' },
      { title: '课程总结 — 申报书', type: 'summary',
        html: '<h2>项目申报书撰写 — 核心要点</h2><ul><li><strong>问题要真</strong>：研究问题要有真实需求和学术价值</li><li><strong>目标要实</strong>：具体、可考核，不要空泛</li><li><strong>创新要亮</strong>：至少2个明确的创新点，与现有工作对比</li><li><strong>方案要细</strong>：技术路线清晰，时间节点明确</li><li><strong>格式要规</strong>：严格按照模板要求，细节决定成败</li></ul><p>好的申报书是改出来的，多轮迭代+专家意见=高通过率！</p>' }
    ]
  },

  18: { name: '语音合成与识别', tools: ['剪映AI','讯飞星火','Whisper','ElevenLabs'],
    pages: [
      { title: '课程概览 — 语音合成识别', type: 'cover',
        html: '<h2>语音合成与识别</h2><p>利用AI语音工具进行文字转语音、语音转文字和音频处理，让声音成为你的生产力工具。</p><p><strong>学习目标：</strong>掌握AI语音技术的核心应用，能够高效处理语音相关的各类任务。</p>' },
      { title: '推荐工具 — 语音技术', type: 'tool',
        html: '<h2>语音技术推荐工具</h2><ul><li><strong>剪映AI</strong> — 文字转语音、智能字幕、音频处理一站式</li><li><strong>讯飞星火</strong> — 中文语音识别准确率最高</li><li><strong>Whisper</strong> — OpenAI开源，多语言支持好</li><li><strong>ElevenLabs</strong> — 英文语音合成质量最高，情感丰富</li></ul><p><strong>其他工具：</strong>微软Azure语音、百度语音、腾讯云智能语音</p>' },
      { title: '语音转文字技术', type: 'method',
        html: '<h2>语音识别最佳实践</h2><p><strong>提高识别准确率的方法：</strong></p><ul><li>使用高质量麦克风，减少环境噪音</li><li>语速适中，发音清晰</li><li>选择支持该语言的模型</li><li>上传前进行降噪处理</li></ul><p><strong>应用场景：</strong></p><ul><li>会议记录：实时转写会议内容</li><li>课堂笔记：录音转文字整理</li><li>采访整理：采访录音快速转录</li><li>字幕生成：视频自动加字幕</li></ul>' },
      { title: '文字转语音技巧', type: 'prompt',
        html: '<h2>语音合成优化</h2><p><strong>参数调节：</strong></p><ul><li>语速：0.8x-1.2x，根据内容调整</li><li>音调：选择适合内容风格的音色</li><li>停顿：在标点处适当停顿</li><li>情感：部分工具支持情感调节</li></ul><p><strong>应用场景：</strong></p><ul><li>有声书/文章朗读</li><li>视频旁白/配音</li><li>语音提示/导航</li><li>辅助阅读（视障人士）</li></ul><p><strong>提示：</strong>中文推荐讯飞/剪映，英文推荐ElevenLabs。</p>' },
      { title: '音频处理与优化', type: 'case',
        html: '<h2>AI音频处理技术</h2><p><strong>常见处理需求：</strong></p><ul><li><strong>降噪</strong>：去除背景噪音，突出人声</li><li><strong>去混响</strong>：消除回声效果</li><li><strong>音量均衡</strong>：统一不同片段音量</li><li><strong>静音检测</strong>：自动删除无声片段</li></ul><p><strong>工具推荐：</strong></p><ul><li>Adobe Podcast（免费在线音频增强）</li><li>Audacity（免费开源音频编辑）</li><li>剪映（一键音频处理）</li></ul>' },
      { title: '多语言语音处理', type: 'advanced',
        html: '<h2>多语言语音应用</h2><p><strong>Whisper多语言识别：</strong></p><ul><li>支持99种语言</li><li>自动检测语言类型</li><li>支持翻译为英文</li></ul><p><strong>跨语言语音克隆：</strong></p><ul><li>ElevenLabs支持28种语言语音克隆</li><li>用你的声音说不同语言</li><li>保持音色和语调一致</li></ul><p><strong>应用场景：</strong>多语言视频配音、跨语言会议翻译</p>' },
      { title: '语音质量评估', type: 'verify',
        html: '<h2>语音质量检查标准</h2><p><strong>识别质量评估：</strong></p><ul><li>字准确率（WER）：错误字数/总字数</li><li>语义准确率：关键信息是否识别正确</li><li>标点准确率：断句是否合理</li></ul><p><strong>合成质量评估：</strong></p><ul><li>自然度：是否像真人说话</li><li>清晰度：发音是否清楚</li><li>情感表达：是否符合内容情绪</li><li>多音字处理：是否正确发音</li></ul><p><strong>建议：</strong>AI生成后人工听一遍，修正错误。</p>' },
      { title: '避坑指南 — 语音技术', type: 'pitfall',
        html: '<h2>语音技术常见陷阱</h2><ul><li><strong>方言识别差</strong> — 普通话识别率高，方言/口音可能出错</li><li><strong>专业术语误识别</strong> — 生僻词、专业名词容易识别错误</li><li><strong>多人对话混乱</strong> — 不区分说话人，内容混在一起</li><li><strong>标点不准确</strong> — AI添加的标点可能不合理</li><li><strong>版权风险</strong> — 语音克隆涉及肖像权和声音权</li><li><strong>隐私泄露</strong> — 语音数据上传到云端有风险</li></ul>' },
      { title: '实战练习 — 语音技术', type: 'practice',
        html: '<h2>实战练习</h2><p><strong>基础练习：</strong></p><p>录一段5分钟的讲话，分别用讯飞和Whisper转文字，对比识别准确率和差异。</p><p><strong>进阶练习：</strong></p><p>选择一篇文章，用AI生成语音朗读，调整语速和音色，导出为音频文件。</p><p><strong>挑战练习：</strong></p><p>完成一个视频项目：录制视频→语音识别生成字幕→文字转语音做旁白→音频降噪处理→导出成品。</p>' },
      { title: '课程总结 — 语音技术', type: 'summary',
        html: '<h2>语音合成与识别 — 核心要点</h2><ul><li><strong>识别要清晰</strong>：好麦克风+安静环境+清晰发音</li><li><strong>合成要自然</strong>：选择合适音色，调节语速停顿</li><li><strong>处理要精细</strong>：降噪、均衡、去混响提升音质</li><li><strong>质量要检查</strong>：AI输出后人工核对关键内容</li><li><strong>隐私要注意</strong>：敏感语音避免上传公共平台</li></ul><p>语音技术正在改变信息获取方式，用好它可以让你的学习和工作效率倍增！</p>' }
    ]
  }
};

async function seed() {
  const conn = await pool.getConnection();
  try {
    await conn.query('TRUNCATE TABLE ppt_slides');
    console.log('已清空 ppt_slides 表');

    let total = 0;
    for (let skillId = 1; skillId <= 18; skillId++) {
      const skill = skillSlides[skillId];
      if (!skill) {
        console.log(`技能 ${skillId} 数据缺失，跳过`);
        continue;
      }
      
      for (let i = 0; i < skill.pages.length; i++) {
        const page = skill.pages[i];
        await conn.query(
          'INSERT INTO ppt_slides (skill_id, title, type, content, tools, sort_order) VALUES (?, ?, ?, ?, ?, ?)',
          [skillId, page.title, page.type, JSON.stringify({ html: page.html }), JSON.stringify(i === 1 ? skill.tools : []), i]
        );
        total++;
      }
      console.log(`技能 ${skillId} (${skill.name}) - ${skill.pages.length} 页幻灯片已插入`);
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
