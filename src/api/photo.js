import request from "@/utils/request";

export function queryPhoto(data) {
  return request({
    url: "/lxy_contact/queryPhoto.action",
    method: "post",
    params: data
  });
}

export function updatePhoto(data) {
  return request({
    url: "/lxy_contact/updatePhoto.action",
    method: "post",
    params: data
  });
}