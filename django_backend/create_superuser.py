#!/usr/bin/env python3
"""
创建超级管理员
"""
import os
import sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ai_empower.settings')
django.setup()

from django.contrib.auth import get_user_model
from core.models import User as CoreUser

User = get_user_model()

# 创建 Django auth 超级用户
if not User.objects.filter(username='yananbaoyan').exists():
    user = User.objects.create_superuser(
        username='yananbaoyan',
        email='2110107344@qq.com',
        password='yanan123456'
    )
    print(f"✓ Django auth 超级用户创建成功: {user.username}")
else:
    print("✓ Django auth 超级用户已存在")

print("\n超级管理员信息:")
print(f"  用户名: yananbaoyan")
print(f"  邮箱: 2110107344@qq.com")
print(f"  密码: yanan123456")
print(f"  昵称: 研岸")
