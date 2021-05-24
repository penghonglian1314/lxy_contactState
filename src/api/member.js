import request from '@/utils/request'

export function queryMember(data) {
    return request({
      url: '/lxy_contact/business/queryMember.action',
      method: 'post',
      params: data
    })
  }
