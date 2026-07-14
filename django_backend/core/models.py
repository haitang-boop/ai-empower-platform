from django.db import models

# ============================================================
# 用户表 - 对应已有的 users 表
# ============================================================
class User(models.Model):
    username = models.CharField(max_length=50, unique=True, verbose_name='用户名')
    email = models.CharField(max_length=100, unique=True, verbose_name='邮箱')
    password_hash = models.CharField(max_length=255, verbose_name='密码哈希', db_column='password_hash')
    nickname = models.CharField(max_length=50, blank=True, null=True, verbose_name='昵称')
    avatar = models.CharField(max_length=255, blank=True, null=True, verbose_name='头像')
    role = models.CharField(max_length=20, default='user', verbose_name='角色')  # enum('user','admin','editor')
    status = models.CharField(max_length=20, default='active', verbose_name='状态')  # enum('active','disabled')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='创建时间')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='更新时间')

    class Meta:
        managed = False
        db_table = 'users'
        verbose_name = '用户'
        verbose_name_plural = '用户'

    def __str__(self):
        return f'{self.username} ({self.nickname or ""})'


# ============================================================
# 场景表
# ============================================================
class Scenario(models.Model):
    name = models.CharField(max_length=100, verbose_name='场景名称')
    icon = models.CharField(max_length=100, blank=True, null=True, verbose_name='图标')
    description = models.TextField(blank=True, null=True, verbose_name='描述')
    sub_count = models.IntegerField(default=0, verbose_name='子项数量')
    sort_order = models.IntegerField(default=0, verbose_name='排序')
    status = models.IntegerField(default=1, verbose_name='状态')  # tinyint(1)
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='创建时间')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='更新时间')

    class Meta:
        managed = False
        db_table = 'scenarios'
        verbose_name = '场景'
        verbose_name_plural = '场景'

    def __str__(self):
        return self.name


# ============================================================
# 技能表
# ============================================================
class Skill(models.Model):
    code = models.CharField(max_length=20, unique=True, verbose_name='技能编码')
    name = models.CharField(max_length=100, verbose_name='技能名称')
    icon = models.CharField(max_length=100, blank=True, null=True, verbose_name='图标')
    description = models.TextField(blank=True, null=True, verbose_name='描述')
    tool_list = models.TextField(blank=True, null=True, verbose_name='推荐工具')  # JSON 类型，用 TextField 避免 pymysql 兼容问题
    sort_order = models.IntegerField(default=0, verbose_name='排序')
    status = models.IntegerField(default=1, verbose_name='状态')  # tinyint(1)
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='创建时间')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='更新时间')

    class Meta:
        managed = False
        db_table = 'skills'
        verbose_name = '技能'
        verbose_name_plural = '技能'

    def __str__(self):
        return f'{self.code} - {self.name}'


# ============================================================
# 场景-技能关联表
# ============================================================
class ScenarioSkill(models.Model):
    scenario = models.ForeignKey(Scenario, on_delete=models.CASCADE, verbose_name='场景')
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE, verbose_name='技能')

    class Meta:
        managed = False
        db_table = 'scenario_skills'
        unique_together = (('scenario', 'skill'),)
        verbose_name = '场景技能关联'
        verbose_name_plural = '场景技能关联'

    def __str__(self):
        return f'{self.scenario.name} → {self.skill.name}'


# ============================================================
# PPT幻灯片表
# ============================================================
class PptSlide(models.Model):
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE, verbose_name='所属技能')
    title = models.CharField(max_length=200, verbose_name='标题')
    type = models.CharField(max_length=50, default='slide', verbose_name='类型')
    content = models.TextField(blank=True, null=True, verbose_name='内容')  # MySQL JSON 类型，用 TextField 避免 pymysql 兼容问题
    tools = models.TextField(blank=True, null=True, verbose_name='工具列表')  # MySQL JSON 类型，用 TextField 避免 pymysql 兼容问题
    sort_order = models.IntegerField(default=0, verbose_name='排序')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='创建时间')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='更新时间')

    class Meta:
        managed = False
        db_table = 'ppt_slides'
        verbose_name = 'PPT幻灯片'
        verbose_name_plural = 'PPT幻灯片'
        ordering = ['sort_order']

    def __str__(self):
        return f'{self.skill.name} - {self.title}'


# ============================================================
# 用户学习进度表
# ============================================================
class UserProgress(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name='用户')
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE, verbose_name='技能')
    current_slide = models.IntegerField(default=0, verbose_name='当前幻灯片')
    completed = models.CharField(max_length=10, default='no', verbose_name='是否完成')  # enum('yes','no')
    last_study_at = models.DateTimeField(blank=True, null=True, verbose_name='最后学习时间')

    class Meta:
        managed = False
        db_table = 'user_progress'
        unique_together = (('user', 'skill'),)
        verbose_name = '学习进度'
        verbose_name_plural = '学习进度'

    def __str__(self):
        return f'{self.user.username} - {self.skill.name}'


# ============================================================
# 用户收藏表
# ============================================================
class UserFavorite(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name='用户')
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE, verbose_name='技能')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='创建时间')

    class Meta:
        managed = False
        db_table = 'user_favorites'
        unique_together = (('user', 'skill'),)
        verbose_name = '收藏记录'
        verbose_name_plural = '收藏记录'

    def __str__(self):
        return f'{self.user.username} 收藏 {self.skill.name}'


# ============================================================
# AI模型表
# ============================================================
class AiModel(models.Model):
    name = models.CharField(max_length=100, verbose_name='模型名称')
    developer = models.CharField(max_length=100, verbose_name='开发者')
    free_quota = models.CharField(max_length=100, blank=True, null=True, verbose_name='免费额度')
    chinese_ability = models.IntegerField(default=0, verbose_name='中文能力')
    academic_writing = models.IntegerField(default=0, verbose_name='学术写作')
    code_gen = models.IntegerField(default=0, verbose_name='代码生成')
    logic_reasoning = models.IntegerField(default=0, verbose_name='逻辑推理')
    long_text = models.IntegerField(default=0, verbose_name='长文本')
    image_gen = models.IntegerField(default=0, verbose_name='图像生成')
    best_scenario = models.TextField(blank=True, null=True, verbose_name='最佳场景')
    rating = models.DecimalField(max_digits=2, decimal_places=1, default=0.0, verbose_name='评分')
    sort_order = models.IntegerField(default=0, verbose_name='排序')

    class Meta:
        managed = False
        db_table = 'ai_models'
        verbose_name = 'AI模型'
        verbose_name_plural = 'AI模型'

    def __str__(self):
        return f'{self.name} ({self.developer})'
