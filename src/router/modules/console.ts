export default {
  path: "/console",
  redirect: "/console/site",
  meta: {
    icon: "ep:help-filled",
    title: "网站管理",
    rank: 1
  },
  children: [
    {
      path: "/console/site",
      name: "ConsoleSite",
      component: () => import("@/views/console/site.vue"),
      meta: {
        title: "我的网站"
      }
    },
    {
      path: "/console/site-update",
      name: "ConsoleSiteUpdate",
      component: () => import("@/views/console/site-update.vue"),
      meta: {
        title: "修改网站",
        showLink: false,
        activePath: "/console/site"
      }
    }
  ]
} satisfies RouteConfigsTable;
