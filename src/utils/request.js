import axios from "axios";
import { Message } from "element-ui";
import store from "@/store";
import { getToken } from "@/utils/auth";
import { handleCodeObj, handleResponse } from "@/config/request";
const { success, fail, reload, login_fail } = handleCodeObj;
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  crossDomain: true,
  headers: {
    "X-Requested-with": "XMLHttpRequest",
    "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
  },
  timeout: 5000 // request timeout
});

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers["X-Token"] = getToken();
    }
    return config;
  },
  error => {
    // do something with request error
    console.log(error); // for debug
    return Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data;
    //
    if (!success.code.includes(res.code)) {
      let message = "Error";
      if (login_fail.code.includes(res.code)) {
        message = login_fail.msg;
      } else if (reload.code.includes(res.code)) {
        // to re-login
        console.log("reload");
        message = reload.msg;
        store.dispatch("user/resetToken").then(() => {
          location.reload();
        });
      } else if (fail.code.includes(res.code)) {
        message = fail.msg;
      }else{
        // message = "other Error";
        // console.log(res,handleResponse(res))
        return res;
      }
      Message({
        message: message,
        type: "error",
        duration: 5 * 1000
      });
      return Promise.reject(new Error(res.msg || "Error"));
    } else {
      return handleResponse(res);
    }
  },
  error => {
    console.log("err" + error); // for debug

    if (reload.code.includes(`${error.response.status}`)) {
      store.dispatch("user/resetToken").then(() => {
        location.reload();
      });
      Message({
        message: reload.msg,
        type: "error",
        duration: 5 * 1000
      });
    }else{
      Message({
        message: error,
        type: "error",
        duration: 5 * 1000
      });
    }
    return Promise.reject(error);
  }
);

export default service;
