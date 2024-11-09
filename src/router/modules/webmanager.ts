export default {
  path: "/webmanager",
  redirect: "/webmanager/myweb",
  meta: {
    icon: "ep:help-filled",
    title: "网站管理",
    rank: 1
  },
  children: [
    {
      path: "/webmanager/myweb",
      name: "MyWeb",
      component: () => import("@/views/webmanager/myweb/index.vue"),
      meta: {
        title: "我的网站"
      }
    },
    {
      path: "/webmanager/group",
      name: "Group",
      component: () => import("@/views/webmanager/group/index.vue"),
      meta: {
        title: "分组管理"
      }
    }
  ]
} satisfies RouteConfigsTable;
