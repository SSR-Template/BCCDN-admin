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
    },
    {
      path: "/defaultsetting/sharing",
      name: "Sharing",
      component: () => import("@/views/defaultSetting/sharing/index.vue"),
      meta: {
        title: "四层转发"
      }
    },
    {
      path: "/defaultsetting/certificate",
      name: "Certificate",
      component: () => import("@/views/defaultSetting/certificate/index.vue"),
      meta: {
        title: "证书设置"
      }
    }
  ]
} satisfies RouteConfigsTable;
