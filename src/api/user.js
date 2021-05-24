import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/lxy_contact/login.action',
    method: 'post',
    params: data
  })
}

export function logout() {
  return request({
    url: '/lxy_contact/logout.action',
    method: 'post'
  })
}
