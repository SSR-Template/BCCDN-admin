export default {
  path: "/accountcenter",
  redirect: "/accountcenter/personal",
  meta: {
    icon: "ep:user",
    title: "账户中心",
    rank: 9
  },
  children: [
    {
      path: "/accountcenter/personal",
      name: "Personal",
      component: () => import("@/views/accountcenter/personal/index.vue"),
      meta: {
        title: "个人资料"
      }
    },
    {
      path: "/accountcenter/recharge",
      name: "Recharge",
      component: () => import("@/views/accountcenter/recharge/index.vue"),
      meta: {
        title: "账户充值"
      }
    },
    {
      path: "/accountcenter/subscribe",
      name: "Subscribe",
      component: () => import("@/views/accountcenter/subscribe/index.vue"),
      meta: {
        title: "消息订阅"
      }
    },
    {
      path: "/accountcenter/subsearch",
      name: "SubSearch",
      component: () => import("@/views/accountcenter/subsearch/index.vue"),
      meta: {
        title: "消息查询"
      }
    }
  ]
} satisfies RouteConfigsTable;
