import request from '@/utils/request'

// 静态数据回退
import staticSkills from '@/../public/data/skills.json'
import staticScenarioSkills from '@/../public/data/scenario_skills.json'

export function getSkills(params) {
  return request({
    url: '/skills',
    method: 'get',
    params
  }).catch(() => {
    return { data: staticSkills }
  })
}

export function getSkillById(id) {
  return request({
    url: `/skills/${id}`,
    method: 'get'
  }).catch(() => {
    const item = staticSkills.find(s => s.id === Number(id))
    return { data: item || null }
  })
}

export function createSkill(data) {
  return request({ url: '/skills', method: 'post', data })
}

export function updateSkill(id, data) {
  return request({ url: `/skills/${id}`, method: 'put', data })
}

export function deleteSkill(id) {
  return request({ url: `/skills/${id}`, method: 'delete' })
}

export function getSkillsByScenario(scenarioId) {
  return request({
    url: `/skills/scenario/${scenarioId}`,
    method: 'get'
  }).catch(() => {
    const skills = staticScenarioSkills[String(scenarioId)] || []
    return { data: skills }
  })
}

export function favoriteSkill(id) {
  return request({ url: `/users/favorites/${id}`, method: 'post' })
}

export function getFavorites() {
  return request({ url: '/users/favorites', method: 'get' })
}

export function getLearningHistory() {
  return request({ url: '/users/history', method: 'get' })
}

export function saveProgress(id, data) {
  return request({
    url: '/users/progress',
    method: 'post',
    data: { ...data, skill_id: id }
  })
}
