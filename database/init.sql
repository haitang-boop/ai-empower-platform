-- ============================================================
-- AI赋能大学生技能PPT教程平台 - 数据库初始化脚本
-- Database: ai_empower
-- ============================================================

CREATE DATABASE IF NOT EXISTS ai_empower
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE ai_empower;

-- ============================================================
-- 用户表
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id          INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  username    VARCHAR(50)     NOT NULL,
  email       VARCHAR(100)    NOT NULL,
  password_hash VARCHAR(255)  NOT NULL,
  nickname    VARCHAR(50)     DEFAULT NULL,
  avatar      VARCHAR(255)    DEFAULT NULL,
  role        ENUM('user','admin','editor') NOT NULL DEFAULT 'user',
  status      ENUM('active','disabled')     NOT NULL DEFAULT 'active',
  created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_username (username),
  UNIQUE KEY uk_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 场景表
-- ============================================================
CREATE TABLE IF NOT EXISTS scenarios (
  id          INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  name        VARCHAR(100)    NOT NULL,
  icon        VARCHAR(100)    DEFAULT NULL,
  description TEXT            DEFAULT NULL,
  sub_count   INT UNSIGNED    NOT NULL DEFAULT 0,
  sort_order  INT UNSIGNED    NOT NULL DEFAULT 0,
  status      TINYINT(1)      NOT NULL DEFAULT 1,
  created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 技能表
-- ============================================================
CREATE TABLE IF NOT EXISTS skills (
  id          INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  code        VARCHAR(20)     NOT NULL,
  name        VARCHAR(100)    NOT NULL,
  icon        VARCHAR(100)    DEFAULT NULL,
  description TEXT            DEFAULT NULL,
  tool_list   JSON            DEFAULT NULL,
  sort_order  INT UNSIGNED    NOT NULL DEFAULT 0,
  status      TINYINT(1)      NOT NULL DEFAULT 1,
  created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 场景-技能关联表
-- ============================================================
CREATE TABLE IF NOT EXISTS scenario_skills (
  id          INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  scenario_id INT UNSIGNED    NOT NULL,
  skill_id    INT UNSIGNED    NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_scenario_skill (scenario_id, skill_id),
  KEY idx_skill (skill_id),
  CONSTRAINT fk_ss_scenario FOREIGN KEY (scenario_id) REFERENCES scenarios(id) ON DELETE CASCADE,
  CONSTRAINT fk_ss_skill    FOREIGN KEY (skill_id)    REFERENCES skills(id)    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- PPT幻灯片表
-- ============================================================
CREATE TABLE IF NOT EXISTS ppt_slides (
  id          INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  skill_id    INT UNSIGNED    NOT NULL,
  title       VARCHAR(200)    NOT NULL,
  type        VARCHAR(50)     NOT NULL DEFAULT 'slide',
  content     JSON            DEFAULT NULL,
  tools       JSON            DEFAULT NULL,
  sort_order  INT UNSIGNED    NOT NULL DEFAULT 0,
  created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_skill (skill_id),
  CONSTRAINT fk_slides_skill FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 用户学习进度表
-- ============================================================
CREATE TABLE IF NOT EXISTS user_progress (
  id            INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  user_id       INT UNSIGNED  NOT NULL,
  skill_id      INT UNSIGNED  NOT NULL,
  current_slide INT UNSIGNED  NOT NULL DEFAULT 0,
  completed     ENUM('yes','no') NOT NULL DEFAULT 'no',
  last_study_at DATETIME      DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_user_skill (user_id, skill_id),
  KEY idx_skill (skill_id),
  CONSTRAINT fk_progress_user  FOREIGN KEY (user_id)  REFERENCES users(id)  ON DELETE CASCADE,
  CONSTRAINT fk_progress_skill FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 用户收藏表
-- ============================================================
CREATE TABLE IF NOT EXISTS user_favorites (
  id          INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  user_id     INT UNSIGNED    NOT NULL,
  skill_id    INT UNSIGNED    NOT NULL,
  created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_user_skill (user_id, skill_id),
  KEY idx_skill (skill_id),
  CONSTRAINT fk_fav_user  FOREIGN KEY (user_id)  REFERENCES users(id)  ON DELETE CASCADE,
  CONSTRAINT fk_fav_skill FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- AI模型对比表
-- ============================================================
CREATE TABLE IF NOT EXISTS ai_models (
  id              INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  name            VARCHAR(100)  NOT NULL,
  developer       VARCHAR(100)  NOT NULL,
  free_quota      VARCHAR(100)  DEFAULT NULL,
  chinese_ability INT UNSIGNED  NOT NULL DEFAULT 0,
  academic_writing INT UNSIGNED NOT NULL DEFAULT 0,
  code_gen        INT UNSIGNED  NOT NULL DEFAULT 0,
  logic_reasoning INT UNSIGNED  NOT NULL DEFAULT 0,
  long_text       INT UNSIGNED  NOT NULL DEFAULT 0,
  image_gen       INT UNSIGNED  NOT NULL DEFAULT 0,
  best_scenario   TEXT          DEFAULT NULL,
  rating          DECIMAL(2,1)  NOT NULL DEFAULT 0.0,
  sort_order      INT UNSIGNED  NOT NULL DEFAULT 0,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;