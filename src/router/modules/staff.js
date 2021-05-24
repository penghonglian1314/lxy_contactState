/** When your routing table is too long, you can split it into small modules **/

import Layout from "@/layout";

const staffRouter = {
  path: "/staff",
  component: Layout,
  children: [
    {
      path: "index",
      component: () => import("@/views/staff/index"),
      name: "staff",
      meta: { title: "staff", noCache: true, icon: "component" }
    }
  ]
};

export default staffRouter;
