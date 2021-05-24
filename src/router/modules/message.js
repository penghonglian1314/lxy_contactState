/** When your routing table is too long, you can split it into small modules **/

import Layout from "@/layout";

const messageRouter = {
  path: "/message",
  component: Layout,
  children: [
    {
      path: "index",
      component: () => import("@/views/message/index"),
      name: "message",
      meta: { title: "message", noCache: true, icon: "component" }
    }
  ]
};

export default messageRouter;
