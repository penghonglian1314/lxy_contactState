import request from '@/utils/request'

export function queryMessage(data) {
    return request({
      url: '/lxy_contact/business/queryMessage.action',
      method: 'post',
      params: data
    })
  }
  
  export function deleteMessage(data) {
    return request({
      url: '/lxy_contact/deleteTabMessage.action',
      method: 'post',
      params: data
    })
  }