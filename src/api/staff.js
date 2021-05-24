import request from '@/utils/request'

export function queryStaff(data) {
    return request({
      url: '/lxy_contact/business/queryStaff.action',
      method: 'post',
      params: data
    })
  }

  
  export function deleteStaff(data) {
    return request({
      url: '/lxy_contact/updateMember.action',
      method: 'post',
      params: {...data,Role:0}
    })
  }
  export function insertStaff(data) {
    return request({
      url: '/lxy_contact/updateMember.action',
      method: 'post',
      params: {...data,Role:1}
    })
  }

  export function updateStaff(data) {
    return request({
      url: '/lxy_contact/updateMember.action',
      method: 'post',
      params: data
    })
  }