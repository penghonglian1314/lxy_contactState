import request from "@/utils/request";
import { deleteFileServer } from "./upload";

export function queryDynamic(data) {
  return request({
    url: "/lxy_contact/business/queryDynamic.action",
    method: "post",
    params: data
  });
}

export function deleteDynamic(data) {
  if(data.PicUrls.length){
    data.PicUrls.forEach(url => {
    let key = ''
    if(url){
      if (url.includes('com/')) {
      key = url.split('com/')[1]
    } else {
      key = url
    } try {
      deleteFileServer({ FileID: key })
    } catch (error) {
      console.log('图片不存在', error)
    }
    }  
  });
  }
  
  return request({
    url: "/lxy_contact/deleteDynamic.action",
    method: "post",
    params: {DynamicID: data.DynamicID}
  });
}