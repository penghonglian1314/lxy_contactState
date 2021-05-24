import request from '@/utils/request'


export function queryMemberAccount(data) {
    return request({
      url: '/lxy_contact/queryMemberAccount.action',
      method: 'post',
      params: data
    })
  }

  export function queryMemberAccountRecord(data) {
    return request({
      url: '/lxy_contact/queryMemberAccountRecord.action',
      method: 'post',
      params: data
    })
  }

