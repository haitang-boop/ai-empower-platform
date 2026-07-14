import request from '@/utils/request'

// 静态数据回退
import staticPptSlides from '@/../public/data/ppt_slides.json'

export function getPptBySkill(skillId) {
  return request({
    url: `/ppt/skill/${skillId}`,
    method: 'get'
  }).catch(() => {
    const slides = staticPptSlides[String(skillId)] || []
    return { data: slides }
  })
}

export function getPptById(id) {
  return request({ url: `/ppt/${id}`, method: 'get' })
}

export function createPpt(data) {
  return request({ url: '/ppt', method: 'post', data })
}

export function updatePpt(id, data) {
  return request({ url: `/ppt/${id}`, method: 'put', data })
}

export function deletePpt(id) {
  return request({ url: `/ppt/${id}`, method: 'delete' })
}

export function getSlides(skillId) {
  return request({
    url: `/ppt/skill/${skillId}`,
    method: 'get'
  }).catch(() => {
    const slides = staticPptSlides[String(skillId)] || []
    return { data: slides }
  })
}

export function createSlide(pptId, data) {
  return request({ url: `/ppt/${pptId}/slides`, method: 'post', data })
}

export function updateSlide(pptId, slideId, data) {
  return request({ url: `/ppt/${pptId}/slides/${slideId}`, method: 'put', data })
}

export function deleteSlide(pptId, slideId) {
  return request({ url: `/ppt/${pptId}/slides/${slideId}`, method: 'delete' })
}

export function reorderSlides(pptId, data) {
  return request({ url: `/ppt/${pptId}/slides/reorder`, method: 'put', data })
}
