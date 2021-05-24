/** When your routing table is too long, you can split it into small modules **/

import Layout from "@/layout";

const authorizationRouter = {
  path: "/authorization",
  component: Layout,
  meta: { title: "authorization", noCache: true, icon: "component"},
  children: [
    {
      path: "index",
      component: () => import("@/views/authorization/index"),
      name: "authorization_index",
      meta: { title: "authorization_index", noCache: true, icon: "component" }
    },
    {
        path: "apply",
        component: () => import("@/views/authorization/apply"),
        name: "authorization_apply",
        meta: { title: "authorization_apply", noCache: true, icon: "component" }
      }
  ]
};

export default authorizationRouter;
