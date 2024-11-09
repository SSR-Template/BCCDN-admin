export default {
  path: "/package",
  redirect: "/package/my",
  meta: {
    icon: "ep:help-filled",
    title: "套餐管理",
    rank: 5
  },
  children: [
    {
      path: "/package/my",
      name: "PackageMy",
      component: () => import("@/views/package/my.vue"),
      meta: {
        title: "我的套餐"
      }
    },
    {
      path: "/package/buy",
      name: "PackageBuy",
      component: () => import("@/views/package/buy.vue"),
      meta: {
        title: "购买套餐"
      }
    }
  ]
} satisfies RouteConfigsTable;
