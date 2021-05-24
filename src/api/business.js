import request from '@/utils/request'

export function queryBusiness(data) {
  return request({
    url: '/lxy_contact/queryBusiness.action',
    method: 'post',
    params: data
  })
}

export function insertBusiness(data) {
  return request({
    url: '/lxy_contact/insertBusiness.action',
    method: 'post',
    params: data
  })
}

export function deleteBusiness(data) {
  return request({
    url: '/lxy_contact/deleteBusiness.action',
    method: 'post',
    params: data
  })
}

export function updateBusiness(data) {
  return request({
    url: '/lxy_contact/updateBusiness.action',
    method: 'post',
    params: data
  })
}