import request from "@/utils/request";

export function queryLike(data) {
  return request({
    url: "/lxy_contact/queryMemberLike.action",
    method: "post",
    params: data
  });
}

export function deleteLike(data) {
  return request({
    url: "/lxy_contact/deleteTabMemberLike.action",
    method: "post",
    params: data
  });
}