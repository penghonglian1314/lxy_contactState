// 判断token是否有效
// return Boolean
export function isToken() {
  // =================================================
  // 获取本地数据
  const FtpType = sessionStorage.getItem("FtpType");
  const postData = sessionStorage.getItem("postData");
  const setting = sessionStorage.getItem("setting");
  // 本地存在数据
  if (FtpType) {
    // 七牛云
    if (FtpType === "1") {
      // 本地存在token等数据
      if (postData && setting) {
        this.postData = JSON.parse(postData);
        // 本地token未过期
        if (
          JSON.parse(window.atob(this.postData.token.split(":")[2])).deadline -
            800 >
          Math.floor(new Date().getTime() / 1000)
        ) {
          return true;
        }
        // 本地token存在，但过期了
        else {
          return false;
        }
      }
      // 本地不存在token等数据
      else {
        return false;
      }
    }
    // 腾讯云
    else {
      // 本地存在token等数据，且token未过期
      if (
        postData &&
        setting &&
        JSON.parse(postData).expiredTime - 800 >
          Math.floor(new Date().getTime() / 1000)
      ) {
        // console.log('本地')
        this.postData = JSON.parse(postData);
        this.setting = JSON.parse(setting);
        this.which = "tx";
      }
      // 其他情况
      else {
        return false;
      }
    }
  } else {
    return false;
  }
}
