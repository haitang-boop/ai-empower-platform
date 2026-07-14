import request from '@/utils/request'

// 静态数据回退
import staticScenarios from '@/../public/data/scenarios.json'

export function getScenarios(params) {
  return request({
    url: '/scenarios',
    method: 'get',
    params
  }).catch(() => {
    return { data: staticScenarios }
  })
}

export function getScenarioById(id) {
  return request({
    url: `/scenarios/${id}`,
    method: 'get'
  }).catch(() => {
    const item = staticScenarios.find(s => s.id === Number(id))
    return { data: item || null }
  })
}

export function createScenario(data) {
  return request({ url: '/scenarios', method: 'post', data })
}

export function updateScenario(id, data) {
  return request({ url: `/scenarios/${id}`, method: 'put', data })
}

export function deleteScenario(id) {
  return request({ url: `/scenarios/${id}`, method: 'delete' })
}
