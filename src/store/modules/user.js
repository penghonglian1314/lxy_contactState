import {
  login,
  logout
  // getInfo
} from "@/api/user";
import { getToken, setToken, removeToken } from "@/utils/auth";
import router, { resetRouter } from "@/router";
import { checkLogin } from "@/utils/permission";
import { Message } from "element-ui";
import { loginedErrMsg } from "@/config/message/login";

const state = {
  token: getToken(),
  id: sessionStorage.getItem("id"),
  userid: sessionStorage.getItem("userid"),
  name: sessionStorage.getItem("name"),
  extend: sessionStorage.getItem("extend"),
  roles: JSON.stringify([])
};

const mutations = {
  SET_TOKEN: (state, token) => {
    sessionStorage.setItem("token", token);
    state.token = token;
  },
  SET_ID: (state, id) => {
    sessionStorage.setItem("id", id);
    state.id = id;
  },
  SET_USERID: (state, userid) => {
    sessionStorage.setItem("userid", userid);
    state.userid = userid;
  },
  SET_NAME: (state, name) => {
    sessionStorage.setItem("name", name);
    state.name = name;
  },
  SET_EXTEND: (state, extend) => {
    sessionStorage.setItem("extend", extend);
    sessionStorage.setItem("BusinessID", extend.split('=')[1]);
    state.extend = extend;
  },
  SET_ROLES: (state, roles) => {
    sessionStorage.setItem("roles", JSON.stringify(roles));
    state.roles = JSON.stringify(roles);
  }
};

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo;
    return new Promise((resolve, reject) => {
      login({ UserID: username.trim(), Passwd: password })
        .then(async response => {
          // console.log("login", response);
          const data = response;
          // 此处对response中角色的值转成数组格式
          // 不同response可能处理方式不同
          // 本公司直接返回字符串格式，直接存入数组即可
          const roles = [data.UserRoles?data.UserRoles:''];
          // 登陆账号为本项目文件允许的账号
          if (checkLogin(roles)) {
            // generate accessible routes map based on roles
            const accessRoutes = await this.dispatch(
              "permission/generateRoutes",
              roles
            );
            // dynamically add accessible routes
            router.addRoutes(accessRoutes);

            //  项目相关数据写入vuex，方便之后使用
            commit("SET_ID", data.CustomerID);
            commit("SET_EXTEND", data.Extend);
            // 用户信息
            commit("SET_NAME", data.UserName);
            commit("SET_USERID", data.UserID);
            commit("SET_ROLES", roles);
            // token
            commit("SET_TOKEN", data.LoginID);
            setToken(data.LoginID);

            resolve();
          }
          // 登陆账号不是本项目文件允许的账号
          else {
            Message({
              message: loginedErrMsg,
              type: "error",
              duration: 5 * 1000
            });
            reject(error);
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  // get user info
  // getInfo({ commit, state }) {
  //   return new Promise((resolve, reject) => {
  //     getInfo(state.token).then(response => {
  //       console.log('getInfo',response)
  //       const { data } = response
  //       if (!data) {
  //         reject('Verification failed, please Login again.')
  //       }

  //       const { roles, name, avatar, introduction } = data

  //       // roles must be a non-empty array
  //       if (!roles || roles.length <= 0) {
  //         reject('getInfo: roles must be a non-null array!')
  //       }

  //       commit('SET_ROLES', roles)
  //       commit('SET_NAME', name)
  //       commit('SET_AVATAR', avatar)
  //       commit('SET_INTRODUCTION', introduction)
  //       resolve(data)
  //     }).catch(error => {
  //       reject(error)
  //     })
  //   })
  // },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      // commit("SET_TOKEN", "");
      // commit("SET_ROLES", []);
      // removeToken();
      // resetRouter();
      // dispatch("tagsView/delAllViews", null, { root: true });
      // resolve();
      logout(state.token)
        .then(() => {
          // reset visited views and cached views
          // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
          commit("SET_TOKEN", "");
          commit("SET_ROLES", []);
          removeToken();
          resetRouter();
          dispatch("tagsView/delAllViews", null, { root: true });
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit("SET_TOKEN", "");
      commit("SET_ROLES", []);
      removeToken();
      resolve();
    });
  },
  // 本项目 没有使用
  // 动态切换用户角色
  // dynamically modify permissions
  async changeRoles({ commit, dispatch }, role) {
    const token = role + "-token";

    commit("SET_TOKEN", token);
    setToken(token);

    const { roles } = await dispatch("getInfo");

    resetRouter();

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch("permission/generateRoutes", roles, {
      root: true
    });
    // dynamically add accessible routes
    router.addRoutes(accessRoutes);

    // reset visited views and cached views
    dispatch("tagsView/delAllViews", null, { root: true });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
