/** When your routing table is too long, you can split it into small modules **/

import Layout from "@/layout";

const accountTypeRouter = {
  path: "/accountType",
  component: Layout,
  children: [
    {
      path: "index",
      component: () => import("@/views/accountType/index"),
      name: "accountType",
      meta: { title: "accountType", noCache: true, icon: "component" }
    }
  ]
};

export default accountTypeRouter;
