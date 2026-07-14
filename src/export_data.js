const fs = require('fs');
const path = require('path');
const http = require('http');

function fetch(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch(e) { reject(e); }
      });
    }).on('error', reject);
  });
}

const outDir = path.join(__dirname, '..', '..', 'frontend', 'public', 'data');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

(async () => {
  try {
    // 导出PPT幻灯片（按技能分组的完整数据）
    const pptBySkill = {};
    for (let skillId = 1; skillId <= 18; skillId++) {
      const res = await fetch(`http://localhost:3000/api/ppt/skill/${skillId}`);
      pptBySkill[skillId] = res.data || [];
      console.log(`PPT: 技能${skillId} - ${(res.data || []).length} 页`);
    }
    fs.writeFileSync(path.join(outDir, 'ppt_slides.json'), JSON.stringify(pptBySkill));

    // 导出AI模型数据
    const models = await fetch('http://localhost:3000/api/ai-models');
    fs.writeFileSync(path.join(outDir, 'ai_models.json'), JSON.stringify(models.data || []));
    console.log(`AI模型: ${(models.data || []).length} 个`);

    console.log('\n全部数据导出完成！');
  } catch (err) {
    console.error('导出失败:', err.message);
  }
})();
