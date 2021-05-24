import request from '@/utils/request'

export function queryAccount(data) {
    return request({
      url: '/lxy_contact/queryAccount.action',
      method: 'post',
      params: {
          UserStatus : 0,
          Extend:`BusinessID=${data.BusinessID}`
      }
    })
  }

export function insertAccount(data) {
  return request({
    url: '/lxy_contact/insertAccount.action',
    method: 'post',
    params: {
        DomainID : 16,
        CustomerType : 0,
        CustomerID : 0,
        UserStatus : 0,
        UserRoles : 1999,
        ...data,
        Extend:`BusinessID=${data.BusinessID}`
    }
  })
}


export function updateAccount(data) {
  return request({
    url: '/lxy_contact/updateAccount.action',
    method: 'post',
    params: data
  })
}

export function deleteAccount(data) {
  return request({
    url: '/lxy_contact/deleteAccount.action',
    method: 'post',
    params: data
  })
}