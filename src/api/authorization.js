import request from "@/utils/request";

export function queryAuthorization(data) {
  return request({
    url: "/lxy_contact/queryAuthorization.action",
    method: "post",
    params: data
  });
}

export function addAuthorization(data) {
  return request({
    url: "/lxy_contact/AddAuthorization.action",
    method: "post",
    params: data
  });
}
export function queryAuthorizationApply(data) {
    return request({
      url: "/lxy_contact/queryAuthorizationApply.action",
      method: "post",
      params: data
    });
  }
  export function updateAuthorizationApply(data) {
    const { ID , BusinessID, MemberID,ApplyStatus} = data;
    sendComplaintMsg({ BusinessID, MemberID,ApplyStatus})
    return request({
      url: "/lxy_contact/updateAuthorizationApply.action",
      method: "post",
      params: {ID,ApplyStatus}
    });
  }

  function sendComplaintMsg(data) {
    console.log(data)
    const baseParams = {
      MsgClassify:2,      
      MsgType:4, 
      // ContentType:0, 
      // Sender:'38-' + data.BusinessID, 
      Sender:'38', 
      // BusinessID:data.BusinessID,
      Recver:'38-' + data.MemberID, 
      Extend:`BusinessID=${data.BusinessID}`
    }
   
    // 申请通过
    if(data.ApplyStatus===1){
      request({
        url: '/lxy_contact/sendIMReq.action',
        method: 'post',
        params: {
          ...baseParams,            
            Message:`恭喜您，邀请码已申请成功，快去邀请靠谱朋友加入吧！`,
            ContentType:1
        }
      })
    }else{// 申请不通过
      request({
        url: '/lxy_contact/sendIMReq.action',
        method: 'post',
        params: {
          ...baseParams,
            Message:`非常遗憾，您的邀请码申请被拒绝了。请您保持优质的社交状态，再重新申请。`,
            ContentType:2
        }
      })
    }
  }
  