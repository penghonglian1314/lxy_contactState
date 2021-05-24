import request from "@/utils/request";

export const uploadFileServer = params =>
  request({
    url: "/lxy_contact/uploadFileServer.action",
    method: "post",
    params: params
  });

// 删除七牛服务器的文件
export const deleteFileServer = params =>
  request({
    url: "/lxy_contact/deleteFileServer.action",
    method: "post",
    params: params
  });
