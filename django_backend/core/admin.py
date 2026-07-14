from django.contrib import admin
from django.utils.html import format_html
from .models import (
    User, Scenario, Skill, ScenarioSkill,
    PptSlide, UserProgress, UserFavorite, AiModel
)

# 注册所有模型到 Django admin
@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'username', 'email', 'nickname', 'role', 'status', 'created_at')
    list_filter = ('role', 'status')
    search_fields = ('username', 'email', 'nickname')
    ordering = ('id',)
    list_per_page = 20


@admin.register(Scenario)
class ScenarioAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'icon', 'description', 'sub_count', 'sort_order', 'status')
    list_filter = ('status',)
    search_fields = ('name', 'description')
    ordering = ('sort_order', 'id')
    list_per_page = 20


@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ('id', 'code', 'name', 'description', 'sort_order', 'status')
    list_filter = ('status',)
    search_fields = ('name', 'code', 'description')
    ordering = ('sort_order', 'id')
    list_per_page = 20


@admin.register(ScenarioSkill)
class ScenarioSkillAdmin(admin.ModelAdmin):
    list_display = ('id', 'scenario', 'skill')
    list_filter = ('scenario',)
    search_fields = ('scenario__name', 'skill__name')
    ordering = ('scenario', 'id')
    list_per_page = 50


@admin.register(PptSlide)
class PptSlideAdmin(admin.ModelAdmin):
    list_display = ('id', 'skill', 'title', 'type', 'sort_order')
    list_filter = ('skill', 'type')
    search_fields = ('title', 'skill__name')
    ordering = ('skill', 'sort_order')
    list_per_page = 20


@admin.register(UserProgress)
class UserProgressAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'skill', 'current_slide', 'completed', 'last_study_at')
    list_filter = ('user', 'completed')
    search_fields = ('user__username', 'skill__name')
    ordering = ('-last_study_at',)
    list_per_page = 30


@admin.register(UserFavorite)
class UserFavoriteAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'skill', 'created_at')
    list_filter = ('user',)
    search_fields = ('user__username', 'skill__name')
    ordering = ('-created_at',)
    list_per_page = 30


@admin.register(AiModel)
class AiModelAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'developer', 'free_quota', 'chinese_ability_colored', 'code_gen', 'rating', 'sort_order')
    list_filter = ('developer',)
    search_fields = ('name', 'developer', 'best_scenario')
    ordering = ('sort_order', 'id')
    list_per_page = 20

    def chinese_ability_colored(self, obj):
        if obj.chinese_ability >= 8:
            return format_html('<span style="color: green;">{}</span>', obj.chinese_ability)
        elif obj.chinese_ability >= 4:
            return format_html('<span style="color: orange;">{}</span>', obj.chinese_ability)
        else:
            return format_html('<span style="color: #ccc;">{}</span>', obj.chinese_ability)
    chinese_ability_colored.short_description = '中文能力'

# 自定义 admin site 标题
admin.site.site_header = 'AI赋能大学生技能PPT教程平台 - 管理后台'
admin.site.site_title = 'AI赋能平台'
admin.site.index_title = '欢迎使用 AI 赋能平台管理后台'
