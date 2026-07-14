import request from '@/utils/request'

export function getModels(params) {
  return request({
    url: '/models',
    method: 'get',
    params
  })
}

export function getModelById(id) {
  return request({
    url: `/models/${id}`,
    method: 'get'
  })
}

export function generateContent(data) {
  return request({
    url: '/models/generate',
    method: 'post',
    data
  })
}

export function generateSlide(data) {
  return request({
    url: '/models/generate-slide',
    method: 'post',
    data
  })
}

export function generateOutline(data) {
  return request({
    url: '/models/generate-outline',
    method: 'post',
    data
  })
}