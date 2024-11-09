export default {
  path: "/defaultsetting",
  redirect: "/defaultsetting/webconfig",
  meta: {
    icon: "ep:setting",
    title: "默认设置",
    rank: 4
  },
  children: [
    {
      path: "/defaultsetting/webconfig",
      name: "WebConfig",
      component: () => import("@/views/defaultSetting/webConfig/index.vue"),
      meta: {
        title: "网站设置"
      }
    }
  ]
} satisfies RouteConfigsTable;
