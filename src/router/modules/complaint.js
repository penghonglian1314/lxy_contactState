/** When your routing table is too long, you can split it into small modules **/

import Layout from "@/layout";

const complaintRouter = {
  path: "/complaint",
  component: Layout,
  children: [
    {
      path: "index",
      component: () => import("@/views/complaint/index"),
      name: "complaint",
      meta: { title: "complaint", noCache: true, icon: "component" }
    },
    {
      path: "detail",
      hidden:true,
      component: () => import("@/views/complaint/child/detail"),
      name: "complaint_detail",
      meta: { title: "complaint", noCache: true, icon: "component" }
    }
  ]
};

export default complaintRouter;
