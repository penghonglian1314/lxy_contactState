/** When your routing table is too long, you can split it into small modules **/

import Layout from "@/layout";

const memberRouter = {
  path: "/member",
  component: Layout,
  children: [
    {
      path: "index",
      component: () => import("@/views/member/index"),
      name: "member",
      meta: { title: "member", noCache: true, icon: "component" }
    },
    {
      path: "msg",
      component: () => import("@/views/member/children/msg"),
      name: "member_msg",
      hidden:true,
      meta: { title: "member_msg", noCache: true, icon: "component" }
    },
    {
      path: "dynamic",
      component: () => import("@/views/member/children/dynamic"),
      name: "member_dynamic",
      hidden:true,
      meta: { title: "member_dynamic", noCache: true, icon: "component" }
    },
    {
      path: "collect",
      component: () => import("@/views/member/children/collect"),
      name: "member_collect",
      hidden:true,
      meta: { title: "member_collect", noCache: true, icon: "component" }
    },
    {
      path: "like",
      component: () => import("@/views/member/children/like"),
      name: "member_like",
      hidden:true,
      meta: { title: "member_like", noCache: true, icon: "component" }
    },
    {
      path: "photo",
      component: () => import("@/views/member/children/photo"),
      name: "member_photo",
      hidden:true,
      meta: { title: "member_photo", noCache: true, icon: "component" }
    },
    {
      path: "account",
      component: () => import("@/views/member/children/account"),
      name: "member_account",
      hidden:true,
      meta: { title: "member_account", noCache: true, icon: "component" }
    } ,{
          path: "account/detail",
          hidden:true,
          component: () => import("@/views/member/children/account_children/detail"),
          name: "member_account_detail",
          meta: { title: "member_account_detail", noCache: true, icon: "component" }
        }
  ]
};

export default memberRouter;
