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
      path: "/console/site-edit",
      name: "ConsoleSiteEdit",
      component: () => import("@/views/console/site-edit.vue"),
      meta: {
        title: "编辑网站",
        showLink: false,
        activePath: "/console/site"
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
    },
    {
      path: "/console/more",
      name: "ConsoleMore",
      redirect: "/console/more/domain",
      meta: {
        title: "查看更多"
      },
      children: [
        {
          path: "/console/more/domain",
          name: "ConsoleMoreDomain",
          component: () => import("@/views/console/more/domain.vue"),
          meta: {
            title: "我的域名"
          }
        }
      ]
    }
  ]
} satisfies RouteConfigsTable;
