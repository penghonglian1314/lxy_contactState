const handleCodeObj = {
  success: {
    code: ["0000"],
    msg: "请求成功"
  },
  fail: {
    code: ["404"],
    msg: "请求失败"
  },
  reload: {
    code: ["103", "401"],
    msg: "登录超时，请重新登录!"
  },
  login_fail: {
    code: ["1010", "1006"],
    msg: "登录失败，请检查用户名和密码!"
  }
};
function handleResponse(res) {
  if (res.data) {
    const data = JSON.parse(res.data);
    data.TotalSize = data.TotalSize ? data.TotalSize * 1 : 0;
    data.RowCnt = data.RowCnt ? data.RowCnt * 1 : 0;
    data.Records = data.Records || [];
    return data;
  } else {
    return {
      RowCnt:0,
      TotalSize:0,
      Records:[]

    };
  }
}

export { handleCodeObj, handleResponse };
