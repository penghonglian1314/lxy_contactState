import request from "@/utils/request";

export function queryComplaint(data) {
  return request({
    url: "/lxy_contact/business/queryComplaintB.action",
    method: "post",
    params: data
  });
}

export function deleteComplaint(data) {
  return request({
    url: "/lxy_contact/deleteComplaint.action",
    method: "post",
    params: data
  });
}

export function updateComplaint(data) {
  return request({
    url: "/lxy_contact/updateComplaint.action",
    method: "post",
    params: data
  });
}

export function sendComplaintMsg(data) {
  console.log(data)
  const baseParams = {
    MsgClassify:2, 
    // Sender:'38-' + data.BusinessID, 
    Sender:'38',
    MsgType:0, 
    // BusinessID:data.BusinessID
    Extend:`BusinessID=${data.BusinessID}`
  }
  function formatTime(time) {
    if (!time) {
      return "--";
    }
    const date = time.toString();
    return (
      date.substr(0, 4) +
      "-" +
      date.substr(4, 2) +
      "-" +
      date.substr(6, 2) +
      " " +
      date.substr(8, 2) +
      ":" +
      date.substr(10, 2) +
      ":" +
      date.substr(12, 2)
    );
  }
 
  // 举报通过
  if(data.ComplaintStatus===1){
    request({
      url: '/lxy_contact/sendIMReq.action',
      method: 'post',
      params: {
        ...baseParams,
        ContentType:1, 
          Recver:'38-' + data.Sender, 
          Message:`您举报的用户【${data.RecverName}】的【${data.ComplaintType}】处理结果经客服核实情况属实，我们已进行处理，感谢您的举报。` 
      }
    })
      request({
        url: '/lxy_contact/sendIMReq.action',
        method: 'post',
        params: {
          ...baseParams,
          ContentType:1, 
            Recver:'38-' + data.Recver, 
            // Message :`您于${formatTime(data.DynameicTime)}发布的动态由于${data.ComplaintType}涉嫌违规，再次违规将会被封号。`,
            Message :`您被举报【${data.ComplaintType}】，已涉嫌违规，再次违规将被封号。`,
        }
      })
  }else{// 举报不通过
    request({
      url: '/lxy_contact/sendIMReq.action',
      method: 'post',
      params: {
        ...baseParams,
        ContentType:2, 
          Recver:'38-' + data.Sender, 
          Message:`您举报的用户【${data.RecverName}】的【${data.ComplaintType}】经客服查证核实举报不属实，请提供与举报类型及情况相符的证明。` ,
      }
    })
  }
}
