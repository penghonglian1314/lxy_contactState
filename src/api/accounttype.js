import request from "@/utils/request";

export function queryAccountType(data) {
  return request({
    url: "/lxy_contact/business/queryMemberAccountType.action",
    method: "post",
    params: data
  });
}

export function deleteAccountType(data) {
  return request({
    url: "/lxy_contact/deleteTabMemberAccountType.action",
    method: "post",
    params: data
  });
}

export function insertAccountType(data) {
    return request({
      url: "/lxy_contact/addTabMemberAccountType.action",
      method: "post",
      params: data
    });
  }
  
  export function updateAccountType(data) {
    return request({
      url: "/lxy_contact/updateTabMemberAccountType.action",
      method: "post",
      params: data
    });
  }