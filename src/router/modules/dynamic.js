/** When your routing table is too long, you can split it into small modules **/

import Layout from "@/layout";

const dynamicRouter = {
  path: "/dynamic",
  component: Layout,
  children: [
    {
      path: "index",
      component: () => import("@/views/dynamic/index"),
      name: "dynamic",
      meta: { title: "dynamic", noCache: true, icon: "component" }
    }
  ]
};

export default dynamicRouter;
