import request from "@/utils/request";

export function queryCollect(data) {
  return request({
    url: "/lxy_contact/queryMemberCollection.action",
    method: "post",
    params: data
  });
}

export function deleteCollect(data) {
  return request({
    url: "/lxy_contact/deleteTabMemberCollection.action",
    method: "post",
    params: data
  });
}