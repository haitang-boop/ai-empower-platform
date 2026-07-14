import pymysql
pymysql.install_as_MySQLdb()

from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = 'django-insecure-ai_empower_whut_2026_secret_key'

DEBUG = True

ALLOWED_HOSTS = ['*']

# simpleui 必须放在 admin 前面
INSTALLED_APPS = [
    'simpleui',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'core',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'ai_empower.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'ai_empower.wsgi.application'

# ============================================================
# MySQL 数据库配置 - 连接已有的 ai_empower 数据库
# ============================================================
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'ai_empower',
        'USER': 'root',
        'PASSWORD': '',
        'HOST': 'localhost',
        'PORT': 3306,
        'OPTIONS': {
            'charset': 'utf8mb4',
            'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
        },
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# ============================================================
# 中文化配置
# ============================================================
LANGUAGE_CODE = 'zh-hans'
TIME_ZONE = 'Asia/Shanghai'
USE_I18N = True
USE_TZ = True

STATIC_URL = 'static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# ============================================================
# SimpleUI 配置 - 武汉理工大学蓝黄配色
# ============================================================
SIMPLEUI_HOME_TITLE = 'AI赋能大学生技能PPT教程平台'
SIMPLEUI_HOME_ICON = 'fa fa-graduation-cap'
SIMPLEUI_LOGO = 'AI赋能平台'
SIMPLEUI_HOME_INFO = False
SIMPLEUI_ANALYSIS = False
SIMPLEUI_DEFAULT_THEME = 'blue.css'

# 自定义菜单
SIMPLEUI_CONFIG = {
    'system_keep': False,
    'menu_display': ['内容管理', '用户管理', '权限认证'],
    'menus': [
        {
            'name': '内容管理',
            'icon': 'fas fa-book',
            'models': [
                {'name': '场景管理', 'icon': 'fa fa-layer-group', 'url': '/admin/core/scenario/'},
                {'name': '技能管理', 'icon': 'fa fa-graduation-cap', 'url': '/admin/core/skill/'},
                {'name': 'PPT幻灯片', 'icon': 'fa fa-file-powerpoint', 'url': '/admin/core/pptslide/'},
                {'name': 'AI模型', 'icon': 'fa fa-robot', 'url': '/admin/core/aimodel/'},
            ]
        },
        {
            'name': '用户管理',
            'icon': 'fas fa-users',
            'models': [
                {'name': '用户', 'icon': 'fa fa-user', 'url': '/admin/core/user/'},
                {'name': '学习进度', 'icon': 'fa fa-chart-line', 'url': '/admin/core/userprogress/'},
                {'name': '收藏记录', 'icon': 'fa fa-star', 'url': '/admin/core/userfavorite/'},
            ]
        },
        {
            'name': '权限认证',
            'icon': 'fas fa-shield-alt',
            'models': [
                {'name': '用户', 'icon': 'fa fa-user', 'url': '/admin/auth/user/'},
                {'name': '用户组', 'icon': 'fa fa-users', 'url': '/admin/auth/group/'},
            ]
        },
    ]
}